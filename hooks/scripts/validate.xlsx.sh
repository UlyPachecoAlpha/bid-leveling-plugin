#!/bin/bash
set -euo pipefail

# Read the PostToolUse input from stdin
input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
output_path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.path // empty')

# Only validate if a .xlsx file was just written
if [[ -z "$output_path" ]] || [[ "$output_path" != *.xlsx ]]; then
    exit 0
fi

if [[ ! -f "$output_path" ]]; then
    exit 0
fi

# Check if openpyxl can load it and report basic stats
python3 -c "
import sys
from openpyxl import load_workbook
try:
    wb = load_workbook('$output_path')
    sheets = wb.sheetnames
    print(f'Validated: {len(sheets)} sheets: {sheets}', file=sys.stderr)
    # Check for formula presence
    formula_count = 0
    for name in sheets:
        for row in wb[name].iter_rows():
            for cell in row:
                if cell.value and str(cell.value).startswith('='):
                    formula_count += 1
    if formula_count == 0:
        print('WARNING: No formulas found in workbook — values may be hardcoded', file=sys.stderr)
    else:
        print(f'Found {formula_count} formulas', file=sys.stderr)
except Exception as e:
    print(f'XLSX validation error: {e}', file=sys.stderr)
    exit 1
" 2>&1 || true
