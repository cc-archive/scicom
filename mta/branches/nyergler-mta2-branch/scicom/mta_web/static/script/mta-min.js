function pathToModule(o){if(!o){throw ("Missing or null parameter supplied.")}var q=document.getElementsByTagName("script");var n=q.length;var m;var k;var i=null;var p,r,l;for(m=0;m<n;++m){p=q[m];r=p.src;if(r){l=r.lastIndexOf(o+".js");if(l!=-1&&(!l||r.charAt(l-1)==="/"||r.charAt(l-1)==="\\")){i=r.slice(0,l);break}}}if(!i){throw ("No Module called '"+o+"' was found.")}return i}function addScript(f){var e=document.getElementsByTagName("head")[0],d=document.createElement("script");e.appendChild(d);d.setAttribute("type","text/javascript");d.setAttribute("src",f);return}YAHOO.namespace("cc.mta");YAHOO.cc.mta.parse_success=function(e){var f=new RDFQuery(e);var d=f.query2(YAHOO.cc.mta.MTA_INFO);f.walk2(d,{action:function(a){if(a.offer==document.referrer||a.material==document.referrer){if(a.disease!=undefined){var b="Your use of the material is restricted to: <ul><li>"+a.disease+"</li></ul>";YAHOO.util.Dom.get("requirement-restricted-field").innerHTML=b}if(a.offer_permits=="http://mta.sciencecommons.org/ns#ContractorAccess"){var c=document.createElement("li");YAHOO.util.Dom.addClass(c,"license");c.innerHTML="Contractors may access the material.";YAHOO.util.Dom.insertAfter(c,YAHOO.util.Dom.getLastChild(YAHOO.util.Dom.get("requirements")))}}}})};YAHOO.cc.mta.parse_failure=function(b){};YAHOO.cc.mta.check_referrer=function(){if(document.referrer.match("^http://")){var b={success:YAHOO.cc.mta.parse_success,failure:YAHOO.cc.mta.parse_failure};YAHOO.cc.ld.load(document.referrer,"/scraper/triples",b)}};YAHOO.register("cc.mta",YAHOO.cc.mta,{version:"0.0.1",build:"1"});YAHOO.util.Event.onDOMReady(YAHOO.cc.mta.check_referrer);YAHOO.cc.mta.MTA_INFO={select:["offer","material","disease","offer_permits"],where:[{pattern:["?offer","http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://mta.sciencecommons.org/ns#Offer"]},{pattern:["?offer","http://mta.sciencecommons.org/ns#agreement",document.URL]},{where:[{pattern:["?material","http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://mta.sciencecommons.org/ns#Material"]},{pattern:["?material","http://mta.sciencecommons.org/ns#offer","?offer"]}],optional:true},{where:[{pattern:["?offer","http://creativecommons.org/ns#requires","?requirement"]},{pattern:["?requirement","http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://mta.sciencecommons.org/ns#DiseaseRequirement"]},{pattern:["?requirement","http://mta.sciencecommons.org/ns#disease","?disease"]}],optional:true},{where:[{pattern:["?offer","http://creativecommons.org/ns#permits","?offer_permits"]}],optional:true}]};