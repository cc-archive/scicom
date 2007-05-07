YAHOO.namespace("scholars");

// validate the form prior to submission
function validate() {

  // clear all previous errors
  $("input").removeClass("error");
  var errors = false;

  // check all except author, which is special cased
  $("input[@name!='author']").each(function(){

     if(! $(this).val()) {

        errors = true;
        $(this).addClass("error");

     } 
  });

  // check author
  var seen_author = false;
  $("input[@name='author']").each(function(){
     if ($(this).val()) seen_author = true;
  });

  if (!seen_author) {
     $("//input[@name='author']:first").addClass("error");
     errors = true;
  }

  // submit if no errors
  return !(errors);

} // validate

// convenience function for creating help tool tips
YAHOO.scholars.init_help_text = function(link_id, help_id) {

    // make sure we have an array to hold the list of panels
    if (!YAHOO.scholars.help_panels) {
	YAHOO.scholars.help_panels = new Array();
    }

    // create the new panel and position it
    var new_panel = new YAHOO.widget.Panel(help_id, 
{close: false, visible: false, draggable: false, width:200,
 effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.35} } ); 

    var link_xy = YAHOO.util.Dom.getXY(link_id);
    new_panel.cfg.setProperty('xy',[link_xy[0] + 15, link_xy[1]] );
    var item_idx = YAHOO.scholars.help_panels.push(new_panel) - 1;

    YAHOO.scholars.help_panels[item_idx].render();

    // connect the event handlers
    YAHOO.util.Event.addListener(link_id, "mouseover", 
				 function(e) {YAHOO.scholars.help_panels[item_idx].show();});
   YAHOO.util.Event.addListener(link_id, "mouseout", 
				function(e) {window.setTimeout("YAHOO.scholars.help_panels[" + item_idx + "].hide();", 500);});

    // disable clicks
    YAHOO.util.Event.addListener(link_id, 'click', function(e){YAHOO.util.Event.preventDefault(e);});

} // init_help_text

// initialization for the client-side app
YAHOO.scholars.init = function() {

   // HTML snippet for new author input boxes
   var AUTHOR_INPUT = '<label>&nbsp;</label><input class="additional" name="author" /><br/>';


   // add author input box functionality
   $("#addAuthor").click( function() {
       $(AUTHOR_INPUT).hide().appendTo("#author_container").slideDown();

       return false;
       } );

   // connect the validation handler to the button
   $("#generate").click(validate);

   // help roll-overs
   // ****************
   YAHOO.scholars.init_help_text('title', 'help_title');
   YAHOO.scholars.init_help_text('journal', 'help_journal');
   YAHOO.scholars.init_help_text('author', 'help_author');
   YAHOO.scholars.init_help_text('publisher', 'help_publisher');
   YAHOO.scholars.init_help_text('agreement', 'help_agreement');
   
} // init

YAHOO.util.Event.onDOMReady(YAHOO.scholars.init); 