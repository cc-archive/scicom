// this is an example of application-specific code for a web page containing the MTA chooser.

onOfferEvent = function(type, args, me) { 
    var offer = args[0];
    var container = document.getElementById("offers");
    
    var offerdiv = document.createElement("div");    
    offerdiv.setAttribute('style', 'border: 1px; border-style: solid; padding: 5px');
    container.appendChild(offerdiv);
    
    var metadata = document.createElement("div");
    metadata.setAttribute('style', 'border: 1px; border-style: solid; padding: 5px');
    metadata.innerHTML = offer.get_metadata();
    offerdiv.appendChild(metadata);
    
    // Display all the offer properties
    var parameters = document.createElement("div");
    var offer_info = offer.get_info();
    parameters.setAttribute('style', 'border: 1px; border-style: solid; padding: 5px');
    for (var prop in offer_info) {
	var textnode = document.createTextNode(prop + ": " + offer_info[prop]);
	parameters.appendChild(textnode);
	parameters.appendChild(document.createElement('br'));
    }
    offerdiv.appendChild(parameters);
    
};

// arrange for onOfferEvent to be called when an offer is complete.
offerEvent.subscribe(onOfferEvent, document);

// enable the add offer button
document.getElementById("button").disabled = false;
