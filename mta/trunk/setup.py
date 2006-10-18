# XXX license header here

from setuptools import setup, find_packages

setup(
    name = "scicom.mta",
    version = "0.2",
    packages = find_packages('src'),
    package_dir = {'':'src'},

    # scripts and dependencies
    install_requires = ['CherryPy>=3.0beta2',
                        'sqlalchemy',
                        'simplejson',],
    include_package_data = True,
    namespace_packages = ['scicom'],
    zip_safe = False,

    entry_points = { 'console_scripts':
                     ['mta = scicom.mta_web.app:serve',
                      ],
                     },

    # author metadata
    author = 'Nathan R. Yergler',
    author_email = 'nathan@creativecommons.org',
    description = 'Material Transfer Agreement selector and support.',
    license = 'MIT',
    url = 'http://mta.sciencecommons.org',

    )
