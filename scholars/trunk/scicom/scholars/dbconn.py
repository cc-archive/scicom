from sqlalchemy import *

import scicom.scholars

DB_URI = "sqlite://./agreements.db" # mysql://root@localhost/sc_mta"

def connect_session():
    """Instantiate the database connection."""

    db_metadata = BoundMetaData(DB_URI)

    # Agreement generation statistics
    agreement_tbl = Table('agreements', db_metadata,
                          Column('row_id', Integer, primary_key=True),
                          Column('issued', DateTime),
                          Column('partner', String(100)),
                          Column('journal', String(255)),
                          Column('agreement', String(255)),
                          )

    # make sure the table exists
    if not(agreement_tbl.exists()):
        agreement_tbl.create()
    
    agreement_mapper = mapper(scicom.scholars.stats.AgreementStatistic, 
                              agreement_tbl)

    return create_session()
