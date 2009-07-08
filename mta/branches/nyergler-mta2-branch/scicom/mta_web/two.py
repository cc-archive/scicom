# MTA 2.0 support
import cherrypy

import letters
from const import STATIC_DIR, TEMPLATE_DIR, MESH_SOURCE


class Mta(object):

    """Serve the MTA 2.0 agreements and related documents"""

    VERSION = '2.0'

    def __init__(self, loader):

        self.__loader = loader
        
    def dispatch(self, basecode, code, doctype, **kwargs):

        # make sure this is a valid code for MTA 2.0
        if code not in ('sc-df', 'sc-ou',):
            raise cherrypy.HTTPError(404)

        if doctype == 'deed':
            return self.deed(code, kwargs)

        if doctype == 'legalcode':
            return self.legalcode(code, kwargs)

        if doctype == 'legaltext':
            return self.legaltext(code)

        if doctype == 'icon':
            return self.icon(basecode)

        # might use basecode here
        if doctype == 'letter':
            return self.letter(basecode, kwargs)

        raise cherrypy.HTTPError(404)

    def deed(self, code, kwargs):
        template = self.__loader.load("deed.html")

        # same for all deeds
        permissions = [
            {'long': 'Use the materials for research that you supervise',
             'uri': '[sc:YourResearch]'},
            {'long': 'Allow others under your supervision to use the materials',
             'uri': '[sc:OthersResearch]'},
            {'long':'Publish the results of your research',
             'uri': '[sc:Publish]'}]

        # default
        footer = 'You will acknowledge provider in publications reporting use of the materials.'
        legalurl = '/agreements/' + code + "/" + self.VERSION + '/legalcode'
        deed_title = code

        # must be sc
        splits = code.split('-')
        
        if splits[0] == 'sc':
            longname = 'Science Commons Material Transfer Agreement'
            
            fieldStr = 'Limited to %s' % kwargs['fieldSpec'] if kwargs.__contains__('fieldSpec') else None;

            footer = ''
            conditions = [
                {'long': 'You must provide appropriate acknowledgment of the source of Materials.',
                 'code': 'by',
                 'uri' : '[cc:Attribution]',
                 },
                {'long': 'You may not transfer or distribute the materials. ',
                 'code': 'no-distribution',
                 'uri': '[sc:Transfer]'}]

            if 'df' in splits: 
                deed_title = "Specific Use"
                conditions.insert(0, {'long': 'Your use of the materials is restricted by fields of use.',
                                      'code': 'restricted-field',
                                      'extra': fieldStr
                                      })
                conditions += [
                    {'long': 'You may not use the materials for clinical purposes.',
                     'code': 'no-clinical',
                     'uri': '[sc:Clinical]'},
                    {'long': 'You may not use the materials in connection with the sale of a product or service.',
                     'code': 'nc',
                     'uri': '[cc:CommercialUse]'},
                    ]

            elif 'ou' in splits:
                deed_title = "Open Use"

        stream = template.generate(code=deed_title, version=self.VERSION, permissions=permissions, conditions=conditions, footer=footer, legalurl=legalurl, longname=longname)
        return stream.render("xhtml")
        
    def letter(self, code, kwargs):
        if code == 'ubmta':
            l = letters.letter.UBMTALetter()
        elif code == 'sla':
            l = letters.letter.SLALetter()
        elif code == 'sc':
            l = letters.letter.SCLetter()
        else:
            raise cherrypy.HTTPError(404, 'Unknown license %s' % code)

        # do this first to catch errors before declaring it a pdf
        result = l(**kwargs)
        l.pdf_prepare_response('implementing-letter')
        return result

    def icon(self, code):
        filename = STATIC_DIR + '/images/mta/' + code + '.png'
        string = open(filename).read()
        cherrypy.response.headers['Content-Type'] = 'image/png'
        return string

    # MTA legal code
    def legalcode(self, code, kwargs):

        template = self.__loader.load("legal.html")
        stream = template.generate(agreementType=code, version=self.VERSION,
                                   **kwargs)
        return stream.render("xhtml")

    # MTA legal text -- served from static files, immutable
    def legaltext(self, code):
        filename = STATIC_DIR + '/legal/' + self.VERSION + '/' + code + '.txt'
        string = open(filename).read()
        cherrypy.response.headers['Content-Type'] = 'text/plain'
        return string



