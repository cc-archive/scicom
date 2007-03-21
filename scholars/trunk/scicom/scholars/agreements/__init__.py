import noembargo
import embargo
import retaincc

handlers = {'noembargo': noembargo.no_embargo,
            'embargo': embargo.embargo,
            'retaincc': retaincc.retaincc,
            }
