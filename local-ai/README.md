# ACT Creative local AI

This folder contains the local Ollama configuration, system prompt, RAG document folders and private conversation logs.

## Initial setup

```powershell
npm install
npm run ollama:create
npm run ollama:embedding
npm run rag:index
```

## Start locally

Run these in separate terminals:

```powershell
npm run dev:ai
npm run dev
```

Open `http://127.0.0.1:3000/`.

The local AI gateway listens only on `127.0.0.1:8787`. Ollama remains on its local API and is not exposed by this MVP.

## Update the knowledge base

1. Add reviewed documents under `local-ai/knowledge/documents/`.
2. Update website pages when required.
3. Rebuild the index:

```powershell
npm run rag:index
```

The running gateway checks for a newer index file and reloads it automatically.

## Edit assistant behavior

Edit `local-ai/system-prompt.md`, then restart `npm run dev:ai`.

## Conversation logs

Completed chat turns are appended to:

```text
local-ai/conversations/YYYY-MM-DD.ndjson
```

The logs include an anonymous session ID, page URL, language, question, answer, completion status, response time and RAG sources. IP addresses are not recorded.

Conversation log files and generated vector indexes are ignored by Git.

## Hardware note

The Qwen 3.6 36B chat model can require about five minutes to cold-start on the current machine. Once loaded, it remains warm for 24 hours. The dedicated embedding model uses a 1024-token context to allow both models to stay resident together.

