
var baseDefaultPath = pathToModule("mta-bootstrap"),
    loader;

(
 function() {
     addScript("http://yui.yahooapis.com/combo?2.7.0/build/yuiloader-dom-event/yuiloader-dom-event.js");
     addScript("http://mirrors.creativecommons.org/software/ld/modules.js");

     function waitForYahoo() {
	 try {
	     loader = new YAHOO.util.YUILoader();

	     loader.addModule({name: "cc.mta",
			 type: "js",
			 fullpath: baseDefaultPath + "mta.js" 
			 });

	     loader.require('cc.mta');
	     loader.insert();
	 } catch(e) {
	     setTimeout(waitForYahoo, 50);
	     return;
	 }
     }
     waitForYahoo();
 }()
 );
