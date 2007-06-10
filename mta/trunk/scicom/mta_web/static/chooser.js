YAHOO.namespace("mta");

var mta = new SciComMta();
var getEl = Ext.Element.get;

getSettings = function() {

  // return an associative array of the current form settings
  result = new Array();

  for (key in SciComMta.prototype._field_order) {
     field_name = SciComMta.prototype._field_order[key];
     element = document.getElementById(field_name);
     if (element) result[field_name] = element.value;
  }
// alert(result);
  return result;

} // getSettings

updateMta = function() {

  // determine the selected MTA and update the link and metadata
    return;
  // get the current MTA selection settings
  var mta_settings = getSettings();

  // update our MTA
  mta.update_settings(mta_settings);

  // update the display information
  // document.getElementById('mta_link').setAttribute('href', mta.get_uri());
  // document.getElementById('mta_link').innerHTML = mta.get_name();

  document.getElementById("metadata").innerHTML = mta.get_metadata();

} // updateMta

update_field = function(field_name) {

    // get the field value
    value = document.getElementById(field_name).value;

    // iterate over the options updating the visibility if necessary
    var options = document.getElementById(field_name).options;

    for (i = 0; i < options.length; i++) {
	var option = options.item(i);
	var detail_element = getEl([field_name, option.value, "detail"].
				   join("_"));

	if (option.value == value) {
	    // this value is selected; show it
	    detail_element.setStyle("display", "block");
	    detail_element.show(true);
	} else {
	    // make sure it's hidden...
	    if (detail_element.isVisible()) {
		detail_element.hide(true);
		detail_element.setStyle("display", "none");
	    }
	}

    } // for i...

} // update_field

YAHOO.mta.change_agr_type = function(event) {

	// show/hide the "custom" field as necessary
	//	Ext.Element.get("custom_url_info").setVisible(
	//	      event.getTarget().id == 'agr_custom', true);
} // change_agr_type

YAHOO.mta.pnl_welcome_activate = function(obj) {

    Ext.Element.get("offer_to_nonprofit").dom.checked = true;

} // pnl_welcome_activate

YAHOO.mta.pnl_type_activate = function(obj) {

    var get = Ext.Element.get;

    // update the enabled status of the agreements
    for (i = 0; i < YAHOO.mta.AGREEMENT_CLASSES.length; i++) {
	    
	agr_class = YAHOO.mta.AGREEMENT_CLASSES[i];
	agr_class.get_dom_element().setDisabled(
						!(agr_class.is_enabled(get("offer_to_nonprofit").dom.checked))
						);
	// mt add, try to fix check persistence problem
	agr_class.get_dom_element().checked = false;
    } // for each agreement class

} // pnl_type_activate


YAHOO.mta.get_selected_offer_type = function() {

    for (i = 0; i < YAHOO.mta.AGREEMENT_CLASSES.length; i++) {

	agr_class = YAHOO.mta.AGREEMENT_CLASSES[i];
	radiobutton = agr_class.get_dom_element();
	// +++ bug here, buttons that were checked and are now unchecked still have .checked tre
	// checking enabled only fixes some cases. 
	if (radiobutton.checked) {
	    return agr_class;	
	}

    } // for each agreement class

    return null;

} // get_selected_offer_type

YAHOO.mta.get_new_offer_name = function() {

    return YAHOO.mta.get_selected_offer_type().get_name();

} // get_new_offer_name

YAHOO.mta.get_new_offer_uri = function() {

    return YAHOO.mta.get_selected_offer_type().get_uri();

} // get_new_offer_uri

YAHOO.mta.get_offer_target = function() {
    // convenience function to return the target for the current offer
    // returns true for public, false for non-profit only

    return Ext.Element.get("offer_to_all").dom.checked;

} // get_offer_name

YAHOO.mta.update_metadata = function() { 
	
    var mtrl_uri = document.getElementById("material_uri").value;
    var mtrl_name = document.getElementById("material_desc").value;
    var metadata = '<div xmlns:cc="http://creativecommons.org/ns#">The material <a href="' + mtrl_uri + '">' + 
    mtrl_name + '</a> is available under the following offers:<br/>\n<ul>\n';

    for (var i=0; i < YAHOO.mta.offer_list.length; i++) {

	offer = YAHOO.mta.offer_list[i];

	metadata = metadata + '<li><a rel="cc:agreement" href="' + 
	    offer.uri + '">' + offer.name + '</a> ' + offer.body.innerHTML + '</li>\n';

    } // for each agreement

    metadata = metadata + "</ul>\n</div>\n";

    // iterate over the offers
    document.getElementById("metadata").innerHTML = metadata;
    document.getElementById("metadata_preview").innerHTML = metadata;
	
} // update_metadata

YAHOO.mta.remove_offer = function(offer_name) {

    // find the offer to remove
    for (var i=0; i < YAHOO.mta.offer_list.length; i++) {
	if (YAHOO.mta.offer_list[i].id == offer_name) {

	    // remove this offer
	    offer = YAHOO.mta.offer_list[i];
	    offer.hide(true);
	    YAHOO.mta.offer_list.pop(offer);
	    offer.destroy();

	    YAHOO.mta.update_metadata();
	    return;
	}

    } // for each offer...

} // remove offer

YAHOO.mta.finish_offer = function() {
	
    var agr_name = YAHOO.mta.get_new_offer_name();
    var agr_uri = YAHOO.mta.get_new_offer_uri();
    var offer_to_public = YAHOO.mta.get_offer_target();
    var mod_name = agr_name + "_" + offer_to_public;

    // create a "module" to contain the offer
    var new_offer = new YAHOO.widget.Module(mod_name);
    new_offer.setHeader('<a href="' + agr_uri + '">' + agr_name + '</a><span class="delete_offer" onclick="YAHOO.mta.remove_offer(\'' + mod_name + '\');">X</span>'); 
    new_offer.setBody(" to " + (offer_to_public ? "the public"
						 : "non-profit institutions") );
    new_offer.render("offer_container");
    new_offer.show();

    // store the URI, etc
    new_offer.uri = agr_uri;
    new_offer.name = agr_name;

    // push the offer onto the stack
    YAHOO.mta.offer_list.push(new_offer);

    // update the metadata
    YAHOO.mta.update_metadata();

} // finish_offer
	    
YAHOO.mta.bind_events = function() {
    // bind widget events for the add offer dialog

} // bind_events

YAHOO.mta.add_offer = function(event) {
    
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
	    if (current == "welcome") {
		next_panel = dialog.wiz_panels["agreement_type"];
	    } else if (current == "agreement_type") {
		// check the agreement type and determine if we're done
		if (YAHOO.mta.get_selected_offer_type().has_info_panel()) {
		    next_panel = YAHOO.mta.get_selected_offer_type().get_info_panel();
		} else {
		    next_panel = dialog.wiz_panels['finish'];
		}

	    } else if (current == "finish") {
		// finish the offer creation process
		YAHOO.mta.finish_offer();
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
	YAHOO.mta.dlg_offer.wiz_panels['welcome'] = 
	    new Ext.ContentPanel('welcome');
	YAHOO.mta.dlg_offer.wiz_panels['welcome'].addListener('activate',
					  YAHOO.mta.pnl_welcome_activate);
	
	YAHOO.mta.dlg_offer.wiz_panels['agreement_type'] = 
	    new Ext.ContentPanel('agreement_type');
	YAHOO.mta.dlg_offer.wiz_panels['agreement_type'].addListener('activate',
					  YAHOO.mta.pnl_type_activate);

	// add the selectors for each agreement type
	for (i = 0; i < YAHOO.mta.AGREEMENT_CLASSES.length; i++) {

	    agr_radio = YAHOO.mta.AGREEMENT_CLASSES[i].get_dom_element();
	    agr_radio.render("agreement_type");
	    agr_radio.addListener("change", YAHOO.mta.change_agr_type);

	} // for each class

	YAHOO.mta.dlg_offer.wiz_panels['scicom_chooser'] = 
	    new Ext.ContentPanel('scicom_chooser');
	YAHOO.mta.dlg_offer.wiz_panels['finish'] = 
	    new Ext.ContentPanel('finish');

    } // if dialog not created

    // set the initial panel
    var layout = YAHOO.mta.dlg_offer.getLayout();
    layout.beginUpdate();
    layout.add('center', YAHOO.mta.dlg_offer.wiz_panels['welcome']);
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
	var description = document.getElementById("material_desc").value;
	var provider = document.getElementById("material_provider").value;
	var provider_url = document.getElementById("material_provider_url").value;
	var provider_nonprofit = document.getElementById("nonprofit_provider").value;

	if (!description || !provider) {
	    // show error message
	    Ext.MessageBox.alert('Error', 'Please enter the Provider and Description.');
	    return false;
	}

	// make the async call to generate a URI
	req_url = "/material/add?description=" + description;
	req_url += "&provider=" + provider;
	req_url += "&provider_url=" + provider_url;
	req_url += "&provider_nonprofit=" + provider_nonprofit;

	var transaction = YAHOO.util.Connect.asyncRequest("GET", req_url,
				   YAHOO.mta.generate_material_callback, null);

    } // generate_material_uri

// temp
YAHOO.mta.generate_implementing_letter = function(event) {
    
    var description = document.getElementById("material_desc").value;
    var provider = document.getElementById("material_provider").value;

    // apparently don't need to urlencode fields, it gets done automatically
    url = "/implementing_letter?providerOrg=" + provider + "&materialDesc=" + description;
    window.open(url, "letter");

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
	updateMta();

        YAHOO.mta.init_help_text('material_provider_hl', 'material_provider_help');	
        YAHOO.mta.init_help_text('material_provider_url_hl', 'material_provider_url_help');	
        YAHOO.mta.init_help_text('material_desc_hl', 'material_desc_help');	
        YAHOO.mta.init_help_text('material_uri_hl', 'material_uri_help');	

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
