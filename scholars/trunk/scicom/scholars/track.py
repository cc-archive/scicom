"""Simple metric tracking for agreements issued."""


import tempfile
import os
import sys
import MySQLdb

def record():
    """Record that an agreement was generated."""
    
    # record the journal tracking information
    #dbConn = MySQLdb.connect(user="scholars", passwd="scholars", db="scholars")
    #dbConn.cursor().execute('INSERT INTO tracking (journal, generated) values ("%s", null);' % journal)
