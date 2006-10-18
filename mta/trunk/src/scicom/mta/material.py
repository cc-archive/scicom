import hashlib

class Material(object):

    BASE_URI = "http://mta.creativecommons.org/material/view"
    
    def __init__(self, description, provider, more_info=None, identifier=None):

        self.material_id = None
        self.description = description
        self.provider = provider
        self.more_info = more_info

        self.identifier = identifier or self.__make_identifier()
        
    def __repr__(self):

        return "%s: %s" % (self.material_id, self.description)

    def __make_identifier(self):

        sha1 = hashlib.sha1()
        sha1.update(self.description)
        sha1.update(self.provider)

        return sha1.hexdigest()

    def view_uri(self):
        """Return the stable view URI for this material."""

        return "%s/%s" % (self.BASE_URI, self.material_id)
