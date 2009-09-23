
MTA_FILES = ../includes/referrer/src/bootstrap.js src/mta.js src/queries.js

all: mta-min.js

mta.js: $(MTA_FILES) 
	cat $(MTA_FILES) > mta-dbg.js

mta-min.js: mta.js
	java -jar ../includes/referrer/lib/yuicompressor-2.4.1.jar mta.js > mta-min.js

clean:
	rm mta.js mta-min.js