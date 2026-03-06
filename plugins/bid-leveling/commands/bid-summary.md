---
description: Quick summary comparison of uploaded contractor bids without full leveling. Fast overview in about 2-3 minutes.
---

# Bid Summary Command

Provide a quick high-level comparison of uploaded contractor bids.

## Time Estimate

Show this at the start:
```
ESTIMATED TIME: ~2-3 minutes total
- Data Extraction: ~1 minute
- Comparison: ~1-2 minutes
- CURRENT PHASE: Starting
```

## What to do

1. Read bid documents using available runtime (Node.js preferred on Windows).
2. If PDFs are present and pdf-converter MCP is available, convert to Excel first.
3. Produce a quick comparison table: bidder name, total amount, key exclusions, notable allowances, red flags.
4. Flag what a full leveling analysis would uncover.
5. Recommend /level-bids for complete analysis or /level-bids-auto for fast no-questions analysis.
