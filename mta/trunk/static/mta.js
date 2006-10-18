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

  // current settings
  this._settings = new Array();

  // ******************************************************************

  // get_param
  //   Return the current value of a specific field; the value is returned
  //   as a two-value array, containing ["Human Readable", "URI Piece"]
  //
  this.get_param = function(field_name) {
    return this._field_values[field_name][this._settings[field_name]];
  } // get_param

  // get_raw_param
  //   Return the current value of a specific field; the value is returned
  //   as the raw parameter value (ie, "yes", "no", etc).
  //
  this.get_raw_param = function(field_name) {
      return this._settings[field_name];
  } // get_raw_param

  // set_param
  //   Set the value for a field; the field value is specifed as the "raw"
  //   value.
  // 
  this.set_param = function(field_name, field_value) {
    this._settings[field_name] = field_value;
  } // set_param

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


  // get_metadata
  //    Generate the metadata for this MTA
  this.get_metadata = function() {


      /*
    <?xml version="1.0"?>
    <rdf:RDF xmlns="http://web.resource.org/cc/"
             xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
             xmlns:dc="http://purl.org/dc/elements/1.1/"
             xmlns:dcq="http://purl.org/dc/terms/">
    <TransferAgreement
    rdf:about="http://sciencecommons.org/mta/DiseaseRestricted-FixedTerm/2.5/">
      <requires rdf:resource="http://web.resource.org/cc/DiseaseField" />
      <permits rdf:resource="http://web.resource.org/cc/ScalingUp" />
      <requires rdf:resource="http://web.resource.org/cc/FixedTerm" />
      <permits rdf:resource="http://web.resource.org/cc/Retention" />
    </TransferAgreement>

    </rdf:RDF>
      */

      var result = new Array();

      // header
      result.push();
      result.push('<rdf:RDF xmlns="http://web.resource.org/cc/"');
      result.push('xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"');
      result.push('xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"');
      result.push('xmlns:dc="http://purl.org/dc/elements/1.1/"');
      result.push('xmlns:dcq="http://purl.org/dc/terms/">');

      // agreement
      result.push('<TransferArgreement rdf:about="' + this.get_uri() + '">');

      // field of research
      var mta_field = this.get_raw_param("field");
      if (mta_field == "disease") {
	  result.push("disease");
      } else
	  if (mta_field == "protocol") {
	      result.push("protocol");
	  }

      // scaling
      if (this.get_raw_param("scaling") == "yes") {
	  // allows scaling up
	  result.push('<permits rdf:resource="http://web.resource.org/cc/ScalingUp" />');
      } else {
	  // scaling up prohibited
	  result.push('<prohibits rdf:resource="http://web.resource.org/cc/ScalingUp" />');
      }

      // term
      if (this.get_raw_param("term") == "fixed") {
	  result.push('<requires rdf:resource="http://web.resource.org/cc/FixedTerm" />');
      }

      // retention
      if (this.get_raw_param("retain") == "yes") {
	  // permits material retention
	  result.push('<permits rdf:resource="http://web.resource.org/cc/Retention" />');
      } else {
	  // prohibits material retention
	  result.push('<prohibits rdf:resource="http://web.resource.org/cc/Retention" />');
      }

      // publication

      result.push("</TransferAgreement>");
      result.push("");
      result.push("</rdf:RDF>");

      return result.join("\n");

      result.push(this.get_uri());

      for (i=0; i < this._field_order.length; i++) {
	  result.push(this.get_param(this._field_order[i]));
      }


  } // get_metadata


} // SciComMta

// specify the order for fields in constructing the URI and Name
SciComMta.prototype._field_order = ["field", "scaling", 
				    "term", "retain", "publication"];

