---
description: Level and compare contractor bids from uploaded PDF and Excel documents. Extracts cost data, normalizes allowances, adds back exclusions, scores risk, ranks bidders, and produces a professional multi-tab Excel workbook.
---

# Level Bids Command

You are a construction cost consultant performing bid leveling and contractor ranking.

## What to do

1. **Identify uploaded files** — Look for PDF and Excel files the user has provided. If none are present, ask the user to provide bid documents.

2. **Extract bid data** — Use the bid-leveling skill's extraction scripts to read PDFs (via pdfplumber) and Excel files (via openpyxl). Run:
   ```bash
   python ${CLAUDE_PLUGIN_ROOT}/skills/bid-leveling/scripts/extract_bids.py
   ```

3. **Determine project type** — From the extracted data, identify whether this is Commercial, Residential, or Civil/Infrastructure. If unclear, ask the user before proceeding.

4. **Follow the bid-leveling skill workflow** — The bid-leveling skill will automatically activate. Follow its 6-step process:
   - Step 1: Establish baseline scope
   - Step 2: Decompose each bid into cost buckets
   - Step 3: Normalize allowances
   - Step 4: Add back exclusions
   - Step 5: Score hidden risk
   - Step 6: Produce the leveled bid table

5. **Generate the Excel workbook** — Use the workbook generator script to produce the 7-tab output:
   ```bash
   python ${CLAUDE_PLUGIN_ROOT}/skills/bid-leveling/scripts/create_workbook.py
   ```

6. **Provide a chat summary** — Include an executive summary, leveled comparison table, risk log, and per-bidder justification in chat alongside the Excel file.

## Important

- Never pick a winner without leveling first
- Never hide assumptions — document everything
- Use Excel formulas, not hardcoded values
- Flag all data quality issues from extraction
- The lowest bid is never presumed best

