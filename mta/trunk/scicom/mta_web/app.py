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
    def add(self, description, provider, provider_url=None, provider_nonprofit=False, more_info=None):
        # create the new material
        new_material = scicom.mta.material.Material(
            description, provider, provider_url, provider_nonprofit, more_info)

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
            return self.legalcode(basecode, version, kwargs)

        # might use basecode here
        if doctype == 'letter':
            return self.letter(code, version, kwargs)

        raise cherrypy.HTTPError(404)


    # code here is temporary, reusing cc codes until we get some nice icons

    def deed(self, code, version, kwargs):
        template = self.__loader.load("deed.html")
        basecode = self.basecode(code)

        # same for all deeds
        permissions = [
            {'long': 'Use the materials for research that you supervise',
             'code': 'share'},
            {'long': 'Allow others under your supervision to use the materials',
             'code': 'remix'},
            {'long':'Publish the results of your research'}]

        # default
        footer = 'You will acknowledge provider in publications reporting use of the materials.'
        legalurl = '/agreements/' + basecode + "/" + version + '/legalcode'

        if code == 'ubmta':
            longname = 'Uniform Biological Material Transfer Agreement'
            conditions = [
                {'long': 'You may not use the materials for clinical purposes.',
                 'code': 'no-endorse'},
                {'long': 'You may only use the materials for teaching and academic research.',
                 'code': 'nc'},
                {'long': 'You may not transfer or distribute the materials, except only Modifications to non-profit organizations under the UBMTA. '},
                {'long': 'You will return or destroy materials upon completion of research or expiration of the implementing letter.'}]

        if code == 'sla':
            longname = 'Simple Letter Agreement'
            conditions = [
                {'long': 'You may not use the materials for clinical purposes.'},
                {'long': 'You may only use the materials for teaching and academic research.'},
                {'long': 'You may not transfer or distribute the materials without permission.'}]


        # must be sc
        splits = code.split('-')
        
        if splits[0] == 'sc':
            longname = 'Science Commons Material Transfer Agreement'
            footer = ''
            conditions = [
                {'long': 'You may not use the materials for clinical purposes.'},
                {'long': 'You may not use the materials in connection with the sale of a product or service.',
                 'code': 'nc'},
                {'long': 'You may not transfer or distribute the materials. '}]

            if splits.__contains__('rp'):
                conditions.append({'long': 'You may only use the material with a specific protocol.'})
            if splits.__contains__('df'):
                conditions.append({'long': 'You may only use the material with a specific disease.'})
            if splits.__contains__('ns'):
                conditions.append({'long': 'You may not scale up the material.'})
            if splits.__contains__('rd'):
                conditions.append({'long': 'You must destroy or return the material after the completion of research.'})

        stream = template.generate(code=code, version=version, permissions=permissions, conditions=conditions, footer=footer, legalurl=legalurl, longname=longname)
        return stream.render("xhtml")
        
    def letter(self, code, version, kwargs):
        # +++ just UBMTA for now
        l = letters.letter.UBMTALetter()
        # do this first to catch errors before declaring it a pdf
        result = l(**kwargs)
        l.pdf_prepare_response('implementing-letter')
        return result


    # not built out yet -- in reality, will use a static url or per-agreement template, probably
    # MTA legal code
    @cherrypy.expose
    def legalcode(self, code, version, kwargs):

        template = self.__loader.load("legal.html")
        stream = template.generate(agreementType=code, *kwargs)
        return stream.render("xhtml")

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
        template = self.__loader.load("chooser.html")
        stream = template.generate(debug=False)
        return stream.render("xhtml")        

    # debugging version of the chooser
    @cherrypy.expose
    def chooser_debug(self):
        template = self.__loader.load("chooser.html")
        stream = template.generate(debug=True)
        return stream.render("xhtml")        


def serve(host='', port=8082):

    cherrypy.tree.mount(MtaWeb())

    cherrypy.server.socket_host = host
    cherrypy.server.socket_port = port
    cherrypy.server.quickstart()
    cherrypy.engine.start()

if __name__ == '__main__':
    serve()
