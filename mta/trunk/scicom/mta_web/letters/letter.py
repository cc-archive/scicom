import cherrypy
import tempfile
import os

from support import *

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.platypus import Table, TableStyle, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch
from reportlab.lib import colors

# general class for implementing letter, and holding pdf utilities
class Letter(object):

    def pdf_prepare_response(self, filename):
        # set the appropriate headers
        cherrypy.response.headers['Expires'] = '0'
        cherrypy.response.headers['Content-Type'] = 'application/pdf'
        cherrypy.response.headers['Cache-Control'] = 'must-revalidate, post-check=0, pre-check=0'
        cherrypy.response.headers['Content-Disposition'] = 'attachment; filename=' + filename + '.pdf'

    # returns a PDF string suitable for downloading
    # argument is a function of one argument, a filename
    def pdf_string(self, generator):
        # get temp file name
        pdf_fn = tempfile.NamedTemporaryFile().name

        # generate...
        generator(pdf_fn)

        # read string back
        pdf_file = file(pdf_fn, "rb")
        result = pdf_file.read()
        pdf_file.close()

        # remove the temp file
        os.unlink(os.path.join(tempfile.tempdir, pdf_fn))
        return result


class UBMTALetter(Letter):

    def __call__(self, providerOrg='',
                 materialDesc='',
                 address1="",
                 address2="",
                 termination="",
                 endDate="",
                 transmittalFee="",
                 **kwargs):
        
        def generator(filename):
            doc = getDocument(filename)

            Story = []

            def SectionHead(number, string):
                Story.append(Spacer(0, .2 * inch))
                Story.append(Paragraph(str(number) + '. ' + string, styles['outer_style']))

            # unnumbered section head
            def UnSectionHead(string):
                Story.append(Spacer(0, .2 * inch))
                Story.append(Paragraph(string, styles['outer_style']))


            def AddTable(structure):
                result = Table(structure,
#                               rowHeights = [inch*0.2],
                               colWidths = [inch*1, inch*3])
                result.setStyle(
                    TableStyle( [('ALIGN', (0, 0), (0, -1), 'RIGHT'),
                                 ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
#                             ('VALIGN', (0, 1), (0, 1), 'TOP'),
                                 ('FONTSIZE', (0, 0), (0, -1), 8),
                                 ('LINEBELOW', (1, 0), (1, -1), 0.5, colors.black),
                                 ('BOTTOMPADDING', (0,0), (1,-1), 0),
                                 ('TOPPADDING', (0, 0), (1, -1), 10),
                                 ]
                                ))
                result.hAlign = 'LEFT'
                Story.append(result)

            def SignatureBlock(name):
                AddTable([[name + ':', ""],
                          ["Title:", ""],
                          ["Address:", ""],
                          ["", ""],
                          ["Signature:", ""],
                          ["Date:", ""]])

            Story.append(
                Paragraph(
                """The purpose of this letter is to provide a record of the biological material transfer, to memorialize the agreement between the PROVIDER SCIENTIST (identified below) and the RECIPIENT SCIENTIST (identified below) to abide by all terms and conditions of the Uniform Biological Material Transfer [[Page 12775]] Agreement ("UBMTA") March 8, 1995, and to certify that the RECIPIENT (identified below) organization has accepted and signed an unmodified copy of the UBMTA. The RECIPIENT organization's Authorized Official also will sign this letter if the RECIPIENT SCIENTIST is not authorized to certify on behalf of the RECIPIENT organization. The RECIPIENT SCIENTIST (and the Authorized Official of RECIPIENT, if necessary) should sign both copies of this letter and return one signed copy to the PROVIDER. The PROVIDER SCIENTIST will forward the material to the RECIPIENT SCIENTIST upon receipt of the signed copy from the RECIPIENT organization.""", styles['outer_style']))
            Story.append(
                Paragraph(
            """Please fill in all of the blank lines below:""", styles['outer_style']))

            SectionHead(1, "PROVIDER: Organization providing the ORIGINAL MATERIAL:")
            AddTable([["Organization", providerOrg],
                      ["Address", address1],
                      ["", address2]])

            SectionHead(2, "RECIPIENT: Organization receiving the ORIGINAL MATERIAL:")
            AddTable([["Organization:", ""],
                      ["Address:", ""],
                      ["", ""]])

            SectionHead(3, "ORIGINAL MATERIAL")
            AddTable([["Description:", materialDesc],
                      ["", ""],
                      ["", ""]])

            SectionHead(4, "Termination date for this letter (optional)")

            AddTable([["Date:", endDate]])

            SectionHead(5, "Transmittal Fee to reimburse the PROVIDER for preparation and distribution costs (optional).")
            AddTable([["Amount:", transmittalFee]])

            #            Story.append(Spacer(0, .4 * inch))
            Story.append(PageBreak())

            Story.append(
                Paragraph(
                """This Implementing Letter is effective when signed by all parties. The parties executing this Implementing Letter certify that their respective organizations have accepted and signed an unmodified copy of the UBMTA, and further agree to be bound by its terms, for the transfer specified above.""",  styles['outer_style']))

            UnSectionHead('PROVIDER SCIENTIST')
            SignatureBlock('Name')

            UnSectionHead('RECIPIENT SCIENTIST')
            SignatureBlock('Name')

            UnSectionHead('RECIPIENT ORGANIZATON CERTIFICATION')
            SignatureBlock('Authorized Official')


            title = "UBMTA Implementing Letter"

            doc.build(Story,
                      onFirstPage=lambda canvas, doc: firstPageInfo(canvas, doc, title),
                      onLaterPages=lambda canvas, doc: allPageInfo(canvas, doc, title))


        return self.pdf_string(generator)
