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

    story = []

    def PGraph(self, string):
        self.story.append(Paragraph(string, styles['outer_style']))

    def SectionHead(self, number, string):
        self.story.append(Spacer(0, .2 * inch))
        self.story.append(Paragraph(str(number) + '. ' + string, styles['outer_style']))

    def FullLine(self, line, value):
        self.story.append(Spacer(0, .1 * inch))
        self.PGraph(line)

        result = Table([["", value]], colWidths = [inch*.2, inch*4])
        result.setStyle(
            TableStyle( [('LINEBELOW', (1, 0), (1, -1), 0.5, colors.black),
                         ('BOTTOMPADDING', (0,0), (0,-1), 0),
                         ('TOPPADDING', (0, 0), (0, -1), 5),
                         ]
                        ))
        result.hAlign = 'LEFT'
        self.story.append(result)

        # unnumbered section head
    def UnSectionHead(self, string):
        self.story.append(Spacer(0, .2 * inch))
        self.story.append(Paragraph(string, styles['outer_style']))


    def AddTable(self, structure, col1Width=inch*1.5):
        result = Table(structure,
#                               rowHeights = [inch*0.2],
                       colWidths = [col1Width, inch*4])
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
        self.story.append(result)

    def SignatureBlock(self, name):
        self.AddTable(
            [[name + ':', ""],
             ["Title:", ""],
             ["Address:", ""],
             ["", ""],
             ["Signature:", ""],
             ["Date:", ""]])


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

            title = "UBMTA Implementing Letter"

            self.story.append(
                Paragraph(
                """The purpose of this letter is to provide a record of the biological material transfer, to memorialize the agreement between the PROVIDER SCIENTIST (identified below) and the RECIPIENT SCIENTIST (identified below) to abide by all terms and conditions of the Uniform Biological Material Transfer [[Page 12775]] Agreement ("UBMTA") March 8, 1995, and to certify that the RECIPIENT (identified below) organization has accepted and signed an unmodified copy of the UBMTA. The RECIPIENT organization's Authorized Official also will sign this letter if the RECIPIENT SCIENTIST is not authorized to certify on behalf of the RECIPIENT organization. The RECIPIENT SCIENTIST (and the Authorized Official of RECIPIENT, if necessary) should sign both copies of this letter and return one signed copy to the PROVIDER. The PROVIDER SCIENTIST will forward the material to the RECIPIENT SCIENTIST upon receipt of the signed copy from the RECIPIENT organization.""", styles['outer_style']))
            self.story.append(
                Paragraph(
            """Please fill in all of the blank lines below:""", styles['outer_style']))

            self.SectionHead(1, "PROVIDER: Organization providing the ORIGINAL MATERIAL:")
            self.AddTable(
                     [["Organization", providerOrg],
                      ["Address", address1],
                      ["", address2]])

            self.SectionHead(2, "RECIPIENT: Organization receiving the ORIGINAL MATERIAL:")
            self.AddTable(
                [["Organization:", ""],
                 ["Address:", ""],
                 ["", ""]])

            self.SectionHead(3, "ORIGINAL MATERIAL")
            self.AddTable(
                [["Description:", materialDesc],
                 ["", ""],
                 ["", ""]])

            self.SectionHead(4, "Termination date for this letter (optional)")

            self.AddTable([["Date:", endDate]])

            self.SectionHead(5, "Transmittal Fee to reimburse the PROVIDER for preparation and distribution costs (optional).")
            self.AddTable([["Amount:", transmittalFee]])

            #            self.story.append(Spacer(0, .4 * inch))
            self.story.append(PageBreak())

            self.story.append(
                Paragraph(
                """This Implementing Letter is effective when signed by all parties. The parties executing this Implementing Letter certify that their respective organizations have accepted and signed an unmodified copy of the UBMTA, and further agree to be bound by its terms, for the transfer specified above.""",  styles['outer_style']))

            self.UnSectionHead('PROVIDER SCIENTIST')
            self.SignatureBlock('Name')

            self.UnSectionHead('RECIPIENT SCIENTIST')
            self.SignatureBlock('Name')

            self.UnSectionHead('RECIPIENT ORGANIZATON CERTIFICATION')
            self.SignatureBlock('Authorized Official')

            doc.build(self.story,
                      onFirstPage=lambda canvas, doc: firstPageInfo(canvas, doc, title),
                      onLaterPages=lambda canvas, doc: allPageInfo(canvas, doc, title))

        return self.pdf_string(generator)


class SLALetter(Letter):

    def SigLine(self, string):
        self.story.append(Spacer(0, .2 * inch))
        result = Table([["", string, "", "Date"]], colWidths= [inch, inch*3, .2 * inch, inch*1])
        result.setStyle(
            TableStyle( [('ALIGN', (1, 0), (1, -1), 'LEFT'),
                         ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
                         ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
                         ('FONTSIZE', (0, 0), (-1, -1), 8),
                         ('LINEABOVE', (1, 0), (1, 0), 0.5, colors.black),
                         ('LINEABOVE', (3, 0), (3, 0), 0.5, colors.black),
                         ('BOTTOMPADDING', (0,0), (1,-1), 0),
                         ('TOPPADDING', (0, 0), (1, -1), 0),
                         ]
                        ))
        result.hAlign = 'LEFT'
        self.story.append(result)


    def __call__(self, providerOrg='',
                 materialDesc='',
                 address1="",
                 address2="",
                 termination="",
                 endDate="",
                 transmittalFee="",
                 purpose="",
                 **kwargs):
        
        def generator(filename):
            doc = getDocument(filename)

            title = "Simple Letter Agreement for the Transfer of Materials"

            self.FullLine("In response to the RECIPIENT's request for the MATERIAL", materialDesc)



            self.FullLine("To be used for the purpose of", purpose)

            self.PGraph("""the PROVIDER asks that the RECIPIENT and the RECIPIENT SCIENTIST agree to the Simple Letter Agreement attached before the RECIPIENT receives the MATERIAL.""")
            self.PGraph("""The PROVIDER, RECIPIENT and RECIPIENT SCIENTIST must sign both copies of this letter and return one signed copy to the PROVIDER. The PROVIDER will then send the MATERIAL.""")

            self.UnSectionHead("PROVIDER INFORMATION and AUTHORIZED SIGNATURE")

            self.AddTable(
                     [["Provider Scientist", ""],
                      ["Provider Organization", providerOrg],
                      ["Address", address1],
                      ["Name of Authorized Official", ""],
                      ["Title of Authorized Official", ""]],
                     col1Width=2*inch)
                      
            self.story.append(Spacer(0, .2 * inch))

            self.PGraph("""Certification of Authorized Official:  This Simple Letter Agreement __has / __has not [check one] been modified.""")
            self.PGraph("""If modified, the modifications are attached. """)

            self.SigLine("Signature of Provider's Authorized Official")

            # this is weirdly asymmetrical with previous section, but that's how Thinh spec'd it

            self.UnSectionHead("RECIPIENT INORMATION and AUTHORIZED SIGNATURE")

            self.AddTable(
                     [["Recipient Scientist", ""],
                      ["Recipient Organization", ""],
                      ["Address", ""],
                      ["Name of Authorized Official", ""],
                      ["Title of Authorized Official", ""],
                      ["Signature of Authorized Official", ""],
                      ["Date", ""]],
                     col1Width=2*inch)
                      
            self.story.append(Spacer(0, .2 * inch))

            self.PGraph("""Certification of Recipient Scientist:  I have read and understood the conditions outlined in this Agreement and I agree to abide by them in the receipt and use of the MATERIAL.""")
            self.SigLine("Recipient Scientist")

            doc.build(self.story,
                      onFirstPage=lambda canvas, doc: firstPageInfo(canvas, doc, title),
                      onLaterPages=lambda canvas, doc: allPageInfo(canvas, doc, title))

        return self.pdf_string(generator)


    
class SCLetter(Letter):

    # like default but no address
    def SignatureBlock(self, name):
        self.AddTable(
            [[name + ':', ""],
             ["Title:", ""],
             ["Signature:", ""],
             ["Date:", ""]])


    def __call__(self, providerOrg='',
                 materialDesc='',
                 address1="",
                 address2="",
                 termination="",
                 endDate="",
                 transmittalFee="",
                 legalURL="",
                 fieldSpec="",
                 **kwargs):
        
        def generator(filename):

            doc = getDocument(filename)

            title = "Science Commons Material Transfer Agreement Implementing Letter"

            self.PGraph("Reference URL: http://mta.sciencecommons.org/" + legalURL)

            self.story.append(Spacer(0, .2 * inch))
            
            self.PGraph("""This Implementing Letter incorporates by reference the Science Commons Material Transfer Agreement indicated above.""")

            self.SectionHead(1, "PROVIDER: Organization providing the MATERIAL:")
            self.AddTable(
                     [["Organization", providerOrg],
                      ["Address", address1],
                      ["", address2]])

            self.SectionHead(2, "RECIPIENT: Organization receiving the MATERIAL:")
            self.AddTable(
                [["Organization:", ""],
                 ["Address:", ""],
                 ["", ""]])

            self.SectionHead(3, "MATERIAL (Enter description, URL, or add attachment):")
            self.AddTable(
                [["Description:", materialDesc],
                 ["", ""],
                 ["", ""]])

            self.SectionHead(4, "SPECIFIED FIELD OF USE OR PROJECT (only if required by the MTA)")

            self.FullLine("", fieldSpec)

            self.SectionHead(5, "Termination date for this letter (optional)")

            self.AddTable([["Date:", endDate]])

            self.SectionHead(6, "Transmittal Fee to reimburse the PROVIDER for preparation and distribution costs (optional).")
            self.AddTable([["Amount:", transmittalFee]])

            #            self.story.append(Spacer(0, .4 * inch))
            self.story.append(PageBreak())

            self.PGraph("""This Implementing Letter is effective when signed by both PROVIDER and RECIPIENT or when signed by RECIPIENT and accepted by PROVIDER.""")

            self.UnSectionHead('RECIPIENT SCIENTIST')
            self.SignatureBlock('Name')

            self.UnSectionHead('RECIPIENT ORGANIZATION REPRESENTATIVE')
            self.PGraph("""As an authorized representative of RECIPIENT organization, I execute this Agreement on behalf of RECIPIENT organization (May be the RECIPIENT SCIENTIST if authorized by the RECIPIENT organization):""")
            self.SignatureBlock('Authorized Official')


            self.UnSectionHead('ACCEPTED BY PROVIDER (IF REQUIRED')
            self.SignatureBlock('Authorized Official')

            doc.build(self.story,
                      onFirstPage=lambda canvas, doc: firstPageInfo(canvas, doc, title),
                      onLaterPages=lambda canvas, doc: allPageInfo(canvas, doc, title))

        return self.pdf_string(generator)

