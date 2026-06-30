# Production AI Operations

The production request path is:

`actcreative.net/api/chat` -> Vercel Function -> `ai.actcreative.net` ->
Cloudflare Tunnel -> local AI gateway -> Ollama.

## Local Requirements

- Ollama must remain installed on the always-on Windows workstation.
- `.env.local` must contain `AI_GATEWAY_SECRET`.
- The RAG index must exist at
  `local-ai/knowledge/index/act-creative-rag-index.json`.
- Cloudflare Tunnel config must exist at
  `%USERPROFILE%\.cloudflared\config.yml`.
- Cloudflare Tunnel publishes only `http://127.0.0.1:8787`; port `11434`
  must never be exposed.

## Supervisor

Use the production supervisor instead of relying on one-shot startup scripts:

```powershell
npm run ai:prod:install
npm run ai:prod:check
```

`scripts/install-production-ai-supervisor.ps1` tries, in order:

1. A highest-privilege current-user scheduled task.
2. A normal current-user scheduled task.
3. A current-user Startup shortcut fallback.

This workstation currently uses the Startup shortcut fallback because the
Windows task scheduler API returns `Access is denied` from this shell. The
fallback installs:

- Startup shortcut:
  `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\ACTCreativeProductionAISupervisor.lnk`
- Runtime launcher:
  `tmp/run-production-ai-supervisor.cmd`
- Hidden VBS wrapper:
  `tmp/run-production-ai-supervisor.vbs`

The launcher keeps restarting `scripts/watch-production-ai.ps1` if it exits.
The watcher then checks the stack every 60 seconds and warms the chat and
embedding models every 12 hours without writing test messages through the
conversation logger.

## Repair Commands

Run these manually when changing operations code or after suspected failure:

```powershell
npm run ai:prod:start
npm run ai:prod:tunnel
npm run ai:prod:check
```

Equivalent direct PowerShell commands:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\start-production-ai.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\start-production-tunnel.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\check-production-ai.ps1
```

`start-production-ai.ps1` is idempotent. It exits if the local stack is
healthy. If it finds duplicate `ollama.exe` service processes, missing ACT
models, a broken local gateway, or the wrong model directory, it restarts the
affected local processes with the site-specific Ollama environment.

`start-production-tunnel.ps1` is also idempotent. It verifies
`https://ai.actcreative.net/api/chat?health=1` through the Cloudflare Tunnel
when the local gateway is healthy, and restarts the matching `cloudflared`
process if direct tunnel health fails.

## Health Checks

Local authenticated gateway:

```powershell
$secret = (Get-Content .env.local |
  Where-Object { $_ -like "AI_GATEWAY_SECRET=*" }).Split("=", 2)[1]
Invoke-RestMethod `
  -Headers @{ Authorization = "Bearer $secret" } `
  -Uri "http://127.0.0.1:8787/api/chat?health=1"
```

Direct Cloudflare Tunnel:

```powershell
Invoke-RestMethod `
  -Headers @{ Authorization = "Bearer $secret" } `
  -Uri "https://ai.actcreative.net/api/chat?health=1"
```

Production proxy:

```powershell
Invoke-RestMethod -Uri "https://actcreative.net/api/chat?health=1"
```

Production POST checks must include a browser-like origin because
`api/chat.ts` intentionally rejects unknown origins:

```powershell
$body = @{
  messages = @(@{ role = "user"; content = "Please reply exactly: ACT AI online" })
  language = "en"
  pageUrl = "https://actcreative.net/health-check"
} | ConvertTo-Json -Depth 6

Invoke-RestMethod `
  -Method Post `
  -Headers @{ Origin = "https://actcreative.net" } `
  -Uri "https://actcreative.net/api/chat" `
  -ContentType "application/json" `
  -Body $body `
  -TimeoutSec 180
```

## Routine Maintenance

Rebuild the RAG index after changing website or manual knowledge content:

```powershell
npm run rag:index
npm run ai:prod:start
```

Runtime stdout and stderr logs are written separately under `tmp/`:

- `tmp/ai-production-task.out.log`
- `tmp/ai-production-task.err.log`
- `tmp/ollama-production-task.out.log`
- `tmp/ollama-production-task.err.log`
- `tmp/cloudflared-production.out.log`
- `tmp/cloudflared-production.err.log`
- `tmp/production-ai-supervisor.log`

Conversation records remain under `local-ai/conversations/`.
