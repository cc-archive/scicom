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

import os
import cherrypy

import scicom.scholars

STATIC_DIR = os.path.abspath(
    os.path.dirname(scicom.scholars.static.__file__)
    )
TEMPLATE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'templates',)
    )
    
class ScholarsCopyright(object):
        
    # serve up static files for HTML, CSS, Javascript, etc.
    _cp_config = {'tools.staticdir.on':True,
                  'tools.staticdir.root':STATIC_DIR,
                  'tools.staticdir.dir':''}

    # map the root path to the static file index.html
    index = cherrypy.tools.staticfile.handler(
        os.path.join(STATIC_DIR, 'index.html'))

    @cherrypy.expose
    def generate(self, manuscript='', journal='', author=[],
                 publisher='', agreement=''):
        
        # make sure author is a list
        try:
            author.append(None)
            del author[-1]
        except AttributeError, e:
            # author must be a string
            author = [author]

        # validate input
        if "" in (manuscript, journal, publisher, agreement) or \
                len(author) == 0:
            show_error()
        if len(journal) > 255: journal = journal[:255]

        # generate the agreement
        pdf_contents = scicom.scholars.generate.create_pdf(
            manuscript, journal, author, publisher, agreement)
        scicom.scholars.track.record()

        # set the appropriate headers
        cherrypy.response.headers['Expires'] = '0'
        cherrypy.response.headers['Content-Type'] = 'application/pdf'
        cherrypy.response.headers['Cache-Control'] = \
            'must-revalidate, post-check=0, pre-check=0'
        cherrypy.response.headers['Content-Disposition'] = \
            'attachment; filename="agreement.pdf"'

        # read the response, unlink the temp file and return it
        return pdf_contents

    @cherrypy.expose
    def iframe(self, partner_id=None, stylesheet=''):

        pass


    # MTA deeds and legalcode
    @cherrypy.expose
    def agreement(self, code, version):

        template = self.__loader.load("deed.html")
        stream = template.generate(code=code, version=version)

        return stream.render("xhtml")

def serve(host='localhost', port=8082):

    cherrypy.tree.mount(ScholarsCopyright())

    #cherrypy.server.socket_host = host
    cherrypy.server.socket_port = port
    cherrypy.server.quickstart()
    cherrypy.engine.start()

if __name__ == '__main__':
    serve()
