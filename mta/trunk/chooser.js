
var mta = new SciComMta();
var mta_info_visible = false;

getSettings = function() {

  // return an associative array of the current form settings
  result = new Array();
  form_fields = ["field", "scaling"];

  for (key in SciComMta.prototype._field_order) {
     field_name = SciComMta.prototype._field_order[key];
//alert(field_name);
//alert(document.forms["mta_selector_form"][field_name].length);
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

  if (!mta_info_visible) {
     // show the resulting MTA
     var el = YAHOO.ext.Element.get('results');
     el.setVisible(true, true);
     // el.toggle(/*fade*/true);

     mta_info_visible = true;
  } // if not visible...
} // updateMta
