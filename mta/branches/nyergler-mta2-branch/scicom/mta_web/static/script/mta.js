YAHOO.namespace("cc.mta");YAHOO.cc.mta.parse_success=function(a){console.log(a);var c=new RDFQuery(a);var b=c.query2(YAHOO.cc.mta.MTA_INFO);console.log(b);c.walk2(b,{action:function(f){if(f.offer==document.referrer||f.material==document.referrer){if(f.disease!=undefined){var e="Your use of the material is restricted to: <ul><li>"+f.disease+"</li></ul>";YAHOO.util.Dom.get("requirement-restricted-field").innerHTML=e}if(f.offer_permits=="http://mta.sciencecommons.org/ns#ContractorAccess"){var d=document.createElement("li");YAHOO.util.Dom.addClass(d,"license");d.innerHTML="Contractors may access the material.";YAHOO.util.Dom.insertAfter(d,YAHOO.util.Dom.getLastChild(YAHOO.util.Dom.get("requirements")));console.log("permits contractor access")}}}})};YAHOO.cc.mta.parse_failure=function(a){};YAHOO.cc.mta.check_referrer=function(){if(document.referrer.match("^http://")){var a={success:YAHOO.cc.mta.parse_success,failure:YAHOO.cc.mta.parse_failure};YAHOO.cc.ld.load(document.referrer,"/scraper/triples",a)}};YAHOO.cc.mta.init=function(){loader=new YAHOO.util.YUILoader();YAHOO.cc.modules.add_definitions(loader,pathToModule("mta"));loader.require("cc.ld");loader.onSuccess=function(a){setTimeout(function(){YAHOO.cc.mta.check_referrer()},500)};loader.insert()};YAHOO.register("cc.mta",YAHOO.cc.mta,{version:"0.0.1",build:"1"});(function(){YAHOO.cc.mta.init()}());YAHOO.cc.mta.MTA_INFO={select:["offer","material","disease","offer_permits"],where:[{pattern:["?offer","http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://mta.sciencecommons.org/ns#Offer"]},{pattern:["?offer","http://mta.sciencecommons.org/ns#agreement",document.URL]},{where:[{pattern:["?material","http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://mta.sciencecommons.org/ns#Material"]},{pattern:["?material","http://mta.sciencecommons.org/ns#offer","?offer"]}],optional:true},{where:[{pattern:["?offer","http://creativecommons.org/ns#requires","?requirement"]},{pattern:["?requirement","http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://mta.sciencecommons.org/ns#DiseaseRequirement"]},{pattern:["?requirement","http://mta.sciencecommons.org/ns#disease","?disease"]}],optional:true},{where:[{pattern:["?offer","http://creativecommons.org/ns#permits","?offer_permits"]}],optional:true}]};