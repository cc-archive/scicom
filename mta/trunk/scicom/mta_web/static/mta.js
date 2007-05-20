// Agreement Classes

// Base -- Prototype

function MtaClass() {

    this.class_id = 'basic';
    this.class_name = 'Basic Agreement';

    this.is_enabled = function(np_recipient) {
	// return true if this agreement is enabled for the source/recipient;
	// np_source and np_recipient are true if they are non-profit

	return true;
    };

    this.get_id = function() {
	// return the simple string identifier for this class
	return this.class_id;
    };

    this.get_name = function() {
	// return the human readable name for this class
	return this.class_name;
    };

    this.get_uri = function() {
	return 'http://example.com/mta/1.0/';
    };

    this.get_info_panel = function () {
	// if this class requires additional parameters, return the UI panel
	// otherwise return null

	return null;
    };

    this.get_dom_id = function() {

	return "agr_" + this.get_id();
    }; 

    this.get_dom_element = function() {

	if (!this._dom_element) {
	    // create the element
	    this._dom_element = new Ext.form.Radio({
		    boxLabel : this.get_name(),
		    name : 'agreement_type',
		    id : this.get_dom_id(),
		});
	} // if not previously created

	return this._dom_element;

    };
    
}; // MtaClass

function UbmtaClass() {

    this.class_id = 'ubmta';
    this.class_name = 'UBMTA';

    this.is_enabled = function(np_recipient) {
	// return true if this agreement is enabled for the source/recipient;
	// np_source and np_recipient are true if they are non-profit

	return np_recipient;
    };

}; // UbmtaClass
UbmtaClass.prototype = new MtaClass;

function SlaClass() {

    this.class_id = 'sla';
    this.class_name = 'SLA';

    this.is_enabled = function(np_recipient) {
	// return true if this agreement is enabled for the source/recipient;
	// np_source and np_recipient are true if they are non-profit

	return np_recipient;
    };

}; // SlaClass
SlaClass.prototype = new MtaClass;


function CustomMta() {

    this.class_id = 'custom';
    this.class_name = 'Custom Agreement';

    this.is_enabled = function(np_recipient) {
	// return true if this agreement is enabled for the source/recipient;
	// np_source and np_recipient are true if they are non-profit

	return !np_recipient;
    };

}; // SlaClass
CustomMta.prototype = new MtaClass;

// SciComMta
// 
// 

function SciComMta() {

  // MTA Generation Control Structures
  this._CURRENT_VERSION = "1.0";
  this._BASE_URI = "http://mta.sciencecommons.org/agreement/";

  // this._field_order = ["field", "scaling", "term", "retain", "publication"];
  this._field_order = ["field", "scaling", "term", "retain"];  
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

  // current settings
  this._settings = new Array();

    this.class_id = 'scicom';
    this.class_name = 'Science Commons';

    this.is_enabled = function(np_recipient) {
	// return true if this agreement is enabled for the source/recipient;
	// np_source and np_recipient are true if they are non-profit

	return !np_recipient;
    };

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
SciComMta.prototype = new MtaClass;


// specify the list of all available agreements
YAHOO.namespace('mta');
YAHOO.mta.AGREEMENT_CLASSES = [new UbmtaClass(), new SlaClass(),
			       new SciComMta(), new CustomMta()];

