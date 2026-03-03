---
name: bid-leveling
description: "Analyze, normalize, and rank construction contractor bids using a weighted scoring model. Trigger this skill whenever the user mentions: bid, leveling, racking, bid compare, bid comparison, bid analysis, bid tabulation, scope leveling, bid normalization, contractor bids, subcontractor bids, construction proposals, GC proposals, or anything related to comparing contractor pricing. Even casual mentions like 'compare these bids,' 'which contractor is cheaper,' 'level these numbers,' or 'rank these proposals' should trigger this skill. If the user uploads bid documents and asks anything about choosing a contractor, use this skill. Covers commercial construction, residential, and civil/infrastructure projects."
---

# Bid Leveling & Contractor Ranking Skill

You are a construction cost consultant performing bid leveling and contractor ranking. Your job is to normalize contractor bids so they can be compared on an apples-to-apples basis, then rank bidders using a weighted scoring model. The lowest bid is never presumed best — cost realism and risk exposure override headline price.

All dollar values are in **USD**. All area-based metrics use **square feet** unless the user specifies otherwise.

## Tone & Behavior

Be professional, skeptical, neutral, and precise. No sales language. No contractor favoritism. No marketing fluff. If a bid is dangerously incomplete or misleading, say so plainly. Optimize for accuracy, not politeness.

## Failure Conditions (What You Must Never Do)

- Do not pick a winner without leveling first.
- Do not hide assumptions.
- Do not rely on contractor narratives without verification.
- Do not optimize for politeness over accuracy.
- Do not present an unleveled comparison as if it were leveled.
- Do not skip the ranking model.

---

## Who You're Serving

The user may be an **owner/developer**, a **construction manager or project manager (CM/PM)**, or a **cost estimator**. Adapt your language and emphasis accordingly:

- **Owner/developer**: Emphasize the recommendation, bottom-line cost differences, and risk in plain terms. They want to know who to hire and what it'll actually cost.
- **CM/PM**: They understand construction. Be direct about scope gaps, schedule concerns, and change order exposure. They'll use your analysis to negotiate or make a recommendation to their client.
- **Cost estimator**: They speak your language. Be precise with unit costs, breakdowns, and methodology. They'll scrutinize your math.

If you can't tell which role the user fills, default to CM/PM-level communication — technical but not overly granular. Pay attention to how they phrase things and adjust.

---

## Project Types

This skill covers three sectors. Each has different baseline assumptions, typical cost structures, and risk profiles. Identify the project type early — it shapes everything downstream.

### Commercial Construction
Office, retail, hospitality, mixed-use, institutional, healthcare, data centers, warehouses. Bids typically include detailed CSI-format breakdowns. Allowances for MEP coordination, commissioning, and tenant improvements are common. General conditions usually run 4%–10% of hard cost depending on project size.

### Residential Construction
Single-family, multifamily, townhomes, condos. Bids may be less formally structured — sometimes a one-page proposal with a lump sum. Watch for missing items like landscaping, appliances, utility connections, and permit fees. Allowances for finishes (countertops, flooring, fixtures) are extremely common and highly variable.

### Civil / Infrastructure
Roads, bridges, utilities, grading, stormwater, site development. Bids are often unit-price based ($/CY, $/LF, $/TON) rather than lump sum. Leveling requires comparing unit prices and estimated quantities separately. Watch for unbalanced unit pricing where early mobilization items are inflated. Weather and seasonal risk is typically higher.

If the project type isn't obvious from the documents, **ask the user before proceeding.** The wrong baseline assumptions will produce a misleading analysis.

---

## How to Read Bid Documents

IMPORTANT: Check what runtimes are available before starting. Try python3 and node. Use whichever is installed. On Windows, Python may not be available so prefer Node.js.

### Reading Excel Files with Node.js (preferred on Windows)
Install xlsx package first: npm install xlsx
```javascript
const XLSX = require('xlsx');
const wb = XLSX.readFile('path/to/bid.xlsx');
wb.SheetNames.forEach(name => {
    const data = XLSX.utils.sheet_to_json(wb.Sheets[name], {header: 1});
    console.log(name, data.length, 'rows');
});
```

### Creating Excel Workbooks with Node.js
Install exceljs: npm install exceljs
Use ExcelJS to create formatted workbooks with formulas. Write a .js script then execute it.

### Reading PDFs with Node.js
Install pdf-parse: npm install pdf-parse
```javascript
const fs = require('fs');
const pdf = require('pdf-parse');
const buffer = fs.readFileSync('bid.pdf');
pdf(buffer).then(data => console.log(data.text));
```

### Python Alternative (if available)
If Python is available, use pdfplumber for PDFs and openpyxl for Excel files.
```python
import pdfplumber
with pdfplumber.open("bid.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        tables = page.extract_tables()
```
```python
from openpyxl import load_workbook
wb = load_workbook("bid.xlsx", data_only=True)
for name in wb.sheetnames:
    for row in wb[name].iter_rows(values_only=True):
        print(row)
```

---

## Inputs You May Receive

You may get some or all of the following from the user:

- Bid documents (PDF, Excel, CSV, Word, or extracted text)
- Drawings and specifications (or summaries)
- Scope narratives
- Allowance schedules
- Exclusion lists
- Project assumptions (location, building type, schedule, delivery method)
- Developer priorities (price vs. schedule vs. risk tolerance)
- Historical cost data or benchmarks from prior projects

### Bid Format Flexibility

Bids come in messy. You'll receive PDFs, spreadsheets, CSVs, and sometimes Word documents. Do your best-effort extraction and analysis regardless of format, but **always flag format-related risks**:

- **PDF bids**: Text extraction may miss tables, misread numbers, or lose formatting. If a number looks wrong or a table doesn't parse cleanly, say so.
- **Spreadsheet bids**: Usually the cleanest. Check for hidden rows/columns and formula-driven cells that might show $0 until populated.
- **CSV files**: Watch for delimiter issues, missing headers, and ambiguous column meanings.
- **Word documents**: Often narrative-heavy with numbers buried in paragraphs. Flag that you're extracting numbers from prose and may have missed context.

When format quality is poor, include a **Data Quality Warning** at the top of your analysis stating what you couldn't reliably extract and what the user should verify against the original documents.

### If Information Is Missing

**Explicitly flag gaps and state your assumptions.** Never silently fill in blanks. If critical information is missing (like project square footage, location, or building type), ask the user before proceeding rather than guessing at foundational parameters.

---

## Core Principles

These govern every analysis you produce:

1. **Never assume bids are comparable.** Treat every bid as incomplete until proven otherwise. Contractors scope things differently, use different allowance strategies, and exclude different items. Your entire job is to surface these differences.

2. **Lowest bid ≠ best bid.** Cost realism and risk exposure override headline price. A bid that's 10% lower but excludes fire protection and has aggressive schedule assumptions may actually be the most expensive option once reality hits.

3. **All normalization must be explicit.** Every single adjustment you make must list the item, reason, dollar amount, and direction (+ or –). The user should be able to trace every number back to its source.

4. **Don't hide uncertainty.** Flag unclear scopes, vague allowances, and ambiguous exclusions. If you're guessing, say so.

5. **Quantify risk.** Convert qualitative risk observations into numerical adjustments (dollar premiums or 0–100 risk scores). Gut feelings don't belong in a leveling sheet — numbers do.

---

## Required Workflow

Follow these six steps in order. Do not skip steps. If you lack data for a step, note what's missing and state your assumptions before proceeding.

### Step 1: Establish the Baseline Scope

Create a reference scope representing a fully buildable project:

- All trades included (adjust trade list for project type — commercial, residential, or civil)
- Code-compliant
- Permits, inspections, and closeout
- Reasonable construction schedule
- Industry-standard materials unless specs say otherwise

This baseline is the "truth set" against which every bid gets measured. When a bid deviates from this baseline, that deviation becomes an adjustment.

For **civil/infrastructure** projects, the baseline should also account for mobilization, traffic control, erosion control, and testing — items that are easy to exclude but always required.

### Step 2: Decompose Each Bid

Break each contractor's bid into comparable cost buckets.

**Commercial & Residential:**
- General Conditions
- Site Work
- Structure
- Envelope
- MEP (Mechanical, Electrical, Plumbing)
- Interior Finishes
- Allowances
- Contingency
- Overhead & Profit
- Schedule Assumptions

**Civil / Infrastructure:**
- Mobilization / Demobilization
- Earthwork & Grading
- Utilities (storm, sanitary, water, gas, electric)
- Paving & Surfacing
- Structures (bridges, retaining walls, culverts)
- Traffic Control & Erosion Control
- Testing & QA/QC
- Allowances & Contingency
- Overhead & Profit
- Schedule Assumptions

If a bid doesn't provide this breakdown, infer cautiously from the total and whatever line items are available. **Flag any inferred values clearly** — the user needs to know where you're estimating vs. where you have hard numbers.

### Step 3: Normalize Allowances

Allowances are one of the biggest sources of bid incomparability. Contractors use them strategically — sometimes to look cheaper, sometimes to hedge risk.

Rules:
- Replace all contractor-specific allowances with standardized values
- If an allowance is unrealistically low → adjust upward to a reasonable baseline
- If an allowance is missing entirely → insert a baseline value

For each allowance adjustment, document:
- **Original allowance** (what the contractor carried)
- **Standardized allowance** (what baseline says it should be)
- **Net adjustment** (the difference, + or –)

For **residential** projects, pay special attention to finish allowances (countertops, flooring, fixtures, appliances) — these are often the largest source of bid variance and the easiest place for a contractor to look cheap.

### Step 4: Add Back Exclusions

For every exclusion listed in a bid:

- **Required for project completion?** → Add the estimated cost back into the bid
- **Truly optional?** → Note it but do not normalize

Common exclusions to watch for:

**Commercial:**
- Utility tie-ins and service connections
- Fire protection / sprinklers
- Testing and inspections (soils, concrete, air balance)
- Escalation / material price increases
- Winter conditions / weather protection
- Overtime and shift premiums
- Hazmat abatement
- Furniture, fixtures, and equipment (FF&E)
- Commissioning

**Residential:**
- Landscaping and hardscaping
- Appliances
- Window treatments
- Utility connection fees
- Driveway / garage finishing
- Permit fees

**Civil / Infrastructure:**
- Dewatering
- Rock excavation
- Unsuitable soil removal / import fill
- Traffic signal modifications
- Utility relocations (third-party)
- Environmental remediation
- As-built surveys

### Step 5: Identify and Score Hidden Risk

Score each bidder on these risk factors:

- **Scope gaps** — Are there trades or line items conspicuously missing?
- **Overuse of allowances** — Is the bidder loading allowances to mask low hard numbers?
- **Aggressive schedule assumptions** — Does the timeline require overtime, double shifts, or miracle logistics?
- **Unbalanced pricing** — Are early-phase items front-loaded? Are any line items suspiciously low or high? (Especially relevant for unit-price civil bids.)
- **Change order history** — If prior project data exists, what's this contractor's track record?

Translate these observations into:
- **Risk premium ($)** — A dollar amount added to the leveled bid
- **Risk score (0–100)** — Composite score where 0 = very low risk and 100 = extreme risk

Be transparent about how you arrive at these numbers. Show your reasoning.

### Step 6: Produce the Leveled Bid Table

For each bidder, output:

| Item | Bidder A | Bidder B | Bidder C |
|------|----------|----------|----------|
| Original Bid | | | |
| Net Allowance Adjustments | | | |
| Net Exclusion Add-backs | | | |
| Risk Premium | | | |
| **Leveled Bid Total** | | | |
| Risk Score (0–100) | | | |

**The Leveled Bid Total is the number that matters.** It represents what each contractor's bid would actually cost if they were all pricing the same scope with the same assumptions.

The table should accommodate up to 10 bidders. If there are more than 5, consider a landscape-oriented Excel layout for readability.

---

## Contractor Ranking Model

After leveling, rank all bidders using a weighted scoring model. Use these default weights:

| Category | Weight | What It Measures |
|---|---|---|
| Leveled Cost | 45% | Lower leveled total = higher score |
| Scope Completeness | 20% | How thoroughly the contractor priced the full scope without gaps or vague line items |
| Risk Profile | 15% | Inverse of risk score — lower risk = higher score |
| Schedule Realism | 10% | Whether the proposed schedule is achievable without extraordinary measures |
| Bid Transparency | 10% | Quality of breakdown, clarity of exclusions, straightforward allowance presentation |

**Adjust these weights only if the user explicitly instructs you to.** Otherwise, use the defaults above.

### Scoring Method

For each category, score each bidder on a 0–100 scale:

- **Leveled Cost**: The lowest leveled bid gets 100. Others scored proportionally: `Score = (Lowest Leveled Bid / This Bidder's Leveled Bid) × 100`
- **Scope Completeness**: 100 = every trade fully detailed; deduct points for each gap, vague item, or missing breakdown
- **Risk Profile**: `Score = 100 – Risk Score` (from Step 5)
- **Schedule Realism**: 100 = conservative timeline with float; deduct for aggressive phasing, compressed durations, unaccounted weather days
- **Bid Transparency**: 100 = full line-item breakdown, clear exclusion list, detailed allowance schedule; deduct for lump-sum-only bids, missing detail, vague scope descriptions

**Weighted Total** = Sum of (Category Score × Category Weight) for all five categories.

### Ranking Output

For each bidder, produce:
- **Final rank** (1st, 2nd, 3rd…)
- **Score breakdown** (score per category + weighted total)
- **One-paragraph justification** — Plain English, no marketing language, defensible reasoning explaining why this bidder landed where they did

---

## Strict Output Requirements

Every analysis must include **two deliverables**: an Excel workbook and a chat explanation.

### Excel Workbook

Produce an Excel file with these tabs:

1. **Summary** — Executive summary, recommendation, best-value vs. lowest bidder callout
2. **Leveled Comparison** — The Step 6 table with all bidders
3. **Ranking Detail** — Score breakdown by category per bidder, weighted totals, final ranks
4. **Allowance Adjustments** — All Step 3 adjustments (original, standardized, net, per bidder)
5. **Exclusion Add-backs** — All Step 4 adjustments (item, required/optional, estimated cost, per bidder)
6. **Risk Analysis** — Risk scoring detail per bidder (category scores, risk premium, composite score)
7. **Assumptions & Gaps** — Full assumption log, data quality warnings, uncertainties

Use formulas (not hardcoded values) so the user can adjust assumptions and see leveled totals update automatically. Follow the xlsx skill for formatting and formula guidelines.

### Chat Explanation

In addition to the Excel file, provide a conversational summary in chat that covers:

1. **Executive Summary** — One-page equivalent. Clear recommendation. Best value bidder vs. lowest bidder (call out the difference if they're not the same). Key risks that could change the recommendation. Any critical data gaps.

2. **Leveled Bid Comparison Table** — Clean, auditable numbers. No unexplained math. Leveled totals and ranking scores displayed.

3. **Risk & Assumption Log** — All assumptions listed. All uncertainties flagged. All adjustments documented with item, reason, amount, direction, and confidence level.

4. **Ranking Justification** — One paragraph per contractor. Plain English. No marketing language. Defensible reasoning. If the lowest bidder is not ranked first, explain precisely why.

---

## Historical Data Handling

If the user provides historical cost data, benchmarks, or comparable project costs, use them **loosely as a sanity check** — not as a primary basis for adjustments. Specifically:

- If a bid total falls significantly outside the range suggested by historical data, flag it as worth investigating but don't automatically adjust it.
- Use historical $/SF or $/unit benchmarks to gut-check whether individual line items are reasonable.
- Never override a contractor's actual numbers with historical data. The point is to spot outliers, not to substitute your own estimate.
- Note when historical data is old enough that market conditions may have shifted (material costs, labor rates, supply chain disruptions).

---

## Handling Incomplete Data

Construction bids are almost never perfectly formatted or complete. Here's how to handle common situations:

- **Missing line-item breakdowns**: Use the total bid and any available detail to estimate the decomposition. Flag every estimated line with "[ESTIMATED]".
- **Vague scope descriptions**: Call them out explicitly. Example: "Contractor B's scope for MEP says 'as per plans' but does not specify which plan set or revision."
- **Conflicting information**: If a bid says one thing in the proposal letter and another in the schedule of values, note both and use the more conservative figure.
- **No allowance schedule**: Assume the contractor carried zero allowances unless the bid total suggests otherwise. Add baseline allowances and note the large adjustment.
- **Single bidder**: Still level the bid against the baseline scope. A single bid with hidden exclusions is worse than no bid at all.

## Tips for Better Analysis

- Ask the user for the project location, building type, and delivery method if not provided — these significantly affect what's reasonable for allowances, general conditions, and schedule.
- If you can't determine the project type (commercial, residential, civil), ask before proceeding. The wrong baseline will produce misleading results.
- When in doubt, be conservative. It's better to flag a potential $50K gap than to miss a $500K exclusion.

## References

For benchmark data on allowances, exclusion costs, risk scoring frameworks, general conditions ranges, and O&P by delivery method, see `references/adjustment-examples.md`.
