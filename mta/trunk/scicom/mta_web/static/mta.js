// Offer Classes

// Base -- Prototype

offer_counter = 0;

function MtaClass() {

    version = "1.0";

    // if I was a better JavaScript hacker I'd know how to do this in a constructor
    // so subclasses got it too...but instead, it's called from the "factory" point.
    this.uniquify = function() {
	this.offer_id = offer_counter++;
    }

    // list of all panels 
    this.get_panels = function() {
	return ["agreement_type", "for_whom", "finish"];
    }

    this.get_next_panel = function(current_panel) {
	var panels = this.get_panels();
	for (i = 0; i < panels.length; i++) {
	    if (panels[i] == current_panel) {
		return panels[i+1];
	    }
	}
    }

    this.get_id = function() {
	// return the simple string identifier for this class
	return this.class_id;
    };


    this.get_name = function() {
	// return the human readable name for this class
	return this.class_name;
    };


    // the user-specified parameters for the license
    this.get_specs = function() {

	var result = {};

	maparray(this.get_panels(), function(panel_name) {
	
	YAHOO.mta.dlg_offer.wiz_panels[panel_name].gather_info(result);
	});

	return result;

    }

    // returns a dictionary with relevant values
    this.get_info = function() {
	var specs = this.get_specs();
	Ext.apply(specs, 
		  { agreement_name: this.get_name(),
		    agreement_uri: this.get_deed_uri(),	
		    legal_uri: this.get_legal_uri(),
		    implementing_uri: this.get_implementing_uri()
		  });
	return specs;
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

    this.get_deed_uri = function() {
	return this.build_uri(null);	
    };

    this.get_implementing_uri = function() {
	return this.build_uri("letter");
    }

    this.get_legal_uri = function() {
	return this.build_uri('legalcode');
    }

    this.build_uri = function(type) {
	var info = YAHOO.mta.agreement_info();
	var agr_type = this.get_license_id();
        var url = "agreements/" + agr_type + '/' + version;
	if (type != null) {
	    url = url + "/" + type;
	}
	// here we add in parameters...+++ only needed sometimes
	url = url + "?source=mta";  
	url = this.url_add_parameter(url, "providerOrg", info.provider_name);
	url = this.url_add_parameter(url, "providerAddress", info.provider_address);
	url = this.url_add_parameter(url, "materialDesc", info.material_description);
	url = this.add_additional_url_parameters(url);
	return url;
    }

    // conditionally add a parameter
    this.url_add_parameter = function(base, pname, pvalue) {
	if (pvalue != null) {
	    return base + "&" + pname + "=" + pvalue;
	}
	else
	    return base;
    }

    // subclasses can override this to add customization
    this.add_additional_url_parameters = function(url) {
	return url;
    }

    this.get_dom_id = function() {

	return "agr_" + this.get_id();
    }; 

    // creates the radio button for the agreement
    this.get_dom_element = function() {

	if (!this._dom_element) {
	    // create the element
	    this._dom_element = new Ext.form.Radio({
		boxLabel : this.get_name(),
		name : 'agreement_type',
		id : this.get_dom_id()
	    });
	} // if not previously created

	return this._dom_element;

    };
    

}; // MtaClass
MtaClass.prototype.class_id = 'basic';
MtaClass.prototype.class_name = 'Basic Agreement';

    // code for license (for sc, depends on parameters)
MtaClass.prototype.get_license_id = function() {
	return this.get_id();
    }

// default is to allow for profit or noprofit
MtaClass.prototype.allowed = function(for_proft) {
    return true;
};



function NonProfitMtaClass() {

    // this is a placeholder class in the heirarchy that get's the appropriate
    // "enabled" function for non-profit-only offers.

}

NonProfitMtaClass.prototype = new MtaClass;


NonProfitMtaClass.prototype.allowed = function(for_profit) {
    return !for_profit;
};


function UbmtaClass() {


}; // UbmtaClass

UbmtaClass.prototype = new NonProfitMtaClass;
UbmtaClass.prototype.class_id = 'ubmta';
UbmtaClass.prototype.class_name = 'UBMTA';
UbmtaClass.prototype.constructor = UbmtaClass; // get around JavaScript weirdness
UbmtaClass.prototype.get_panels = function() {
    return ["agreement_type", "for_whom", "logistics", "finish"];
}


function SlaClass() {

}; // SlaClass

SlaClass.prototype = new NonProfitMtaClass;
SlaClass.prototype.class_id = 'sla';
SlaClass.prototype.class_name = 'SLA';
SlaClass.prototype.constructor = SlaClass; // get around JavaScript weirdness
SlaClass.prototype.get_panels = function() {
    return ["agreement_type", "for_whom", "purpose", "finish"];
}


function CustomMta() {

    this.get_deed_uri = function() {
	return this.get_specs()['custom_url'];
    }

    // I guess these should be empty (and callers should be smart about not displaying links)
    this.get_implementing_uri = function() {
	return '';
    }
    this.get_legal_uri = function() {
	return '';
    }

}; // CustomMta
CustomMta.prototype = new MtaClass;
CustomMta.prototype.class_id = 'custom';
CustomMta.prototype.class_name = 'Custom Agreement';
CustomMta.prototype.constructor = CustomMta; // get around JavaScript weirdness
CustomMta.prototype.get_panels = function() {
    return ["agreement_type", "for_whom", "custom", "finish"];
}


// SciComMta
// 
// 
function SciComMta() {


    // I'm being too clever by half here...
    this.get_specs = function() {

	// call the "superclass" method, and tack new stuff onto it.
	var specs = this.constructor.prototype.get_specs();

// +++ getting redone
// 	var rawspecs = this._info_form.getValues();
 	// goddamn ext widgets don't return the right values, so massage them here
// 	Ext.apply(specs, rawspecs);

	return specs;
    }

    this.get_metadata_template_additional = function() {
	var info = this.get_info();
	var result = '';
	// note: scaleup isn't actually going to be here, it's in the license
	if (info['endDate'] != '') {
	    result = result + '<br>Permission expires on <span property=cc:expires">{endDate}</span>';
	}

	// this all lives on deed, so nthing for it here.
	// maybe put in disease or protocol specifics
// 	if (info['protocol'] != '') {
// 	    result = result + '<br><span ref="cc:requires" class="sc:ProtocolRequirement">Restricted to protocol <span property="sc:protocol">{protocol}</span></span>';
// 	}
// 	if (info['disease'] != '') {
// 	    result = result + '<br><span ref="cc:requires" class="sc:DiseaseRequirement">Restricted to disease <span property="sc:disease">{disease}</span></span>';
// 	}

// 	if (info['scaleUpAllowed'] == "on") {
// 	    result = result + '<br><span rel=cc:permits class="sc:ScalingUp">Scaling up is permitted</span>';
// 	}
// 	if (info['retentionAllowed'] == "on") {
// 	    result = result + '<br><span rel=cc:permits class="sc:Retention">Retention of unused materials is permitted</span>';
// 	}

	// +++ more here
	return result
    }

    this.add_additional_url_parameters = function(url) {
	var info = this.get_specs();
	// +++ much more here
	return this.url_add_parameter(url, "disease", info['disease']);
    }

}; // SciComMta
SciComMta.prototype = new MtaClass;
SciComMta.prototype.class_id = 'scicom';
SciComMta.prototype.class_name = 'Science Commons';
SciComMta.prototype.constructor = SciComMta; // get around JavaScript weirdness

SciComMta.prototype.get_panels = function() {
    return ["agreement_type", "for_whom", "sc_info", "logistics", "finish"];
}

SciComMta.prototype.get_license_id = function() {
	var id = "sc";
	info = this.get_specs();
	if (info['fieldOfUse'] == 'protocol') {
	    id = id + '-rp';
	}
	if (info['fieldOfUse'] == 'disease') {
	    id = id + '-df';
	}
	// +++ the senses of these are confusing
	if (info['scaleUpAllowed'] != 'on') {
	    id = id + '-ns';
	}
	if (info['retentionAllowed'] != 'on') {
	    id = id + '-rd';
	}
	return id;
    }


// specify the list of all available agreements
YAHOO.namespace('mta');
YAHOO.mta.AGREEMENT_CLASSES = [new UbmtaClass(), new SlaClass(), 
			       new SciComMta(), new CustomMta()];



