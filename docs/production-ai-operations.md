# Retired Production AI Service

The ACT Creative website AI assistant was retired on 2026-08-09.

## Expected State

- The website does not render or inject the floating AI assistant.
- `https://actcreative.net/api/chat/` returns HTTP `410 Gone` with status `retired`.
- The Windows Startup shortcut for `ACTCreativeProductionAISupervisor` is disabled.
- Ports `127.0.0.1:8787` and `127.0.0.1:11434` are not listening.
- Ollama model workers, the local AI gateway and the site Cloudflare Tunnel are not running.
- Vercel no longer needs `AI_GATEWAY_URL` or `AI_GATEWAY_SECRET`.

## Retained Archives

The following files remain for historical analysis or an explicit rollback:

- Private conversation logs under `local-ai/conversations/`.
- Model definitions, RAG data and system prompts under `local-ai/`.
- Former gateway, supervisor and Tunnel scripts under `scripts/`.
- Local Cloudflare Tunnel configuration and credentials.

These archived scripts must not be run unless the user explicitly decides to
restore the service. Model files and conversation records were not deleted.
