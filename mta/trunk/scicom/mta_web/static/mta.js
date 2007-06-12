// Offer Classes

// Base -- Prototype

offer_counter = 0;


function MtaClass() {

    // if I was a better JavaScript hacker I'd know how to do this in a constructor
    // so subclasses got it too...but instead, it's called from the "factory" point.
    this.uniquify = function() {
	this.offer_id = offer_counter++;
    }

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

    // returns a dictionary with relevant values
    this.get_info = function() {
	var result = 
	    { agreement_name: this.get_name(),
	      agreement_uri: this.get_uri()	}
	return result
    }

    this.get_metadata_template = function() {
	return new Ext.Template(
	    "<li class='sc:Offer' rel='sc:offer'>\n" +
		"  <a rel=sc:agreement href='{agreement_uri}'>{agreement_name}</a> to non-profit institutions.\n" +
		this.get_metadata_template_additional() +
		"</li>");
    }
    
    // subclasses override this to add metadata
    this.get_metadata_template_additional = function() {
	return '';
    }

    this.get_metadata = function() {
	var info = this.get_info();
	return this.get_metadata_template().apply(info);
    }

    // +++ subclasses need to be able to modify this...not sure javascript can handle it
    // +++ might want base url to vary based on python limits at the other end...
    this.get_implementing_uri = function() {
	var info = YAHOO.mta.agreement_info();
	var agr_type = this.get_name();
        var url = "/implementing_letter?" +
            "agreementType=" + agr_type +       // +++ not yet implemented on other end...
            "&providerOrg=" + info.provider_name + 
	    "&materialDesc=" + info.material_description;
	return url;
    }

    // none of this implemented on server yet.
    this.get_legal_uri = function() {
	var info = YAHOO.mta.agreement_info();
	var agr_type = this.get_name();
        var url = "/legal?" +
            "agreementType=" + agr_type +       // +++ not yet implemented on other end...
            "&providerOrg=" + info.provider_name + 
	    "&materialDesc=" + info.material_description;
	return url;
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
UbmtaClass.prototype.constructor = UbmtaClass; // get around JavaScript weirdness

function SlaClass() {

    this.get_uri = function() {
 	return 'http://mta.sciencecommons.org/mta/sla/';
    };

}; // SlaClass
SlaClass.prototype = new NonProfitMtaClass;
SlaClass.prototype.class_id = 'sla';
SlaClass.prototype.class_name = 'SLA';
SlaClass.prototype.constructor = SlaClass; // get around JavaScript weirdness

function CustomMta() {


    this.get_uri = function() {

	return this.get_info()['agreement_url'];
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
		width:200,
		allowBlank:false
	    })
	);
	// +++ create anew for each trip through....
	this._info_panel = new Ext.ContentPanel("info_" + this.get_id() + this.offer_id,

						{autoCreate:true,
						 fitToFrame:true});
	this._url_form.render(this._info_panel.getEl());

	return this._info_panel;

    }; // get_info_panel

    // I'm being too clever by half here...
    this.get_info = function() {
	// call the "superclass" method, and tack new stuff onto it.
	var maininfo = this.constructor.prototype.get_info();
	maininfo['agreement_url'] = this._url_form.findField('agreement_url').getValue();
	return maininfo;
    }

}; // CustomMta
CustomMta.prototype = new MtaClass;
CustomMta.prototype.class_id = 'custom';
CustomMta.prototype.class_name = 'Custom Agreement';
CustomMta.prototype.constructor = CustomMta; // get around JavaScript weirdness

// SciComMta
// 
// 
function SciComMta() {

    this._has_info_panel = true;

    this.get_info_panel = function() {

	// see if we've created it previously
	if (this._info_panel) return this._info_panel;

	// we haven't, create now
	var form = new Ext.form.Form({
	    labelAlign: 'right',
            labelWidth: 200});

	// save for later
	this._info_form = form;  

	form.add(
	    new Ext.form.TextField({
                fieldLabel:'Restrict to specific disease',
		width:175,
		name: 'disease'

	    }),

	    new Ext.form.TextField({
                fieldLabel:'Restrict to specific protocol',
		width:175,
		name: 'protocol'

	    }),


	    new Ext.form.DateField({
		name: 'endDate',
		fieldLabel:'End date',
		width:175
	    }),

	    new Ext.form.Checkbox({
		name: 'scaleUpAllowed',
		fieldLabel:'Is scaling up allowed?'
	    }),


	    new Ext.form.Checkbox({
		name: 'retentionAllowed',
		fieldLabel:'Is the recipient permitted to retain material?'
	    })

	);

	this._info_panel = new Ext.ContentPanel("info_" + this.get_id() + this.offer_id,
						{autoCreate:true,
						 fitToFrame:true});
	form.render(this._info_panel.getEl());

	return this._info_panel;

    }; // get_info_panel

    // I'm being too clever by half here...
    this.get_info = function() {
	// call the "superclass" method, and tack new stuff onto it.
	var maininfo = this.constructor.prototype.get_info();
	// get field values +++
	Ext.apply(maininfo, this._info_form.getValues());
	return maininfo;
    }

    this.get_metadata_template_additional = function() {
	var info = this.get_info();
	var result = '';
	// note: scaleup isn't actually going to be here, it's in the license
	if (info['endDate'] != '') {
	    result = result + '<br>Permission expires on <span property=cc:expires">{endDate}</span>';
	}
	if (info['protocol'] != '') {
	    result = result + '<br><span ref="cc:requires" class="sc:ProtocolRequirement">Restricted to protocol <span property="sc:protocol">{protocol}</span></span>';
	}
	if (info['disease'] != '') {
	    result = result + '<br><span ref="cc:requires" class="sc:DiseaseRequirement">Restricted to disease <span property="sc:disease">{disease}</span></span>';
	}
	if (info['scaleUpAllowed'] == "on") {
	    result = result + '<br><span rel=cc:permits class="sc:ScalingUp">Scaling up is permitted</span>';
	}
	if (info['retentionAllowed'] == "on") {
	    result = result + '<br><span rel=cc:permits class="sc:Retention">Retention of unused materials is permitted</span>';
	}

	// +++ more here
	return result
    }

    // +++ url should get parameterized based on metadata...here we're just experimenting
    this.get_uri = function() {
	var info = this.get_info();
	var uri = 'http://mta.sciencecommons.org/mta/sc?ignore=this';
	
	if (info['disease'] != '') {
	    uri = uri + '&disease=' + info['disease'];
	}

 	return uri;
    };



}; // SciComMta
SciComMta.prototype = new MtaClass;
SciComMta.prototype.class_id = 'scicom';
SciComMta.prototype.class_name = 'Science Commons';
SciComMta.prototype.constructor = SciComMta; // get around JavaScript weirdness

// specify the list of all available agreements
YAHOO.namespace('mta');
YAHOO.mta.AGREEMENT_CLASSES = [new UbmtaClass(), new SlaClass(), 
			       new SciComMta(), new CustomMta()];

