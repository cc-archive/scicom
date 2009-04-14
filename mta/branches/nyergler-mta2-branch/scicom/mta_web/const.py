import os

STATIC_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'static',)
    )
TEMPLATE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'templates',)
    )
MESH_SOURCE = os.path.join(STATIC_DIR, 'mesh_2007_trees')
