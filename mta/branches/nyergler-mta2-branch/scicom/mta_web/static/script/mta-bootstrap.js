/* pathToModule, addScript shamelessly cribbed from ubiquity-rdfa project;
   http://ubiquity-rdfa.googlecode.com/svn/trunk/ubiquity-loader.js
   
   Licensed under Apache Software License 2.0
*/

function pathToModule(module) {
	if (!module) {
		throw("Missing or null parameter supplied.");
	}

	var scriptNodes = document.getElementsByTagName( "script" );
	var l = scriptNodes.length;
	var i;
	var head;
	var s = null;
	var el, src, pos;

	for (i = 0; i < l; ++i) {
		el = scriptNodes[i];
		// See if the module name we are looking for is present in any of the
		// following forms:
		//
		//  [path]/module.js
		//  [path]\\module.js
		//  module.js
		//
		src = el.src;
		if (src) {
			pos = src.lastIndexOf(module + ".js");
			
			if (pos != -1 && (!pos || src.charAt(pos - 1) === "/" || src.charAt(pos - 1) === "\\")) {
				s = src.slice(0, pos);
				break;
			}
		}// if @src is present
	}// for each script node

	if (!s) {
		throw("No Module called '" + module + "' was found.");
	}
	return s;
}

function addScript(uri) {
	var head = document.getElementsByTagName("head")[0],
	    el = document.createElement('script');

	head.appendChild(el);
	el.setAttribute("type","text/javascript");
	el.setAttribute("src", uri);
	return;
}


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
