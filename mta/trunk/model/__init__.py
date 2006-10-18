from sqlalchemy import *

import material

DB_URI = "mysql://root@localhost/sc_mta"

def connect_session():
    """Instantiate the database connection."""

    db_metadata = BoundMetaData(DB_URI)

    material_table = Table('materials', db_metadata, autoload=True)
    material_mapper = mapper(material.Material, material_table)
    
    return create_session()
