#!/usr/bin/env python

"""CGI Wrapper Script for Scholar's Copryight."""

import cgi
import cgitb; cgitb.enable()

import tempfile
import os

import agreements

def process():

    form = cgi.FieldStorage()

    # extract details
    manuscript = form.getfirst("manuscript", "")
    journal = form.getfirst("journal", "")
    author = form.getlist("author")
    publisher = form.getfirst("publisher", "")

    # record the journal tracking information
    # XXX
    
    # get a temporary file name
    pdf_fn = tempfile.NamedTemporaryFile().name
    
    # generate the appropriate PDF
    target = form.getfirst("agreement", None)
    if (target == 'noembargo'):
        agreements.no_embargo(pdf_fn, manuscript=manuscript, journal=journal,
                              author=author, publisher=publisher)
        
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
    
