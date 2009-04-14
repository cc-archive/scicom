import os

__all__ = ['UBMTA', 'SCICOM']

# define constants for each available MTA class
UBMTA = os.path.join(os.path.dirname(scicom.mta.classes.__file__),
                     'ubmta.ini')
SCICOM = os.path.join(os.path.dirname(scicom.mta.classes.__file__),
                      'scicom.ini')
