---
description: Generate a quick summary comparison of uploaded contractor bids without full leveling. Use for a fast overview before doing a complete bid leveling analysis.
---

# Bid Summary Command

Provide a quick, high-level comparison of uploaded contractor bids.

## What to do

1. **Extract bid data** from uploaded PDFs and Excel files using:
   ```bash
   python ${CLAUDE_PLUGIN_ROOT}/skills/bid-leveling/scripts/extract_bids.py
   ```

2. **Produce a quick comparison table** in chat showing:
   - Bidder name
   - Total bid amount
   - Key exclusions (if visible)
   - Notable allowances
   - Any obvious red flags

3. **Flag gaps** — Note what a full leveling analysis would uncover that this summary cannot.

4. **Recommend next step** — Suggest running `/level-bids` for the complete analysis with the Excel workbook output.

This is a lightweight preview, not a substitute for full bid leveling.
