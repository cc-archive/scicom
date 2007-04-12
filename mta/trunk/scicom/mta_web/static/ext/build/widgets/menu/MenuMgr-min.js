/*
 * Ext JS Library 1.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

Ext.menu.MenuMgr=function(){var _1,_2,_3={};function init(){_1={},_2=new Ext.util.MixedCollection();Ext.get(document).addKeyListener(27,function(){if(_2.length>0){hideAll();}});}function hideAll(){if(_2.length>0){var c=_2.clone();c.each(function(m){m.hide();});}}function onHide(m){_2.remove(m);if(_2.length<1){Ext.get(document).un("mousedown",onMouseDown);}}function onShow(m){var _8=_2.last();_2.add(m);if(_2.length==1){Ext.get(document).on("mousedown",onMouseDown);}if(m.parentMenu){m.getEl().setZIndex(parseInt(m.parentMenu.getEl().getStyle("z-index"),10)+3);m.parentMenu.activeChild=m;}else{if(_8&&_8.isVisible()){m.getEl().setZIndex(parseInt(_8.getEl().getStyle("z-index"),10)+3);}}}function onBeforeHide(m){if(m.activeChild){m.activeChild.hide();}if(m.autoHideTimer){clearTimeout(m.autoHideTimer);delete m.autoHideTimer;}}function onBeforeShow(m){var pm=m.parentMenu;if(!pm&&!m.allowOtherMenus){hideAll();}else{if(pm&&pm.activeChild){pm.activeChild.hide();}}}function onMouseDown(e){if(_2.length>0&&!e.getTarget(".x-menu")){hideAll();}}function onBeforeCheck(mi,_e){if(_e){var g=_3[mi.group];for(var i=0,l=g.length;i<l;i++){if(g[i]!=mi){g[i].setChecked(false);}}}}return {hideAll:function(){hideAll();},register:function(_12){if(!_1){init();}_1[_12.id]=_12;_12.on("beforehide",onBeforeHide);_12.on("hide",onHide);_12.on("beforeshow",onBeforeShow);_12.on("show",onShow);var g=_12.group;if(g&&_12.events["checkchange"]){if(!_3[g]){_3[g]=[];}_3[g].push(_12);_12.on("checkchange",onCheck);}},get:function(_14){if(typeof _14=="string"){return _1[_14];}else{if(_14.events){return _14;}else{return new Ext.menu.Menu(_14);}}},unregister:function(_15){delete _1[_15.id];_15.un("beforehide",onBeforeHide);_15.un("hide",onHide);_15.un("beforeshow",onBeforeShow);_15.un("show",onShow);var g=_15.group;if(g&&_15.events["checkchange"]){_3[g].remove(_15);_15.un("checkchange",onCheck);}},registerCheckable:function(_17){var g=_17.group;if(g){if(!_3[g]){_3[g]=[];}_3[g].push(_17);_17.on("beforecheckchange",onBeforeCheck);}},unregisterCheckable:function(_19){var g=_19.group;if(g){_3[g].remove(_19);_19.un("beforecheckchange",onBeforeCheck);}}};}();
