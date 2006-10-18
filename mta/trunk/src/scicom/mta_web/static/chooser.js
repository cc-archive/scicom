
var mta = new SciComMta();
var getEl = YAHOO.ext.Element.get;

getSettings = function() {

  // return an associative array of the current form settings
  result = new Array();

  for (key in SciComMta.prototype._field_order) {
     field_name = SciComMta.prototype._field_order[key];
     result[field_name] = document.forms["mta_selector_form"][field_name].value;
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
    value = document.forms["mta_selector_form"][field_name].value;

    // iterate over the options updating the visibility if necessary
    var options = document.forms["mta_selector_form"][field_name].options;

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

    var materialDetailsSubmit = function() {
    } // materialDetailsSubmit

    initChooser = function() {

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

	
	// initialize the material details dialog UI
	var dlg_buttons = [ {text:'OK', handler: materialDetailsSubmit,
			     isDefault: true},
    {text:'Cancel', handler: function(){materialDialog.hide();} } ];

	materialDialog = new YAHOO.widget.Dialog("material_details", { 
		modal:false, visible:false, width:"350px", 
		fixedcenter:true, constraintoviewport:true, 
		draggable:true, postmethod:"none" 
	    });
	materialDialog.cfg.queueProperty("buttons", dlg_buttons);

	materialDialog.render();
	// materialDialog.hide();

	// connect the link to the dialog
	YAHOO.util.Event.addListener("cmd_show_material_dlg", "click", 
				     function() {materialDialog.show();}
				     );

	// call updateMta to generate the information for the base MTA
	updateMta();

    } // initChooser
