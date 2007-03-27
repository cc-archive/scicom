import copy

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.platypus import Table, TableStyle, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch
from reportlab.lib import colors

from support import *

class RetainCC(object):

    NAME = "OpenAccess-Creative Commons"

    def __call__(self, filename, manuscript="", journal="", author=[], 
                 publisher=""):
        """Generate the Retain CC agreement."""

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
            """<seq id="main">. <b>Author's Retention of Rights. </b>
            Notwithstanding any terms in the Publication Agreement to the
            contrary, AUTHOR and PUBLISHER agree that in addition to any rights
            under copyright retained by Author in the Publication Agreement,
            Author retains: (i) the rights to reproduce, to distribute, to
            publicly perform, and to publicly display the Article in any medium
            for non-commercial purposes; (ii) the right to prepare derivative
            works from the Article; and (iii) the right to authorize others to
            make any non-commercial use of the Article so long as Author receives
            credit as author and the journal in which the Article has been
            published is cited as the source of first publication of the Article.
            For example, Author may make and distribute copies in the course of
            teaching and research and may post the Article on personal or
            institutional Web sites and in other open-access digital
            repositories.""",
            outer_style)
            )

        # Page Break
        #Story.append(PageBreak())

        # Section 5
        Story.append(
            Paragraph(
            """<seq id="main">. <b>Acknowledgment of Prior License Grants. </b>
            In addition, where applicable and without limiting the retention
            of rights above, Publisher acknowledges that Author's assignment
            of copyright or Author's grant of exclusive rights in the
            Publication Agreement is subject to Author's prior grant of a
            non-exclusive copyright license to Author's employing institution
            and/or to a funding entity that financially supported the research
            reflected in the Article as part of an agreement between Author
            or Author's employing institution and such funding entity, such as
            an agency of the United States government.""",
            outer_style)
            )

        # Section 6
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
    retaincc("test.pdf", "Extraordinary Measures",
               "Nature", ["B. Pants"], "The Publisher")
    
