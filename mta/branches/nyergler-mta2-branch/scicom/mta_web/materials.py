import cherrypy
import scicom.mta

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
