/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 */


YAHOO.ext.UpdateManager=function(el,forceNew){el=YAHOO.ext.Element.get(el);if(!forceNew&&el.updateManager){return el.updateManager;}
this.el=el;this.defaultUrl=null;this.beforeUpdate=new YAHOO.util.CustomEvent('UpdateManager.beforeUpdate');this.onUpdate=new YAHOO.util.CustomEvent('UpdateManager.onUpdate');this.onFailure=new YAHOO.util.CustomEvent('UpdateManager.onFailure');this.sslBlankUrl=YAHOO.ext.UpdateManager.defaults.sslBlankUrl;this.disableCaching=YAHOO.ext.UpdateManager.defaults.disableCaching;this.indicatorText=YAHOO.ext.UpdateManager.defaults.indicatorText;this.showLoadIndicator=YAHOO.ext.UpdateManager.defaults.showLoadIndicator;this.timeout=YAHOO.ext.UpdateManager.defaults.timeout;this.autoRefreshProcId=null;this.refreshDelegate=this.refresh.createDelegate(this);this.updateDelegate=this.update.createDelegate(this);this.formUpdateDelegate=this.formUpdate.createDelegate(this);this.successDelegate=this.processSuccess.createDelegate(this);this.failureDelegate=this.processFailure.createDelegate(this);this.renderer=new YAHOO.ext.UpdateManager.BasicRenderer();}
YAHOO.ext.UpdateManager.prototype={getEl:function(){return this.el;},update:function(url,params,callback,discardUrl){if(this.beforeUpdate.fireDirect(this.el,url,params)!==false){this.showLoading();if(!discardUrl){this.defaultUrl=url;}
if(typeof url=='function'){url=url();}
if(params&&typeof params!='string'){var buf=[];for(key in params){buf.push(encodeURIComponent(key),'=',encodeURIComponent(params[key]),'&');}
delete buf[buf.length-1];params=buf.join('');}
var callback={success:this.successDelegate,failure:this.failureDelegate,timeout:(this.timeout*1000),argument:{'url':url,'form':null,'callback':callback,'params':params}};var method=params?'POST':'GET';if(method=='GET'){url=this.prepareUrl(url);}
YAHOO.util.Connect.asyncRequest(method,url,callback,params);}},formUpdate:function(form,url,reset,callback){if(this.beforeUpdate.fireDirect(this.el,form,url)!==false){this.showLoading();formEl=YAHOO.util.Dom.get(form);if(typeof url=='function'){url=url();}
url=url||formEl.action;var callback={success:this.successDelegate,failure:this.failureDelegate,timeout:(this.timeout*1000),argument:{'url':url,'form':form,'callback':callback,'reset':reset}};var isUpload=false;var enctype=formEl.getAttribute('enctype');if(enctype&&enctype.toLowerCase()=='multipart/form-data'){isUpload=true;}
YAHOO.util.Connect.setForm(form,isUpload,this.sslBlankUrl);YAHOO.util.Connect.asyncRequest('POST',url,callback);}},refresh:function(callback){if(this.defaultUrl==null){return;}
this.update(this.defaultUrl,null,callback,true);},startAutoRefresh:function(interval,url,params,callback,refreshNow){if(refreshNow){this.update(url||this.defaultUrl,params,callback,true);}
if(this.autoRefreshProcId){clearInterval(this.autoRefreshProcId);}
this.autoRefreshProcId=setInterval(this.update.createDelegate(this,[url||this.defaultUrl,params,callback,true]),interval*1000);},stopAutoRefresh:function(){if(this.autoRefreshProcId){clearInterval(this.autoRefreshProcId);}},showLoading:function(){if(this.showLoadIndicator){this.el.update(this.indicatorText);}},prepareUrl:function(url){if(this.disableCaching){var append='_dc='+(new Date().getTime());if(url.indexOf('?')!==-1){url+='&'+append;}else{url+='?'+append;}}
return url;},processSuccess:function(response){this.renderer.render(this.el,response);if(response.argument.form&&response.argument.reset){try{response.argument.form.reset();}catch(e){}}
this.onUpdate.fireDirect(this.el,response);if(typeof response.argument.callback=='function'){response.argument.callback(this.el,true);}},processFailure:function(response){this.onFailure.fireDirect(this.el,response);if(typeof response.argument.callback=='function'){response.argument.callback(this.el,false);}},setRenderer:function(renderer){this.renderer=renderer;},setDefaultUrl:function(defaultUrl){this.defaultUrl=defaultUrl;}};YAHOO.ext.UpdateManager.BasicRenderer=function(){};YAHOO.ext.UpdateManager.BasicRenderer.prototype={render:function(el,response){el.update(response.responseText);}};YAHOO.ext.UpdateManager.defaults={};YAHOO.ext.UpdateManager.defaults.timeout=30;YAHOO.ext.UpdateManager.defaults.sslBlankUrl='about:blank';YAHOO.ext.UpdateManager.defaults.disableCaching=false;YAHOO.ext.UpdateManager.defaults.showLoadIndicator=true;YAHOO.ext.UpdateManager.defaults.indicatorText='<div class="loading-indicator">Loading...</div>';