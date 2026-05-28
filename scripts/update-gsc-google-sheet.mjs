#!/usr/bin/env node

import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { google } from 'googleapis';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const READONLY_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const DEFAULT_SITE_URL = 'https://actcreative.net/';
const DEFAULT_DIMENSIONS = ['query', 'page'];
const MAX_ROW_LIMIT = 25000;
const SHEET_NAMES = {
  summary: 'Summary',
  latest: 'Latest 28d',
  history: 'Weekly History',
  config: 'Config',
};

for (const envFile of ['.env.local', '.env']) {
  const envPath = path.join(ROOT_DIR, envFile);
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false, quiet: true });
  }
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      continue;
    }

    const [rawKey, rawValue] = arg.slice(2).split('=', 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (rawValue !== undefined) {
      args[key] = rawValue;
      continue;
    }

    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = true;
    }
  }

  return args;
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function quoteSheetName(sheetName) {
  return `'${sheetName.replaceAll("'", "''")}'`;
}

function a1(sheetName, range) {
  return `${quoteSheetName(sheetName)}!${range}`;
}

function resolveMaybeRelative(filePath) {
  if (!filePath) {
    return '';
  }
  return path.isAbsolute(filePath) ? filePath : path.resolve(ROOT_DIR, filePath);
}

async function createAuth(args) {
  const keyFile = args.keyFile
    ?? process.env.GSC_SERVICE_ACCOUNT_KEY_FILE
    ?? process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (keyFile) {
    return new google.auth.GoogleAuth({
      keyFile: resolveMaybeRelative(keyFile),
      scopes: [READONLY_SCOPE, SHEETS_SCOPE],
    });
  }

  if (process.env.GSC_SERVICE_ACCOUNT_JSON) {
    return new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON),
      scopes: [READONLY_SCOPE, SHEETS_SCOPE],
    });
  }

  if (
    process.env.GOOGLE_CLIENT_ID
    && process.env.GOOGLE_CLIENT_SECRET
    && process.env.GOOGLE_REFRESH_TOKEN
  ) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    return oauth2Client;
  }

  return new google.auth.GoogleAuth({ scopes: [READONLY_SCOPE, SHEETS_SCOPE] });
}

async function fetchRows({ siteUrl, startDate, endDate, dimensions, rowLimit, maxRows, auth }) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  const rows = [];
  let startRow = 0;

  while (rows.length < maxRows) {
    const currentLimit = Math.min(rowLimit, maxRows - rows.length);
    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions,
        rowLimit: currentLimit,
        startRow,
      },
    });

    const batch = response.data.rows ?? [];
    rows.push(...batch);

    if (batch.length < currentLimit) {
      break;
    }

    startRow += batch.length;
  }

  return rows;
}

function normalizeRows(rows) {
  return rows.map((row) => ({
    query: row.keys?.[0] ?? '',
    page: row.keys?.[1] ?? '',
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    avgPosition: row.position ?? 0,
  }));
}

function summarizeRows(rows) {
  const totalClicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const totalImpressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  return {
    totalClicks,
    totalImpressions,
    ctr: totalImpressions ? totalClicks / totalImpressions : 0,
    avgPosition: totalImpressions
      ? rows.reduce((sum, row) => sum + row.avgPosition * row.impressions, 0) / totalImpressions
      : 0,
  };
}

async function getSheetMap(sheets, spreadsheetId) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties(sheetId,title)',
  });

  return new Map(
    (response.data.sheets ?? []).map((sheet) => [sheet.properties.title, sheet.properties.sheetId]),
  );
}

async function ensureSheets(sheets, spreadsheetId) {
  let sheetMap = await getSheetMap(sheets, spreadsheetId);
  const missing = Object.values(SHEET_NAMES)
    .filter((sheetName) => !sheetMap.has(sheetName))
    .map((sheetName) => ({ addSheet: { properties: { title: sheetName } } }));

  if (missing.length) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: missing },
    });
    sheetMap = await getSheetMap(sheets, spreadsheetId);
  }

  return sheetMap;
}

async function clearAndWrite(sheets, spreadsheetId, sheetName, values) {
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: a1(sheetName, 'A:Z'),
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: a1(sheetName, 'A1'),
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

async function readValues(sheets, spreadsheetId, sheetName, range) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: a1(sheetName, range),
  });
  return response.data.values ?? [];
}

function makeSummaryValues({ rows, summary, dateRange, siteUrl }) {
  const topRows = [...rows].sort((a, b) => b.impressions - a.impressions).slice(0, 10);

  return [
    ['ACT Creative Search Console Tracker'],
    [],
    ['Metric', 'Value', '', 'Metric', 'Value'],
    ['Snapshot date', dateRange.snapshot, '', 'CTR', summary.ctr],
    ['Date range', `${dateRange.start} to ${dateRange.end}`, '', 'Avg position', summary.avgPosition],
    ['Rows', rows.length, '', 'Property', siteUrl],
    ['Clicks', summary.totalClicks],
    ['Impressions', summary.totalImpressions],
    [],
    ['Top query', 'Page', 'Clicks', 'Impressions', 'CTR', 'Avg position'],
    ...topRows.map((row) => [
      row.query,
      row.page,
      row.clicks,
      row.impressions,
      row.ctr,
      row.avgPosition,
    ]),
  ];
}

function makeLatestValues(rows) {
  return [
    ['query', 'page', 'clicks', 'impressions', 'ctr', 'avg_position'],
    ...rows.map((row) => [
      row.query,
      row.page,
      row.clicks,
      row.impressions,
      row.ctr,
      row.avgPosition,
    ]),
  ];
}

function makeHistoryRows(rows, dateRange) {
  return rows.map((row) => [
    dateRange.snapshot,
    dateRange.start,
    dateRange.end,
    row.query,
    row.page,
    row.clicks,
    row.impressions,
    row.ctr,
    row.avgPosition,
  ]);
}

async function rewriteHistory(sheets, spreadsheetId, rows, dateRange) {
  const header = [
    'snapshot_date',
    'start_date',
    'end_date',
    'query',
    'page',
    'clicks',
    'impressions',
    'ctr',
    'avg_position',
  ];
  const existingRows = await readValues(sheets, spreadsheetId, SHEET_NAMES.history, 'A2:I');
  const retainedRows = existingRows.filter((row) => (
    row[0] !== dateRange.snapshot || row[1] !== dateRange.start || row[2] !== dateRange.end
  ));

  await clearAndWrite(sheets, spreadsheetId, SHEET_NAMES.history, [
    header,
    ...retainedRows,
    ...makeHistoryRows(rows, dateRange),
  ]);
}

function makeConfigValues({ siteUrl, days, endLagDays, spreadsheetId, dateRange }) {
  return [
    ['Setting', 'Value'],
    ['property', siteUrl],
    ['spreadsheet_id', spreadsheetId],
    ['default_window_days', days],
    ['default_end_lag_days', endLagDays],
    ['automation_schedule', 'Every Monday'],
    ['source_script', 'scripts/update-gsc-google-sheet.mjs'],
    ['last_updated', dateRange.snapshot],
    ['latest_range', `${dateRange.start} to ${dateRange.end}`],
    ['notes', 'Weekly History keeps one snapshot per date range; Latest 28d is refreshed each run.'],
  ];
}

async function applyBasicFormatting(sheets, spreadsheetId, sheetMap) {
  const headerFormat = {
    backgroundColor: { red: 0.09, green: 0.2, blue: 0.3 },
    textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
  };
  const requests = [
    {
      repeatCell: {
        range: { sheetId: sheetMap.get(SHEET_NAMES.summary), startRowIndex: 0, endRowIndex: 1 },
        cell: {
          userEnteredFormat: {
            ...headerFormat,
            textFormat: { ...headerFormat.textFormat, fontSize: 14 },
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat)',
      },
    },
    ...[
      [SHEET_NAMES.latest, 0],
      [SHEET_NAMES.history, 0],
      [SHEET_NAMES.config, 0],
      [SHEET_NAMES.summary, 9],
    ].map(([sheetName, rowIndex]) => ({
      repeatCell: {
        range: {
          sheetId: sheetMap.get(sheetName),
          startRowIndex: rowIndex,
          endRowIndex: rowIndex + 1,
        },
        cell: { userEnteredFormat: headerFormat },
        fields: 'userEnteredFormat(backgroundColor,textFormat)',
      },
    })),
    ...[SHEET_NAMES.latest, SHEET_NAMES.history].map((sheetName) => ({
      updateSheetProperties: {
        properties: {
          sheetId: sheetMap.get(sheetName),
          gridProperties: { frozenRowCount: 1 },
        },
        fields: 'gridProperties.frozenRowCount',
      },
    })),
    ...[
      [SHEET_NAMES.summary, 0, 8],
      [SHEET_NAMES.latest, 0, 6],
      [SHEET_NAMES.history, 0, 9],
      [SHEET_NAMES.config, 0, 2],
    ].map(([sheetName, startIndex, endIndex]) => ({
      autoResizeDimensions: {
        dimensions: {
          sheetId: sheetMap.get(sheetName),
          dimension: 'COLUMNS',
          startIndex,
          endIndex,
        },
      },
    })),
  ];

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests },
  });
}

function printHelp() {
  console.log(`Update the ACT Creative Google Search Console tracker sheet.

Usage:
  npm run gsc:sheet -- --days 28

Options:
  --spreadsheet-id <id>     Defaults to GOOGLE_SPREADSHEET_ID.
  --site <url>              Defaults to GSC_SITE_URL or ${DEFAULT_SITE_URL}
  --start <YYYY-MM-DD>      Defaults to a 28-day window ending two days ago.
  --end <YYYY-MM-DD>        Defaults to two days ago.
  --days <number>           Window size when --start is omitted. Defaults to 28.
  --end-lag-days <number>   Days to lag the end date. Defaults to 2.
  --max-rows <number>       Maximum rows to fetch. Defaults to ${MAX_ROW_LIMIT}.
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    printHelp();
    return;
  }

  const days = Number.parseInt(args.days ?? '28', 10);
  const endLagDays = Number.parseInt(args.endLagDays ?? '2', 10);
  const endDate = args.end ?? toIsoDate(addDays(new Date(), -endLagDays));
  const startDate = args.start ?? toIsoDate(addDays(new Date(`${endDate}T00:00:00.000Z`), -(days - 1)));
  const siteUrl = args.site ?? process.env.GSC_SITE_URL ?? DEFAULT_SITE_URL;
  const spreadsheetId = args.spreadsheetId ?? process.env.GOOGLE_SPREADSHEET_ID;
  const rowLimit = Math.min(
    Number.parseInt(args.limit ?? String(MAX_ROW_LIMIT), 10),
    MAX_ROW_LIMIT,
  );
  const maxRows = Number.parseInt(args.maxRows ?? args.maxrows ?? String(MAX_ROW_LIMIT), 10);

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SPREADSHEET_ID must be set in .env.local or passed with --spreadsheet-id.');
  }

  const auth = await createAuth(args);
  const rows = normalizeRows(await fetchRows({
    siteUrl,
    startDate,
    endDate,
    dimensions: DEFAULT_DIMENSIONS,
    rowLimit,
    maxRows,
    auth,
  }));
  const summary = summarizeRows(rows);
  const dateRange = {
    snapshot: toIsoDate(new Date()),
    start: startDate,
    end: endDate,
  };

  const sheets = google.sheets({ version: 'v4', auth });
  const sheetMap = await ensureSheets(sheets, spreadsheetId);

  await clearAndWrite(sheets, spreadsheetId, SHEET_NAMES.summary, makeSummaryValues({
    rows,
    summary,
    dateRange,
    siteUrl,
  }));
  await clearAndWrite(sheets, spreadsheetId, SHEET_NAMES.latest, makeLatestValues(rows));
  await rewriteHistory(sheets, spreadsheetId, rows, dateRange);
  await clearAndWrite(sheets, spreadsheetId, SHEET_NAMES.config, makeConfigValues({
    siteUrl,
    days,
    endLagDays,
    spreadsheetId,
    dateRange,
  }));
  await applyBasicFormatting(sheets, spreadsheetId, sheetMap);

  console.log(`Updated spreadsheet: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
  console.log(`Date range: ${startDate} to ${endDate}`);
  console.log(`Rows: ${rows.length}`);
  console.log(`Clicks: ${summary.totalClicks}`);
  console.log(`Impressions: ${summary.totalImpressions}`);
}

main().catch((error) => {
  console.error(error?.response?.data ?? error);
  process.exitCode = 1;
});
