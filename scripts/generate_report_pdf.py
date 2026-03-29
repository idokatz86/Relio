#!/usr/bin/env python3
"""Convert the market validation survey report from Markdown to a styled PDF."""
import re
from fpdf import FPDF

MD_PATH = '/Users/idokatz/VSCode/Relio/docs/market-validation-survey-report.md'
PDF_PATH = '/Users/idokatz/VSCode/Relio/docs/market-validation-survey-report.pdf'

FN = 'ReportFont'


class ReportPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font(FN, 'I', 8)
            self.set_text_color(130, 130, 130)
            self.cell(0, 5, 'Relio \u2014 Market Validation Survey Report | Confidential', align='R')
            self.ln(8)

    def footer(self):
        self.set_y(-15)
        self.set_font(FN, 'I', 8)
        self.set_text_color(130, 130, 130)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')

    def section_title(self, text, level=1):
        if level == 1:
            self.ln(6)
            self.set_font(FN, 'B', 18)
            self.set_text_color(17, 24, 39)
            self.multi_cell(0, 8, text)
            self.set_draw_color(37, 99, 235)
            self.set_line_width(0.8)
            self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
            self.ln(4)
        elif level == 2:
            self.ln(5)
            self.set_font(FN, 'B', 14)
            self.set_text_color(30, 64, 175)
            self.multi_cell(0, 7, text)
            self.set_draw_color(200, 200, 200)
            self.set_line_width(0.3)
            self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
            self.ln(3)
        elif level == 3:
            self.ln(4)
            self.set_font(FN, 'B', 11)
            self.set_text_color(30, 58, 95)
            self.multi_cell(0, 6, text)
            self.ln(2)
        elif level == 4:
            self.ln(3)
            self.set_font(FN, 'B', 10)
            self.set_text_color(55, 65, 81)
            self.multi_cell(0, 5.5, text)
            self.ln(1)

    def body_text(self, text):
        self.set_font(FN, '', 9.5)
        self.set_text_color(30, 30, 30)
        parts = re.split(r'\*\*(.+?)\*\*', text)
        for i, part in enumerate(parts):
            if i % 2 == 1:
                self.set_font(FN, 'B', 9.5)
            else:
                self.set_font(FN, '', 9.5)
            self.write(5, part)
        self.ln(5)

    def blockquote(self, text):
        self.ln(2)
        self.set_draw_color(37, 99, 235)
        self.set_line_width(0.8)
        self.set_fill_color(239, 246, 255)
        self.set_font(FN, 'I', 9)
        self.set_text_color(30, 58, 95)
        w = self.w - self.l_margin - self.r_margin
        nlines = self.multi_cell(w - 12, 5, text, split_only=True)
        h = len(nlines) * 5 + 6
        y = self.get_y()
        if y + h > self.h - 20:
            self.add_page()
            y = self.get_y()
        self.rect(self.l_margin + 4, y, w - 4, h, 'F')
        self.line(self.l_margin + 4, y, self.l_margin + 4, y + h)
        self.set_xy(self.l_margin + 10, y + 3)
        self.multi_cell(w - 16, 5, text)
        self.ln(3)

    def render_table(self, headers, rows):
        self.ln(2)
        page_w = self.w - self.l_margin - self.r_margin
        n_cols = len(headers)
        col_widths = []
        for i in range(n_cols):
            mx = len(str(headers[i]))
            for row in rows:
                if i < len(row):
                    mx = max(mx, len(str(row[i])))
            col_widths.append(mx)
        total = sum(col_widths) or 1
        col_widths = [max(cw / total * page_w, 12) for cw in col_widths]
        scale = page_w / sum(col_widths)
        col_widths = [cw * scale for cw in col_widths]
        row_h = 5.5

        self.set_font(FN, 'B', 7.5)
        self.set_fill_color(30, 64, 175)
        self.set_text_color(255, 255, 255)
        for i, hdr in enumerate(headers):
            self.cell(col_widths[i], row_h + 1.5, str(hdr).strip(), border=1, fill=True)
        self.ln()

        self.set_font(FN, '', 7.5)
        self.set_text_color(30, 30, 30)
        for r_idx, row in enumerate(rows):
            if r_idx % 2 == 0:
                self.set_fill_color(249, 250, 251)
            else:
                self.set_fill_color(255, 255, 255)
            cell_texts = []
            max_lines = 1
            for ci in range(n_cols):
                txt = str(row[ci]).strip() if ci < len(row) else ''
                cell_texts.append(txt)
                nl = self.multi_cell(col_widths[ci] - 2, row_h, txt, split_only=True)
                max_lines = max(max_lines, len(nl))
            cell_h = max_lines * row_h

            if self.get_y() + cell_h > self.h - 20:
                self.add_page()
                self.set_font(FN, 'B', 7.5)
                self.set_fill_color(30, 64, 175)
                self.set_text_color(255, 255, 255)
                for i, hdr in enumerate(headers):
                    self.cell(col_widths[i], row_h + 1.5, str(hdr).strip(), border=1, fill=True)
                self.ln()
                self.set_font(FN, '', 7.5)
                self.set_text_color(30, 30, 30)
                if r_idx % 2 == 0:
                    self.set_fill_color(249, 250, 251)
                else:
                    self.set_fill_color(255, 255, 255)

            yb = self.get_y()
            xb = self.get_x()
            for ci, txt in enumerate(cell_texts):
                xp = xb + sum(col_widths[:ci])
                self.set_xy(xp, yb)
                self.rect(xp, yb, col_widths[ci], cell_h, 'DF')
                self.set_xy(xp + 1, yb + 0.5)
                self.multi_cell(col_widths[ci] - 2, row_h, txt)
            self.set_y(yb + cell_h)
        self.ln(3)

    def bullet(self, text, indent=0):
        self.set_font(FN, '', 9.5)
        self.set_text_color(30, 30, 30)
        x = self.l_margin + 4 + indent
        self.set_x(x)
        self.cell(4, 5, '\u2022')
        parts = re.split(r'\*\*(.+?)\*\*', text)
        for i, part in enumerate(parts):
            if i % 2 == 1:
                self.set_font(FN, 'B', 9.5)
            else:
                self.set_font(FN, '', 9.5)
            self.write(5, part)
        self.ln(5)


def parse_and_render(pdf, md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if not line:
            i += 1
            continue
        if line.strip() == '---':
            pdf.ln(2)
            pdf.set_draw_color(200, 200, 200)
            pdf.set_line_width(0.3)
            pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
            pdf.ln(3)
            i += 1
            continue
        h_match = re.match(r'^(#{1,4})\s+(.+)$', line)
        if h_match:
            level = len(h_match.group(1))
            text = h_match.group(2)
            pdf.section_title(text, level)
            i += 1
            continue
        if '|' in line and i + 1 < len(lines) and '---' in lines[i + 1]:
            headers = [c.strip() for c in line.split('|') if c.strip()]
            i += 2
            rows = []
            while i < len(lines) and '|' in lines[i] and lines[i].strip():
                row = [c.strip() for c in lines[i].split('|') if c.strip()]
                rows.append(row)
                i += 1
            pdf.render_table(headers, rows)
            continue
        if line.startswith('>'):
            quote_text = line.lstrip('> ').strip()
            i += 1
            while i < len(lines) and lines[i].strip().startswith('>'):
                quote_text += ' ' + lines[i].lstrip('> ').strip()
                i += 1
            pdf.blockquote(quote_text)
            continue
        if line.startswith('- ') or line.startswith('* '):
            text = line[2:].strip()
            pdf.bullet(text)
            i += 1
            continue
        num_match = re.match(r'^\d+\.\s+(.+)$', line)
        if num_match:
            text = num_match.group(1)
            pdf.bullet(text)
            i += 1
            continue
        para = line
        i += 1
        while i < len(lines) and lines[i].strip() and not lines[i].startswith('#') \
                and not lines[i].startswith('|') and not lines[i].startswith('-') \
                and not lines[i].startswith('>') and not lines[i].strip() == '---' \
                and not re.match(r'^\d+\.', lines[i]):
            para += ' ' + lines[i].strip()
            i += 1
        pdf.body_text(para)


# Build PDF
pdf = ReportPDF()
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)

pdf.add_font(FN, '', '/System/Library/Fonts/Supplemental/Arial.ttf')
pdf.add_font(FN, 'B', '/System/Library/Fonts/Supplemental/Arial Bold.ttf')
pdf.add_font(FN, 'I', '/System/Library/Fonts/Supplemental/Arial Italic.ttf')
pdf.add_font(FN, 'BI', '/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf')

pdf.add_page()

# Title page
pdf.ln(30)
pdf.set_font(FN, 'B', 28)
pdf.set_text_color(30, 64, 175)
pdf.cell(0, 12, 'Relio', align='C')
pdf.ln(14)
pdf.set_font(FN, '', 16)
pdf.set_text_color(55, 65, 81)
pdf.cell(0, 8, 'Market Validation Survey Report', align='C')
pdf.ln(12)
pdf.set_draw_color(37, 99, 235)
pdf.set_line_width(1)
mid = pdf.w / 2
pdf.line(mid - 40, pdf.get_y(), mid + 40, pdf.get_y())
pdf.ln(12)
pdf.set_font(FN, '', 11)
pdf.set_text_color(100, 100, 100)
for line in [
    'March 29, 2026',
    '101 Respondents',
    '',
    'Prepared by All Pod Leaders',
    'CEO | CPO | CRO | CPsychO | CMO | CSO',
    '',
    'Confidential \u2014 Board & Leadership',
]:
    pdf.cell(0, 6, line, align='C')
    pdf.ln()

pdf.add_page()
parse_and_render(pdf, MD_PATH)
pdf.output(PDF_PATH)
print(f'PDF generated: {PDF_PATH}')
