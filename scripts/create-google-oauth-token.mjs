#!/usr/bin/env node

import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { google } from 'googleapis';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_PATH = path.join(ROOT_DIR, '.env.local');
const READONLY_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

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

    const [key, value] = arg.slice(2).split('=', 2);
    if (value !== undefined) {
      args[key] = value;
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

async function readEnvFile() {
  if (!existsSync(ENV_PATH)) {
    return [];
  }
  return (await readFile(ENV_PATH, 'utf8')).split(/\r?\n/);
}

function upsertEnv(lines, updates) {
  const used = new Set();
  const next = lines.map((line) => {
    const match = line.match(/^([A-Z0-9_]+)=/);
    if (!match || !(match[1] in updates)) {
      return line;
    }

    used.add(match[1]);
    return `${match[1]}=${updates[match[1]]}`;
  });

  for (const [key, value] of Object.entries(updates)) {
    if (!used.has(key)) {
      next.push(`${key}=${value}`);
    }
  }

  while (next.length && next[next.length - 1] === '') {
    next.pop();
  }

  return `${next.join('\n')}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const port = Number.parseInt(args.port ?? '53682', 10);
  const state = randomBytes(16).toString('hex');
  const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local.');
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    include_granted_scopes: true,
    prompt: 'consent',
    scope: [READONLY_SCOPE, SHEETS_SCOPE],
    state,
  });

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', redirectUri);
      if (url.pathname !== '/oauth2callback') {
        response.writeHead(404).end('Not found');
        return;
      }

      if (url.searchParams.get('state') !== state) {
        response.writeHead(400).end('Invalid state.');
        return;
      }

      const code = url.searchParams.get('code');
      if (!code) {
        response.writeHead(400).end(`Missing code: ${url.searchParams.get('error') ?? 'unknown error'}`);
        return;
      }

      const { tokens } = await oauth2Client.getToken(code);
      if (!tokens.refresh_token) {
        response.writeHead(400).end('No refresh token returned. Re-run with prompt=consent or remove prior app access.');
        return;
      }

      const envLines = await readEnvFile();
      await writeFile(
        ENV_PATH,
        upsertEnv(envLines, {
          GOOGLE_REFRESH_TOKEN: tokens.refresh_token,
        }),
        'utf8',
      );

      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      response.end('<h1>Authorization complete</h1><p>You can close this tab and return to Codex.</p>');
      console.log('OAuth refresh token saved to .env.local');
      server.close();
    } catch (error) {
      response.writeHead(500).end('OAuth token exchange failed.');
      console.error(error?.response?.data ?? error);
      process.exitCode = 1;
      server.close();
    }
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`Listening on ${redirectUri}`);
    console.log(`AUTH_URL=${authUrl}`);
  });
}

main().catch((error) => {
  console.error(error?.response?.data ?? error);
  process.exitCode = 1;
});
