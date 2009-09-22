YAHOO.namespace("cc.mta");


YAHOO.cc.mta.parse_success = function(store) {

    // make sure the referrer has metadata about this document
    var query = new RDFQuery(store);
    var results = query.query2(YAHOO.cc.mta.MTA_INFO);

    query.walk2(results, {
	    action : function (obj) {
		
		// make sure either the offer or the material was the referer
		if (obj.offer == document.referrer || 
		    obj.material == document.referrer) {
		    // look for the disease we're limited to 
		    if (obj.disease != undefined) {
			// add the disease notification to the deed
			var notification = "Your use of the material is restricted to: <ul><li>" + obj.disease + "</li></ul>";

			YAHOO.util.Dom.get("requirement-restricted-field").innerHTML = notification;
		    }

		    // what about contractor access
		    if (obj.offer_permits == "http://mta.sciencecommons.org/ns#ContractorAccess") {
			// add the contractor permission to the deed
			var notice = document.createElement("li");
			YAHOO.util.Dom.addClass(notice, "license");
			notice.innerHTML = "Contractors may access the material.";
			
			YAHOO.util.Dom.insertAfter(notice,
						   YAHOO.util.Dom.getLastChild(YAHOO.util.Dom.get("requirements")));
		    }
		}
	    }});

} // parse_success

    YAHOO.cc.mta.parse_failure = function(error_code) {
	// see http://developer.yahoo.com/yui/connection/#failure 
    } // parse_failure


YAHOO.cc.mta.check_referrer = function() {

    // look for the referrer
    if (document.referrer.match('^http://')) {

	// construct the request callback
	var callback = {
	    success: YAHOO.cc.mta.parse_success,
	    failure: YAHOO.cc.mta.parse_failure
	};

	YAHOO.cc.ld.load(document.referrer, 
			 '/scraper/triples',
			 callback);

	} // if refered from http:// request

}

YAHOO.register("cc.mta", YAHOO.cc.mta, {version:"0.0.1", build:"1"});
YAHOO.util.Event.onDOMReady(YAHOO.cc.mta.check_referrer);
