YAHOO.namespace("mta");

// is this used?
var getEl = Ext.Element.get;

// set by containing html, we don't want to change it here.
//var MTA_embedded = false;  

YAHOO.mta.pnl_type_activate = function(obj) {

    var get = Ext.Element.get;

    // update the enabled status of the agreements (+++ this is a no-op)
    for (i = 0; i < YAHOO.mta.AGREEMENT_CLASSES.length; i++) {
	    
	var agr_class = YAHOO.mta.AGREEMENT_CLASSES[i];
	var radiobutton = agr_class.get_dom_element();
    } // for each agreement class

} // pnl_type_activate

YAHOO.mta.get_selected_offer_type = function() {

    for (i = 0; i < YAHOO.mta.AGREEMENT_CLASSES.length; i++) {

	var agr_class = YAHOO.mta.AGREEMENT_CLASSES[i];
	var radiobutton = agr_class.get_dom_element();
	if (radiobutton.getValue()) {
	    return agr_class;	
	}
    } // for each agreement class
    return null;
} // get_selected_offer_type


YAHOO.mta.update_metadata = function() { 
	
    // constant, we don't have to really make this each time
    var template = new Ext.Template(
	'<div xmlns:cc="http://creativecommons.org/ns#" xmlns:sc="http://sciencecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">\n' +
	    '<div class="sc:Material" about="{material_uri}">' +
	    'The material <a href="{material_uri}">{material_description}</a>' +
	    ' is available from <a rel="sc:provider" href="{provider_url}">{provider_name}</a> under the following offers:<br/>\n<ul>\n');


    var info = YAHOO.mta.agreement_info();
    var metadata = template.apply(info);

    // iterate over the offers
    for (var i=0; i < YAHOO.mta.offer_list.length; i++) {
	var offer = YAHOO.mta.offer_list[i];
	metadata = metadata + '\n<li>' +  offer.get_metadata() + '</li>';
    } // for each offer

    metadata = metadata + "</ul>\n</div>\n</div>\n";

    document.getElementById("metadata").value = metadata;  // innerHTML gets error in IE
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
	    '<li><a href="{letter_uri}" target="letter">Implementing letter (PDF)</a>' +
	    '<li><a href="{legalcode_uri}" target="legal">Legal code</a></ul>' );
    
    // special-case custom
    if (current_offer.class_id == 'custom') {
	template = new Ext.Template(
	    '<ul><li><a href="{agreement_uri}" target="deed">Deed</a></ul>');
    }

    var body = template.apply(info);

    current_offer.module = module;

    module.setBody(body);
    module.render("offer_container");
    module.show();
    YAHOO.mta.hide_dlg();
    
} // finish_offer
	    
// finish offer, embedded version
YAHOO.mta.finish_offer_embedded = function() {

    offerEvent.fire(current_offer);
    YAHOO.mta.hide_dlg();

}


YAHOO.mta.hide_dlg = function() {
    if (popup) {
	window.close();
    }
    else {
	YAHOO.mta.dlg_offer.hide();
    }
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


var popup = false;

YAHOO.mta.add_offer = function(event) {
    
    // good a place as any.
    if (!MTA_embedded) {
	YAHOO.mta.write_cookie();
    }

    // lazy initialize the add wizard
    if (!YAHOO.mta.dlg_offer) {

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
		preservePanels:true
	    }
	});
	YAHOO.mta.dlg_offer.addKeyListener(27, YAHOO.mta.hide_dlg, YAHOO.mta.dlg_offer);

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
	    
	    current_panel = dialog.getLayout().getRegion("center").getActivePanel();

	    // show the next panel
	    dialog.getLayout().beginUpdate();
	    dialog.getLayout().getRegion("center").remove(current_panel);
	    dialog.getLayout().add("center", last_panel);
	    dialog.getLayout().getRegion("center").showPanel(last_panel.getId());
	    dialog.getLayout().endUpdate();


	    // update the back button
	    YAHOO.mta.dlg_offer.update_buttons();

	} // on_back
	

	YAHOO.mta.dlg_offer.on_next = function(context) {

	    dialog = YAHOO.mta.dlg_offer;

	    // determine the next panel to display
	    current_panel = dialog.getLayout().getRegion("center").getActivePanel();
	    current_name = current_panel.getId();

	    if (current_panel.verify_panel_complete()) {
		next_panel_name = current_offer.get_next_panel(current_panel.getId());

		if (next_panel_name == null) {

		    // finish the offer creation process
		    if (MTA_embedded) {
    			YAHOO.mta.finish_offer_embedded();
		    }
		    else {
    			YAHOO.mta.finish_offer();
		    }
		    return;
		}

		// store the current panel in the history
		dialog.panel_history.push(current_panel);

		// show the next panel
		next_panel = dialog.wiz_panels[next_panel_name];
		dialog.getLayout().beginUpdate();
		dialog.getLayout().getRegion("center").remove(current_name);
		dialog.getLayout().add("center", next_panel);
		dialog.getLayout().getRegion("center").showPanel(next_panel.id);
		dialog.getLayout().endUpdate();

		// update the back button
		YAHOO.mta.dlg_offer.update_buttons();
	    }
	} // on_next
	
	// dialog control buttons
	YAHOO.mta.dlg_offer.addButton('Cancel', 
					  YAHOO.mta.hide_dlg, 
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
	YAHOO.mta.dlg_offer.wiz_panels = {};

	// *** agreement type panel

	panel = new Ext.ContentPanel('agreement_type');
	YAHOO.mta.dlg_offer.wiz_panels['agreement_type'] = panel;

	panel.addListener('activate', YAHOO.mta.pnl_type_activate);
	panel.verify_panel_complete = function () {
	    offer_type = YAHOO.mta.get_selected_offer_type();
	    if (offer_type == null) {
		Ext.MessageBox.alert('Error', 'Please choose an agreement type.');
		return false;
	    }
	    current_offer = new (offer_type.constructor)();
	    current_offer.uniquify();
	    return true;
	}

	panel.gather_info = function(result) { };   // see get_agreement_id

	// add the selectors for each agreement type
	for (i = 0; i < YAHOO.mta.AGREEMENT_CLASSES.length; i++) {

	    agr_radio = YAHOO.mta.AGREEMENT_CLASSES[i].get_dom_element();
	    agr_radio.render("agreement_type");

	} // for each class


	// *** for_whom panel
	
	panel = new Ext.ContentPanel('for_whom');
	YAHOO.mta.dlg_offer.wiz_panels['for_whom'] = panel;

	var for_whom_form =  new Ext.form.Form({
	    labelAlign: 'right',
            labelWidth: 200});
	for_whom_form.add(
	    new Ext.form.Radio({
		fieldLabel: "Recipient class",
		boxLabel : "All types of recipients",
		inputValue: 'all',
		checked: true,
		name : 'recipientType'
	    }), 

	    new Ext.form.Radio({
		boxLabel : "Offer to non-profits only",
		inputValue: 'nonProfit',
		name : 'recipientType'
	    }), 

	    new Ext.form.Radio({
		boxLabel : "Offer to for-profits only",
		inputValue: 'forProfit',
		name : 'recipientType'
	    })
	);

	for_whom_form.render(panel.getEl().child(".x-contents"));

	panel.verify_panel_complete = function (offer) {
	    return true;
	}

	panel.gather_info = function(result) {

	    // new style
	    var rawspecs = for_whom_form.getValues();
	    Ext.apply(result, rawspecs);
	}

	// *** finish panel

	panel = new Ext.ContentPanel('finish');
	YAHOO.mta.dlg_offer.wiz_panels['finish'] = panel;
	panel.verify_panel_complete = function(offer) { return true; };
	panel.gather_info = function(result) { };

	// *** logistics panel

	panel = new Ext.ContentPanel('logistics');
	YAHOO.mta.dlg_offer.wiz_panels['logistics'] = panel;

	var logistics_form = new Ext.form.Form({
	    labelAlign: 'right',
            labelWidth: 200});

	logistics_form.add(

	    new Ext.form.DateField({
		name: 'endDate',
		fieldLabel:'Termination date',
		width:175
	    }),

 	    new Ext.form.TextField({
                fieldLabel:'Transmittal Fee',
 		width:175,
 		name: 'transmittalFee'
 	    }) 
	);
	
	logistics_form.render(panel.getEl().child(".x-contents"));

	panel.verify_panel_complete = function (offer) {
	    return true;
	}

	panel.gather_info = function(result) {
	    var rawspecs = logistics_form.getValues();
 	    //  widgets don't return the right values, so massage them here
	    Ext.apply(result, rawspecs);
	}


	// *** custom panel

	panel = new Ext.ContentPanel('custom');
	YAHOO.mta.dlg_offer.wiz_panels['custom'] = panel;

	var custom_form = new Ext.form.Form({
	    labelAlign: 'right',
            labelWidth: 100});

	custom_form.add(

 	    new Ext.form.TextField({
                fieldLabel:'Custom agreement URL',
 		width:275,
 		name: 'custom_url'
 	    }) 
	);
	
	custom_form.render(panel.getEl().child(".x-contents"));

	panel.verify_panel_complete = function (offer) {
	    var url = custom_form.findField('custom_url').getValue();
	    if (!isUrl(url)) {
	    	Ext.MessageBox.alert('Error', 'Please enter a valid URL.');
		return false;
	    }
	    else {
		return true;
	    }
	}

	panel.gather_info = function(result) {
	    var rawspecs = custom_form.getValues();
 	    //  widgets don't return the right values, so massage them here
	    Ext.apply(result, rawspecs);
	}

	// *** SC info panel

	panel = new Ext.ContentPanel('sc_info');
	YAHOO.mta.dlg_offer.wiz_panels['sc_info'] = panel;

	var sc_form = new Ext.form.Form({
	    labelAlign: 'right',
            labelWidth: 200});

	var radios = [	    new Ext.form.Radio({
		fieldLabel: "Field of use",
		boxLabel : "All research uses",
		inputValue: 'all',
		name : 'fieldOfUse',
		checked : true
	    }), 

	    new Ext.form.Radio({
		boxLabel : "Restrict to disease",
		inputValue: 'disease',
		name : 'fieldOfUse'
	    }), 

	    new Ext.form.Radio({
		boxLabel : "All uses <i>except</i> disease",
		inputValue: 'notDisease',
		name : 'fieldOfUse'
	    }), 

	    new Ext.form.Radio({
		boxLabel : "Restrict to protocol",
		inputValue: 'protocol',
		name : 'fieldOfUse'
	    })
		     ];

	// There is an ext bug that prevents this from working, not fixed as of 1.1
	// I have a patch in the local version, see ext-all-debug.js, search for MT+++
	maparray(radios, function(radio) {
	    sc_form.add(radio);
	    radio.addListener('check', YAHOO.mta.update_use_field, sc_form);
	});

	// hold for later
	panel.fieldSpec =  
 	    new Ext.form.TextField({
                fieldLabel: 'Disease or protocol',
 		width: 175,
 		name: 'fieldSpec'
 	    });

	sc_form.add(

	    panel.fieldSpec,
	    
	    new Ext.form.Checkbox({
		name: 'scaleUpAllowed',
		fieldLabel: 'Is scaling up allowed?'
	    }),

	    new Ext.form.Checkbox({
		name: 'retentionAllowed',
		fieldLabel: 'Is retention of material allowed?'
	    })
	    
	);

	// set up auto complete +++
	// currently in YAHOO.mta.init...also see css stuff in chooser-scripts.html

	sc_form.render(panel.getEl().child(".x-contents"));

	panel.verify_panel_complete = function (offer) {
	    return true;
	}

	panel.gather_info = function(result) {
	    var rawspecs = sc_form.getValues();
 	    // widgets don't necessarily return the right values, so massage them here
	    Ext.apply(result, rawspecs);
	}
	

    } // if dialog not created

    // set the initial panel
    var layout = YAHOO.mta.dlg_offer.getLayout();
    layout.beginUpdate();
    var cp = layout.getRegion("center").getActivePanel();
    if (cp != null) {
	layout.getRegion("center").remove(cp);
    }
    layout.add('center', YAHOO.mta.dlg_offer.wiz_panels['agreement_type']);
    layout.endUpdate();

    // reset the page history
    YAHOO.mta.dlg_offer.panel_history = new Array();

    // update the buttons
    YAHOO.mta.dlg_offer.update_buttons();

    // show the dialog
    YAHOO.mta.dlg_offer.show();

} // YAHOO.mta.add_offer


var useFieldInitialized = false;
YAHOO.mta.init_use_field = function() {

    if (!useFieldInitialized) {
	var sc_panel = YAHOO.mta.dlg_offer.wiz_panels['sc_info'];
	var fieldEl = sc_panel.fieldSpec.getEl().dom;
	var acEl = document.createElement('div');
	// stupid javascript has insertBefore but no insertAfter
	fieldEl.parentNode.insertBefore(acEl, fieldEl.nextSibling);

	// NOTE: this will get errors on the embeddable chooser, unless the embedder implements
	// a proxy as described in the documentations.  It can't point to mta.sciencecommons.org
	// due to the ever-annoying browser security restrictions.
	var dsMeSH = new YAHOO.widget.DS_XHR("/mesh/json",
	    ["Result", "Description", "LookupKey"]
					    );
	var diseaseAutoComp = new YAHOO.widget.AutoComplete(fieldEl, acEl, dsMeSH);
// may need to turn this on for IE.
//    diseaseAutoComp.useIFrame = true;
	diseaseAutoComp.forceSelection = false;  // too aggressive
	diseaseAutoComp.useShadow = true;
	diseaseAutoComp.typeAhead = false;  // too aggressive

	diseaseAutoComp.formatResult = function(aResultItem, sQuery) {
	    return aResultItem[0] + " [" + aResultItem[1] + "]"
	}  

	// save it.
	sc_panel.fieldSpec.autoComp = diseaseAutoComp;

    }
}

YAHOO.mta.update_use_field = function(object) {
    var sc_panel = YAHOO.mta.dlg_offer.wiz_panels['sc_info'];
    var checkedValue = object.inputValue;
    var fieldEnabled = checkedValue == 'disease' || checkedValue == 'protocol' || checkedValue == 'notDisease';
    if (fieldEnabled) {
	sc_panel.fieldSpec.enable();
	YAHOO.mta.init_use_field();
	// for protocol, we don't want autocomplete at all, but there's no API for turning it off, so try to fake it.
	sc_panel.fieldSpec.autoComp.queryDelay = (checkedValue == 'protocol' ? 1000 : 0.5)
    }
    else {
	sc_panel.fieldSpec.setValue("");
	sc_panel.fieldSpec.disable();
    }
}

YAHOO.mta.generate_material_callback = {
	success: function(result) {
	    document.getElementById("material_uri").value = result.responseText;
	}, // success

	failure: function(result) {
	    // XXX handle error case here
	}, // failure

	argument: []

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

    // in embedded case we have none of this information
    if (MTA_embedded) {
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

    if (MTA_debug) {
	// initialize auto-complete for disease field restriction
	var dsMeSH = new YAHOO.widget.DS_XHR("/mesh/json",
	    ["Result", "Description", "LookupKey"]
					    );
	var diseaseAutoComp = new YAHOO.widget.AutoComplete("field_disease", "field_disease_ac", dsMeSH);
	//    diseaseAutoComp.useIFrame = true;
	// diseaseAutoComp.forceSelection = true;
	diseaseAutoComp.useShadow = true;
	diseaseAutoComp.typeAhead = true;

	diseaseAutoComp.formatResult = function(aResultItem, sQuery) {
	    return aResultItem[0] + " (" + aResultItem[1] + ")";
	}  
    }

    // initialize the add offer button
    new YAHOO.widget.Button("btn_add_offer", {onclick: {fn: YAHOO.mta.add_offer } });

    // initialize the material generator button
    new YAHOO.widget.Button("btn_generate_material_uri", 
			    { onclick: { fn: YAHOO.mta.generate_material_uri } });


    // initialize the stack of offers
    YAHOO.mta.offer_list = new Array();

    YAHOO.mta.init_help_text('material_provider_hl', 'material_provider_help');	
    YAHOO.mta.init_help_text('material_provider_url_hl', 'material_provider_url_help');	
    YAHOO.mta.init_help_text('material_provider_address_hl', 'material_provider_address_help');	
    YAHOO.mta.init_help_text('material_desc_hl', 'material_desc_help');	
    YAHOO.mta.init_help_text('material_uri_hl', 'material_uri_help');	

    if (!MTA_embedded) {
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

// Utility that I can't live without
maparray = function(array, proc) {
    for (i = 0; i < array.length; i++) {
	proc(array[i]);
    }
}

isUrl = function(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}

nonBlank = function(s) {
    return s != null && s != '';
}

// event for embedded
// this apparently fails in IE +++
var offerEvent = new YAHOO.util.CustomEvent("offerEvent");
var include_logistics = true;

// expose something without YAHOO in the name, for embeddable version
var add_offer = function(logistics) {
    include_logistics = logistics;
    YAHOO.mta.add_offer(null);
}

