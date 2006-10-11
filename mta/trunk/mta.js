// SciComMta
// 
// 

SciComMta = function() {

  // MTA Generation Control Structures
  this._CURRENT_VERSION = "1.0";
  this._BASE_URI = "http://mta.sciencecommons.org/";

  // this._field_order = ["field", "scaling", "term", "retain", "publication"];
  this._field_values = new Array();
  
  // parameter: field
  this._field_values['field'] = new Array();
  this._field_values['field']['all'] = ['', ''];
  this._field_values['field']['disease'] = ['Disease Field', 'Disease'];
  this._field_values['field']['protocol'] = ['Research Protocol', 'Protocol'];

  // parameter: scaling
  this._field_values['scaling'] = new Array();
  this._field_values['scaling']['yes'] = ['', ''];
  this._field_values['scaling']['no']  = ['No Scaling', 'NoScaling'];

  // parameter: term
  this._field_values['term'] = new Array();
  this._field_values['term']['variable'] = ['', ''];
  this._field_values['term']['fixed'] = ['Fixed Term', 'FixedTerm'];

  // parameter: retain
  this._field_values['retain'] = new Array();
  this._field_values['retain']['yes'] = ['', ''];
  this._field_values['retain']['no']  = ['No Retention', 'NoRetention'];

  // parameter: publication
  this._field_values['publication'] = new Array();
  this._field_values['publication']['yes'] = ['', ''];
  this._field_values['publication']['no'] = ['No Publication', 'NoPublication'];

  // ******************************************************************

  this.get_param = function(field_name) {
    return this._field_values[field_name][this._settings[field_name]];
  }

  this.set_param = function(field_name, field_value) {
    this._settings[field_name] = field_value;
  } // set_param

  // current settings
  this._settings = new Array();

  // update_settings
  //   Update the current settings for this MTA
  //
  this.update_settings = function(new_settings) {
     this._settings = new_settings;
  } // update_settings



  // get_uri
  //   Generate the URI for the currently selected MTA
  //
  this.get_uri = function() {

     var uri_pieces = new Array();
     uri_pieces.push("Base");

     // determine the pieces for our new URI
     for (i=0; i < this._field_order.length; i++) {
        if (this._settings[this._field_order[i]]) {

           value = this.get_param(this._field_order[i])[1];
           if (value) uri_pieces.push(value);
        }
     }

     return this._BASE_URI + uri_pieces.join("-") + "/" + this._CURRENT_VERSION;
  } // get_uri



  // get_name
  //   Generate the Agreement name for the currently selected MTA
  // 
  this.get_name = function() {

     var uri_pieces = new Array();
     // uri_pieces.push("Base");

     // determine the pieces for our new URI
     for (i=0; i < this._field_order.length; i++) {
        if (this._settings[this._field_order[i]]) {

           value = this.get_param(this._field_order[i])[0];
           if (value) uri_pieces.push(value);
        }
     }

     return "Science Commons " + uri_pieces.join("-") + " " +  this._CURRENT_VERSION;
  } // get_name


} // SciComMta

// specify the order for fields in constructing the URI and Name
SciComMta.prototype._field_order = ["field", "scaling", 
				    "term", "retain", "publication"];

