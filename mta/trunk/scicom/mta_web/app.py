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
        # only has to be done once, but (apparently) has to be done in a request
        # make material relocatable
        scicom.mta.material.Material.BASE_URI = cherrypy.request.base + '/material/view'

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

        # only has to be done once, but (apparently) has to be done in a request
        # make material relocatable
        scicom.mta.material.Material.BASE_URI = cherrypy.request.base + '/material/view'

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

        # only has to be done once, but (apparently) has to be done in a request
        # make material relocatable
        scicom.mta.material.Material.BASE_URI = cherrypy.request.base + '/material/view'

        query = self.session.query(scicom.mta.material.Material)
        materials = query.select()
        template = self.__loader.load('material-index.html')
        stream = template.generate(materials=materials)
        return stream.render('xhtml')

# dead remnant
# class MtaSelector(object):
#     """Support select views for each MTA class."""

#     def __init__(self):

#         # create a template loader instance
#         self.__loader = genshi.template.TemplateLoader([TEMPLATE_DIR])

#     # scicom chooser
#     @cherrypy.expose
#     def index(self, source, recipient, **kwargs):

#         template = self.__loader.load(
#             os.path.join(TEMPLATE_DIR, "select.html"))
#         stream = template.generate(source=source, recipient=recipient)

#         return stream.render("xhtml")

class MtaWeb(object):

    def __init__(self):

        # create a template loader instance
        self.__loader = genshi.template.TemplateLoader([TEMPLATE_DIR])

        # create sub-objects for areas of functionality

        # not actually used...
        #        self.select = MtaSelector()

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


    @cherrypy.expose
    # +++ many more parameters
    def implementing_letter(self, agreementType='', providerOrg='', materialDesc='', **kwargs):
        # for now, ignore letterType...
        l = letters.letter.UBMTALetter()
        l.pdf_prepare_response('implementing-letter')
        return l(providerOrg=providerOrg, materialDesc=materialDesc)
    
    # MTA deeds 
    @cherrypy.expose
    def deed(self,  agreementType, **kwargs):

        template = self.__loader.load("deed.html")
        stream = template.generate(code=agreementType, version="1.0")
        return stream.render("xhtml")

    # not built out yet -- in reality, will use a static url or per-agreement template, probably
    # MTA legal code
    @cherrypy.expose
    def legal(self, agreementType, **kwargs):

        template = self.__loader.load("legal.html")
        stream = template.generate(agreementType=agreementType)

        return stream.render("xhtml")

def serve(host='', port=8082):

    cherrypy.tree.mount(MtaWeb())
    # mt temp
    #    cherrypy.tree.mount(mthack.MT(), "/mt")    
    cherrypy.server.socket_host = host
    cherrypy.server.socket_port = port
    cherrypy.server.quickstart()
    cherrypy.engine.start()

if __name__ == '__main__':
    serve()
