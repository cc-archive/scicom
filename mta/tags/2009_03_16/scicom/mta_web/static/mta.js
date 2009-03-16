// Offer Classes

// Base -- Prototype

offer_counter = 0;

function MtaClass() {

    version = "1.0";

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
		var npanel = panels[i+1];
		// special hack to skip logistics panel
		if (npanel == 'logistics' && !include_logistics)
		    return panels[i+2];
		return npanel;
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


    this.get_offer = function() {
	return version;
    }

    // the user-specified parameters for the agreement
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
		    legalcode_uri: this.get_legalcode_uri(),
		    letter_uri: this.get_letter_uri(),
		    icon_uri: this.get_icon_uri()
		  });
	return specs;
    }

    // namespace definitions are external to this...
    this.get_metadata_template = function() {
	return new Ext.Template(
	    "<div class='sc:Offer' rel='sc:offer'>\n" +
		"  <a rel='sc:agreement' href='{agreement_uri}'>{agreement_name}</a>.\n" +
		this.get_metadata_template_additional() +
		"</div>");
    }
    
    // was going to allow classes to override, but instead it's data-driven from the info
    this.get_metadata_template_additional = function() {
	var info = this.get_info();
	var result = '';
	// note: scaleup isn't actually going to be here, it's in the agreement
	if (nonBlank(info['endDate'])) {
	    result = result + '<br/>The offer expires on <span property="sc:expires">{endDate}</span>';
	}
	if (nonBlank(info['transmittalFee'])) {
	    result = result + '<br/>The transmittal fee is <span property="sc:transmittalFee">{transmittalFee}</span>';
	}
	if (info['recipientType']) {
	    result = result + '<br/>The offer is available to <span property="sc:recipientType">{recipientType}</span> institutions';
	}
	if (info['fieldOfUse'] == 'disease') {
	    result = result + '<br/><span rel="cc:prohbits" class="sc:DiseaseProhibition">Offer is limited to use with disease <span property="sc:disease">{fieldSpec}</span> </span>';
	}
	if (info['fieldOfUse'] == 'protocol') {
	    result = result + '<br/><span rel="cc:prohbits" class="sc:ProtocolProhibition">Offer is limited to use with protocol <span property="sc:protocol">{fieldSpec}</span> </span>';
	}
	// assuming most other parameters live on the deed, so needn't be here.
	return result
    }

    this.get_metadata = function() {
	var info = this.get_info();
	return this.get_metadata_template().apply(info);
    }

    this.get_deed_uri = function() {
	return this.build_uri(null);	
    };

    this.get_letter_uri = function() {
	return this.build_uri("letter");
    }

    this.get_legalcode_uri = function() {
	return this.build_basic_uri('legalcode');
    }

    this.get_legaltext_uri = function() {
	return this.build_basic_uri('legaltext');
    }

    this.get_icon_uri = function() {
	return this.build_basic_uri('icon');
    }

    // no parameters

    this.build_basic_uri = function(type) {
	var agr_type = this.get_agreement_id();
	var url = MTA_embedded ? 'http://mta.sciencecommons.org/' : '';
        url = url + "agreements/" + agr_type + '/' + version;
	if (type != null) {
	    url = url + "/" + type;
	}
	return url;
    }

    this.build_uri = function(type) {
	var url = this.build_basic_uri(type);
	var info = YAHOO.mta.agreement_info();
	// here we add in parameters...+++ only needed sometimes
	url = url + "?source=mta";  
	url = this.url_add_parameter(url, "providerOrg", info.provider_name);
	url = this.url_add_parameter(url, "providerAddress1", info.provider_address);
	url = this.url_add_parameter(url, "materialDesc", info.material_description);
	url = this.add_additional_url_parameters(url);
	return url;
    }

    // conditionally add a parameter
    this.url_add_parameter = function(base, pname, pvalue) {
	if (pvalue != null && pvalue != "") {
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

    // code for agreement (for sc, depends on parameters)
MtaClass.prototype.get_agreement_id = function() {
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

    this.add_additional_url_parameters = function(url) {
	var info = this.get_specs();
	// +++ much more here
	url = this.url_add_parameter(url, "endDate", info['endDate']);
	url = this.url_add_parameter(url, "transmittalFee", info['transmittalFee']);
	return url;
    }

}; // UbmtaClass

UbmtaClass.prototype = new NonProfitMtaClass;
UbmtaClass.prototype.class_id = 'ubmta';
UbmtaClass.prototype.class_name = 'UBMTA';
UbmtaClass.prototype.constructor = UbmtaClass; // get around JavaScript weirdness
UbmtaClass.prototype.get_panels = function() {
    return ["agreement_type", "logistics", "finish"];
}


function SlaClass() {

    this.add_additional_url_parameters = function(url) {
	var info = this.get_specs();
	// +++ much more here
	url = this.url_add_parameter(url, "endDate", info['endDate']);
	url = this.url_add_parameter(url, "transmittalFee", info['transmittalFee']);
	return url;
    }


}; // SlaClass

SlaClass.prototype = new NonProfitMtaClass;
SlaClass.prototype.class_id = 'sla';
SlaClass.prototype.class_name = 'Simple Letter Agreement';
SlaClass.prototype.constructor = SlaClass; // get around JavaScript weirdness
SlaClass.prototype.get_panels = function() {
    return ["agreement_type", "logistics", "finish"];
}


function CustomMta() {

    this.get_deed_uri = function() {
	return this.get_specs()['custom_url'];
    }

    // I guess these should be empty (and callers should be smart about not displaying links)
    this.get_letter_uri = function() {
	return '';
    }
    this.get_legalcode_uri = function() {
	return '';
    }

}; // CustomMta
CustomMta.prototype = new MtaClass;
CustomMta.prototype.class_id = 'custom';
CustomMta.prototype.class_name = 'Custom Agreement';
CustomMta.prototype.constructor = CustomMta; // get around JavaScript weirdness
CustomMta.prototype.get_panels = function() {
    return ["agreement_type", "custom", "finish"];
}


// SciComMta
// 
// 
function SciComMta() {



    this.add_additional_url_parameters = function(url) {
	var info = this.get_specs();
	// +++ much more here
	url = this.url_add_parameter(url, "fieldSpec", info['fieldSpec']);
	url = this.url_add_parameter(url, "endDate", info['endDate']);
	url = this.url_add_parameter(url, "transmittalFee", info['transmittalFee']);
	// note: have to do it this way, urls are not in the info object at this point.
	url = this.url_add_parameter(url, "legalURL", this.get_legalcode_uri());
	return url;
    }



}; // SciComMta
SciComMta.prototype = new MtaClass;
SciComMta.prototype.class_id = 'scicom';
SciComMta.prototype.class_name = 'Science Commons MTA';
SciComMta.prototype.constructor = SciComMta; // get around JavaScript weirdness

SciComMta.prototype.get_panels = function() {
    return ["agreement_type", "for_whom", "sc_info", "logistics", "finish"];
}

SciComMta.prototype.get_agreement_id = function() {
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



