#!/usr/local/python234/bin/python

"""CGI Wrapper Script for Scholar's Copryight."""

import cgi
# import cgitb; cgitb.enable()

import tempfile
import os
import sys
import MySQLdb

import agreements

def show_error():
    print "Content-Type: text/html"
    print

    print """<html>
    <head>
      <title>Error</title>
    </head>
    <body>
    <p>An error occurred processing your request. Please make sure you supplied
    at least one value for each field. </p>
    <p><em>software at creativecommons dot org</em></p>
    </body>
    </html>
    """

    sys.exit()
    
def process():

    form = cgi.FieldStorage()

    # extract details
    manuscript = form.getfirst("manuscript", "")
    journal = form.getfirst("journal", "")
    author = form.getlist("author")
    publisher = form.getfirst("publisher", "")

    # validate input
    if "" in (manuscript, journal, publisher) or len(author) == 0:
        show_error()
    if len(journal) > 255: journal = journal[:255]
    
    # record the journal tracking information
    dbConn = MySQLdb.connect(user="scholars", passwd="scholars", db="scholars")
    dbConn.cursor().execute('INSERT INTO tracking (journal, generated) values ("%s", null);' % journal)
    
    # get a temporary file name
    pdf_fn = tempfile.NamedTemporaryFile().name
    
    # generate the appropriate PDF
    target = form.getfirst("agreement", None)
    if target in agreements.handlers:
        agreements.handlers[target] (pdf_fn, manuscript=manuscript,
                                     journal=journal, author=author,
                                     publisher=publisher)
    else:
        # invalid target
        show_error()
        
    # serve the temporary file
    pdf_file = file(pdf_fn, "rb")

    print "Expires: 0"
    print "Content-Type: application/pdf"
    print "Cache-Control: must-revalidate, post-check=0, pre-check=0"
    print 'Content-Disposition: attachment; filename="%s.pdf"' % pdf_fn
    print

    print pdf_file.read()

    # remove the temp file
    os.unlink(os.path.join(tempfile.tempdir, pdf_fn))

if __name__ == '__main__':
    process()
    
