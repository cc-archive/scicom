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
    def add(self, description, provider, more_info=None):

        # create the new material
        new_material = scicom.mta.material.Material(
            description, provider, more_info)

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
    
class MtaWeb(object):

    def __init__(self):

        # create a template loader instance
        self.__loader = genshi.template.TemplateLoader([TEMPLATE_DIR])

        # create sub-objects for areas of functionality

        # Material Registration
        self.material = MtaMaterial(self.__loader)
        self.material.exposed = True

        # JSON support for MeSH ontology
        self.mesh = Mesh()
        self.mesh.exposed = True
        
    # serve up static files for HTML, CSS, Javascript, etc.
    _cp_config = {'tools.staticdir.on':True,
                  'tools.staticdir.root':STATIC_DIR,
                  'tools.staticdir.dir':''}

    # root page -- pre-chooser
    @cherrypy.expose
    def index(self):
        template = self.__loader.load(
            os.path.join(TEMPLATE_DIR, "index.html"))
        return template.generate().render('xhtml')
        
    # academic chooser (UBMTA, SLA)
    @cherrypy.expose
    def academic(self, source, recipient, **kwargs):

        template = self.__loader.load(
            os.path.join(TEMPLATE_DIR, "academic.html"))
        stream = template.generate(source=source, recipient=recipient)

        return stream.render("xhtml")

    # to academic chooser (SciCom, UBMTA, SLA)
    @cherrypy.expose
    def compare(self, source, recipient, **kwargs):

        template = self.__loader.load(
            os.path.join(TEMPLATE_DIR, "triple.html"))
        stream = template.generate(source=source, recipient=recipient)

        return stream.render("xhtml")

    # scicom chooser
    @cherrypy.expose
    def select(self, source, recipient, **kwargs):

        template = self.__loader.load(
            os.path.join(TEMPLATE_DIR, "select.html"))
        stream = template.generate(source=source, recipient=recipient)

        return stream.render("xhtml")

    # MTA deeds and legalcode
    @cherrypy.expose
    def agreement(self, code, version):

        template = self.__loader.load("deed.html")
        stream = template.generate(code=code, version=version)

        return stream.render("xhtml")

def serve(host='', port=8082):

    cherrypy.tree.mount(MtaWeb())

    cherrypy.server.socket_host = host
    cherrypy.server.socket_port = port
    cherrypy.server.quickstart()
    cherrypy.engine.start()

if __name__ == '__main__':
    serve()
