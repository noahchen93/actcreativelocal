# Production AI Operations

The production request path is:

`actcreative.net/api/chat` -> Vercel Function -> `ai.actcreative.net` ->
Cloudflare Tunnel -> local AI gateway -> Ollama.

## Local requirements

- Ollama must remain installed on the always-on Windows workstation.
- `.env.local` must contain `AI_GATEWAY_SECRET`.
- The RAG index must exist at
  `local-ai/knowledge/index/act-creative-rag-index.json`.
- The current-user Windows startup entry `ACTCreativeProductionAI` runs
  `scripts/start-production-ai.ps1` after sign-in.
- The current-user Windows startup entry `ACTCreativeCloudflareTunnel` runs
  `scripts/start-production-tunnel.ps1`.
- Cloudflare Tunnel publishes only `http://127.0.0.1:8787`; port `11434`
  must never be exposed.

## Health checks

Local authenticated gateway:

```powershell
$secret = (Get-Content .env.local |
  Where-Object { $_ -like "AI_GATEWAY_SECRET=*" }).Split("=", 2)[1]
Invoke-RestMethod `
  -Headers @{ Authorization = "Bearer $secret" } `
  -Uri "http://127.0.0.1:8787/api/chat?health=1"
```

Production:

```powershell
Invoke-RestMethod -Uri "https://actcreative.net/api/chat?health=1"
```

## Routine maintenance

Rebuild the RAG index after changing website or manual knowledge content:

```powershell
npm run rag:index
Stop-Process -Id (
  Get-NetTCPConnection -LocalPort 8787 -State Listen
).OwningProcess
Start-Process `
  -FilePath "powershell.exe" `
  -ArgumentList "-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden",
    "-ExecutionPolicy", "Bypass", "-File",
    "$PWD\scripts\start-production-ai.ps1" `
  -WindowStyle Hidden
```

Runtime stdout and stderr logs are written separately under `tmp/`.
Conversation records remain under `local-ai/conversations/`.
