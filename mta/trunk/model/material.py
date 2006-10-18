
class Material(object):

    def __init__(self, description, provider, more_info=None):

        self.material_id = None
        self.description = description
        self.provider = provider
        self.more_info = more_info
        
    def __repr__(self):

        return "%s: %s" % (self.material_id, self.description)


