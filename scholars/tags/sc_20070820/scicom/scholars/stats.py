"""Simple metric tracking for agreements issued."""

from datetime import datetime
from sqlalchemy import MetaData, Table, Column, types
from sqlalchemy.orm import mapper, create_session
from scicom.scholars.dbconn import DB_URI

class AgreementStatistic(object):
    """Tracking information for a single generated agreement."""
    
    def __init__(self, partner, journal, agreement):

        self.row_id = None
        self.issued = datetime.now()
        self.partner = partner
        self.journal = journal
        self.agreement = agreement

class StatsMapper(object):
    """An object mapper for agreement statistics."""

    def _connect_session(self):
        """Instantiate the database connection."""

        self.db_metadata = MetaData(DB_URI)

        # Agreement generation statistics
        self.agreements = Table('agreements', self.db_metadata,
                              Column('row_id', types.Integer,primary_key=True),
                              Column('issued', types.DateTime),
                              Column('partner', types.String(100)),
                              Column('journal', types.String(255)),
                              Column('agreement', types.String(255)),
                              )

        # make sure the table exists
        if not(self.agreements.exists()):
            self.agreements.create()

        self.mapper = mapper(AgreementStatistic, self.agreements)

        return create_session()

    @property
    def session(self):
        """Return the session object."""

        try:
            return self._session
        except AttributeError:
            self._session = self._connect_session()
            return self._session
        
    def counts(self):
        """Return a sequence of tuples mapping, where each tuple consists of

        (journal, agreement_count)

        """

        return []

    def total(self):
        """Return the total number of agreements issued."""

    
