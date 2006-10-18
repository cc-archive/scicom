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

    def __init__(self):

        # get a handle to the database session
        self.session = scicom.mta.connect_session()

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
        loader = genshi.template.TemplateLoader([TEMPLATE_DIR])
        template = loader.load('material.html')
        stream = template.generate(material=material[0])

        return stream.render('xhtml')
    
class MtaWeb(object):

    # serve up static files for HTML, CSS, Javascript, etc.
    _cp_config = {'tools.staticdir.on':True,
                  'tools.staticdir.root':STATIC_DIR,
                  'tools.staticdir.dir':''}

    # map the root path to the static file index.html
    index = cherrypy.tools.staticfile.handler(
        os.path.join(STATIC_DIR, 'index.html'))

    # MTA deeds and legalcode
    @cherrypy.expose
    def agreement(self, code, version):
        return "\n".join([code,version])

    # Material Registration
    material = MtaMaterial()
    material.exposed = True

    # JSON support for MeSH ontology
    mesh = Mesh()
    mesh.exposed = True

def serve(host='localhost', port=8080):

    cherrypy.tree.mount(MtaWeb())
    cherrypy.server.quickstart()
    cherrypy.engine.start()

if __name__ == '__main__':
    serve()
