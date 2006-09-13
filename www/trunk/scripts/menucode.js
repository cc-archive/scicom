//// code for pop-up menus

// how it works:
//  When the mouse passes over one of the main navigation buttons, it calls
//   show_menu_exclusive() to swap the button image, open that button's pop-up menu,
//   and close any others that might be open.
//  When the mouse leaves the nav button, it starts a delayed restore of the button image
//   and closing of that pop-up menu by calling start_delayed_hide_menu(). The closing
//   is delayed because the mouse might be entering the pop-up menu. If not, then the menu
//   will either be closed by the delayed call to do_delayed_hide_menu(), or by entering
//   a different navigation button.
//  When the mouse enters a pop-up menu button, it cancels the delayed close of that
//   pop-up menu with cancel_delayed_hide_menu().
//  When the mouse leaves a pop-up menu button, it starts the delayed close.
//
//

//// globals

// variable records which menu is currently open
var open_menu = "";

// timer for delayed hide
var timerid = null;

//// configuration (some of these depend on how the HTML is written)

// prefix of primary nav item id
var n1prefix = "n1";
// suffix of primary nav mouseover image filename
var n1rosuffix = "_ro";
// file extension of primary nav image filename
var n1fileext = ".gif";
// prefix of menu div
var menuprefix = "menu_";
// menu close delay in ms (in general, 50 seems to be a good value)
var menudelay = 50;

//// functions

// show main nav mouseover and corresponding pop-up menu (immediately hide previous, if any)
//
function show_menu_exclusive(menuname) {

  if (timerid != null) {        // cancel any delayed hides
    clearTimeout (timerid);
    timerid = null;
  }

  if (open_menu == menuname)  // return if this menu already open
    return;

  if (open_menu != "") {      // restore main navigation button
    // find image object
    var oldnavobj = MM_findObj(n1prefix + open_menu);
    // replace the original image
    if (oldnavobj != null) {
      if (oldnavobj.originalsrc) {
        oldnavobj.src = oldnavobj.originalsrc;
      }
    }
    // hide the old pop-up menu
    var oldmenulayer = menuprefix + open_menu;
    MM_showHideLayers(oldmenulayer,'','hide')
  }

  // swap in new menu button rollover and show pop-up menu

  if (menuname != "") {
    // find image object
    var navobj = MM_findObj(n1prefix + menuname);
    if (navobj != null) {
      // get image src
      var src = navobj.src;
      // stash it for later replacement
      navobj.originalsrc = src;
      // replace ".gif" with "_hi.gif" (or whatever the suffix and extension are)
      // (but make sure we're not already showing _hi.gif)
      var i = src.lastIndexOf(n1rosuffix + n1fileext);
      if (i < 0) {
        i = src.lastIndexOf(n1fileext);
        if (i >= 0) {
          src = src.substring(0,i) + n1rosuffix + n1fileext;
        }
      }
      // swap in highlighted image
      navobj.src = src;
    }
    // show the new pop-up menu
    var menulayer = menuprefix + menuname;
    MM_showHideLayers(menulayer,'','show')
  }

  // record the open menu
  open_menu = menuname;
}

// start delayed main nav image restoration and pop-up menu hiding
//
function start_delayed_hide_menu() {
  timerid = setTimeout("do_delayed_hide_menu()", menudelay); // last arg is delay in milliseconds
}

// cancel delayed main nav image restoration and pop-up menu hiding
//
function cancel_delayed_hide_menu() {
  if (timerid != null) {
    clearTimeout (timerid);
    timerid = null;
  }
}

// perform delayed main nav image restoration and pop-up menu hiding
//
function do_delayed_hide_menu() {
  show_menu_exclusive("");
}
