"""Script for generating possible combinations of MTA settings"""

fields = ('field', 'scaling', 'term', 'retain', 'publication')

# dictionary which maps:
#
# a field name to a mapping of options,
#   where each entry in the option mapping maps the key to a tuple
#   and the tuple contains the (pretty name, uri piece)
#

parameters = {
    'field'       : {'all' : ('', ''),
                     'disease' : ('Disease Field', 'Disease'),
                     'protocol' : ('Research Protocol', 'Protocol'),
                     },
    'scaling'     : {'yes': ('', ''),
                     'no': ('No Scaling', 'NoScaling'),
                     },
    'term'        : {'variable': ('', ''),
                     'fixed': ('Fixed Term', 'FixedTerm'),
                     },
    'retain'      : {'yes': ('', ''),
                     'no': ('No Retention', 'NoRetention'),
                     },
    'publication' : {'yes': ('', ''),
                     'no': ('No Publication', 'NoPublication'),
                     },
    }


class Agreement(object):
    BASE_URL = "http://mta.sciencecommons.org/"
    
    def __init__(self, field, scaling, term, retain, publication,
                 version = "1.0"):

        self.field = field
        self.scaling = scaling
        self.term = term
        self.retain = retain
        self.publication = publication

        self.version = version

    def __terms(self, pretty_print=False):
        """Returns a sequence of attributes for this agreement in
        the "correct" order.  If [pretty_print] is False, return the
        pieces as they appear in the MTA URI."""

        fields = ('field', 'scaling', 'term', 'retain', 'publication')
        result = []

        for key in fields:
            value = parameters[key][getattr(self, key)]

            if pretty_print:
                result.append(value[0])
            else:
                result.append(value[1])

        return result
        
    def __str__(self):
        return "Science Commons %s %s Material Transfer Agreement" % (
            "-".join(self.__terms(True)), self.version)

    def __repr__(self):
        return "%s%s/%s" % (self.BASE_URL, self.__term(), self.version)
    
def javascript(agreement, ):
    """Generate Javascript definition for an Agreement."""

    result = """

    var mta = new Array();
    """

    return result

if __name__ == '__main__':

    for field in fields:
        
    print javascript()
    
