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

import letters.letter
import one
import two

from const import STATIC_DIR, TEMPLATE_DIR, MESH_SOURCE

from materials import MtaMaterial

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
    
class MtaAgreements(object):

    """Serve the agreements and related documents"""

    def __init__(self, loader):

        self.__loader = loader
        self.__one = one.Mta(loader)
        self.__two = two.Mta(loader)

    @cherrypy.expose
    def default(self, code=None, version="1.0", *args, **kwargs):
        
        # for site/agreements, go to the chooser
        if code == None:
            raise cherrypy.HTTPRedirect("/chooser", status=303)

        basecode = self.basecode(code)

        if args.__len__() > 0:
            doctype = args[0]
        else:
            doctype = 'deed'

        if version == '1.0':
            return self.__one.dispatch(basecode, code, doctype, **kwargs)
        elif version == '2.0':
            return self.__two.dispatch(basecode, code, doctype, **kwargs)

        raise cherrypy.HTTPError(404, 'Unknown license %s %s' % 
                                 (code, version))        

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
        self.__loader = genshi.template.TemplateLoader([TEMPLATE_DIR],
                                                       variable_lookup='lenient')

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


def app_factory(*args):
    """Application factory for use with Python Paste deployments."""

    from cherrypy._cpengine import STARTED, STARTING, STOPPED

    cherrypy.tree.mount(MtaWeb())

    if cherrypy.engine.state not in (STARTED, STARTING):
        cherrypy.engine.start(blocking=False)
    
    return cherrypy.tree

def serve(host='127.0.0.1', port=8082):

    cp_app = app_factory()

    cherrypy.server.socket_host = host
    cherrypy.server.socket_port = port
    cherrypy.server.quickstart()
    cherrypy.engine.start()

if __name__ == '__main__':
    serve()
