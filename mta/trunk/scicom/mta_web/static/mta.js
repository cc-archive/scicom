// Agreement Classes

// Base -- Prototype

function MtaClass() {

    // override to true if you need to collect additional information
    this._has_info_panel = false;

    this.get_id = function() {
	// return the simple string identifier for this class
	return this.class_id;
    };

    this.get_name = function() {
	// return the human readable name for this class
	return this.class_name;
    };

    this.get_uri = function() {
	return 'http://mta.sciencecommons.org/mta/';
    };

    this.get_implementing_uri = function() {
	return null;
    }

    this.has_info_panel = function() {
	// return true if this class has an additional information panel
	return this._has_info_panel;
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
MtaClass.prototype.class_id = 'basic';
MtaClass.prototype.class_name = 'Basic Agreement';
MtaClass.prototype.is_enabled = function(np_recipient) {
    // return true if this agreement is enabled for the source/recipient;
    // np_source and np_recipient are true if they are non-profit

    // default behavior disables the class for (potentially) for-profit 
    return !np_recipient;
    };

function NonProfitMtaClass() {

    // this is a placeholder class in the heirarchy that get's the appropriate
    // "enabled" function for non-profit-only offers.

}
NonProfitMtaClass.prototype = new MtaClass;
NonProfitMtaClass.prototype.is_enabled = function(np_recipient) {
	// return true if this agreement is enabled for the source/recipient;
	// np_source and np_recipient are true if they are non-profit

	return np_recipient;
    };


function UbmtaClass() {

    this.get_uri = function() {
 	return 'http://mta.sciencecommons.org/mta/ubmta/';
    };

}; // UbmtaClass

UbmtaClass.prototype = new NonProfitMtaClass;
UbmtaClass.prototype.class_id = 'ubmta';
UbmtaClass.prototype.class_name = 'UBMTA';


function SlaClass() {

    this.get_uri = function() {
 	return 'http://mta.sciencecommons.org/mta/sla/';
    };

}; // SlaClass
SlaClass.prototype = new NonProfitMtaClass;
SlaClass.prototype.class_id = 'sla';
SlaClass.prototype.class_name = 'SLA';


function CustomMta() {


    this.get_uri = function() {

	return this._url_form.findField('agreement_url').getValue();
    }

    this._has_info_panel = true;
    this.get_info_panel = function() {
	
	if (this._info_panel) return this._info_panel;

	// the info panel was not previously created


	    this._url_form = new Ext.form.Form();

	    this._url_form.add(
		     new Ext.form.TextField({
			     fieldLabel: 'Agreement URL',
				 name: 'agreement_url',
				 width:175,
				 allowBlank:false
				 })
			 );

	this._info_panel = new Ext.ContentPanel("info_" + this.get_id(),
    {autoCreate:true,
     fitToFrame:true});
	this._url_form.render(this._info_panel.getEl());

	return this._info_panel;

    }; // get_info_panel

}; // CustomMta
CustomMta.prototype = new MtaClass;
CustomMta.prototype.class_id = 'custom';
CustomMta.prototype.class_name = 'Custom Agreement';


// SciComMta
// 
// 
function SciComMta() {

    this._has_info_panel = true;
    this.get_info_panel = function() {

	// see if we've created it previously
	if (this._info_panel) return this._info_panel;

	// we haven't, create now
	this._url_form = new Ext.form.Form({
		labelWidth:200});

	this._url_form.add(
			   new Ext.form.ComboBox({
				   fieldLabel:'Specify a field of use:',
				       forceSelection:true,
				       mode:'local',
				       displayField:'label',
				       store: new Ext.data.SimpleStore({
					       fields:['value', 'label'],
						   data:[['all', 'All Research Uses'],
							 ['disease', 'Disease Field of Use'],
							 ['protocol', 'Restricted Protocol']]
						   })
				       }),

			   new Ext.form.ComboBox({
				   fieldLabel:'Is Scaling Up allows?',
				       forceSelection:true,
				       mode:'local',
				       displayField:'label',
				       store: new Ext.data.SimpleStore({
					       fields:['value', 'label'],
						   data:[[true, 'Yes'],
							 [false,'No']]
						   })
				       }),

			   new Ext.form.ComboBox({
				   fieldLabel:'What is the duration of the permitted use?',
				       forceSelection:true,
				       displayField:'label',
				       mode:'local',
				       store: new Ext.data.SimpleStore({
					       fields:['value', 'label'],
						   data:[['completion', 'Until Completion'], 
							 ['fixed','Fixed Term']]
						   })
				       }),

			   new Ext.form.ComboBox({
				   fieldLabel:'Is the recipient permitted to retain Materials at the end of the permitted use?',
				       forceSelection:true,
				       displayField:'label',
				       mode:'local',
				       store: new Ext.data.SimpleStore({
					       fields:['value', 'label'],
						   data:[[true, 'Yes'], 
							 [false, 'No']]
						   })
				       })
			   );

	this._info_panel = new Ext.ContentPanel("info_" + this.get_id(),
    {autoCreate:true,
     fitToFrame:true});
	this._url_form.render(this._info_panel.getEl());

	return this._info_panel;

    }; // get_info_panel

}; // SciComMta
SciComMta.prototype = new MtaClass;
SciComMta.prototype.class_id = 'scicom';
SciComMta.prototype.class_name = 'Science Commons';

// specify the list of all available agreements
YAHOO.namespace('mta');
YAHOO.mta.AGREEMENT_CLASSES = [new UbmtaClass(), new SlaClass(), 
			       new SciComMta(), new CustomMta()];

