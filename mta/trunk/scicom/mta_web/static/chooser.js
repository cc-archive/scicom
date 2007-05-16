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

  // get the current MTA selection settings
  var mta_settings = getSettings();

  // update our MTA
  mta.update_settings(mta_settings);

  // update the display information
  document.getElementById('mta_link').setAttribute('href', mta.get_uri());
  document.getElementById('mta_link').innerHTML = mta.get_name();

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
	Ext.Element.get("custom_url_info").setVisible(
			      event.getTarget().id == 'agr_custom', true);

    } // change_agr_type

    YAHOO.mta.pnl_welcome_activate = function(obj) {

	Ext.Element.get("offer_to_nonprofit").dom.checked = true;

    } // pnl_welcome_activate

    YAHOO.mta.pnl_type_activate = function(obj) {

	var get = Ext.Element.get;

	// set all active
	get("agr_scicom").dom.disabled = false;
	get("agr_ubmta").dom.disabled = false;
	get("agr_sla").dom.disabled = false;
	get("agr_custom").dom.disabled = false;

	// filter out the list based on the provider and recipient
	if (get("offer_to_nonprofit").dom.checked) {
	    // offer to a non-profit
	    get("agr_scicom").dom.disabled = true;
	    get("agr_custom").dom.disabled = true;

	    get('agr_ubmta').dom.checked = true;

	}  else {
	    // general offer 
	    get("agr_ubmta").dom.checked = true;
	    get("agr_sla").dom.disabled = true;

	}

	// set the default

    } // pnl_type_activate


    YAHOO.mta.get_offer_name = function() {

	var get = Ext.Element.get;

	// convenience function to return the offer name for the current offer
	if (get("agr_sla").dom.checked) {
	    // sla
	    return "SLA"
	} else if (get("agr_ubmta").dom.checked) {
	    // ubmta
	    return "UBMTA";
	} else if (get("agr_custom").dom.checked) {
	    // custom
	    return "Custom";
	} else if (get("agr_scicom").dom.checked) {
	    // science commons
	    // return the fully name here
	    return "Science Commons";
	}

    } // get_offer_name

    YAHOO.mta.get_offer_target = function() {
	// convenience function to return the target for the current offer
	// returns true for public, false for non-profit only

	return Ext.Element.get("offer_to_all").dom.checked;

    } // get_offer_name

    YAHOO.mta.update_metadata = function() { 
    } // update_metadata

    YAHOO.mta.remove_offer = function(offer_name) {

	// find the offer to remove
	for (var i = 0; i < YAHOO.mta.offer_list.length; i++) {
	    if (YAHOO.mta.offer_list[i].id == offer_name) {

		// remove this offer
		offer = YAHOO.mta.offer_list[i];
		offer.hide(true);
		YAHOO.mta.offer_list.pop(offer);
		offer.destroy();
		return;
	    }

	} // for each offer...

    } // remove offer

    YAHOO.mta.finish_offer = function() {
	
	var agr_name = YAHOO.mta.get_offer_name();
	var offer_to_public = YAHOO.mta.get_offer_target();
	var mod_name = agr_name + "_" + offer_to_public;

	// create a "module" to contain the offer
	var new_offer = new YAHOO.widget.Module(mod_name);
	new_offer.setHeader(agr_name + '<span class="delete_offer" onclick="YAHOO.mta.remove_offer(\'' + mod_name + '\');">X</span>'); 
	new_offer.setBody(" to " + (offer_to_public ? "the public"
						 : "non-profit institutions") );
	new_offer.render("offer_container");
	new_offer.show();

	// store the URI, etc
	// XXX

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
	    YAHOO.mta.dlg_offer.btn_back.setDisabled(
               (YAHOO.mta.dlg_offer.panel_history.length == 0) 
						     );

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

	    var next_panel = "";
	    if (current == "welcome") {
		next_panel = "agreement_type";
	    } else if (current == "agreement_type") {
		// check the agreement type and determine if we're done

		if (get("agr_sla").dom.checked) {
		    // sla
		    next_panel = "finish";
		} else if (get("agr_ubmta").dom.checked) {
		    // ubmta
		    next_panel = "finish";
		} else if (get("agr_custom").dom.checked) {
		    // custom
		    next_panel = "finish";
		} else if (get("agr_scicom").dom.checked) {
		    // science commons
		    next_panel = "scicom_chooser";
		}

	    } else if (current == "finish") {
		// finish the offer creation process
		YAHOO.mta.finish_offer();
		dialog.getLayout().getRegion("center").remove(current);
		YAHOO.mta.dlg_offer.hide();
		return;
	    } else {
		// all others go to the finish next
		next_panel = "finish";
	    }

	    // store the current panel in the history
	    dialog.panel_history.push(current);

	    // show the next panel
	    dialog.getLayout().beginUpdate();
	    dialog.getLayout().getRegion("center").remove(current);
	    dialog.getLayout().add("center", dialog.wiz_panels[next_panel]);
	    dialog.getLayout().getRegion("center").showPanel(next_panel);
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


	Ext.Element.get("agr_ubmta").addListener("change", 
						 YAHOO.mta.change_agr_type);
	Ext.Element.get("agr_sla").addListener("change", 
						 YAHOO.mta.change_agr_type);
	Ext.Element.get("agr_scicom").addListener("change", 
						 YAHOO.mta.change_agr_type);
	Ext.Element.get("agr_custom").addListener("change", 
						 YAHOO.mta.change_agr_type);

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

	if (!description || !provider) {
	    // show error message
	    Ext.MessageBox.alert('Error', 'Please enter the Provider and Description.');
	    return false;
	}

	// make the async call to generate a URI
	req_url = "/material/add?description=" + description;
	req_url += "&provider=" + provider;

	var transaction = YAHOO.util.Connect.asyncRequest("GET", req_url,
				   YAHOO.mta.generate_material_callback, null);

    } // generate_material_uri

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


	// initialize the stack of offers
	YAHOO.mta.offer_list = new Array();

	// call updateMta to generate the information for the base MTA
	updateMta();

    } // initChooser

YAHOO.util.Event.onDOMReady(YAHOO.mta.init); 