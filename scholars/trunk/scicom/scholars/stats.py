"""Simple metric tracking for agreements issued."""

from datetime import datetime

class AgreementStatistic(object):
    """Tracking information for a single generated agreement."""
    
    def __init__(self, partner, journal, agreement):

        self.row_id = None
        self.issued = datetime.now()
        self.partner = partner
        self.journal = journal
        self.agreement = agreement
