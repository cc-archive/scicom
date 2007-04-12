YAHOO.namespace("mta");

getSettings = function() {

  // return an associative array of the current form settings
  result = new Array();

  for (key in SciComMta.prototype._field_order) {
     field_name = SciComMta.prototype._field_order[key];
     result[field_name] = document.getElementById(field_name).value;
  }

// alert(result);
  return result;

} // getSettings

    YAHOO.mta.updateSelector = function(e) {

	var source = document.getElementById('source').value;
	var recip = document.getElementById('recipient').value;
	// see if both have a value selected
	if (( source != '---') && ( recip != '---')) {

	    // determine which target to set the form to
	    if (recip == 'acad') {
		// sending to academic; check if scicom is even an option
		if (source == 'acad') {
		    
		    // academic to academic -- no scicom
		    document.getElementById('frm_preselector').action = 
			"./academic";

		} else {

		    // commercial to academic
		    document.getElementById('frm_preselector').action = 
			"./compare"
			}
	    } else {
		// some other combintation
		document.getElementById('frm_preselector').action = "./select"
	    }

	    // enable the button
	    YAHOO.mta.btnContinue.set('disabled', false);

	} else {
	    // disable the continue button
	    YAHOO.mta.btnContinue.set('disabled', true);
	}

    } // updateSelector

    YAHOO.mta.init = function() {

	// create continue button
        YAHOO.mta.btnContinue = new YAHOO.widget.Button( "btn_continue", 
                      {type:"submit", disabled:true});
	
	// attach event handlers
	YAHOO.util.Event.addListener("source", "change", 
				     YAHOO.mta.updateSelector);
	YAHOO.util.Event.addListener("recipient", "change", 
				     YAHOO.mta.updateSelector);

	// call updateSelector in case we came back to this page
	// and the form isn't in it's default state
	YAHOO.mta.updateSelector();

    } // init

YAHOO.util.Event.onDOMReady(YAHOO.mta.init); 