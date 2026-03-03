# Adjustment Examples & Benchmarks

Reference data for bid leveling analysis. Use these as starting points when contractor-specific data is unavailable. Always adjust for project location, building type, and market conditions. All values in USD.

---

## Common Allowance Benchmarks by Project Type

### Commercial Construction (% of Hard Cost)

| Allowance Category | Low | Mid | High | Notes |
|---|---|---|---|---|
| Site Conditions / Unforeseen | 1.0% | 2.0% | 3.5% | Higher for renovation, urban, brownfield |
| MEP Coordination | 0.5% | 1.0% | 2.0% | Higher for labs, hospitals, data centers |
| Material Escalation | 1.5% | 3.0% | 5.0% | Depends on project duration and market volatility |
| Design Contingency | 3.0% | 5.0% | 10.0% | Depends on document completeness |
| Testing & Inspection | 0.3% | 0.5% | 1.0% | Soils, concrete, air balance, commissioning |
| Permits & Fees | 1.0% | 2.0% | 4.0% | Highly location-dependent |

### Residential Construction (% of Hard Cost)

| Allowance Category | Low | Mid | High | Notes |
|---|---|---|---|---|
| Finish Allowances (counters, flooring, fixtures) | 3.0% | 8.0% | 15.0% | Enormous variance; biggest leveling issue in residential |
| Appliances | 0.5% | 1.5% | 3.0% | Often excluded entirely |
| Landscaping & Hardscaping | 1.0% | 3.0% | 6.0% | Frequently excluded or underallowed |
| Site Conditions / Unforeseen | 1.0% | 2.0% | 4.0% | Higher for lots with slope, rock, or poor soils |
| Design Contingency | 2.0% | 5.0% | 8.0% | Custom homes higher than production |
| Permits & Impact Fees | 1.0% | 3.0% | 6.0% | Varies wildly by jurisdiction |

### Civil / Infrastructure (% of Hard Cost)

| Allowance Category | Low | Mid | High | Notes |
|---|---|---|---|---|
| Unsuitable Soils / Rock | 2.0% | 5.0% | 10.0% | Site-specific; geotech report is key |
| Utility Conflicts | 1.0% | 3.0% | 5.0% | Urban sites higher |
| Material Escalation | 1.5% | 3.0% | 6.0% | Asphalt and steel especially volatile |
| Dewatering | 0.5% | 2.0% | 5.0% | Depends on water table and season |
| Traffic Control | 0.5% | 1.5% | 3.0% | DOT jobs can be much higher |
| Environmental / Erosion Control | 0.5% | 1.0% | 2.5% | Wetlands, waterways increase cost |

---

## Common Exclusion Cost Estimates

### Commercial

| Exclusion Item | Typical Cost Range | Basis |
|---|---|---|
| Fire Protection / Sprinklers | $3–$8 / SF | Depends on hazard classification |
| Utility Tie-ins | $25K–$150K | Depends on utilities, distance, jurisdiction |
| Winter Conditions | 1%–3% of hard cost | Northern climates, Oct–Apr |
| Overtime Premium | 15%–30% of affected labor | On top of base labor rates |
| Hazmat Abatement | $5K–$500K+ | Highly variable, needs survey |
| Commissioning | 0.5%–1.5% of MEP cost | LEED projects typically higher |
| Escalation (12-month project) | 2%–5% of hard cost | Depends on market conditions |

### Residential

| Exclusion Item | Typical Cost Range | Basis |
|---|---|---|
| Landscaping (full) | $10K–$75K+ | Size and complexity dependent |
| Appliance Package | $5K–$40K | Builder grade vs. premium |
| Driveway & Walks | $5K–$25K | Material and length dependent |
| Utility Connection Fees | $5K–$30K | Jurisdiction-specific |
| Window Treatments | $3K–$20K | Often excluded |
| Permit & Impact Fees | $5K–$50K+ | Varies wildly |

### Civil / Infrastructure

| Exclusion Item | Typical Cost Range | Basis |
|---|---|---|
| Rock Excavation | $15–$50 / CY | Volume and hardness dependent |
| Import Fill | $8–$25 / CY | Haul distance is the driver |
| Utility Relocations (third-party) | $25K–$300K+ | Depends on utility owner and scope |
| Traffic Signal Modifications | $50K–$200K per intersection | DOT requirements vary |
| Environmental Remediation | $20K–$500K+ | Needs Phase II ESA |
| Dewatering (active) | $5K–$50K / month | Duration and volume dependent |

---

## Risk Scoring Framework

Use this framework to translate observations into the 0–100 risk score.

### Scoring by Category (each scored 0–20)

| Category | 0–5 (Low) | 6–10 (Moderate) | 11–15 (Elevated) | 16–20 (High) |
|---|---|---|---|---|
| Scope Gaps | All trades covered, detailed breakdown | Minor items unclear | 1–2 trades vague or missing detail | Major trades unaddressed |
| Allowance Realism | All allowances at or above baseline | 1–2 slightly below baseline | Multiple below baseline by >25% | Missing or token allowances |
| Schedule Risk | Conservative timeline, float built in | Tight but achievable | Requires overtime or phasing luck | Unrealistic without extraordinary measures |
| Pricing Balance | Even distribution, logical progression | Minor front-loading | Notable imbalance in 2+ areas | Extreme front-loading or loss-leader items |
| Track Record | Strong history, low change orders | Average performer | Some history of disputes or overruns | Known for aggressive bidding and change orders |

**Composite Risk Score** = Sum of all five categories (0–100)

### Converting Risk Score to Risk Premium

| Risk Score | Suggested Premium | Rationale |
|---|---|---|
| 0–20 | 0%–1% of bid | Low risk, minor contingency |
| 21–40 | 1%–3% of bid | Moderate gaps, manageable |
| 41–60 | 3%–5% of bid | Material concerns, real exposure |
| 61–80 | 5%–10% of bid | Significant risk, high change order probability |
| 81–100 | 10%+ of bid | Extreme risk, consider disqualifying |

---

## Example Adjustment Entry

Every adjustment in the Detailed Adjustment Log should follow this format:

```
Item:       Fire Protection
Bidder:     Contractor B
Reason:     Excluded from bid scope (see exclusion list item #4)
Amount:     +$185,000
Direction:  + (add to bid)
Basis:      $5.50/SF × 33,600 SF, per recent comparable project (Oak Street Office)
Confidence: Medium — based on comparable, not a direct quote
```

---

## General Conditions Benchmarks

### Commercial

| Project Size | GC % Range | Notes |
|---|---|---|
| < $5M | 8%–15% | Small projects have proportionally higher GC |
| $5M–$20M | 6%–10% | Mid-range commercial |
| $20M–$50M | 4%–8% | Larger scale, efficiencies emerge |
| > $50M | 3%–6% | Major projects, lean operations |

### Residential

| Project Type | GC % Range | Notes |
|---|---|---|
| Custom Home | 15%–25% | High touch, long duration relative to cost |
| Production / Tract | 8%–12% | Repetition drives efficiency |
| Multifamily | 5%–10% | Scale dependent |

### Civil / Infrastructure

| Project Size | GC % Range | Notes |
|---|---|---|
| < $2M | 10%–18% | Small site jobs |
| $2M–$10M | 7%–12% | Mid-range civil |
| > $10M | 5%–8% | Large infrastructure |

If a contractor's general conditions fall well outside these ranges for the project size and type, investigate why. Could be aggressive bidding (risk) or unusual project characteristics (legitimate).

---

## Overhead & Profit Benchmarks

| Delivery Method | Typical O&P Range |
|---|---|
| Hard Bid / Lump Sum | 3%–8% |
| GMP / CM at Risk | 3%–6% fee on cost of work |
| Design-Build | 5%–12% (includes design risk) |
| Negotiated | Varies widely |
| Unit Price (Civil) | Typically embedded in unit rates; 5%–10% effective |

Unusually low O&P may signal a contractor planning to make margin through change orders. Unusually high O&P in a competitive bid may reflect risk pricing or lack of interest.

---

## Unit Price Sanity Checks (Civil / Infrastructure)

These are rough order-of-magnitude ranges. Actual prices depend heavily on location, quantities, and site conditions. Use only as a "does this pass the smell test" check.

| Item | Unit | Low | Mid | High |
|---|---|---|---|---|
| Unclassified Excavation | CY | $5 | $12 | $25 |
| Rock Excavation | CY | $15 | $35 | $60 |
| Import Fill (compacted) | CY | $8 | $18 | $30 |
| 8" PVC Sanitary Sewer | LF | $35 | $60 | $100 |
| 12" Water Main (DI) | LF | $50 | $85 | $140 |
| Asphalt Paving (3" HMA) | SY | $15 | $25 | $40 |
| Concrete Curb & Gutter | LF | $18 | $30 | $50 |
| 6" Concrete Sidewalk | SF | $6 | $10 | $16 |
| Erosion Control (silt fence) | LF | $2 | $4 | $8 |
| Mobilization | LS | 3%–8% of bid | | |
