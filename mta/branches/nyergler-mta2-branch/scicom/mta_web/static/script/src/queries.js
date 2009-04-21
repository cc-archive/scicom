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

