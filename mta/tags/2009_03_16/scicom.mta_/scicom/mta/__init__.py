from sqlalchemy import *

import material

DB_URI = "sqlite://./material.db" # mysql://root@localhost/sc_mta"

def connect_session():
    """Instantiate the database connection."""

    db_metadata = BoundMetaData(DB_URI)

    # Material registry
    m_tbl = Table('materials', db_metadata,
                  Column('material_id', Integer, primary_key=True),
                  Column('description', String(100)),
                  Column('provider', String(100)),
                  Column('provider_url', String(200)),
                  Column('provider_nonprofit', Boolean),
                  Column('more_info', String(255)),
                  Column('identifier', String(255)),
                  )

    # make sure the table exists
    if not(m_tbl.exists()):
        m_tbl.create()
    
    material_mapper = mapper(material.Material, m_tbl)
    
    return create_session()
