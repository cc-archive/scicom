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

from setuptools import setup

setup(
    name = "scicom.mta_web",
    version = "0.2",
    packages = ['scicom.mta_web'],

    # scripts and dependencies
    dependency_links = ['http://dist.repoze.org/PIL-1.1.6.tar.gz#egg=PIL-1.1.6',
                        'http://ftp.schooltool.org/schooltool/eggs/Reportlab-2.1.tar.gz#egg=Reportlab-2.1'],

    install_requires = ['setuptools',
                        'CherryPy<=3.0.999',
                        'simplejson',
                        'Genshi',
                        'zdaemon',
                        'PIL',
                        'Reportlab==2.1', 
                        'scicom.mta',
                        ],

    include_package_data = True,
    namespace_packages = ['scicom'],
    zip_safe = False,

    entry_points = { 'console_scripts':
                     ['server = scicom.mta_web.app:serve',
                      ],
                     },

    # author metadata
    author = 'Nathan R. Yergler',
    author_email = 'nathan@creativecommons.org',
    description = 'Material Transfer Agreement selector and support.',
    license = 'MIT',
    url = 'http://mta.sciencecommons.org',

    )
