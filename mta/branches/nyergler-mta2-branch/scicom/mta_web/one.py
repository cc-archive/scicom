# MTA 1.0 support
import cherrypy

import letters
from const import STATIC_DIR, TEMPLATE_DIR, MESH_SOURCE

class Mta(object):

    """Serve the MTA 1.0 agreements and related documents"""

    VERSION = '1.0'

    def __init__(self, loader):

        self.__loader = loader
        
    def dispatch(self, basecode, code, doctype, **kwargs):
        
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
        
        if code == 'ubmta':
            longname = 'Uniform Biological Material Transfer Agreement'
            conditions = [
                {'long': 'You may not use the materials for clinical purposes.',
                 'code': 'no-clinical',
                 'uri': '[sc:Clinical]' },
                {'long': 'You may only use the materials for teaching and academic research.',
                 'code': 'nc',
                 'uri': '[cc:CommercialUse]'},
                {'long': 'You may not transfer or distribute the materials, except only Modifications to non-profit organizations under the UBMTA. ',
                 'code': 'no-distribution',
                 'uri': '[sc:Transfer]'},
                {'long': 'You will return or destroy materials upon completion of research or expiration of the implementing letter.',
                 'uri': '[sc:Retention]',
                 'code': 'return'}]

        if code == 'sla':
            longname = 'Simple Letter Agreement'
            conditions = [
                {'long': 'You may not use the materials for clinical purposes.',
                 'code': 'no-clinical',
                 'uri': '[sc:Clinical]'},
                {'long': 'You may only use the materials for teaching and academic research.',
                 'code': 'nc',
                 'uri': '[cc:CommercialUse]'},
                {'long': 'You may not transfer or distribute the materials without permission.',
                 'code': 'no-distribution',
                 'uri': '[sc:Transfer]'}]

        # must be sc
        splits = code.split('-')
        
        if splits[0] == 'sc':
            longname = 'Science Commons Material Transfer Agreement'

            fieldStr = 'Limited to %s' % kwargs['fieldSpec'] if kwargs.__contains__('fieldSpec') else None;

            footer = ''
            conditions = [
                {'long': 'You may not use the materials for clinical purposes.',
                 'code': 'no-clinical',
                 'uri': '[sc:Clinical]'},
                {'long': 'You may not use the materials in connection with the sale of a product or service.',
                 'code': 'nc',
                 'uri': '[cc:CommercialUse]'},
                {'long': 'You may not transfer or distribute the materials. ',
                 'code': 'no-distribution',
                 'uri': '[sc:Transfer]'}]

            if splits.__contains__('rp'):
                conditions.insert(0, {'long': 'Your use of the materials is restricted to a specific research protocol.',
                                      'code': 'restricted-field',
                                      'extra': fieldStr})
            if splits.__contains__('df'):
                conditions.insert(0, {'long': 'Your use of the materials is restricted by fields of use.',
                                      'code': 'restricted-field',
                                      'extra': fieldStr
                                      })
            if splits.__contains__('ns'):
                conditions.append({'long': 'You may not produce additional quantities of the materials.',
                                   'code': 'no-scaling',
                                   'uri': '[sc:ScalingUp]'})
            if splits.__contains__('rd'):
                conditions.append({'long': 'You will return or destroy the materials upon completion of research or the termination of the agreement.',
                                   'uri': '[sc:Retention]',
                                   'code': 'return'})

        if kwargs.__contains__('endDate'):
            conditions.append({'long':  'This agreement terminates on %s' % kwargs['endDate'],
                               'code':  'end-date'})

        stream = template.generate(code=code, version=self.VERSION, permissions=permissions, conditions=conditions, footer=footer, legalurl=legalurl, longname=longname)
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



