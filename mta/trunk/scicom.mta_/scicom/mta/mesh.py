#!/usr/bin/env python

import simplejson
import cgi

# represents a single mesh entry
class MeshEntry(object):

    def __init__(self, description, lookup):
        self.description = description
        self.lookup = lookup

    def match(self, query):
        #        return (query.lower() in self.description.lower()) 
        return begins(self.description.lower(), query.lower())

def begins(string,sub):
    return string[0:len(sub)] == sub


class MeshTreeSet(object):

    def __init__(self, filename):
        self.__filename = filename
        self.load()

    def load(self, filename=None):
        """Load a MeSH tree dataset.  If no filename is specified, use
        the filename specified in the constructor."""

        source = open(filename or self.__filename, 'r')
        self.data = {}

        for entry in source:
            description, lookup = entry.strip().split(';')
            # C indicates a disease term
            # only store entry once (+++ this is O(n^2), should use a dictionary)
            if lookup[0] == 'C' and not(self.data.__contains__(description)):
                self.data[description] = MeshEntry(description, lookup)

    def query(self, query):
        """Query the dataset for entries which match the query.  Return
        a sequence of MeshEntry objects."""

        if query is None:
            # no filtering
            return self.data
        
        matches = [n for n in self.data.itervalues() if n.match(query)]
        matches.sort(None, lambda(mesh): mesh.description)

        return matches

class MeshEntryJsonEncoder(simplejson.JSONEncoder):

    def default(self, obj):

        if isinstance(obj, MeshEntry):
            # encode the entry as JSON using our custom schema
            return {'Description': obj.description,
                    'LookupKey':obj.lookup}
        else:
            # fallback to default behavior
            return simplejson.JSONEncoder.default(self, obj)
