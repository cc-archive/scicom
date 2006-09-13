import copy

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
#pageinfo = "No Embargo"

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

def embargo(filename, manuscript="", journal="", author=[], publisher=""):
    """Generate the No Embargo agreement."""

    # check the parameters
    while len(author) < 4:
        author.append("")
        
    doc = SimpleDocTemplate(filename)
    
    Story = []
    
    outer_style = styles["Normal"]
    outer_style.spaceAfter = 8
    outer_style.spaceBefore = 6
    outer_style.leftIndent = inch * 0.12
    outer_style.firstLineIndent = -1 * outer_style.leftIndent

    inner_style = copy.deepcopy(outer_style)
    inner_style.leftIndent = inch * 0.50
    inner_style.firstLineIndent = -0.25 * inch

    # Section 1
    Story.append(
        Paragraph(
        """<seq id="main">. THIS ADDENDUM hereby modifies and supplements
        the attached Publication Agreement concerning the following
        Article:""", outer_style)
        )

    journal_info_table = Table([
        [fillInRow(manuscript, "(manuscript title)", width=inch*5)],
        [fillInRow(journal, "(journal name)", width=inch*5)],
        ],
          )
    journal_info_table.hAlign = 'LEFT'
    Story.append(journal_info_table)

    # Section 2
    Story.append(
        Paragraph(
        """<seq id="main">. The parties to the Publication Agreement as
        modified and supplemented by this Addendum are:""", outer_style)
        )

    journal_info_table = Table([
        [fillInRow(author[0],"(corresponding author)",), "", ""],
        [fillInRow(author[1],""), "", ""],
        [fillInRow(author[2],""), "", ""],
        [fillInRow(author[3],
                   """(Individually or, if one than more author, collectively, Author)"""), "", fillInRow(publisher, "(Publisher")],
        ],
                               colWidths=[inch*3, inch * 0.25, inch*3],
          )
    journal_info_table.hAlign = 'LEFT'
    Story.append(journal_info_table)

    # Section 3
    Story.append(
        Paragraph(
        """<seq id="main">. This Addendum and the Publication Agreement,
        taken together, allocate all rights under copyright with respect
        to all versions of the Article.  The parties agree that wherever
        there is any conflict between this Addendum and the Publication
        Agreement, the provisions of this Addendum are paramount and the
        Publication Agreement shall be construed accordingly.""",
        outer_style)
        )

    # Section 4
    Story.append(
        Paragraph(
        """<seq id="main">. Notwithstanding any terms in the Publication
        Agreement to the contrary, AUTHOR and PUBLISHER agree as follows:""",
        outer_style)
        )

    Story.append(
        Paragraph(
        """<seq template="%(main)s.%(Sec4+)s"/>. <b>Professional Activities.</b>
        Author retains the non-exclusive right to create derivative works
        from the Article and to reproduce, to distribute, to publicly
        perform, and to publicly display the Article in connection with
        Author's teaching, conference presentations, lectures, other
        scholarly works, and professional activities. """,
        inner_style)
        )

    Story.append(
        Paragraph(
        """<seq template="%(main)s.%(Sec4+)s"/>. <b>Author's Final Version. </b>
        Author retains the non-exclusive right to distribute copies of
        Author's final version by means of any web server from which members
        of the general public can download copies without charge.
        "Author's final version" means the final version accepted for journal
        publication, and includes all modifications from the publishing peer
        review process. """,
        inner_style)
        )

    Story.append(
        Paragraph(
        """<seq template="%(main)s.%(Sec4+)s"/>. <b>Published Version. </b>
        Author has the non-exclusive right to distribute copies of the
        published version of the Article by means of any web server from
        which members of the general public can download copies without
        charge, provided that Author cites the journal in which the Article
        has been published as the source of first publication, and further,
        that Author shall not authorize public access to the published version
        any earlier than six months from the date that Publisher first makes
        the final, published version available to Publisher's subscribers.
        "Published version" means the version of the Article distributed by
        Publisher to subscribers or readers of the Journal.""",
        inner_style)
        )

    Story.append(
        Paragraph(
        """<seq template="%(main)s.%(Sec4+)s"/>.
        <b>Acknowledgment of Prior License Grants.</b>  Where applicable,
        Publisher acknowledges that Author's assignment of copyright or
        Author's grant of exclusive rights in the Publication Agreement is
        subject to Author's prior grant of a non-exclusive copyright license
        to Author's employing institution and/or to a funding entity that
        financially supported the research reflected in the Article as part
        of an agreement between Author or Author's employing institution
        and such funding entity, such as an agency of the United States
        government.""",
        inner_style)
        )

    # Page Break
    Story.append(PageBreak())
    
    # Section 5
    Story.append(
        Paragraph(
        """<seq id="main">. For record keeping purposes, Author requests
        that Publisher sign a copy of this Addendum and return it to Author.
        However, if Publisher publishes the Article in the journal or in any
        other form without signing a copy of this Addendum, such publication
        manifests Publisher's assent to the terms of this Addendum.""",
        outer_style)
        )

    # Signature
    journal_info_table = Table([
        ["AUTHOR", " ", "PUBLISHER"],
        [fillInRow("", "(corresponding author on behalf of all authors)"),
         "", fillInRow("", "")],
        [fillInRow("", "Date"),
         "",
         fillInRow("", "Date")]
        ],
                               colWidths=[inch*3, inch*.25, inch*3],
          )

    journal_info_table.hAlign = 'LEFT'
    Story.append(journal_info_table)

    doc.build(Story, onFirstPage=pageInfo, onLaterPages=pageInfo)

if __name__ == '__main__':
    embargo("test.pdf", "Extraordinary Measures",
               "Nature", ["B. Pants"], "The Publisher")
    
