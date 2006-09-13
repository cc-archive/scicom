
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.platypus import Table, TableStyle, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch
from reportlab.lib import colors

PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
styles = getSampleStyleSheet()

Title = "ADDENDUM TO PUBLICATION AGREEMENT"
Footer = "Model Author's Addendum to Publication Agreement 1.0"

def pageInfo (canvas, doc):
    canvas.saveState()

    # draw the header
    canvas.setFont('Times-Bold',12)
    canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-50, Title)

    # draw the footer
    canvas.setFont('Times-Roman', 8)
    canvas.drawImage('./images/scicom.gif', inch, inch*.75,
                     width=inch, height=inch*.28)
    canvas.drawString(2.1 * inch, inch*.85, Footer)
    canvas.restoreState()

def fillInRow(value, label, width=inch*3):

    result = Table([ [value],
                     [label]
                     ],
                   rowHeights=[inch*0.2, inch*0.1],
                   colWidths=[width])
    result.setStyle(
        TableStyle( [('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                     ('VALIGN', (0, 0), (0, 0), 'BOTTOM'),
                     ('VALIGN', (0, 1), (0, 1), 'TOP'),
                     ('FONTSIZE', (0, 1), (0, 1), 8),
                     ('LINEABOVE', (0, 1), (0, 1), 0.5, colors.black),
                     ('BOTTOMPADDING', (0,0), (0,0), 0),
                     ('TOPPADDING', (0, 1), (0, 1), 0),
                     ]
                    )
        )

    return result
