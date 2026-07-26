# AI conversation logs

The local AI gateway writes one JSON object per completed chat turn to daily `.ndjson` files in this folder.

Each record contains an anonymous session ID, page URL, language, user message, assistant response, retrieval sources and timing. IP addresses are not recorded.

Conversation files are ignored by Git so real user content is not accidentally pushed to the remote repository.

