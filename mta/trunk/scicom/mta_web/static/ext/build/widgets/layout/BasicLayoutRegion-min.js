/*
 * Ext JS Library 1.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

Ext.BasicLayoutRegion=function(_1,_2,_3,_4){this.mgr=_1;this.position=_3;this.events={"beforeremove":true,"invalidated":true,"visibilitychange":true,"paneladded":true,"panelremoved":true,"collapsed":true,"expanded":true,"slideshow":true,"slidehide":true,"panelactivated":true,"resized":true};this.panels=new Ext.util.MixedCollection();this.panels.getKey=this.getPanelId.createDelegate(this);this.box=null;this.activePanel=null;if(_4!==true){this.applyConfig(_2);}};Ext.extend(Ext.BasicLayoutRegion,Ext.util.Observable,{getPanelId:function(p){return p.getId();},applyConfig:function(_6){this.margins=_6.margins||this.margins||{top:0,left:0,right:0,bottom:0};this.config=_6;},resizeTo:function(_7){var el=this.el?this.el:(this.activePanel?this.activePanel.getEl():null);if(el){switch(this.position){case "east":case "west":el.setWidth(_7);this.fireEvent("resized",this,_7);break;case "north":case "south":el.setHeight(_7);this.fireEvent("resized",this,_7);break;}}},getBox:function(){return this.activePanel?this.activePanel.getEl().getBox(false,true):null;},getMargins:function(){return this.margins;},updateBox:function(_9){this.box=_9;var el=this.activePanel.getEl();el.dom.style.left=_9.x+"px";el.dom.style.top=_9.y+"px";el.setSize(_9.width,_9.height);},getEl:function(){return this.activePanel;},isVisible:function(){return this.activePanel?true:false;},setActivePanel:function(_b){_b=this.getPanel(_b);if(this.activePanel&&this.activePanel!=_b){this.activePanel.setActiveState(false);this.activePanel.getEl().setStyle({left:-10000,right:-10000});}this.activePanel=_b;_b.setActiveState(true);if(this.box){_b.setSize(this.box.width,this.box.height);}this.fireEvent("panelactivated",this,_b);this.fireEvent("invalidated");},showPanel:function(_c){if(_c=this.getPanel(_c)){this.setActivePanel(_c);}return _c;},getActivePanel:function(){return this.activePanel;},add:function(_d){if(arguments.length>1){for(var i=0,_f=arguments.length;i<_f;i++){this.add(arguments[i]);}return null;}if(this.hasPanel(_d)){this.showPanel(_d);return _d;}var el=_d.getEl();if(el.dom.parentNode!=this.mgr.el.dom){this.mgr.el.dom.appendChild(el.dom);}_d.setRegion(this);this.panels.add(_d);el.setStyle("position","absolute");if(!_d.background){this.setActivePanel(_d);if(this.config.initialSize&&this.panels.getCount()==1){this.resizeTo(this.config.initialSize);}}this.fireEvent("paneladded",this,_d);return _d;},hasPanel:function(_11){if(typeof _11=="object"){_11=_11.getId();}return this.getPanel(_11)?true:false;},remove:function(_12,_13){_12=this.getPanel(_12);if(!_12){return null;}var e={};this.fireEvent("beforeremove",this,_12,e);if(e.cancel===true){return null;}var _15=_12.getId();this.panels.removeKey(_15);return _12;},getPanel:function(id){if(typeof id=="object"){return id;}return this.panels.get(id);},getPosition:function(){return this.position;}});
