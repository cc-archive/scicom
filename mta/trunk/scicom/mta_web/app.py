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
# thought I'd try routes but it's more trouble than its worth
#         d = cherrypy.dispatch.RoutesDispatcher()
#         d.connect(name='deed',
#                   route=':type/:version',
#                   controller='deed_controller',
#                   action='update')
#         config = {'/agreements': {'request.dispatch': d}}
#         cherrypy.tree.mount(root=None, config=config)
        
    @cherrypy.expose
    def default(self, code, version, *args, **kwargs):
        
        self.checklicense(code)

        if args.__len__() > 0:
            doctype = args[0]
        else:
            return self.deed(code, version, kwargs)

        if doctype == 'legalcode':
            return self.legalcode(code, version, kwargs)
        if doctype == 'letter':
            return self.letter(code, version, kwargs)

        raise cherrypy.HTTPError(404)


    def deed(self, code, version, kwargs):
        template = self.__loader.load("deed.html")
        stream = template.generate(code=code, version=version)
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

    def checklicense(self, code):
        if ['ubmta', 'sla'].__contains__(code):
            return True
        splits = code.split('-')
        if splits[0] == 'sc':
            return True
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
