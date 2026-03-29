#!/usr/bin/env python3
"""Generate PDF for ChatGPT conversion strategy using the same engine."""
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(script_dir, 'generate_report_pdf.py')

with open(src, 'r') as f:
    code = f.read()

code = code.replace(
    "MD_PATH = '/Users/idokatz/VSCode/Relio/docs/market-validation-survey-report.md'",
    "MD_PATH = '/Users/idokatz/VSCode/Relio/docs/chatgpt-conversion-strategy.md'"
)
code = code.replace(
    "PDF_PATH = '/Users/idokatz/VSCode/Relio/docs/market-validation-survey-report.pdf'",
    "PDF_PATH = '/Users/idokatz/VSCode/Relio/docs/chatgpt-conversion-strategy.pdf'"
)
code = code.replace(
    'Market Validation Survey Report | Confidential',
    'ChatGPT User Conversion Strategy | Confidential'
)
code = code.replace(
    "pdf.cell(0, 8, 'Market Validation Survey Report', align='C')",
    "pdf.cell(0, 8, 'ChatGPT User Conversion Strategy', align='C')"
)

exec(code)
