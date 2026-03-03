# Bid Leveling Plugin for Claude Code

A Claude Code plugin that reads contractor bid documents (PDFs and Excel files), normalizes bids to an apples-to-apples basis, and produces a professional multi-worksheet Excel workbook with leveled comparisons, rankings, and risk analysis.

## Features

- **PDF & Excel extraction** — Reads bid documents in PDF and Excel formats using pdfplumber and openpyxl
- **Automated bid leveling** — Normalizes allowances, adds back exclusions, scores risk
- **Weighted ranking model** — Ranks bidders across 5 categories with configurable weights
- **7-tab Excel workbook output** — Professional formatting with live formulas (not hardcoded values)
- **Data quality tracking** — Flags extraction issues and documents all assumptions

## Plugin Structure

```
bid-leveling/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── commands/
│   ├── level-bids.md            # /level-bids — full analysis
│   └── bid-summary.md           # /bid-summary — quick overview
├── agents/
│   └── bid-analyzer.md          # Subagent for data analysis
├── skills/
│   └── bid-leveling/
│       ├── SKILL.md             # Auto-invoked skill
│       ├── scripts/
│       │   ├── extract_bids.py  # PDF & Excel data extraction
│       │   └── create_workbook.py # 7-tab Excel generator
│       └── references/
│           └── adjustment-examples.md  # Benchmark data
├── hooks/
│   ├── hooks.json               # Event handlers
│   └── scripts/
│       └── validate-xlsx.sh     # Post-write workbook validation
└── README.md
```

## Components

### Commands (user-triggered)
- **`/level-bids`** — Run the full bid leveling workflow: extract → analyze → level → rank → produce workbook
- **`/bid-summary`** — Quick comparison overview without full leveling

### Skill (auto-invoked)
- **`bid-leveling`** — Automatically activates when Claude detects bid leveling context (mentions of bids, contractors, proposals, comparisons)

### Agent
- **`bid-analyzer`** — Specialized subagent for parsing extracted bid data into the structured format needed by the workbook generator

### Hooks
- **PostToolUse** — Validates any `.xlsx` file written during the session (checks sheet count and formula presence)
- **Stop** — Verifies completeness of bid leveling output before finishing

## Installation

### From local directory
```bash
claude
/plugin marketplace add /path/to/marketplace-containing-this-plugin
/plugin install bid-leveling@your-marketplace
```

### From GitHub
```bash
claude
/plugin install https://github.com/your-org/bid-leveling-plugin
```

## Usage

1. Upload contractor bid PDFs and/or Excel files
2. Run `/level-bids` or just ask Claude to compare/level the bids
3. Receive a formatted Excel workbook + chat summary

## Excel Output (7 Worksheets)

1. **Summary** — Executive recommendation, quick comparison, data warnings
2. **Leveled Comparison** — Original bid → adjustments → leveled total
3. **Ranking Detail** — Weighted scoring with SUMPRODUCT and RANK formulas
4. **Allowance Adjustments** — Per-bidder allowance normalization
5. **Exclusion Add-backs** — Required exclusions priced and added back
6. **Risk Analysis** — 5-category risk scoring
7. **Assumptions & Gaps** — Full audit trail

## Project Types Supported

- **Commercial** — Office, retail, hospitality, institutional, healthcare, data centers
- **Residential** — Single-family, multifamily, townhomes, condos
- **Civil / Infrastructure** — Roads, bridges, utilities, grading, stormwater

## Dependencies

- Python 3.8+
- pdfplumber
- openpyxl
