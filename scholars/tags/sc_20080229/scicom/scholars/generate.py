## Copyright (c) 2006-2007 Nathan R. Yergler, Creative Commons

## Permission is hereby granted, free of charge, to any person obtaining
## a copy of this software and associated documentation files (the "Software"),
## to deal in the Software without restriction, including without limitation
## the rights to use, copy, modify, merge, publish, distribute, sublicense,
## and/or sell copies of the Software, and to permit persons to whom the
## Software is furnished to do so, subject to the following conditions:

## The above copyright notice and this permission notice shall be included in
## all copies or substantial portions of the Software.

## THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
## IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
## FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
## AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
## LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
## FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
## DEALINGS IN THE SOFTWARE.

"""CGI Wrapper Script for Scholar's Copryight."""

import tempfile
import os
import sys

from scicom.scholars import agreements

def create_pdf(manuscript, journal, authors, publisher, 
               target_agreement):
    
    # get a temporary file name
    pdf_fn = tempfile.NamedTemporaryFile().name
    
    # generate the appropriate PDF
    if target_agreement in agreements.handlers:
        agreements.handlers[target_agreement]() (pdf_fn, manuscript=manuscript,
                                     journal=journal, author=authors,
                                     publisher=publisher)
    else:
        # invalid target
        show_error()
        
    # read the temporary file
    pdf_file = file(pdf_fn, "rb")
    result = pdf_file.read()
    pdf_file.close()

    # remove the temp file
    os.unlink(os.path.join(tempfile.tempdir, pdf_fn))

    # return the contents
    return result 
    
