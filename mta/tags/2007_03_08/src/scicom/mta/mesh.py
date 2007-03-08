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
        """Query the dataset for entries which match the query.  Return
        a sequence of MeshEntry objects."""

        if query is None:
            # no filtering
            return self.data
        
        return [n for n in self.data if n.match(query)]


class MeshEntryJsonEncoder(simplejson.JSONEncoder):

    def default(self, obj):

        if isinstance(obj, MeshEntry):
            # encode the entry as JSON using our custom schema
            return {'Description': obj.description,
                    'LookupKey':obj.lookup}
        else:
            # fallback to default behavior
            return simplejson.JSONEncoder.default(self, obj)
