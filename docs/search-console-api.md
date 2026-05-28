# Google Search Console API setup

This project can fetch Search Console performance data into CSV with:

```bash
node scripts/fetch-search-console.mjs --start 2026-05-01 --end 2026-05-24
```

The script writes exports to `docs/search-console-exports/` by default.

It can also update the Google Sheet tracker with:

```bash
npm run gsc:sheet -- --days 28
```

The tracker uses `GOOGLE_SPREADSHEET_ID` from `.env.local`.

## OAuth refresh token setup

This is the current setup for ACT Creative because the Search Console property is a domain property:
`sc-domain:actcreative.net`.

```bash
GSC_SITE_URL=sc-domain:actcreative.net
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_SPREADSHEET_ID=
```

Generate or refresh the token locally:

```bash
node scripts/create-google-oauth-token.mjs
```

The script requests these scopes:

- `https://www.googleapis.com/auth/webmasters.readonly`
- `https://www.googleapis.com/auth/spreadsheets`

The Sheets scope is required so the weekly job can write the tracker workbook.

## Service account setup

Use this only if Search Console accepts the service account email as a user for the property.

1. In Google Cloud Console, enable the Google Search Console API and Google Sheets API.
2. Create a service account and download its JSON key.
3. In Google Search Console, add the service account email as a user for the target property.
4. Save the JSON outside git, for example `.secrets/gsc-service-account.json`.
5. Create `.env.local`:

```bash
GSC_SITE_URL=sc-domain:actcreative.net
GSC_SERVICE_ACCOUNT_KEY_FILE=.secrets/gsc-service-account.json
```

## Useful commands

```bash
npm run gsc
npm run gsc:auth
npm run gsc:sheet
node scripts/fetch-search-console.mjs --days 7
node scripts/fetch-search-console.mjs --dimensions query,page,date
node scripts/fetch-search-console.mjs --output docs/search-console-exports/latest.csv
```

## Weekly Google Sheet tracker

The tracker workbook contains four tabs:

- `Summary`: current 28-day totals and top query/page pairs.
- `Latest 28d`: refreshed each run with current query/page rows.
- `Weekly History`: keeps one snapshot per date range to avoid duplicate reruns.
- `Config`: local job settings and the last updated range.

The scheduled automation should run from this repository:

```bash
node scripts/update-gsc-google-sheet.mjs --days 28
```
