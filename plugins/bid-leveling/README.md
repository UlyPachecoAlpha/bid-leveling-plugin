# Bid Leveling Plugin for Claude Code

A Claude Code plugin that reads contractor bid documents (PDFs and Excel files), normalizes bids, and produces a professional multi-worksheet Excel workbook.

## Installation

```
/plugin marketplace add UlyPachecoAlpha/bid-leveling-plugin
/plugin install bid-leveling@bid-leveling-marketplace
```

Restart Claude Code after installing.

## Usage

Upload bid PDFs or Excel files, then either:
- Run `/bid-leveling:level-bids` for the full analysis
- Run `/bid-leveling:bid-summary` for a quick overview
- Just ask naturally: "compare these bids" or "level these proposals"

## What It Produces

A 7-tab Excel workbook with live formulas:
1. Summary - Executive recommendation
2. Leveled Comparison - Normalized bid totals
3. Ranking Detail - Weighted scoring model
4. Allowance Adjustments - Normalization detail
5. Exclusion Add-backs - Missing scope priced back in
6. Risk Analysis - 5-category risk scoring
7. Assumptions and Gaps - Full audit trail

## Project Types

Commercial, Residential, and Civil/Infrastructure.

## Requirements

Python packages pdfplumber and openpyxl (installed automatically if missing).
