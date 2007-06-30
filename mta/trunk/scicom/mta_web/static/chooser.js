YAHOO.namespace("mta");

// is this used?
var getEl = Ext.Element.get;

// set by html, we don't want to change it here.
//var MTA_iframe = false;  

YAHOO.mta.pnl_type_activate = function(obj) {

    var get = Ext.Element.get;

    // update the enabled status of the agreements
    for (i = 0; i < YAHOO.mta.AGREEMENT_CLASSES.length; i++) {
	    
	var agr_class = YAHOO.mta.AGREEMENT_CLASSES[i];
	var radiobutton = agr_class.get_dom_element();
// 	radiobutton.setDisabled(
// 	    !(agr_class.is_enabled(get("offer_to_nonprofit").dom.checked))
// 	);
	// mt add, try to fix check persistence problem
	radiobutton.setValue("off");
    } // for each agreement class

} // pnl_type_activate


YAHOO.mta.pnl_to_whom_activate = function(obj) {

    // get agreement type, and enable checkboxes accordingly.
    var agr_class = YAHOO.mta.get_selected_offer_type();
    var forprofit = agr_class.allowed(true);
    var nonprofit = agr_class.allowed(false);

    var forprofit_box = document.getElementById('offer_to_forprofit');
    var nonprofit_box = document.getElementById('offer_to_nonprofit');

    forprofit_box.disabled = !forprofit;
    nonprofit_box.disabled = !nonprofit;

    // not clear why we don't just skip this panel if there's only one choice
    // this isn't working for some unknown and no doubt stupid reason.
    if (!forprofit) {
	nonprofit_box.value = true;
    }
    if (!nonprofit) {
	forprofit_box.value = true;
    }

} // pnl_to_whom_activate


YAHOO.mta.get_selected_offer_type = function() {

    for (i = 0; i < YAHOO.mta.AGREEMENT_CLASSES.length; i++) {

	var agr_class = YAHOO.mta.AGREEMENT_CLASSES[i];
	var radiobutton = agr_class.get_dom_element();
	if (radiobutton.checked) {
	    return agr_class;	
	}
    } // for each agreement class
    return null;
} // get_selected_offer_type


// currently unused, but maybe will be useful
YAHOO.mta.get_offer_target = function() {
    // convenience function to return the target for the current offer
    // returns true for public, false for non-profit only

    return Ext.Element.get("offer_to_all").dom.checked;

} // get_offer_name

YAHOO.mta.update_metadata = function() { 
	
    // constant, we don't have to really make this each time
    var template = new Ext.Template(
	'<div xmlns:cc="http://creativecommons.org/ns# xmlns:sc="http://sciencecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">\n' +
	    '<div class=sc:Material about="{material_uri}">' +
	    'The material <a href="{material_uri}">{material_description}</a>' +
	    ' is available from <a href="{provider_url}">{provider_name}</a> under the following offers:<br/>\n<ul>\n');


    var info = YAHOO.mta.agreement_info();
    var metadata = template.apply(info);

    // iterate over the offers
    for (var i=0; i < YAHOO.mta.offer_list.length; i++) {
	var offer = YAHOO.mta.offer_list[i];
	metadata = metadata + offer.get_metadata();
    } // for each offer

    metadata = metadata + "</ul>\n</div>\n</div>\n";

    document.getElementById("metadata").innerHTML = metadata;
    document.getElementById("metadata_preview").innerHTML = metadata;
	
} // update_metadata

YAHOO.mta.remove_offer = function(offer_id) {

    // find the offer to remove
    for (var i=0; i < YAHOO.mta.offer_list.length; i++) {
	if (YAHOO.mta.offer_list[i].offer_id == offer_id) {

	    // remove this offer
	    var offer = YAHOO.mta.offer_list[i];
	    offer.module.hide(true);
	    YAHOO.mta.offer_list.splice(i, 1); // remove offer from array
	    offer.module.destroy();

	    YAHOO.mta.update_metadata();
	    return;
	}

    } // for each offer...

} // remove offer

var current_offer;

// current_offer is set in the dialog
YAHOO.mta.finish_offer = function() {

    // push the offer onto the stack
    YAHOO.mta.offer_list.push(current_offer);

    // update the metadata
    YAHOO.mta.update_metadata();

    // create a "module" to contain the offer
    var agr_name = current_offer.get_name();

    var info = current_offer.get_info();

    var module = new YAHOO.widget.Module('offer' + current_offer.offer_id);
    module.setHeader(agr_name + " offer" +
		     '<span class="delete_offer" onclick="YAHOO.mta.remove_offer(\'' + current_offer.offer_id + '\');">X</span>'); 

    var template = new Ext.Template(
	'<ul><li><a href="{agreement_uri}" target="deed">Deed</a>' +
	    '<li><a href="{implementing_uri}" target="letter">Implementing letter (PDF)</a>' +
	    '<li><a href="{legal_uri}" target="legal">Legal code</a></ul>' );
    
    var body = template.apply(info);

    current_offer.module = module;

    module.setBody(body);
    module.render("offer_container");
    module.show();
    
} // finish_offer
	    
// finish offer, iframe version
YAHOO.mta.finish_offer_iframe = function() {

    offerEvent.fire(current_offer);
    
}

YAHOO.mta.write_cookie = function() {

    createCookie("provider_name", document.getElementById("material_provider").value, 7);
    createCookie("provider_url",  document.getElementById("material_provider_url").value, 7);
    createCookie("provider_address",  document.getElementById("material_provider_address").value, 7);
}

YAHOO.mta.read_cookie = function() {
    
    var v = readCookie("provider_name");
    if (v != null) {
	document.getElementById("material_provider").value = v;
    }
    v = readCookie("provider_url");
    if (v != null) {
	document.getElementById("material_provider_url").value = v;
    }
    v = readCookie("provider_address");
    if (v != null) {
	document.getElementById("material_provider_address").value = v;
    }

}


YAHOO.mta.add_offer = function(event) {
    
    // good a place as any.
    if (!MTA_iframe) {
	YAHOO.mta.write_cookie();
    }

    // lazy initialize the add wizard
    if (!YAHOO.mta.dlg_offer) {

	// attempt to move dialog to main window...god knows if this will work
	if (MTA_iframe) {
	    var dialog = document.getElementById("add-offer-dlg");
	    dialog.parent = window.top.document;
	}

	YAHOO.mta.dlg_offer = new Ext.LayoutDialog("add-offer-dlg", {
	    modal:true,
	    width:450,
	    height:300,
	    shadow:true,
	    minWidth:300,
	    minHeight:300,
	    closable:false,
	    collapsible:false,
	    resizable:false,
	    proxyDrag: true,
	    center: {
		autoScroll:true,
		preservePanels:true,
	    }
	});
	YAHOO.mta.dlg_offer.addKeyListener(27, YAHOO.mta.dlg_offer.hide, YAHOO.mta.dlg_offer);

	YAHOO.mta.dlg_offer.update_buttons = function() {

	    // disable/enable the back button
	    YAHOO.mta.dlg_offer.btn_back.
   	      setDisabled((YAHOO.mta.dlg_offer.panel_history.length == 0));

	    // update the next/finish label
	    
	    if (YAHOO.mta.dlg_offer.getLayout().
		  getRegion("center").getActivePanel().getId() == "finish") {

		YAHOO.mta.dlg_offer.btn_next.setText("Finish");

	    } else {
		YAHOO.mta.dlg_offer.btn_next.setText("Next");
	    }

	} // update_buttons

	YAHOO.mta.dlg_offer.on_back = function(context) {
	    
	    dialog = YAHOO.mta.dlg_offer;
	    last_panel = dialog.panel_history.pop();
	    
	    current = dialog.getLayout().
	       getRegion("center").getActivePanel().getId();

	    // show the next panel
	    dialog.getLayout().beginUpdate();
	    dialog.getLayout().getRegion("center").remove(current);
	    dialog.getLayout().add("center", dialog.wiz_panels[last_panel]);
	    dialog.getLayout().getRegion("center").showPanel(last_panel);
	    dialog.getLayout().endUpdate();


	    // update the back button
	    YAHOO.mta.dlg_offer.update_buttons();

	} // on_back
	

	YAHOO.mta.dlg_offer.on_next = function(context) {

	    var get = Ext.Element.get;

	    dialog = YAHOO.mta.dlg_offer;

	    // determine the next panel to display
	    current = dialog.getLayout().
	    getRegion("center").getActivePanel().getId();

	    var next_panel = null;
	    if (current == "agreement_type") {

		next_panel = dialog.wiz_panels["to_whom"];

	    } else if (current == "to_whom") {
		// check the agreement type and determine if we're done
		// +++ make sure user checked something!
		current_offer = new (YAHOO.mta.get_selected_offer_type().constructor)();
		current_offer.uniquify();

		if (current_offer.has_info_panel()) {
		    next_panel = current_offer.get_info_panel();
		} else {
		    next_panel = dialog.wiz_panels['finish'];
		}

		// +++ TEMP for debugging, let me see this pupply.
		//		next_panel = dialog.wiz_panels['scicom_chooser'];
	    } else if (current == "finish") {
		// finish the offer creation process
		if (MTA_iframe) {
    		    YAHOO.mta.finish_offer_iframe();
		}
		else {
    		    YAHOO.mta.finish_offer();
		}
		dialog.getLayout().getRegion("center").remove(current);
		YAHOO.mta.dlg_offer.hide();
		return;
	    } else {
		// all others go to the finish next
		next_panel = dialog.wiz_panels["finish"];
	    }
 
	    // store the current panel in the history
	    dialog.panel_history.push(current);

	    // show the next panel
	    dialog.getLayout().beginUpdate();
	    dialog.getLayout().getRegion("center").remove(current);
	    dialog.getLayout().add("center", next_panel);
	    dialog.getLayout().getRegion("center").showPanel(next_panel.id);
	    dialog.getLayout().endUpdate();

	    // update the back button
	    YAHOO.mta.dlg_offer.update_buttons();

	} // on_next
	
	// dialog control buttons
	YAHOO.mta.dlg_offer.addButton('Cancel', 
					  YAHOO.mta.dlg_offer.hide, 
					  YAHOO.mta.dlg_offer);

        YAHOO.mta.dlg_offer.btn_back = 
	    YAHOO.mta.dlg_offer.addButton('Back', 
					  YAHOO.mta.dlg_offer.on_back, 
					  YAHOO.mta.dlg_offer);
	YAHOO.mta.dlg_offer.btn_back.disable();

	YAHOO.mta.dlg_offer.btn_next = 
            YAHOO.mta.dlg_offer.addButton('Next', 
					  YAHOO.mta.dlg_offer.on_next,
					  YAHOO.mta.dlg_offer);

                
	// create the page panels
	YAHOO.mta.dlg_offer.wiz_panels = new Array();

	
	YAHOO.mta.dlg_offer.wiz_panels['agreement_type'] = 
	    new Ext.ContentPanel('agreement_type');
	YAHOO.mta.dlg_offer.wiz_panels['agreement_type'].addListener('activate',
					  YAHOO.mta.pnl_type_activate);

	// add the selectors for each agreement type
	for (i = 0; i < YAHOO.mta.AGREEMENT_CLASSES.length; i++) {

	    agr_radio = YAHOO.mta.AGREEMENT_CLASSES[i].get_dom_element();
	    agr_radio.render("agreement_type");
//	    agr_radio.addListener("change", YAHOO.mta.change_agr_type);

	} // for each class

	// to_whom panel

	YAHOO.mta.dlg_offer.wiz_panels['to_whom'] = 
	    new Ext.ContentPanel('to_whom');
	YAHOO.mta.dlg_offer.wiz_panels['to_whom'].addListener('activate',
							       YAHOO.mta.pnl_to_whom_activate);


	YAHOO.mta.dlg_offer.wiz_panels['finish'] = 
	    new Ext.ContentPanel('finish');

    } // if dialog not created

    // set the initial panel
    var layout = YAHOO.mta.dlg_offer.getLayout();
    layout.beginUpdate();
    layout.add('center', YAHOO.mta.dlg_offer.wiz_panels['agreement_type']);
    layout.endUpdate();

    // reset the page history
    YAHOO.mta.dlg_offer.panel_history = new Array();

    // update the buttons
    YAHOO.mta.dlg_offer.update_buttons();

    // show the dialog
    YAHOO.mta.dlg_offer.show();

} // YAHOO.mta.add_offer

YAHOO.mta.generate_material_callback = {
	success: function(result) {
	    document.getElementById("material_uri").value = result.responseText;
	}, // success

	failure: function(result) {
	    // XXX handle error case here
	}, // failure

	argument: [],

} // YAHOO.mta.generate_material_callback

YAHOO.mta.generate_material_uri = function(event) {

	// make sure we have a description and provider
    var info = YAHOO.mta.agreement_info();

    if (!info.material_description || !info.provider_name) {
	// show error message
	Ext.MessageBox.alert('Error', 'Please enter the Provider and Description.');
	return false;
    }

    // make the async call to generate a URI
    req_url = "/material/add?description=" + info.material_description;
    req_url += "&provider=" + info.provider_name;
    req_url += "&provider_url=" + info.provider_url;
    // +++ provider address?

    var transaction = YAHOO.util.Connect.asyncRequest("GET", req_url,
						      YAHOO.mta.generate_material_callback, null);

    } // generate_material_uri


// this should take care of most "reaching into the dom" functionality.
YAHOO.mta.agreement_info = function() {

    // in iframe case we have none of this information
    if (MTA_iframe) {
	return {};
    }

    var info =
    {"provider_name": document.getElementById("material_provider").value,
     "provider_url":  document.getElementById("material_provider_url").value,
     "provider_address": document.getElementById("material_provider_address").value,
     "material_description": document.getElementById("material_desc").value,
     "material_uri": document.getElementById("material_uri").value
    }
    return info
}

YAHOO.mta.init = function() {

    // initialize auto-complete for disease field restriction
    var dsMeSH = new YAHOO.widget.DS_XHR("/mesh/json",
	["Result", "Description", "LookupKey"]
					);
    var diseaseAutoComp = new YAHOO.widget.AutoComplete("field_disease",
	"field_disease_ac",
	dsMeSH);
    diseaseAutoComp.useIFrame = true;
    // diseaseAutoComp.forceSelection = true;
    diseaseAutoComp.typeAhead = true;

    diseaseAutoComp.formatResult = function(aResultItem, sQuery) {
	return aResultItem[0] + " (" + aResultItem[1] + ")";
    } // formatResult


    // initialize the add offer button
    new YAHOO.widget.Button("btn_add_offer", {onclick: {fn: YAHOO.mta.add_offer } });

    // initialize the material generator button
    new YAHOO.widget.Button("btn_generate_material_uri", 
			    { onclick: { fn: YAHOO.mta.generate_material_uri } });


    // temp
    new YAHOO.widget.Button("btn_implementing_letter",
			    { onclick: { fn: YAHOO.mta.generate_implementing_letter } });

    // initialize the stack of offers
    YAHOO.mta.offer_list = new Array();

    // call updateMta to generate the information for the base MTA
    // apparently dead? +++
    //	updateMta();

    YAHOO.mta.init_help_text('material_provider_hl', 'material_provider_help');	
    YAHOO.mta.init_help_text('material_provider_url_hl', 'material_provider_url_help');	
    YAHOO.mta.init_help_text('material_desc_hl', 'material_desc_help');	
    YAHOO.mta.init_help_text('material_uri_hl', 'material_uri_help');	

    if (!MTA_iframe) {
	YAHOO.mta.read_cookie();
    }

} // initChooser

// convenience function for creating help tool tips
// from scholars
YAHOO.mta.init_help_text = function(link_id, help_id) {

    // make sure we have an array to hold the list of panels
    if (!YAHOO.mta.help_panels) {
	YAHOO.mta.help_panels = new Array();
    }

    // create the new panel and position it
    var new_panel = new YAHOO.widget.Panel(help_id, 
{close: false, visible: false, draggable: false, width:200,
 effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.35} } ); 

    var link_xy = YAHOO.util.Dom.getXY(link_id);
    new_panel.cfg.setProperty('xy',[link_xy[0] + 15, link_xy[1]] );
    var item_idx = YAHOO.mta.help_panels.push(new_panel) - 1;

    YAHOO.mta.help_panels[item_idx].render();

    // connect the event handlers
    YAHOO.util.Event.addListener(link_id, "mouseover", 
				 function(e) {YAHOO.mta.help_panels[item_idx].show();});
   YAHOO.util.Event.addListener(link_id, "mouseout", 
				function(e) {window.setTimeout("YAHOO.mta.help_panels[" + item_idx + "].hide();", 500);});

    // disable clicks
    YAHOO.util.Event.addListener(link_id, 'click', function(e){YAHOO.util.Event.preventDefault(e);});

} // init_help_text


YAHOO.util.Event.onDOMReady(YAHOO.mta.init); 

// cookie utilities
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

// event for iframe
var offerEvent = new YAHOO.util.CustomEvent("offerEvent");
parent.document.offerEvent = offerEvent;
