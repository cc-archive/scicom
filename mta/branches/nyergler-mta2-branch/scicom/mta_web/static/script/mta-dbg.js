YAHOO.namespace("cc.mta");


YAHOO.cc.mta.parse_success = function(store) {
    console.log(store);

    // make sure the referrer has metadata about this document
    var query = new RDFQuery(store);
    var results = query.query2(YAHOO.cc.mta.MTA_INFO);
    console.log(results);

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
			console.log("permits contractor access");
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

YAHOO.cc.mta.init = function() {

    // load dependencies and initialize MTA handling
    loader = new YAHOO.util.YUILoader();
    YAHOO.cc.modules.add_definitions(loader, pathToModule("mta"));
    loader.require("cc.ld");

    loader.onSuccess = function(o) {
	setTimeout(
		   function() {
		       YAHOO.cc.mta.check_referrer();
		   },
		   500
		   );
    };

    loader.insert();

} // cc.mta.init

YAHOO.register("cc.mta", YAHOO.cc.mta, {version:"0.0.1", build:"1"});

(
 function() {
     YAHOO.cc.mta.init();
     
 }()
 );

YAHOO.cc.mta.MTA_INFO =  {
        select: [ "offer", "material", "disease", "offer_permits"],
        where:
        [
    { pattern: [ "?offer", 
		 "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", 
		 "http://mta.sciencecommons.org/ns#Offer" ] },
    { pattern: [ "?offer",
		 "http://mta.sciencecommons.org/ns#agreement",
		 document.URL ] },
    // optionally look for a material assertion connected to this offer
    { where:
      [
    { pattern: [ "?material",
		 "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", 
		 "http://mta.sciencecommons.org/ns#Material" ] },
    { pattern: [ "?material",
		 "http://mta.sciencecommons.org/ns#offer",
		 "?offer" ] }
       ],
      optional: true
    },

    // optionally look for disease information
    { where:
      [
    { pattern: [ "?offer",
		 "http://creativecommons.org/ns#requires", 
		 "?requirement" ] },
    { pattern: [ "?requirement",
		 "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", 
		 "http://mta.sciencecommons.org/ns#DiseaseRequirement" ] },
    { pattern: [ "?requirement",
		 "http://mta.sciencecommons.org/ns#disease", 
		 "?disease" ] }
       ],
      optional: true
    },

    // look for additional, optional permissions
    { where:
      [
    { pattern: [ "?offer",
		 "http://creativecommons.org/ns#permits", 
		 "?offer_permits" ] }
       ],
      optional: true
    }
        ]
};

