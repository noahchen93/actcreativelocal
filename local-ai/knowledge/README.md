# ACT Creative local RAG knowledge

Run `npm run rag:index` after changing website pages or adding documents.

## Document folders

- `documents/company`: company profile, team and contact material
- `documents/services`: service descriptions, workflows and capability notes
- `documents/cases`: project and case-study material
- `documents/venues`: venue notes and venue-related material
- `documents/regulations`: reserved for future official or reviewed regulatory material

Supported manual formats in the MVP are `.md`, `.txt`, `.html`, `.htm` and `.json`.

The indexer also reads the website homepage, top-level service pages, blog pages and case-study pages. Singapore venue detail pages are deliberately excluded from the first company-focused index.

Generated vector index files are stored in `index/` and ignored by Git.

