/*
 * Ext JS Library 1.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

if(typeof YAHOO=="undefined"){var YAHOO={};}YAHOO.namespace=function(){var a=arguments,o=null,i,j,d;for(i=0;i<a.length;i=i+1){d=a[i].split(".");o=YAHOO;for(j=(d[0]=="YAHOO")?1:0;j<d.length;j=j+1){o[d[j]]=o[d[j]]||{};o=o[d[j]];}}return o;};YAHOO.log=function(_6,_7,_8){var l=YAHOO.widget.Logger;if(l&&l.log){return l.log(_6,_7,_8);}else{return false;}};YAHOO.init=function(){this.namespace("util","widget","example");if(typeof YAHOO_config!="undefined"){var l=YAHOO_config.listener,ls=YAHOO.env.listeners,_c=true,i;if(l){for(i=0;i<ls.length;i=i+1){if(ls[i]==l){_c=false;break;}}if(_c){ls.push(l);}}}};YAHOO.register=function(_e,_f,_10){var _11=YAHOO.env.modules;if(!_11[_e]){_11[_e]={versions:[],builds:[]};}var m=_11[_e],v=_10.version,b=_10.build,ls=YAHOO.env.listeners;m.name=_e;m.version=v;m.build=b;m.versions.push(v);m.builds.push(b);m.mainClass=_f;for(var i=0;i<ls.length;i=i+1){ls[i](m);}if(_f){_f.VERSION=v;_f.BUILD=b;}else{YAHOO.log("mainClass is undefined for module "+_e,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[],getVersion:function(_17){return YAHOO.env.modules[_17]||null;}};YAHOO.lang={isArray:function(obj){if(obj.constructor&&obj.constructor.toString().indexOf("Array")>-1){return true;}else{return YAHOO.lang.isObject(obj)&&obj.constructor==Array;}},isBoolean:function(obj){return typeof obj=="boolean";},isFunction:function(obj){return typeof obj=="function";},isNull:function(obj){return obj===null;},isNumber:function(obj){return typeof obj=="number"&&isFinite(obj);},isObject:function(obj){return typeof obj=="object"||YAHOO.lang.isFunction(obj);},isString:function(obj){return typeof obj=="string";},isUndefined:function(obj){return typeof obj=="undefined";},hasOwnProperty:function(obj,_21){if(Object.prototype.hasOwnProperty){return obj.hasOwnProperty(_21);}return !YAHOO.lang.isUndefined(obj[_21])&&obj.constructor.prototype[_21]!==obj[_21];},extend:function(_22,_23,_24){var F=function(){};F.prototype=_23.prototype;_22.prototype=new F();_22.prototype.constructor=_22;_22.superclass=_23.prototype;if(_23.prototype.constructor==Object.prototype.constructor){_23.prototype.constructor=_23;}if(_24){for(var i in _24){_22.prototype[i]=_24[i];}}},augment:function(r,s){var rp=r.prototype,sp=s.prototype,a=arguments,i,p;if(a[2]){for(i=2;i<a.length;i=i+1){rp[a[i]]=sp[a[i]];}}else{for(p in sp){if(!rp[p]){rp[p]=sp[p];}}}}};YAHOO.init();YAHOO.util.Lang=YAHOO.lang;YAHOO.augment=YAHOO.lang.augment;YAHOO.extend=YAHOO.lang.extend;YAHOO.register("yahoo",YAHOO,{version:"2.2.0",build:"127"});
