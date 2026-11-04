# -*- coding: utf-8 -*-
"""Genera el guion imprimible de la exposición de Chernóbil para cinco personas."""

from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_TAB_ALIGNMENT, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_COLOR_INDEX
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.style import WD_STYLE_TYPE
import copy
import re


INK = "1B1E1E"
DARK = "141717"
RED = "A3382D"
AMBER = "A87428"
AMBER_LIGHT = "F4EEDF"
LIGHT = "F2EFE7"
LIGHT_2 = "F8F6F0"
GRAY = "5F6562"
MIDGRAY = "8A8F8B"
LINE = "D8D3C7"
WHITE = "FFFFFF"


# ---------------------------------------------------------------------------
# Helpers de formato OOXML
# ---------------------------------------------------------------------------

def _set_cell_shading(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tcPr.append(shd)


def _set_cell_margins(cell, top=80, start=100, bottom=80, end=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement("w:tcMar")
    for tag, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        el = OxmlElement(f"w:{tag}")
        el.set(qn("w:w"), str(value))
        el.set(qn("w:type"), "dxa")
        tcMar.append(el)
    tcPr.append(tcMar)


def _set_cell_border(cell, color=LINE, size=4, edges=("top", "left", "bottom", "right")):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = tcPr.find(qn("w:tcBorders"))
    if tcBorders is None:
        tcBorders = OxmlElement("w:tcBorders")
        tcPr.append(tcBorders)
    for edge in edges:
        el = tcBorders.find(qn(f"w:{edge}"))
        if el is None:
            el = OxmlElement(f"w:{edge}")
            tcBorders.append(el)
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), str(size))
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), color)


def _table_borders(table, color=LINE, size=4, inside=True):
    tblPr = table._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    edges = ["top", "left", "bottom", "right"]
    if inside:
        edges += ["insideH", "insideV"]
    for edge in edges:
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), str(size))
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), color)
        borders.append(el)
    tblPr.append(borders)


def _no_table_borders(table):
    tblPr = table._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "nil")
        borders.append(el)
    tblPr.append(borders)


def _set_col_widths(table, widths):
    table.autofit = False
    for i, width in enumerate(widths):
        table.columns[i].width = Cm(width)
    for row in table.rows:
        for i, width in enumerate(widths):
            row.cells[i].width = Cm(width)


def _table_width(table, width_cm):
    tblPr = table._tbl.tblPr
    tblW = OxmlElement("w:tblW")
    tblW.set(qn("w:w"), str(int(width_cm * 567)))
    tblW.set(qn("w:type"), "dxa")
    tblPr.append(tblW)


def _row_no_split(row):
    trPr = row._tr.get_or_add_trPr()
    cantSplit = OxmlElement("w:cantSplit")
    trPr.append(cantSplit)


def _repeat_header(row):
    trPr = row._tr.get_or_add_trPr()
    tblHeader = OxmlElement("w:tblHeader")
    trPr.append(tblHeader)


def _paragraph_shading(paragraph, fill):
    pPr = paragraph._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    pPr.append(shd)


def _paragraph_border(paragraph, color=LINE, size=4, position="bottom", space=4):
    pPr = paragraph._p.get_or_add_pPr()
    pBdr = pPr.find(qn("w:pBdr"))
    if pBdr is None:
        pBdr = OxmlElement("w:pBdr")
        pPr.append(pBdr)
    el = OxmlElement(f"w:{position}")
    el.set(qn("w:val"), "single")
    el.set(qn("w:sz"), str(size))
    el.set(qn("w:space"), str(space))
    el.set(qn("w:color"), color)
    pBdr.append(el)


def _letter_spacing(run, twips):
    rPr = run._element.get_or_add_rPr()
    spacing = OxmlElement("w:spacing")
    spacing.set(qn("w:val"), str(twips))
    rPr.append(spacing)


def _add_page_number(paragraph):
    run = paragraph.add_run()
    fldChar1 = OxmlElement("w:fldChar")
    fldChar1.set(qn("w:fldCharType"), "begin")
    instrText = OxmlElement("w:instrText")
    instrText.set(qn("xml:space"), "preserve")
    instrText.text = " PAGE "
    fldChar2 = OxmlElement("w:fldChar")
    fldChar2.set(qn("w:fldCharType"), "separate")
    t = OxmlElement("w:t")
    t.text = "1"
    fldChar3 = OxmlElement("w:fldChar")
    fldChar3.set(qn("w:fldCharType"), "end")
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)
    run._r.append(t)
    run._r.append(fldChar3)


def _set_run(run, font="Arial", size=10, bold=False, color=INK, italic=False, caps=False, spacing=None):
    run.font.name = font
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)
    if caps:
        run.font.all_caps = True
    if spacing is not None:
        _letter_spacing(run, spacing)


def _add_rich_text(paragraph, text, base_font="Arial", size=10.4, color=INK, bold=False, italic=False):
    """Admite **negritas** y _cursivas_ simples para mantener el guion legible."""
    pattern = re.compile(r"(\*\*.*?\*\*|__.*?__)")
    pos = 0
    for match in pattern.finditer(text):
        if match.start() > pos:
            r = paragraph.add_run(text[pos:match.start()])
            _set_run(r, base_font, size, bold, color, italic)
        token = match.group(0)
        if token.startswith("**"):
            r = paragraph.add_run(token[2:-2])
            _set_run(r, base_font, size, True, color, italic)
        else:
            r = paragraph.add_run(token[2:-2])
            _set_run(r, base_font, size, bold, color, True)
        pos = match.end()
    if pos < len(text):
        r = paragraph.add_run(text[pos:])
        _set_run(r, base_font, size, bold, color, italic)


# ---------------------------------------------------------------------------
# Documento
# ---------------------------------------------------------------------------

doc = Document()

# Propiedades
doc.core_properties.title = "Chernóbil: la noche que cambió la historia — Guion de exposición"
doc.core_properties.subject = "Guion cronometrado para cinco expositores"
doc.core_properties.author = "Equipo de exposición"
doc.core_properties.keywords = "Chernóbil, educación, historia, guion, exposición"

# Página A4
section = doc.sections[0]
section.page_width = Cm(21)
section.page_height = Cm(29.7)
section.top_margin = Cm(1.65)
section.bottom_margin = Cm(1.65)
section.left_margin = Cm(1.9)
section.right_margin = Cm(1.9)
section.header_distance = Cm(0.75)
section.footer_distance = Cm(0.65)
section.different_first_page_header_footer = True
CONTENT_W = 17.2

# Estilos
styles = doc.styles
normal = styles["Normal"]
normal.font.name = "Arial"
normal.font.size = Pt(10.2)
normal.font.color.rgb = RGBColor.from_string(INK)
normal.paragraph_format.space_after = Pt(4)
normal.paragraph_format.line_spacing = 1.18

def add_style(name, font="Arial", size=10, color=INK, bold=False, italic=False,
              before=0, after=4, line=1.15, caps=False, spacing=None):
    st = styles.add_style(name, WD_STYLE_TYPE.PARAGRAPH)
    st.base_style = normal
    st.font.name = font
    st.font.size = Pt(size)
    st.font.bold = bold
    st.font.italic = italic
    st.font.color.rgb = RGBColor.from_string(color)
    st.paragraph_format.space_before = Pt(before)
    st.paragraph_format.space_after = Pt(after)
    st.paragraph_format.line_spacing = line
    st.paragraph_format.keep_with_next = False
    if caps:
        st.font.all_caps = True
    if spacing is not None:
        st.element.get_or_add_rPr()
        sp = OxmlElement("w:spacing")
        sp.set(qn("w:val"), str(spacing))
        st.element.get_or_add_rPr().append(sp)
    return st

add_style("Kicker", size=8.2, color=RED, bold=True, before=0, after=4, caps=True, spacing=22)
add_style("BigTitle", font="Arial", size=42, color=INK, bold=True, before=0, after=2, line=0.95)
add_style("CoverSub", font="Georgia", size=16.5, color=RED, italic=True, before=0, after=8, line=1.05)
add_style("Lead", size=12, color="3E4542", before=0, after=9, line=1.32)
add_style("H1", size=23, color=INK, bold=True, before=0, after=5, line=1.0)
add_style("H2", size=10.6, color=RED, bold=True, before=12, after=4, caps=True, spacing=12)
add_style("H3", size=9.2, color=AMBER, bold=True, before=8, after=3, caps=True, spacing=10)
add_style("BodySmall", size=9, color="4E5552", before=0, after=3, line=1.18)
add_style("Cue", size=8.4, color="7A5720", italic=True, before=4, after=5, line=1.14)
add_style("Speech", size=10.5, color=INK, before=0, after=6, line=1.27)
add_style("Quote", font="Georgia", size=11.6, color=INK, italic=True, before=0, after=4, line=1.3)
add_style("Caption", size=7.6, color=MIDGRAY, before=2, after=0, line=1.1, caps=True, spacing=10)
add_style("Tiny", size=7.8, color=GRAY, before=0, after=2, line=1.12)
add_style("Mission", font="Georgia", size=11.4, color=RED, italic=True, before=2, after=8, line=1.2)


def P(text="", style="Speech"):
    p = doc.add_paragraph(style=style)
    if text:
        _add_rich_text(p, text, size=(10.5 if style == "Speech" else (9 if style == "BodySmall" else 10)))
    return p


def CUE(text):
    p = doc.add_paragraph(style="Cue")
    r = p.add_run("▸  ")
    _set_run(r, "Arial", 8.6, True, AMBER)
    _add_rich_text(p, text, size=8.4, color="7A5720", italic=True)
    p.paragraph_format.keep_with_next = True
    return p


def H1(text):
    return doc.add_paragraph(text, style="H1")


def H2(text):
    return doc.add_paragraph(text, style="H2")


def H3(text):
    return doc.add_paragraph(text, style="H3")


def rule(color=LINE, size=5, space_before=2, space_after=8):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1
    _paragraph_border(p, color, size, "bottom", 0)
    return p


def page_break():
    doc.add_page_break()


def callout(title, lines, fill=AMBER_LIGHT, accent=AMBER, title_color=AMBER):
    table = doc.add_table(rows=1, cols=1)
    _table_width(table, CONTENT_W)
    _no_table_borders(table)
    _set_cell_shading(table.cell(0, 0), fill)
    _set_cell_margins(table.cell(0, 0), 115, 135, 105, 135)
    _set_cell_border(table.cell(0, 0), accent, 22, ("left",))
    cell = table.cell(0, 0)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(title.upper())
    _set_run(r, "Arial", 7.5, True, title_color, spacing=18)
    for line in lines:
        p2 = cell.add_paragraph(style="BodySmall")
        p2.paragraph_format.space_after = Pt(2)
        _add_rich_text(p2, line, size=9, color="4C504D")
    return table


def transition_box(text):
    table = doc.add_table(rows=1, cols=1)
    _table_width(table, CONTENT_W)
    _no_table_borders(table)
    _set_cell_shading(table.cell(0, 0), "F6ECE8")
    _set_cell_margins(table.cell(0, 0), 120, 140, 115, 140)
    _set_cell_border(table.cell(0, 0), RED, 26, ("left",))
    cell = table.cell(0, 0)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run("TRANSICIÓN · DI ESTO")
    _set_run(r, "Arial", 7.3, True, RED, spacing=18)
    p2 = cell.add_paragraph(style="Quote")
    p2.paragraph_format.space_after = Pt(0)
    _add_rich_text(p2, f"“{text}”", base_font="Georgia", size=10.8, color=INK, italic=True)
    return table


def qa_block(items):
    H2("Si te preguntan")
    for q, a in items:
        p = doc.add_paragraph(style="Speech")
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run("P.  ")
        _set_run(r, "Arial", 8.8, True, RED)
        r = p.add_run(q + "  ")
        _set_run(r, "Arial", 9.7, True, INK)
        r = p.add_run(a)
        _set_run(r, "Arial", 9.7, False, "4C5150")
        p.paragraph_format.left_indent = Cm(0.25)
        p.paragraph_format.first_line_indent = Cm(-0.25)
        p.paragraph_format.space_after = Pt(4)


def add_speaker_banner(num, title, chapters, minutes):
    table = doc.add_table(rows=1, cols=2)
    _table_width(table, CONTENT_W)
    _no_table_borders(table)
    table.autofit = False
    _set_col_widths(table, [12.9, 4.3])
    left = table.cell(0, 0)
    right = table.cell(0, 1)
    _set_cell_shading(left, DARK)
    _set_cell_shading(right, RED)
    _set_cell_margins(left, 160, 190, 150, 170)
    _set_cell_margins(right, 160, 150, 150, 150)
    p = left.paragraphs[0]
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run(f"PERSONA {num} / 05")
    _set_run(r, "Arial", 7.5, True, AMBER, spacing=20)
    p2 = left.add_paragraph()
    p2.paragraph_format.space_after = Pt(3)
    p2.paragraph_format.line_spacing = 0.96
    r = p2.add_run(title.upper())
    _set_run(r, "Arial", 19.5, True, WHITE)
    p3 = left.add_paragraph()
    p3.paragraph_format.space_after = Pt(0)
    r = p3.add_run("Nombre: ______________________________________")
    _set_run(r, "Arial", 8, False, "BFC2BB")
    pr = right.paragraphs[0]
    pr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pr.paragraph_format.space_after = Pt(3)
    r = pr.add_run("CAPÍTULOS")
    _set_run(r, "Arial", 6.8, True, "F0D3C9", spacing=13)
    pr2 = right.add_paragraph()
    pr2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pr2.paragraph_format.space_after = Pt(2)
    r = pr2.add_run(chapters)
    _set_run(r, "Arial", 18, True, WHITE)
    pr3 = right.add_paragraph()
    pr3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pr3.paragraph_format.space_after = Pt(0)
    r = pr3.add_run(f"≈ {minutes} MIN")
    _set_run(r, "Arial", 7.2, True, WHITE, spacing=12)
    _row_no_split(table.rows[0])
    return table


def speaker_meta(mission, anchors):
    p = doc.add_paragraph(style="Mission")
    _add_rich_text(p, mission, base_font="Georgia", size=11.2, color=RED, italic=True)
    # Anclas en una banda discreta
    table = doc.add_table(rows=1, cols=3)
    _table_width(table, CONTENT_W)
    _no_table_borders(table)
    _set_col_widths(table, [5.73, 5.73, 5.74])
    for i, a in enumerate(anchors):
        cell = table.cell(0, i)
        _set_cell_shading(cell, LIGHT_2)
        _set_cell_margins(cell, 95, 110, 85, 110)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(f"0{i+1}")
        _set_run(r, "Arial", 7.3, True, AMBER, spacing=5)
        p2 = cell.add_paragraph(style="BodySmall")
        p2.paragraph_format.space_after = Pt(0)
        _add_rich_text(p2, a, size=8.7, color="454B48")
    return table


def source_row():
    p = doc.add_paragraph(style="Caption")
    p.paragraph_format.space_before = Pt(8)
    _paragraph_border(p, LINE, 3, "top", 5)
    r = p.add_run("FUENTES DEL BLOQUE  ·  IAEA / INSAG-7  ·  UNSCEAR  ·  OMS  ·  EBRD  ·  ChNPP")
    _set_run(r, "Arial", 6.9, False, MIDGRAY, spacing=8)


# ---------------------------------------------------------------------------
# Encabezado y pie (a partir de la página 2)
# ---------------------------------------------------------------------------
header = section.header
hp = header.paragraphs[0]
hp.paragraph_format.space_after = Pt(2)
hp.paragraph_format.tab_stops.add_tab_stop(Cm(CONTENT_W), WD_TAB_ALIGNMENT.RIGHT)
r = hp.add_run("CHERNÓBIL · GUION DE EXPOSICIÓN")
_set_run(r, "Arial", 7.2, True, "6B716D", spacing=12)
r = hp.add_run("\tDOCUMENTO DE TRABAJO · 2026")
_set_run(r, "Arial", 7.2, False, "8A8F8B", spacing=8)
_paragraph_border(hp, LINE, 3, "bottom", 4)

footer = section.footer
fp = footer.paragraphs[0]
fp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
fp.paragraph_format.space_before = Pt(2)
r = fp.add_run("CHERNÓBIL 1986—2026  ·  PÁGINA ")
_set_run(r, "Arial", 6.8, False, "7D827E", spacing=8)
_add_page_number(fp)


# ---------------------------------------------------------------------------
# PORTADA
# ---------------------------------------------------------------------------
band = doc.add_table(rows=1, cols=1)
_table_width(band, CONTENT_W)
_no_table_borders(band)
_set_cell_shading(band.cell(0, 0), DARK)
_set_cell_margins(band.cell(0, 0), 100, 140, 90, 140)
bp = band.cell(0, 0).paragraphs[0]
bp.paragraph_format.space_after = Pt(0)
r = bp.add_run("ARCHIVO DE EXPOSICIÓN  ·  2026")
_set_run(r, "Arial", 7.4, True, "E7DFD0", spacing=22)
r = bp.add_run("        GUION DE CINCO VOCES")
_set_run(r, "Arial", 7.4, False, "AEB6AE", spacing=16)

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(46)
p.paragraph_format.space_after = Pt(0)
r = p.add_run("GUION DE EXPOSICIÓN  ·  TRABAJO EN EQUIPO")
_set_run(r, "Arial", 8, True, RED, spacing=20)

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(7)
p.paragraph_format.space_after = Pt(2)
p.paragraph_format.line_spacing = 0.86
r = p.add_run("CHERNÓBIL")
_set_run(r, "Arial", 58, True, INK, spacing=2)

p = doc.add_paragraph(style="CoverSub")
p.paragraph_format.space_before = Pt(5)
p.paragraph_format.space_after = Pt(16)
r = p.add_run("La noche que cambió la historia")
_set_run(r, "Georgia", 20, False, RED, italic=True)

# Línea roja
line = doc.add_paragraph()
line.paragraph_format.space_before = Pt(0)
line.paragraph_format.space_after = Pt(14)
_paragraph_border(line, RED, 10, "top", 0)

p = doc.add_paragraph(style="Lead")
p.paragraph_format.space_after = Pt(12)
_add_rich_text(
    p,
    "Reparto, cronología y textos palabra por palabra para una exposición de **20 minutos** sobre el accidente del 26 de abril de 1986.",
    size=13.4,
    color="3E4542",
)

# Ficha editorial
meta = doc.add_table(rows=1, cols=3)
_table_width(meta, CONTENT_W)
_no_table_borders(meta)
_set_col_widths(meta, [5.73, 5.73, 5.74])
for i, (label, value) in enumerate([
    ("FORMATO", "10 capítulos · 5 voces"),
    ("DURACIÓN", "20 minutos · versión 15"),
    ("USO", "Exposición en clase"),
]):
    cell = meta.cell(0, i)
    _set_cell_shading(cell, LIGHT)
    _set_cell_margins(cell, 95, 110, 90, 110)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(label)
    _set_run(r, "Arial", 6.8, True, AMBER, spacing=12)
    p2 = cell.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    r = p2.add_run(value)
    _set_run(r, "Arial", 9.2, True, INK)

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(28)
p.paragraph_format.space_after = Pt(3)
r = p.add_run("EQUIPO")
_set_run(r, "Arial", 7.4, True, RED, spacing=20)
p = doc.add_paragraph(style="Tiny")
p.paragraph_format.space_after = Pt(10)
r = p.add_run("Escriban sus nombres antes de imprimir. Cada persona conserva su bloque y su transición.")
_set_run(r, "Arial", 8.4, False, GRAY)

team = doc.add_table(rows=5, cols=2)
_table_width(team, CONTENT_W)
_table_borders(team, LINE, 3, True)
_set_col_widths(team, [3.3, 13.9])
for i in range(5):
    _row_no_split(team.rows[i])
    left = team.cell(i, 0)
    right = team.cell(i, 1)
    _set_cell_shading(left, DARK)
    _set_cell_margins(left, 95, 120, 80, 100)
    _set_cell_margins(right, 95, 130, 80, 120)
    p = left.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(f"P{i+1}")
    _set_run(r, "Arial", 11, True, WHITE, spacing=3)
    p = right.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("Nombre:  __________________________________________________     Firma: ________________")
    _set_run(r, "Arial", 8.6, False, "5A605C")

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(20)
p.paragraph_format.space_after = Pt(2)
_paragraph_border(p, LINE, 3, "top", 0)
p = doc.add_paragraph(style="Caption")
p.paragraph_format.space_before = Pt(5)
r = p.add_run("26 DE ABRIL DE 1986  ·  01:23  ·  UNIDAD 4  ·  PRÍPIAT, UCRANIA")
_set_run(r, "Arial", 7.2, True, "7D827E", spacing=14)
p = doc.add_paragraph(style="Tiny")
p.paragraph_format.space_before = Pt(2)
r = p.add_run("Documento de trabajo basado en la presentación interactiva index.html. No sustituye a las fuentes citadas.")
_set_run(r, "Arial", 7.4, False, MIDGRAY)


# ---------------------------------------------------------------------------
# PLAN
# ---------------------------------------------------------------------------
page_break()
H1("Cinco voces, una sola historia")
p = doc.add_paragraph(style="Lead")
_add_rich_text(
    p,
    "La presentación tiene diez capítulos. Cada persona expone dos y entrega el hilo narrativo a la siguiente. "
    "El objetivo no es recitar datos: es que el público entienda **cómo funcionaba el reactor, cómo falló, a quién afectó y qué aprendimos**.",
    size=12,
)

speakers = [
    ("01", "1–2", "El reactor y la trampa de la prueba", "4 min", "Apertura · datos técnicos"),
    ("02", "3–4", "La explosión y los primeros en entrar", "4 min", "Clímax · respaldo técnico"),
    ("03", "5–6", "Prípiat y la nube sobre Europa", "4 min", "Escala humana y global · tiempo"),
    ("04", "7–8", "Liquidadores y consecuencias", "4,5 min", "Evidencia y salud · fuentes"),
    ("05", "9–10", "Encerrar el reactor y aprender", "3,5 min", "Cierre · cita final"),
]

t = doc.add_table(rows=1 + len(speakers), cols=5)
_table_width(t, CONTENT_W)
_table_borders(t, LINE, 4, True)
_set_col_widths(t, [1.2, 2.0, 7.3, 1.6, 5.1])
header_cells = t.rows[0].cells
for i, h in enumerate(["#", "CAP.", "ENFOQUE", "MIN.", "FUNCIÓN EN EL EQUIPO"]):
    _set_cell_shading(header_cells[i], DARK)
    _set_cell_margins(header_cells[i], 85, 95, 75, 95)
    p = header_cells[i].paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(h)
    _set_run(r, "Arial", 6.9, True, "E8E0D2", spacing=10)
_repeat_header(t.rows[0])
for i, (num, caps, focus, minutes, role) in enumerate(speakers):
    row = t.rows[i + 1]
    _row_no_split(row)
    vals = [num, caps, focus, minutes, role]
    for j, val in enumerate(vals):
        cell = row.cells[j]
        _set_cell_margins(cell, 95, 95, 80, 95)
        if i % 2 == 1:
            _set_cell_shading(cell, LIGHT_2)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        if j == 0:
            r = p.add_run(val)
            _set_run(r, "Arial", 9.3, True, RED, spacing=4)
        elif j == 1:
            r = p.add_run(val)
            _set_run(r, "Arial", 9.1, True, INK)
        elif j == 3:
            r = p.add_run(val)
            _set_run(r, "Arial", 8.6, True, AMBER)
        elif j == 4:
            r = p.add_run(val)
            _set_run(r, "Arial", 8.4, False, "565C58")
        else:
            r = p.add_run(val)
            _set_run(r, "Arial", 9.4, False, INK)

p = doc.add_paragraph(style="Caption")
p.paragraph_format.space_before = Pt(9)
r = p.add_run("TIEMPO TOTAL: 20 MINUTOS  ·  +1–2 MINUTOS DE MARGEN PARA CAMBIOS DE EXPOSITOR")
_set_run(r, "Arial", 6.8, True, MIDGRAY, spacing=8)

H2("El orden de la noche")
p = doc.add_paragraph(style="BodySmall")
p.paragraph_format.space_after = Pt(8)
_add_rich_text(
    p,
    "La secuencia no es casual: primero se explica el diseño; después, el accidente; luego, la evacuación y la contaminación; "
    "más tarde, el trabajo de los liquidadores y las consecuencias; y al final, la contención y la reflexión. "
    "Si alguien se adelanta a una idea que pertenece a otro bloque, la retoma brevemente el siguiente.",
    size=9.2,
)

# Línea de tiempo visual en 5 celdas
tl = doc.add_table(rows=1, cols=5)
_table_width(tl, CONTENT_W)
_no_table_borders(tl)
_set_col_widths(tl, [3.44, 3.44, 3.44, 3.44, 3.44])
for i, (num, caps, focus, minutes, role) in enumerate(speakers):
    cell = tl.cell(0, i)
    _set_cell_shading(cell, LIGHT)
    _set_cell_margins(cell, 100, 100, 90, 100)
    _set_cell_border(cell, RED, 20, ("top",))
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run(f"BLOQUE {num}")
    _set_run(r, "Arial", 6.8, True, AMBER, spacing=13)
    p2 = cell.add_paragraph()
    p2.paragraph_format.space_after = Pt(2)
    p2.paragraph_format.line_spacing = 1.0
    r = p2.add_run(f"{['0:00','4:00','8:00','12:00','16:30'][i]}")
    _set_run(r, "Arial", 12.5, True, RED)
    p3 = cell.add_paragraph()
    p3.paragraph_format.space_after = Pt(0)
    r = p3.add_run(f"{minutes.replace(' min','')} min · {focus.split(' y ')[0]}")
    _set_run(r, "Arial", 7.5, False, "4E5450")

H2("Cinco reglas de oro")
rules = [
    "**No lean la pantalla.** El panel es apoyo visual; el guion es suyo. Cada persona elige tres datos y los explica.",
    "**Una interacción por bloque.** Demasiados clics distraen. Hagan la acción principal y dejen que el público mire.",
    "**Esperen la transición.** Entre capítulos la escena tarda un segundo o dos en cargar. No hablen encima del cambio.",
    "**Las cifras se explican, no se recitan.** Digan qué significan antes de dar el número.",
    "**La precisión importa más que el dramatismo.** Si una estimación es incierta, díganlo: “se estima”, “se atribuye”.",
]
for i, text in enumerate(rules, 1):
    p = doc.add_paragraph(style="Speech")
    p.paragraph_format.left_indent = Cm(0.65)
    p.paragraph_format.first_line_indent = Cm(-0.65)
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run(f"{i:02d}  ")
    _set_run(r, "Arial", 8.3, True, RED, spacing=4)
    _add_rich_text(p, text, size=9.6)

callout(
    "Si el tiempo se reduce a 15 minutos",
    [
        "Cada persona baja a unos **3 minutos**. Conserven la primera frase de su bloque, el dato principal y la transición.",
        "Eliminen la segunda interacción, los detalles secundarios y las respuestas largas de la sección “Si te preguntan”.",
        "No se elimine el cierre: la cita final necesita aire y silencio.",
    ],
)

source_row()


# ---------------------------------------------------------------------------
# TÉCNICA / ROLES
# ---------------------------------------------------------------------------
page_break()
H1("Cómo usar la presentación")
p = doc.add_paragraph(style="Lead")
_add_rich_text(
    p,
    "La experiencia está diseñada para que cada expositor mantenga el control. **No avanza sola.** "
    "Cada persona abre su capítulo, reproduce su secuencia y cede el paso cuando termina su transición.",
    size=11.5,
)
p = doc.add_paragraph(style="BodySmall")
_add_rich_text(
    p,
    "Archivo: index.html  ·  Abrir en Chrome, Edge, Firefox o Safari actuales  ·  Pantalla completa recomendada  ·  Sonido desactivado por defecto.",
    size=8.8,
    color=GRAY,
)

H2("Controles esenciales")
ctrl = doc.add_table(rows=1, cols=3)
_table_width(ctrl, CONTENT_W)
_table_borders(ctrl, LINE, 4, True)
_set_col_widths(ctrl, [7.2, 4.2, 5.8])
for i, h in enumerate(["ACCIÓN", "TECLA / CONTROL", "CUÁNDO USARLO"]):
    _set_cell_shading(ctrl.cell(0, i), LIGHT)
    _set_cell_margins(ctrl.cell(0, i), 80, 95, 70, 95)
    p = ctrl.cell(0, i).paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(h)
    _set_run(r, "Arial", 6.8, True, GRAY, spacing=10)
rows = [
    ("Capítulo siguiente / anterior", "←  →", "Cambiar de bloque sin volver al inicio"),
    ("Pausar o reanudar animaciones", "Espacio", "Detener una escena para explicarla"),
    ("Ocultar o mostrar el panel", "H", "Dar protagonismo a la escena"),
    ("Mostrar etiquetas 3D", "L", "Señalar un elemento concreto"),
    ("Cronología", "T", "Responder una duda o ubicar una fecha"),
    ("Fuentes", "F", "Mostrar una referencia en preguntas"),
    ("Cita final", "Botón “Cita final”", "Cierre del capítulo 10"),
]
for i, (a, k, when) in enumerate(rows, 1):
    row = ctrl.add_row()
    _row_no_split(row)
    for j, val in enumerate((a, k, when)):
        cell = row.cells[j]
        _set_cell_margins(cell, 80, 95, 65, 95)
        if i % 2 == 0:
            _set_cell_shading(cell, LIGHT_2)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        _add_rich_text(p, val, size=8.8, color=(INK if j == 0 else (AMBER if j == 1 else "555B57")))

H2("Las secuencias, paso a paso")
p = doc.add_paragraph(style="Speech")
_add_rich_text(
    p,
    "El botón **Reproducir secuencia** inicia la animación. Mientras corre cambia a **Detener secuencia**; "
    "la tira inferior muestra “EN REPRODUCCIÓN”. Si la presentación está pausada, el mismo botón pasa a **Reanudar secuencia**. "
    "Al terminar, cambia a **Repetir secuencia**. No hace falta hacer doble clic: un clic inicia, otro detiene.",
    size=9.7,
)
callout(
    "El error que hay que evitar",
    [
        "No pulsen varias veces el botón de secuencia. Un clic inicia; el segundo clic la detiene.",
        "Si la escena no responde, comprueben primero que la presentación no esté pausada: miren el botón central o el indicador “EN REPRODUCCIÓN”.",
        "Si todo falla, sigan con el guion. El contenido está completo aunque la animación no esté disponible.",
    ],
    fill="F6ECE8",
    accent=RED,
    title_color=RED,
)

H2("Roles durante la exposición")
roles = doc.add_table(rows=1, cols=3)
_table_width(roles, CONTENT_W)
_table_borders(roles, LINE, 4, True)
_set_col_widths(roles, [3.2, 5.7, 8.3])
for i, h in enumerate(["PERSONA", "RESPONSABILIDAD", "EN CASO DE PROBLEMA"]):
    _set_cell_shading(roles.cell(0, i), LIGHT)
    _set_cell_margins(roles.cell(0, i), 80, 95, 70, 95)
    p = roles.cell(0, i).paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(h)
    _set_run(r, "Arial", 6.8, True, GRAY, spacing=10)
role_rows = [
    ("P1", "Apertura, pantalla completa y contexto.", "Arranca la presentación y comprueba el sonido."),
    ("P2", "Respaldo técnico: conoce todos los botones.", "Asume la navegación si otra persona se bloquea."),
    ("P3", "Control del tiempo y avisos de ritmo.", "Señala cuándo recortar sin interrumpir."),
    ("P4", "Fuentes y preguntas de datos.", "Responde o deriva a la pestaña “Fuentes”."),
    ("P5", "Cierre, cita final y despedida.", "Gestiona el silencio final antes de abrir preguntas."),
]
for i, (who, what, fallback) in enumerate(role_rows, 1):
    row = roles.add_row()
    _row_no_split(row)
    for j, val in enumerate((who, what, fallback)):
        cell = row.cells[j]
        _set_cell_margins(cell, 80, 95, 65, 95)
        if i % 2 == 0:
            _set_cell_shading(cell, LIGHT_2)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        if j == 0:
            r = p.add_run(val)
            _set_run(r, "Arial", 8.8, True, RED, spacing=3)
        else:
            _add_rich_text(p, val, size=8.5, color="555B57")

H2("Antes de entrar al aula")
checklist = [
    "Prueben index.html en el equipo y en el proyector. Confirmen que hay internet para Three.js.",
    "Pongan el navegador en pantalla completa y al 100 % de zoom. Desactiven notificaciones.",
    "Abran cada capítulo una vez para comprobar que carga; vuelvan al 1 sin cerrar el navegador.",
    "Tengan este guion impreso y una copia del archivo en un pendrive o en la nube.",
    "Si no hay internet, la presentación entra en modo lectura: no hay 3D, pero todo el contenido y las fuentes están disponibles.",
]
for item in checklist:
    p = doc.add_paragraph(style="Speech")
    p.paragraph_format.left_indent = Cm(0.55)
    p.paragraph_format.first_line_indent = Cm(-0.55)
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run("□  ")
    _set_run(r, "Arial", 10, True, RED)
    _add_rich_text(p, item, size=9.5)

source_row()


# ---------------------------------------------------------------------------
# CONTENIDO DE CADA PERSONA
# ---------------------------------------------------------------------------

speaker_scripts = [
    {
        "num": "01",
        "title": "El reactor que parecía controlado",
        "chapters": "01 — 02",
        "minutes": "4",
        "mission": "Que el público entienda cómo funcionaba el RBMK y por qué la prueba de seguridad colocó al reactor en una zona prohibida.",
        "anchors": [
            "4 reactores RBMK-1000 y una ciudad de 49.360 personas a 3 km.",
            "3.200 MWt; grafito + agua; coeficiente de vapor positivo.",
            "01:23:40: AZ-5; margen de barras de 8 frente al mínimo de 15.",
        ],
        "blocks": [
            ("cue", "Capítulo 01 · vista «Complejo». Deja que el público vea la central completa."),
            ("speech", "Buenos días. Vamos a recorrer la noche del 26 de abril de 1986 a través de diez escenas. Empezamos en el norte de Ucrania, a orillas del río Prípiat, a unos 110 kilómetros de Kiev. Allí estaba la central nuclear de Chernóbil: **cuatro reactores RBMK-1000 en funcionamiento** y dos más en construcción."),
            ("speech", "A tres kilómetros se levantaba Prípiat, una ciudad construida para las familias que trabajaban en la central. En abril de 1986 vivían allí **49.360 personas**. La central no usaba torres de refrigeración hiperbólicas, como muchas veces se imagina: se refrigeraba con un gran estanque artificial de 22 kilómetros cuadrados."),
            ("cue", "Cambia a la vista «Cómo funciona». Señala el esquema sin tapar la escena."),
            ("speech", "Cada RBMK-1000 producía **3.200 megavatios térmicos** y unos 1.000 megavatios eléctricos. La reacción nuclear se producía en tubos verticales de combustible. El grafito moderaba los neutrones y el agua refrigeraba el núcleo. Pero el agua también absorbía neutrones: si hervía y formaba vapor, absorbía menos y la reacción podía aumentar. Es el llamado **coeficiente de vapor positivo**. A baja potencia, ese comportamiento hacía al reactor especialmente difícil de controlar."),
            ("speech", "Además, el edificio no tenía una contención integral capaz de retener una liberación masiva. Esa ausencia será decisiva."),
            ("cue", "Capítulo 02 · vista «Sala de control». Mantén el panel en «Historia»."),
            ("speech", "El 25 de abril, el reactor 4 iba a apagarse para mantenimiento. Aprovecharían la parada para una prueba: comprobar si la inercia de una turbina podía alimentar las bombas de refrigeración hasta que arrancaran los generadores diésel. Era una prueba eléctrica, pero se hizo sin evaluar bien sus implicaciones nucleares."),
            ("speech", "La demanda de Kiev retrasó el apagado. Ya de madrugada, la potencia cayó hasta unos **30 megavatios térmicos**. El xenón envenenó el núcleo. Para recuperar potencia, los operadores extrajeron demasiadas barras. A la 01:00 el reactor estaba en unos 200 megavatios, con un margen de **8 barras cuando el mínimo era 15**. Después entraron más bombas, bajó la reactividad y se sacaron más barras. El reactor quedó en una zona inestable."),
            ("cue", "Pulsa «Reproducir secuencia». Deja avanzar hasta el paso de las 01:23:40 y pulsa «Detener secuencia» para explicar sin prisa."),
            ("speech", "A las **01:23:40** se pulsó AZ-5, la parada de emergencia. Las barras empezaron a entrar. Pero su diseño incluía desplazadores de grafito que desplazaban agua y añadían reactividad en la parte inferior del núcleo. La potencia se disparó. En segundos, el reactor dejó de ser controlable."),
            ("speech", "No fue culpa de una sola persona. Fue la combinación de un diseño vulnerable, una operación en zona prohibida, información insuficiente y una cultura que no convirtió las advertencias en barreras."),
            ("transition", "El reactor ya estaba fuera de control. Lo que ocurrió en los siguientes segundos destruyó el edificio y abrió el núcleo a la atmósfera."),
        ],
        "qa": [
            ("¿Qué era el coeficiente de vapor positivo?", "Si el agua hierve, hay menos agua líquida absorbiendo neutrones; en ciertas condiciones, la reactividad del núcleo aumenta."),
            ("¿Por qué el RBMK era distinto?", "Usaba grafito como moderador y tubos de presión con agua en ebullición; no tenía una contención integral como otros diseños."),
            ("¿Fue solo un error de los operadores?", "No. INSAG-7 señala la interacción entre diseño, operación, información y supervisión. Los operadores tuvieron un papel, pero el sistema los llevó a una zona insegura."),
        ],
        "sources": "IAEA · INSAG-7 · UNSCEAR · World Nuclear Association",
    },
    {
        "num": "02",
        "title": "La noche en que el reactor se abrió",
        "chapters": "03 — 04",
        "minutes": "4",
        "mission": "Explicar la excursión de potencia, las dos explosiones y el precio humano de las primeras horas, separando los hechos de las licencias visuales.",
        "anchors": [
            "01:23:40 AZ-5 · 01:23:4x explosiones · 1.000 t de losa superior.",
            "134 casos de síndrome de irradiación aguda; 28 muertes en los primeros meses.",
            "Bomberos a las 01:28; fuego principal controlado hacia las 05:00.",
        ],
        "blocks": [
            ("cue", "Capítulo 03 · vista «Corte del reactor». Pulsa «Reproducir secuencia» y deja ver la excursión."),
            ("speech", "El reactor estaba en una condición inestable y el operador acababa de pulsar AZ-5. Lo que ocurrió en los siguientes segundos fue una **excursión de potencia**."),
            ("speech", "Las barras de control entraron, pero sus desplazadores de grafito desplazaron agua y añadieron reactividad local. El combustible se fragmentó; el agua se convirtió en vapor a presión. La losa superior, de unas **1.000 toneladas**, se desplazó. La primera explosión fue de vapor. Dos o tres segundos después hubo una segunda, probablemente por hidrógeno y vapor. La secuencia exacta sigue siendo objeto de estudio, pero **no fue una explosión nuclear como la de una bomba atómica**."),
            ("cue", "Puedes detener la secuencia después de la segunda explosión. Cambia a «Edificio» si quieres mostrar la ruina."),
            ("speech", "El edificio no tenía contención integral. El núcleo quedó expuesto. Fragmentos de combustible y grafito salieron al exterior; los incendios de la cubierta y el material incandescente mantuvieron emisiones durante unos diez días. La columna alcanzó aproximadamente un kilómetro. Lo que vemos aquí no es una nube verde: es vapor, humo, polvo y partículas radiactivas invisibles."),
            ("cue", "Capítulo 04 · vista «Incendio». Muestra a los bomberos y el camión antes de hablar."),
            ("speech", "A las **01:28** llegaron los bomberos de Prípiat. Creían enfrentar un incendio de cubierta. No sabían que el reactor estaba abierto ni tenían información suficiente sobre la radiación. Trabajaron para evitar que el fuego llegara al bloque 3. Las cubiertas se controlaron hacia las **02:10 y 02:20**; el fuego principal, hacia las **05:00**."),
            ("speech", "Las dosis fueron extremas. Dos trabajadores murieron por las explosiones. Entre bomberos y personal de emergencia se confirmaron **134 casos de síndrome de irradiación aguda**; **28 murieron en los primeros tres meses**. Otras 19 personas murieron entre 1987 y 2004 por causas no necesariamente atribuibles a la radiación. El público general no sufrió ARS."),
            ("speech", "La radiación ionizante no brilla ni se convierte en una sustancia verde. Es energía que puede dañar el ADN; el riesgo depende de la dosis, el tiempo y la vía de exposición. En Chernóbil, el yodo radiactivo inhalado o ingerido fue clave para la tiroides. La exposición externa fue clave para los bomberos."),
            ("cue", "Si hay tiempo, abre «¿Qué es la radiación?» durante 20–30 segundos y ciérralo. No lo conviertas en una segunda exposición."),
            ("speech", "Lo más doloroso es que entraron sin saber. La falta de información no fue un detalle: formó parte del desastre."),
            ("transition", "Mientras los bomberos trabajaban, a tres kilómetros de distancia, Prípiat seguía su sábado sin saber que su ciudad ya tenía los días contados."),
        ],
        "qa": [
            ("¿Por qué pulsar AZ-5 empeoró la situación?", "Por el diseño de las barras: al bajar, los desplazadores de grafito añadieron reactividad local en un núcleo que ya estaba inestable."),
            ("¿Fue una explosión nuclear?", "No como la de una bomba. Fue una excursión de criticalidad con explosiones de vapor y gases; la segunda se asocia al hidrógeno."),
            ("¿Por qué los bomberos se expusieron?", "No tenían información completa ni dosimetría adecuada; creían combatir un incendio convencional y trabajaron para evitar que se propagara."),
        ],
        "sources": "IAEA · INSAG-7 · UNSCEAR · OMS · National Academies",
    },
    {
        "num": "03",
        "title": "Prípiat y la nube sobre Europa",
        "chapters": "05 — 06",
        "minutes": "4",
        "mission": "Conectar la escala humana de la evacuación con la escala global de la contaminación, sin confundir “detectable” con “peligroso”.",
        "anchors": [
            "49.360 personas; evacuación a las 36 horas; tres días que nunca terminaron.",
            "Detección en Forsmark, Suecia, el 27–28 de abril de 1986.",
            "≈150.000 km² contaminados; dosis media <1 mSv en Europa lejana.",
        ],
        "blocks": [
            ("cue", "Capítulo 05 · vista «Avenida». Deja la ciudad viva en pantalla."),
            ("speech", "Los bomberos estaban dentro. A tres kilómetros, Prípiat seguía su sábado. Era una ciudad joven, construida para los trabajadores de la central: escuelas, hospital, palacio de cultura y un parque con una noria que iba a inaugurarse el 1 de mayo."),
            ("speech", "Vivían allí **49.360 personas**. Nadie recibió una orden de evacuación el 26 de abril. Las autoridades esperaron: la información era incompleta, la decisión debía tomarse en Moscú y existía miedo al pánico. Mientras se organizaban los autobuses, los habitantes siguieron expuestos."),
            ("cue", "Pulsa «Reproducir evacuación». Deja que la ciudad pase de la vida a la evacuación y al abandono; detén al final."),
            ("speech", "La evacuación comenzó el **27 de abril a las 14:00**, unas 36 horas después del accidente. Se anunció como temporal: tres días, documentos y ropa de abrigo. La gente dejó mascotas, fotos y muebles. La ciudad se vació en pocas horas. Nunca volvieron de forma permanente. Para el 14 de mayo, unas **116.000 personas** habían sido evacuadas de la zona de 30 km; después se reasentaron cientos de miles más."),
            ("speech", "La noria no llegó a inaugurarse. Se convirtió en el símbolo de una promesa rota."),
            ("cue", "Capítulo 06 · vista «Dispersión». Haz clic en Ucrania y luego en Suecia; cierra la ficha si tapa el mapa."),
            ("speech", "El problema no se quedó en Prípiat. Durante unos **diez días**, el reactor liberó material radiactivo. El viento llevó el penacho primero al noroeste, hacia Suecia y Finlandia. El **27 y 28 de abril**, la central de Forsmark detectó radiactividad y activó la alerta. El 28, la URSS emitió un comunicado breve. La magnitud real llegó tarde."),
            ("speech", "La deposición fue irregular: dependió de la lluvia y de cada cambio de viento. Alrededor de **150.000 km²** de Ucrania, Bielorrusia y Rusia quedaron contaminados. En Europa lejana, la dosis media del primer año fue **inferior a 1 mSv**, pero se detectaron trazas en casi todo el continente. Detectar no es lo mismo que recibir una dosis peligrosa."),
            ("speech", "El yodo-131 afectó la tiroides; el cesio-137 persistió en suelos, alimentos y bosques. Cerca del reactor murió el Bosque Rojo; con el tiempo, la fauna se recuperó en muchas zonas porque los humanos se fueron. Eso no significa que la radiación sea buena."),
            ("speech", "El mapa no dibuja fronteras inventadas: muestra una dirección general y las partículas son un esquema."),
            ("transition", "La nube salió de Ucrania, pero la contaminación se quedó. Dentro de la zona de exclusión empezó otra batalla: la de los liquidadores."),
        ],
        "qa": [
            ("¿Por qué no evacuaron antes?", "La información era incompleta y la decisión estaba centralizada; se subestimó la magnitud y se temía el pánico. La evacuación llegó 36 horas después."),
            ("¿Europa recibió dosis peligrosas?", "En la mayor parte, no: las dosis medias fueron inferiores a 1 mSv el primer año. La deposición fue irregular y hubo controles de alimentos."),
            ("¿Prípiat volvió a habitarse?", "No de forma permanente. Solo algunos residentes mayores regresaron de manera no oficial; la ciudad quedó abandonada."),
        ],
        "sources": "IAEA · UNSCEAR · OMS · ChNPP",
    },
    {
        "num": "04",
        "title": "Los que limpiaron y lo que quedó",
        "chapters": "07 — 08",
        "minutes": "4,5",
        "mission": "Reconocer el trabajo de los liquidadores y explicar la salud y el ambiente separando siempre lo confirmado de lo estimado.",
        "anchors": [
            "≈600.000 liquidadores registrados; 120 mSv de dosis media en 530.000 trabajadores.",
            "134 casos de ARS; >6.000 cánceres de tiroides hasta 2005; 15 muertes entre esos casos.",
            "Las proyecciones varían: hasta 4.000 muertes (Foro) o 25.000 casos/16.000 muertes (IARC/OMS).",
        ],
        "blocks": [
            ("cue", "Capítulo 07 · vista «Tejados». Deja ver a los trabajadores y los restos antes de hablar."),
            ("speech", "La nube salió de Ucrania. Pero la contaminación se quedó, y con ella empezó otra historia: la de los **liquidadores**."),
            ("speech", "Liquidadores no fueron un solo grupo. Fueron bomberos, soldados, mineros, ingenieros, científicos, conductores, médicos y constructores. Se registraron alrededor de **600.000**. No todos recibieron dosis altas; los primeros equipos, sí. UNSCEAR estima una dosis media de unos **120 mSv** para 530.000 trabajadores de recuperación."),
            ("speech", "Limpiaron tejados, retiraron grafito y combustible, construyeron caminos, bombearon agua y gestionaron residuos. En los tejados, los “biorobots” trabajaban en turnos de menos de un minuto. Los mineros excavaron un túnel bajo el reactor para instalar una losa de refrigeración; completaron la galería en unos quince días."),
            ("cue", "Si hay tiempo, abre «Cómo se construyó» y muestra los pasos del sarcófago durante 20 segundos."),
            ("speech", "El primer sarcófago se levantó en unos **206 días**, con más de **400.000 m³ de hormigón** y **7.300 toneladas de acero**. Fue una medida de emergencia: no era hermético y se pensó para 20 o 30 años. Su trabajo redujo la liberación y permitió estabilizar el sitio. También dejó riesgos."),
            ("speech", "No fueron todos condenados a muerte ni todos salieron indemnes: recibieron dosis muy distintas."),
            ("cue", "Capítulo 08 · vista «Bosque» o «Puesto de control». Abre «Datos de salud» después de la primera frase."),
            ("speech", "En salud hay que separar lo confirmado de lo estimado. El síndrome de irradiación aguda afectó a **134 personas**; 28 murieron en los primeros tres meses. El efecto más claro a largo plazo es el **cáncer de tiroides** en quienes eran niños en 1986: más de **6.000 casos hasta 2005**, con unas **15 muertes** entre esos casos."),
            ("speech", "UNSCEAR no encontró un aumento general de cáncer o leucemia en la población. Algunas señales aparecen en trabajadores con dosis altas. Las estimaciones varían: el Foro de Chernóbil habla de **hasta 4.000 muertes adicionales** entre los más expuestos; una proyección del IARC/OMS habla de unos **25.000 casos y 16.000 muertes** en Europa hasta 2065. Son modelos, no recuentos."),
            ("speech", "También está el impacto psicológico y social: ansiedad, depresión, estigma y pérdida de comunidad. No se mide en sieverts, pero es real."),
            ("speech", "La zona de exclusión ucraniana ocupa unos **2.600 km²**; 187 comunidades quedaron abandonadas. El Bosque Rojo murió y muchas especies regresaron. La naturaleza no demuestra que la radiación sea inocua: demuestra que la ausencia de humanos también transforma el paisaje."),
            ("transition", "El reactor seguía abierto. Primero lo cubrieron con prisa; después, con una obra de ingeniería pensada para durar cien años."),
        ],
        "qa": [
            ("¿Cuál es la diferencia entre confirmado y estimado?", "Confirmado son casos y muertes observadas. Estimado son proyecciones basadas en modelos de dosis y riesgo; no son recuentos."),
            ("¿Todos los liquidadores enfermaron?", "No. Las dosis variaron mucho. Los grupos más expuestos tienen mayor riesgo, pero no todos sufrieron efectos."),
            ("¿Por qué volvió la naturaleza?", "La ausencia de caza, agricultura y personas permitió recuperar hábitats. En los puntos calientes, la radiación sigue afectando a los organismos."),
        ],
        "sources": "IAEA · UNSCEAR 2008 · OMS · Foro de Chernóbil · IARC",
    },
    {
        "num": "05",
        "title": "Encerrar el reactor para siempre",
        "chapters": "09 — 10",
        "minutes": "3,5",
        "mission": "Cerrar la historia: del sarcófago de emergencia al NSC, la situación actual y las lecciones que deja Chernóbil.",
        "anchors": [
            "206 días · 400.000 m³ de hormigón · 7.300 t de acero.",
            "NSC: 36.000 t; 165 × 257 × 108 m; deslizado en 2016; diseño a 100 años.",
            "2025: un dron daña el NSC; la IAEA advierte la pérdida de sus funciones principales.",
        ],
        "blocks": [
            ("cue", "Capítulo 09 · vista «Comparación». Deja los tres modelos en pantalla."),
            ("speech", "El reactor quedó abierto. Primero se cubrió con prisa. El sarcófago de 1986 se construyó en **206 días**, con **400.000 m³ de hormigón** y **7.300 toneladas de acero**. No era hermético y se pensó para 20 o 30 años. Dentro siguen unas **200 toneladas de combustible**."),
            ("speech", "Con el tiempo se deterioró. La respuesta fue el **Nuevo Confinamiento Seguro**: una bóveda de acero de **36.000 toneladas**, **165 m de largo, 257 de ancho y 108 de alto**. Se ensambló a 327 m del reactor y se deslizó sobre el sarcófago en **noviembre de 2016**. Está diseñado para **100 años** e incluye ventilación, control de humedad, extinción de incendios, grúas y sistemas para desmantelar el interior. La puesta en servicio culminó en 2019."),
            ("cue", "Pulsa «Recorrer etapas» si quieres hacer visible la comparación; si no, cambia a «2016»."),
            ("speech", "Pero no es “para siempre”. El combustible y los residuos siguen allí. Los bloques 1, 2 y 3 están en desmantelamiento; el último reactor se apagó en 2000. La invasión rusa de 2022 interrumpió las actividades. En **febrero de 2025**, un dron dañó el NSC. La IAEA informó en noviembre de 2025 que la estructura perdió sus dos funciones principales: confinar materiales radiactivos y permitir el desmantelamiento seguro. Las reparaciones continúan en 2026."),
            ("cue", "Capítulo 10 · vista «Amanecer». Baja un poco el ritmo; esta es la parte final."),
            ("speech", "¿Qué aprendimos? Que la seguridad no depende solo de una máquina. Depende de cómo se diseña, de cómo se opera, de quién supervisa y de si la información circula. Ocultar un problema no lo elimina: lo amplifica. La responsabilidad no se resuelve buscando un culpable, sino analizando el sistema."),
            ("speech", "Chernóbil dejó dos trabajadores muertos por las explosiones, 28 muertes por síndrome de irradiación aguda, miles de casos de cáncer de tiroides y cientos de miles de personas desplazadas. Dejó también trabajadores con secuelas, comunidades estigmatizadas y un territorio contaminado."),
            ("speech", "La distancia entre la seguridad y la catástrofe no siempre se mide en kilómetros. A veces se mide en una advertencia que nadie quiso escuchar."),
            ("cue", "Pulsa «Cita final». Deja que la frase respire. Cuenta hasta cinco en silencio; después cierra la cita y da las gracias."),
            ("speech", "Gracias. ¿Tienen preguntas?"),
        ],
        "qa": [
            ("¿El NSC resuelve el problema para siempre?", "No. Contiene y permite trabajar, pero el combustible y los residuos siguen allí y requieren un desmantelamiento de décadas."),
            ("¿Qué pasó con los otros reactores?", "Están clausurados y en desmantelamiento. El último reactor en funcionamiento se apagó en diciembre de 2000."),
            ("¿Cuál es la lección principal?", "La seguridad es una cultura: diseño, supervisión, transparencia y disposición a escuchar las advertencias técnicas."),
        ],
        "sources": "IAEA · EBRD · ChNPP · WNA · UNSCEAR",
    },
]


for idx, sp in enumerate(speaker_scripts):
    page_break()
    add_speaker_banner(sp["num"], sp["title"], sp["chapters"], sp["minutes"])
    speaker_meta(sp["mission"], sp["anchors"])
    # pequeño espacio
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 0.5

    H2("Tu guion, palabra por palabra")
    for kind, text in sp["blocks"]:
        if kind == "cue":
            CUE(text)
        elif kind == "speech":
            p = doc.add_paragraph(style="Speech")
            _add_rich_text(p, text, base_font="Arial", size=10.35, color=INK)
        elif kind == "transition":
            transition_box(text)

    qa_block(sp["qa"])
    source_row()


# ---------------------------------------------------------------------------
# CIERRE / CHECKLIST
# ---------------------------------------------------------------------------
page_break()
H1("Antes de salir al escenario")
p = doc.add_paragraph(style="Lead")
_add_rich_text(
    p,
    "Una exposición con diez escenas y cinco voces necesita ensayo técnico y un plan B. "
    "Usen esta página como lista de verificación final.",
    size=11.5,
)

H2("Ensayo y ejecución")
checks = [
    ("Ensayo 1", "Completo, con la presentación real y cronómetro. Objetivo: 20 minutos."),
    ("Ensayo 2", "Versión de 15 minutos. Cada persona elimina una escena secundaria y una respuesta larga."),
    ("Transiciones", "Cada expositor dice su última frase mirando al público; el siguiente entra y pulsa la flecha."),
    ("Secuencias", "Probar una vez por capítulo. Recordar: un clic inicia, otro detiene; si está pausada, el botón reanuda."),
    ("Preguntas", "Cada persona prepara sus tres respuestas. P4 consulta la pestaña “Fuentes” si hace falta."),
]
for head, text in checks:
    p = doc.add_paragraph(style="Speech")
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run("□  ")
    _set_run(r, "Arial", 11, True, RED)
    r = p.add_run(head + ".  ")
    _set_run(r, "Arial", 9.8, True, INK)
    r = p.add_run(text)
    _set_run(r, "Arial", 9.8, False, "4C5150")

H2("Plan B si la tecnología falla")
planb = doc.add_table(rows=1, cols=3)
_table_width(planb, CONTENT_W)
_table_borders(planb, LINE, 4, True)
_set_col_widths(planb, [4.3, 6.5, 6.4])
for i, h in enumerate(["PROBLEMA", "QUÉ HACER", "QUÉ NO HACER"]):
    _set_cell_shading(planb.cell(0, i), LIGHT)
    _set_cell_margins(planb.cell(0, i), 80, 95, 70, 95)
    p = planb.cell(0, i).paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(h)
    _set_run(r, "Arial", 6.8, True, GRAY, spacing=10)
rows = [
    ("No hay internet", "La app entra en modo lectura con los diez capítulos, el guion y las fuentes. Continúen con el guion impreso.", "No recarguen una y otra vez ni cambien de navegador en plena exposición."),
    ("Una escena no carga", "Pasen al siguiente capítulo con →. El contenido escrito sigue disponible en el panel.", "No pulsen varios botones a la vez."),
    ("La animación no avanza", "Comprueben si la presentación está pausada. Pulsa Espacio o el botón “Reanudar secuencia”.", "No hagan doble clic en el botón de la secuencia."),
    ("El proyector cambia de resolución", "Pulsen F11 y comprueben el zoom al 100 %. Recarguen una sola vez.", "No muevan la ventana durante una transición."),
]
for i, (problem, action, notdo) in enumerate(rows, 1):
    row = planb.add_row()
    _row_no_split(row)
    for j, val in enumerate((problem, action, notdo)):
        cell = row.cells[j]
        _set_cell_margins(cell, 80, 95, 65, 95)
        if i % 2 == 0:
            _set_cell_shading(cell, LIGHT_2)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        _add_rich_text(p, val, size=8.3, color=(INK if j == 0 else "555B57"))

H2("La frase que no se cambia")
p = doc.add_paragraph(style="Quote")
p.paragraph_format.left_indent = Cm(0.5)
p.paragraph_format.right_indent = Cm(0.5)
p.paragraph_format.space_before = Pt(4)
_add_rich_text(
    p,
    "“La distancia entre la seguridad y la catástrofe no siempre se mide en kilómetros. A veces se mide en una advertencia que nadie quiso escuchar.”",
    base_font="Georgia",
    size=12.2,
    color=INK,
    italic=True,
)
p = doc.add_paragraph(style="Caption")
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("REFLEXIÓN FINAL · GUION DE LA EXPOSICIÓN")
_set_run(r, "Arial", 6.8, True, MIDGRAY, spacing=14)

H2("Fuentes principales")
sources = [
    ("IAEA · El accidente de Chornóbil", "https://www.iaea.org/topics/chornobyl"),
    ("IAEA · Preguntas frecuentes", "https://www.iaea.org/topics/chornobyl/faqs"),
    ("INSAG-7 · The Chernobyl Accident: Updating of INSAG-1", "https://www-pub.iaea.org/MTCD/publications/PDF/Pub913e_web.pdf"),
    ("UNSCEAR · The Chornobyl Accident", "https://www.unscear.org/unscear/en/areas-of-work/chernobyl.html"),
    ("OMS · Radiation: The Chernobyl accident", "https://www.who.int/news-room/questions-and-answers/item/radiation-the-chernobyl-accident"),
    ("EBRD · Making Chornobyl safe", "https://www.ebrd.com/home/what-we-do/focus-areas/nuclear-safety/making-chornobyl-safe.html"),
    ("ChNPP · Sitio oficial", "https://www.chnpp.gov.ua/en/home"),
]
for title, url in sources:
    p = doc.add_paragraph(style="BodySmall")
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(title + "  ·  ")
    _set_run(r, "Arial", 8.3, True, "5B615D")
    r = p.add_run(url)
    _set_run(r, "Arial", 7.4, False, "7D827E")

p = doc.add_paragraph(style="Tiny")
p.paragraph_format.space_before = Pt(8)
r = p.add_run("Las cifras y afirmaciones del guion se apoyan en las fuentes de la presentación. Las proyecciones a largo plazo se presentan como estimaciones, no como recuentos definitivos. Este documento es una ayuda para la exposición, no una transcripción literal de la experiencia interactiva.")
_set_run(r, "Arial", 7.4, False, MIDGRAY)


doc.save("Guion_Exposicion_Chernobyl_5_Personas.docx")
print("Documento generado: Guion_Exposicion_Chernobyl_5_Personas.docx")
