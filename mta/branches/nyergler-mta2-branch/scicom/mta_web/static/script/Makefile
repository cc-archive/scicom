
MTA_FILES = src/mta.js src/queries.js
BOOTSTRAP_FILES = ../includes/referrer/src/bootstrap.js src/bootstrap.js

all: mta.js mta-bootstrap.js

mta.js: $(MTA_FILES) 
	cat $(MTA_FILES) > mta-dbg.js
	java -jar ../includes/referrer/lib/yuicompressor-2.4.1.jar mta-dbg.js > mta.js

mta-bootstrap.js: $(BOOTSTRAP_FILES)
	cat $(BOOTSTRAP_FILES) > mta-bootstrap.js

clean:
	rm mta.js mta-dbg.js mta-boostrap.js