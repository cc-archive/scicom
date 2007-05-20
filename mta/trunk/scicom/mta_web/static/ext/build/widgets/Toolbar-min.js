/*
 * Ext JS Library 1.0.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

Ext.Toolbar=function(_1,_2,_3){if(_1 instanceof Array){_2=_1;_3=_2;_1=null;}Ext.apply(this,_3);this.buttons=_2;if(_1){this.render(_1);}};Ext.Toolbar.prototype={render:function(ct){this.el=Ext.get(ct);if(this.cls){this.el.addClass(this.cls);}this.el.update("<div class=\"x-toolbar x-small-editor\"><table cellspacing=\"0\"><tr></tr></table></div>");this.tr=this.el.child("tr",true);var _5=0;this.items=new Ext.util.MixedCollection(false,function(o){return o.id||("item"+(++_5));});if(this.buttons){this.add.apply(this,this.buttons);delete this.buttons;}},add:function(){var a=arguments,l=a.length;for(var i=0;i<l;i++){var el=a[i];if(el.applyTo){this.addField(el);}else{if(el.render){this.addItem(el);}else{if(typeof el=="string"){if(el=="separator"||el=="-"){this.addSeparator();}else{if(el==" "){this.addSpacer();}else{this.addText(el);}}}else{if(el.tagName){this.addElement(el);}else{if(typeof el=="object"){this.addButton(el);}}}}}}},getEl:function(){return this.el;},addSeparator:function(){return this.addItem(new Ext.Toolbar.Separator());},addSpacer:function(){return this.addItem(new Ext.Toolbar.Spacer());},addElement:function(el){return this.addItem(new Ext.Toolbar.Item(el));},addItem:function(_c){var td=this.nextBlock();_c.render(td);this.items.add(_c);return _c;},addButton:function(_e){if(_e instanceof Array){var _f=[];for(var i=0,len=_e.length;i<len;i++){_f.push(this.addButton(_e[i]));}return _f;}var b=_e;if(!(_e instanceof Ext.Toolbar.Button)){b=new Ext.Toolbar.Button(_e);}var td=this.nextBlock();b.render(td);this.items.add(b);return b;},addText:function(_14){return this.addItem(new Ext.Toolbar.TextItem(_14));},insertButton:function(_15,_16){if(_16 instanceof Array){var _17=[];for(var i=0,len=_16.length;i<len;i++){_17.push(this.insertButton(_15+i,_16[i]));}return _17;}if(!(_16 instanceof Ext.Toolbar.Button)){_16=new Ext.Toolbar.Button(_16);}var td=document.createElement("td");this.tr.insertBefore(td,this.tr.childNodes[_15]);_16.render(td);this.items.insert(_15,_16);return _16;},addDom:function(_1b,_1c){var td=this.nextBlock();Ext.DomHelper.overwrite(td,_1b);var ti=new Ext.Toolbar.Item(td.firstChild);ti.render(td);this.items.add(ti);return ti;},addField:function(_1f){var td=this.nextBlock();_1f.render(td);var ti=new Ext.Toolbar.Item(td.firstChild);ti.render(td);this.items.add(ti);return ti;},nextBlock:function(){var td=document.createElement("td");this.tr.appendChild(td);return td;}};Ext.Toolbar.Item=function(el){this.el=Ext.getDom(el);this.id=Ext.id(this.el);this.hidden=false;};Ext.Toolbar.Item.prototype={getEl:function(){return this.el;},render:function(td){this.td=td;td.appendChild(this.el);},destroy:function(){this.td.parentNode.removeChild(this.td);},show:function(){this.hidden=false;this.td.style.display="";},hide:function(){this.hidden=true;this.td.style.display="none";},setVisible:function(_25){if(_25){this.show();}else{this.hide();}},focus:function(){Ext.fly(this.el).focus();},disable:function(){Ext.fly(this.td).addClass("x-item-disabled");this.disabled=true;this.el.disabled=true;},enable:function(){Ext.fly(this.td).removeClass("x-item-disabled");this.disabled=false;this.el.disabled=false;}};Ext.Toolbar.Separator=function(){var s=document.createElement("span");s.className="ytb-sep";Ext.Toolbar.Separator.superclass.constructor.call(this,s);};Ext.extend(Ext.Toolbar.Separator,Ext.Toolbar.Item);Ext.Toolbar.Spacer=function(){var s=document.createElement("div");s.className="ytb-spacer";Ext.Toolbar.Separator.superclass.constructor.call(this,s);};Ext.extend(Ext.Toolbar.Spacer,Ext.Toolbar.Item);Ext.Toolbar.TextItem=function(_28){var s=document.createElement("span");s.className="ytb-text";s.innerHTML=_28;Ext.Toolbar.TextItem.superclass.constructor.call(this,s);};Ext.extend(Ext.Toolbar.TextItem,Ext.Toolbar.Item);Ext.Toolbar.Button=function(_2a){Ext.Toolbar.Button.superclass.constructor.call(this,null,_2a);};Ext.extend(Ext.Toolbar.Button,Ext.Button,{render:function(td){this.td=td;Ext.Toolbar.Button.superclass.render.call(this,td);},destroy:function(){Ext.Toolbar.Button.superclass.destroy.call(this);this.td.parentNode.removeChild(this.td);},show:function(){this.hidden=false;this.td.style.display="";},hide:function(){this.hidden=true;this.td.style.display="none";},disable:function(){Ext.fly(this.td).addClass("x-item-disabled");this.disabled=true;},enable:function(){Ext.fly(this.td).removeClass("x-item-disabled");this.disabled=false;}});Ext.ToolbarButton=Ext.Toolbar.Button;Ext.Toolbar.MenuButton=function(_2c){Ext.Toolbar.MenuButton.superclass.constructor.call(this,null,_2c);};Ext.extend(Ext.Toolbar.MenuButton,Ext.MenuButton,{render:function(td){this.td=td;Ext.Toolbar.MenuButton.superclass.render.call(this,td);},destroy:function(){Ext.Toolbar.MenuButton.superclass.destroy.call(this);this.td.parentNode.removeChild(this.td);},show:function(){this.hidden=false;this.td.style.display="";},hide:function(){this.hidden=true;this.td.style.display="none";}});
