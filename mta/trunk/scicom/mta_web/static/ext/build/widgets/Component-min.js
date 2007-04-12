/*
 * Ext JS Library 1.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

Ext.ComponentMgr=function(){var _1=new Ext.util.MixedCollection();return {register:function(c){_1.add(c);},unregister:function(c){_1.remove(c);},get:function(id){return _1.get(id);},onAvailable:function(id,fn,_7){_1.on("add",function(_8,o){if(o.id==id){fn.call(_7||o,o);_1.un("add",fn,_7);}});}};}();Ext.Component=function(_a){_a=_a||{};if(_a.tagName||_a.dom||typeof _a=="string"){_a={el:_a,id:_a.id||_a};}Ext.apply(this,_a);this.addEvents({disable:true,enable:true,beforeshow:true,show:true,beforehide:true,hide:true,beforerender:true,render:true,beforedestroy:true,destroy:true});if(!this.id){this.id="ext-comp-"+(++Ext.Component.AUTO_ID);}Ext.ComponentMgr.register(this);};Ext.Component.AUTO_ID=1000;Ext.extend(Ext.Component,Ext.util.Observable,{hidden:false,disabled:false,disabledClass:"x-item-disabled",rendered:false,ctype:"Ext.Component",actionMode:"el",getActionEl:function(){return this[this.actionMode];},render:function(_b){if(!this.rendered&&this.fireEvent("beforerender",this)!==false){this.container=Ext.get(_b);this.rendered=true;this.onRender(this.container);if(this.cls){this.el.addClass(this.cls);delete this.cls;}this.fireEvent("render",this);if(this.hidden){this.hide();}if(this.disabled){this.disable();}this.afterRender(this.container);}},onRender:function(ct){this.el=Ext.get(this.el);ct.dom.appendChild(this.el.dom);},getAutoCreate:function(){var _d=typeof this.autoCreate=="object"?this.autoCreate:Ext.apply({},this.defaultAutoCreate);if(this.id&&!_d.id){_d.id=this.id;}return _d;},afterRender:Ext.emptyFn,destroy:function(){if(this.fireEvent("beforedestroy",this)!==false){this.purgeListeners();if(this.rendered){this.el.removeAllListeners();this.el.remove();if(this.actionMode=="container"){this.container.remove();}}Ext.ComponentMgr.unregister(this);this.fireEvent("destroy",this);}},getEl:function(){return this.el;},focus:function(_e){if(this.rendered){this.el.focus();if(_e===true){this.el.dom.select();}}},blur:function(){if(this.rendered){this.el.blur();}},disable:function(){if(this.rendered){this.getActionEl().addClass(this.disabledClass);this.el.dom.disabled=true;}this.disabled=true;this.fireEvent("disable",this);},enable:function(){if(this.rendered){this.getActionEl().removeClass(this.disabledClass);this.el.dom.disabled=false;}this.disabled=false;this.fireEvent("enable",this);},setDisabled:function(_f){this[_f?"disable":"enable"]();},show:function(){if(this.fireEvent("beforeshow",this)!==false){this.hidden=false;if(this.rendered){this.onShow();}this.fireEvent("show",this);}},onShow:function(){var st=this.getActionEl().dom.style;st.display="";st.visibility="visible";},hide:function(){if(this.fireEvent("beforehide",this)!==false){this.hidden=true;if(this.rendered){this.onHide();}this.fireEvent("hide",this);}},onHide:function(){this.getActionEl().dom.style.display="none";},setVisible:function(_11){if(_11){this.show();}else{this.hide();}}});
