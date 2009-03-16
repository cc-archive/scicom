import pkg_resources
pkg_resources.require("CherryPy>=3.0beta2")
pkg_resources.require("sqlalchemy")
pkg_resources.require("simplejson")

import os
import cherrypy
import simplejson
import genshi.template


import scicom.mta
import scicom.mta.mesh

# import mthack 
import letters.letter


STATIC_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'static',)
    )
TEMPLATE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'templates',)
    )
MESH_SOURCE = os.path.join(STATIC_DIR, 'mesh_2007_trees')

class Mesh(object):
    """Serve MeSH information as part of a CherryPy web application."""

    @cherrypy.expose
    def json(self, query=None):

        # load the MeSH data set
        mesh_tree = scicom.mta.mesh.MeshTreeSet(MESH_SOURCE)

        # filter and spit out the results in JSON format
        cherrypy.response.headers['Content-type'] = 'text/plain'

        return simplejson.dumps({'Result':mesh_tree.query(query)},
                                cls=scicom.mta.mesh.MeshEntryJsonEncoder)
    
class MtaMaterial(object):

    def __init__(self, loader):

        # get a handle to the database session
        self.session = scicom.mta.connect_session()
        self.__loader = loader

    @cherrypy.expose
    def add(self, description, provider, provider_url=None,  more_info=None):
        # create the new material
        new_material = scicom.mta.material.Material(
            description, provider, provider_url, more_info)

        # store the material
        self.session.save(new_material)
        self.session.flush()
        
        # return the stable URI
        return new_material.view_uri()

    @cherrypy.expose
    def view(self, id):

        # get the Material
        query = self.session.query(scicom.mta.material.Material)
        material = query.select_by(material_id=id)

        # pass the Material off to a template
        template = self.__loader.load('material.html')
        stream = template.generate(material=material[0])

        return stream.render('xhtml')

    # a crude index page of known materials
    # todo: same thing with search, sort, grid view
    @cherrypy.expose
    def index(self):

        query = self.session.query(scicom.mta.material.Material)
        materials = query.select()
        template = self.__loader.load('material-index.html')
        stream = template.generate(materials=materials)
        return stream.render('xhtml')

class MtaAgreements(object):

    """Serve the agreements and related documents"""

    def __init__(self, loader):

        self.__loader = loader
        
    @cherrypy.expose
    def default(self, code=None, version="1.0", *args, **kwargs):
        
        # for site/agreements, go to the chooser
        if code == None:
            raise cherrypy.HTTPRedirect("/chooser", status=303)

        basecode = self.basecode(code)

        if args.__len__() > 0:
            doctype = args[0]
        else:
            return self.deed(code, version, kwargs)

        if doctype == 'legalcode':
            return self.legalcode(code, version, kwargs)

        if doctype == 'legaltext':
            return self.legaltext(code, version)

        if doctype == 'icon':
            return self.icon(basecode, version)

        # might use basecode here
        if doctype == 'letter':
            return self.letter(basecode, version, kwargs)

        raise cherrypy.HTTPError(404)

    def deed(self, code, version, kwargs):
        template = self.__loader.load("deed.html")
        basecode = self.basecode(code)

        # same for all deeds
        permissions = [
            {'long': 'Use the materials for research that you supervise',
             'uri': 'sc:YourResearch'},
            {'long': 'Allow others under your supervision to use the materials',
             'uri': 'sc:OthersResearch'},
            {'long':'Publish the results of your research',
             'uri': 'sc:Publish'}]

        # default
        footer = 'You will acknowledge provider in publications reporting use of the materials.'
        legalurl = '/agreements/' + code + "/" + version + '/legalcode'
        
        if code == 'ubmta':
            longname = 'Uniform Biological Material Transfer Agreement'
            conditions = [
                {'long': 'You may not use the materials for clinical purposes.',
                 'code': 'no-clinical',
                 'uri': 'sc:Clinical' },
                {'long': 'You may only use the materials for teaching and academic research.',
                 'code': 'nc',
                 'uri': 'cc:CommercialUse'},
                {'long': 'You may not transfer or distribute the materials, except only Modifications to non-profit organizations under the UBMTA. ',
                 'code': 'no-distribution',
                 'uri': 'sc:Transfer'},
                {'long': 'You will return or destroy materials upon completion of research or expiration of the implementing letter.',
                 'uri': 'sc:Retention',
                 'code': 'return'}]

        if code == 'sla':
            longname = 'Simple Letter Agreement'
            conditions = [
                {'long': 'You may not use the materials for clinical purposes.',
                 'code': 'no-clinical',
                 'uri': 'sc:Clinical'},
                {'long': 'You may only use the materials for teaching and academic research.',
                 'code': 'nc',
                 'uri': 'cc:CommercialUse'},
                {'long': 'You may not transfer or distribute the materials without permission.',
                 'code': 'no-distribution',
                 'uri': 'sc:Transfer'}]

        # must be sc
        splits = code.split('-')
        
        if splits[0] == 'sc':
            longname = 'Science Commons Material Transfer Agreement'

            fieldStr = 'Limited to %s' % kwargs['fieldSpec'] if kwargs.__contains__('fieldSpec') else None;

            footer = ''
            conditions = [
                {'long': 'You may not use the materials for clinical purposes.',
                 'code': 'no-clinical',
                 'uri': 'sc:Clinical'},
                {'long': 'You may not use the materials in connection with the sale of a product or service.',
                 'code': 'nc',
                 'uri': 'cc:CommercialUse'},
                {'long': 'You may not transfer or distribute the materials. ',
                 'code': 'no-distribution',
                 'uri': 'sc:Transfer'}]

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
                                   'uri': 'sc:ScalingUp'})
            if splits.__contains__('rd'):
                conditions.append({'long': 'You will return or destroy the materials upon completion of research or the termination of the agreement.',
                                   'uri': 'sc:Retention',
                                   'code': 'return'})

        if kwargs.__contains__('endDate'):
            conditions.append({'long':  'This agreement terminates on %s' % kwargs['endDate'],
                               'code':  'end-date'})

        stream = template.generate(code=code, version=version, permissions=permissions, conditions=conditions, footer=footer, legalurl=legalurl, longname=longname)
        return stream.render("xhtml")
        
    def letter(self, code, version, kwargs):
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

    def icon(self, code, version):
        filename = STATIC_DIR + '/images/mta/' + code + '.png'
        string = open(filename).read()
        cherrypy.response.headers['Content-Type'] = 'image/png'
        return string

    # MTA legal code
    def legalcode(self, code, version, kwargs):

        template = self.__loader.load("legal.html")
        stream = template.generate(agreementType=code, version=version, agreementText=self.legaltext(code, version), **kwargs)
        return stream.render("xhtml")

    def legaltext(self, code, version):
        filename = STATIC_DIR + '/legal/' + version + '/' + code + '.txt'
        string = open(filename).read()
        return string

    # return the base code, or error out
    def basecode(self, code):
        if ['ubmta', 'sla'].__contains__(code):
            return code
        splits = code.split('-')
        if splits[0] == 'sc':
            return 'sc'
        raise cherrypy.HTTPError(404, 'Unknown license %s' % code)


class MtaWeb(object):

    def __init__(self):

        # create a template loader instance
        self.__loader = genshi.template.TemplateLoader([TEMPLATE_DIR])

        # Material Registration
        self.material = MtaMaterial(self.__loader)
        self.material.exposed = True

        self.agreements = MtaAgreements(self.__loader)
        self.agreements.exposed = True

        # JSON support for MeSH ontology
        self.mesh = Mesh()
        self.mesh.exposed = True
        
    # serve up static files for HTML, CSS, Javascript, etc.
    _cp_config = {'tools.staticdir.on':True,
                  'tools.staticdir.root':STATIC_DIR,
                  'tools.staticdir.dir':''}
        
    # map the root path to the static file index.html
    index = cherrypy.tools.staticfile.handler(
        os.path.join(TEMPLATE_DIR, 'index.html'))

    # the chooser
    @cherrypy.expose
    def chooser(self):
        return self.chooser_gen()

    # debugging version of the chooser
    @cherrypy.expose
    def chooser_debug(self):
        return self.chooser_gen(debug=True)

    def chooser_gen(self, template_file="chooser.html", debug=False, embedded=False):
        template = self.__loader.load(template_file)
        stream = template.generate(debug=debug, embedded=embedded)
        return stream.render("xhtml")        

    # For the embeddable chooser, we take pieces of the regular chooser
    # and convert them into a javascript file containing document.write() statements.
    # Horribly ugly but it's about the only way to blend source from two different
    # sites on one web page.
    @cherrypy.expose
    def embed_wizard_js(self):
        return self.embed_gen(False)
        
    @cherrypy.expose
    def embed_wizard_debug_js(self):
        return self.embed_gen(True)

    def embed_gen(self, debug):
        template = self.__loader.load("embed-wizard.html")
        stream = template.generate(embedded=True, debug=debug)
        lines = stream.render("xhtml").split('\n')
        return '\n'.join(map(lambda l: "document.write('%s');" % l.replace("'","\\'"), lines))

    # for debugging
    @cherrypy.expose
    def mesh_test(self):
        template = self.__loader.load("mesh-test.html")
        stream = template.generate()
        return stream.render("xhtml")        


def serve(host='127.0.0.1', port=8082):

    cherrypy.tree.mount(MtaWeb())

    cherrypy.server.socket_host = host
    cherrypy.server.socket_port = port
    cherrypy.server.quickstart()
    cherrypy.engine.start()

if __name__ == '__main__':
    serve()
