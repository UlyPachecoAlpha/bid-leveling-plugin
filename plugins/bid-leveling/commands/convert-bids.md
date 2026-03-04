---
description: Convert PDF bid documents to Excel or Word format for easier analysis. Uses the PDF converter MCP server if available, or falls back to local conversion.
---

# Convert Bids Command

Convert uploaded PDF bid documents to Excel (.xlsx) or Word (.docx) for more efficient data extraction.

## What to do

1. Check if the pdf-converter MCP tools are available (convert_pdf_to_excel, convert_pdf_to_word).
2. If MCP tools are available, use them. If not, use Node.js with pdf-parse and xlsx packages directly.
3. Show a time estimate before starting:
   ```
   ESTIMATED TIME: ~30-60 seconds per file
   ```
4. Convert each PDF file the user has uploaded.
5. Report what was converted and where the output files are.
6. Suggest running /level-bids or /level-bids-auto on the converted files.

## Conversion Priority
- PDF to Excel is preferred for bid documents (tabular data extracts better)
- PDF to Word is available for narrative-heavy proposals
- If the user does not specify, default to Excel

## Notes
- For best quality conversion, set PDFCO_API_KEY environment variable (free tier at pdf.co)
- Local conversion works without an API key but produces lower quality output from complex PDFs
