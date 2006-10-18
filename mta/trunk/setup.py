# XXX license header here

from setuptools import setup, find_packages

setup(
    name = "scicom.mta",
    version = "0.1",
    packages = find_packages('src', exclude=["deprecated", "eggs"]),
    package_dir = {'':'src'},

    # scripts and dependencies
    install_requires = ['CherryPy>=3.0beta2',
                        'sqlalchemy',
                        'simplejson',],
    include_package_data = True,
    zip_safe = False,

    entry_points = { 'console_scripts':
                     ['mta = mta:serve',
                      ],
                     },

    # author metadata
    author = 'Nathan R. Yergler',
    author_email = 'nathan@creativecommons.org',
    description = 'Material Transfer Agreement selector and support.',
    license = 'MIT',
    url = 'http://mta.sciencecommons.org',

    )
