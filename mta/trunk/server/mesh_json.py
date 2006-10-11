#!/usr/bin/env python

import simplejson
import cgi

MESH_SOURCE = "mesh_2007_trees"

class MeshEntry(object):

    def __init__(self, description, lookup):
        self.description = description
        self.lookup = lookup

    def match(self, query):
        return (query.lower() in self.description.lower())

class MeshEntryJsonEncoder(simplejson.JSONEncoder):

    def default(self, obj):

        if isinstance(obj, MeshEntry):
            # encode the entry as JSON using our custom schema
            return {'Description': obj.description,
                    'LookupKey':obj.lookup}
        else:
            # fallback to default behavior
            return simplejson.JSONEncoder.default(self, obj)

class MeshTreeSet(object):

    def __init__(self, filename):
        self.__filename = filename
        self.load()

    def load(self, filename=None):
        """Load a MeSH tree dataset.  If no filename is specified, use
        the filename specified in the constructor."""

        source = open(filename or self.__filename, 'r')
        self.data = []

        for entry in source:
            self.data.append(MeshEntry(*entry.strip().split(';')))

    def query(self, query):

        self.data = [n for n in self.data if n.match(query)]

        # return self to allow simple chaining
        return self

    def json(self):
        return simplejson.dumps({'Result':self.data}, cls=MeshEntryJsonEncoder)
    
# load the MeSH data set
mesh_tree = MeshTreeSet(MESH_SOURCE)

# extract the query from the CGI request
form = cgi.FieldStorage()
query = form["query"].value

# filter and spit out the results in JSON format
print 'Content-type: text/plain'
print
print mesh_tree.query(query).json()
