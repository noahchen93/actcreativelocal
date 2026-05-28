#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { google } from 'googleapis';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const READONLY_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const DEFAULT_SITE_URL = 'https://actcreative.net/';
const DEFAULT_DIMENSIONS = ['query', 'page'];
const MAX_ROW_LIMIT = 25000;

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

function csvEscape(value) {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function makeCsv(rows, dimensions) {
  const header = [...dimensions, 'clicks', 'impressions', 'ctr', 'avg_position'];
  const lines = [header.map(csvEscape).join(',')];

  for (const row of rows) {
    const keys = row.keys ?? [];
    const values = [
      ...dimensions.map((_, index) => keys[index] ?? ''),
      row.clicks ?? 0,
      row.impressions ?? 0,
      `${((row.ctr ?? 0) * 100).toFixed(2)}%`,
      Number(row.position ?? 0).toFixed(2),
    ];
    lines.push(values.map(csvEscape).join(','));
  }

  return `${lines.join('\n')}\n`;
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
      scopes: [READONLY_SCOPE],
    });
  }

  if (process.env.GSC_SERVICE_ACCOUNT_JSON) {
    return new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON),
      scopes: [READONLY_SCOPE],
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

  return new google.auth.GoogleAuth({ scopes: [READONLY_SCOPE] });
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

function printHelp() {
  console.log(`Fetch Google Search Console search analytics data.

Usage:
  npm run gsc -- --start 2026-05-01 --end 2026-05-24

Options:
  --site <url>              Search Console property URL. Defaults to GSC_SITE_URL or ${DEFAULT_SITE_URL}
  --start <YYYY-MM-DD>      Start date. Defaults to a 28-day window ending two days ago.
  --end <YYYY-MM-DD>        End date. Defaults to two days ago.
  --days <number>           Window size when --start is omitted. Defaults to 28.
  --dimensions <list>       Comma-separated dimensions. Defaults to query,page.
  --limit <number>          API row limit per request. Defaults to ${MAX_ROW_LIMIT}.
  --max-rows <number>       Maximum rows to export. Defaults to ${MAX_ROW_LIMIT}.
  --output <path>           CSV output path.
  --key-file <path>         Service account JSON path. Overrides env vars.
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    printHelp();
    return;
  }

  const days = Number.parseInt(args.days ?? '28', 10);
  const endDate = args.end ?? toIsoDate(addDays(new Date(), -2));
  const startDate = args.start ?? toIsoDate(addDays(new Date(`${endDate}T00:00:00.000Z`), -(days - 1)));
  const siteUrl = args.site ?? process.env.GSC_SITE_URL ?? DEFAULT_SITE_URL;
  const dimensions = String(args.dimensions ?? process.env.GSC_DIMENSIONS ?? DEFAULT_DIMENSIONS.join(','))
    .split(',')
    .map((dimension) => dimension.trim())
    .filter(Boolean);
  const rowLimit = Math.min(
    Number.parseInt(args.limit ?? String(MAX_ROW_LIMIT), 10),
    MAX_ROW_LIMIT,
  );
  const maxRows = Number.parseInt(args.maxRows ?? args.maxrows ?? String(MAX_ROW_LIMIT), 10);
  const outputPath = resolveMaybeRelative(
    args.output
      ?? path.join(
        'docs',
        'search-console-exports',
        `gsc_${startDate}_to_${endDate}_${dimensions.join('-')}.csv`,
      ),
  );

  const auth = await createAuth(args);
  const rows = await fetchRows({
    siteUrl,
    startDate,
    endDate,
    dimensions,
    rowLimit,
    maxRows,
    auth,
  });

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, makeCsv(rows, dimensions), 'utf8');

  console.log(`Fetched ${rows.length} rows from ${siteUrl}`);
  console.log(`Date range: ${startDate} to ${endDate}`);
  console.log(`Dimensions: ${dimensions.join(', ')}`);
  console.log(`Output: ${outputPath}`);
}

main().catch((error) => {
  console.error(error?.response?.data ?? error);
  process.exitCode = 1;
});
