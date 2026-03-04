# Bid Leveling Plugin for Claude Code (v2.0)

A Claude Code plugin that reads contractor bid documents (PDFs and Excel files), converts PDFs to more efficient formats, normalizes bids, and produces a professional multi-worksheet Excel workbook. Includes time-to-completion estimates and an auto mode that works without asking questions.

## Installation

```
/plugin marketplace add UlyPachecoAlpha/bid-leveling-plugin
/plugin install bid-leveling@bid-leveling-marketplace
```

Restart Claude Code after installing.

## Commands

| Command | What it does |
|---|---|
| `/bid-leveling:level-bids` | Full interactive analysis with clarifying questions. |
| `/bid-leveling:level-bids-auto` | Full analysis with NO questions - makes and documents assumptions. |
| `/bid-leveling:bid-summary` | Quick overview comparison (~2-3 min). |
| `/bid-leveling:convert-bids` | Convert PDF bid docs to Excel/Word before analysis. |

## Key Features

### Time-to-Completion Estimates
Every command shows a running progress tracker throughout the analysis.

### Auto Mode (No Questions)
`/level-bids-auto` makes reasonable assumptions and documents them all. Fast results, review assumptions after.

### PDF Conversion (MCP Server)
Converts PDFs to Excel/Word before analysis for better data extraction. Works with PDF.co API (free tier) or local fallback. Set `PDFCO_API_KEY` environment variable for best results.

### 7-Tab Excel Workbook Output
Summary, Leveled Comparison, Ranking Detail, Allowance Adjustments, Exclusion Add-backs, Risk Analysis, Assumptions and Gaps.

## Project Types
Commercial, Residential, and Civil/Infrastructure.

## Requirements
Node.js (npm packages installed automatically). Optional: PDFCO_API_KEY for PDF conversion.
