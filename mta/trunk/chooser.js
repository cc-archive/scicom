
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
