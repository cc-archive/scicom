/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 */


YAHOO.ext.DomHelper=new function(){var d=document;this.useDom=false;function applyStyles(el,styles){if(styles){var ss=YAHOO.util.Dom.setStyle;var re=/(.*?)\:(.*?);/g;while(re.exec(styles)!=null){ss(el,RegExp.$1,RegExp.$2);}}}
function createHtml(o){var b='';b+='<'+o.tag;for(var attr in o){if(attr=='tag'||attr=='children'||attr=='html')continue;if(attr=='cls'){b+=' class="'+o['cls']+'"';}else{b+=' '+attr+'="'+o[attr]+'"';}}
b+='>';if(o.children){for(var i=0,len=o.children.length;i<len;i++){b+=createHtml(o.children[i],b);}}
if(o.html){b+=o.html;}
b+='</'+o.tag+'>';return b;}
function createDom(o,parentNode){var el=d.createElement(o.tag);var useSet=el.setAttribute?true:false;for(var attr in o){if(attr=='tag'||attr=='children'||attr=='html'||attr=='style')continue;if(attr=='cls'){el.className=o['cls'];}else{if(useSet)el.setAttribute(attr,o[attr]);else el[attr]=o[attr];}}
applyStyles(el,o.style);if(o.children){for(var i=0,len=o.children.length;i<len;i++){createDom(o.children[i],el);}}
if(o.html){el.innerHTML=o.html;}
if(parentNode){parentNode.appendChild(el);}
return el;}
this.insertHtml=function(where,el,html){if(el.insertAdjacentHTML){if(where=='beforeBegin'){el.insertAdjacentHTML(where,html);return el.previousSibling;}else if(where=='afterBegin'){el.insertAdjacentHTML(where,html);return el.firstChild;}else if(where=='beforeEnd'){el.insertAdjacentHTML(where,html);return el.lastChild;}else if(where=='afterEnd'){el.insertAdjacentHTML(where,html);return el.nextSibling;}
throw'Illegal insertion point -> "'+where+'"';}
var range=el.ownerDocument.createRange();var frag;if(where=='beforeBegin'){range.setStartBefore(el);frag=range.createContextualFragment(html);el.parentNode.insertBefore(frag,el);return el.previousSibling;}else if(where=='afterBegin'){range.selectNodeContents(el);range.collapse(true);frag=range.createContextualFragment(html);el.insertBefore(frag,el.firstChild);return el.firstChild;}else if(where=='beforeEnd'){range.selectNodeContents(el);range.collapse(false);frag=range.createContextualFragment(html);el.appendChild(frag);return el.lastChild;}else if(where=='afterEnd'){range.setStartAfter(el);frag=range.createContextualFragment(html);el.parentNode.insertBefore(frag,el.nextSibling);return el.nextSibling;}else{throw'Illegal insertion point -> "'+where+'"';}};this.insertBefore=function(el,o){el=YAHOO.util.Dom.get(el);var newNode;if(this.useDom){newNode=createDom(o,null);el.parentNode.insertBefore(newNode,el);}else{var html=createHtml(o);newNode=this.insertHtml('beforeBegin',el,html);}
return newNode;};this.insertAfter=function(el,o){el=YAHOO.util.Dom.get(el);var newNode;if(this.useDom){newNode=createDom(o,null);el.parentNode.insertBefore(newNode,el.nextSibling);}else{var html=createHtml(o);newNode=this.insertHtml('afterEnd',el,html);}
return newNode;};this.append=function(el,o){el=YAHOO.util.Dom.get(el);var newNode;if(this.useDom){newNode=createDom(o,null);el.appendChild(newNode);}else{var html=createHtml(o);newNode=this.insertHtml('beforeEnd',el,html);}
return newNode;};this.overwrite=function(el,o){el=YAHOO.util.Dom.get(el);el.innerHTML=createHtml(o);return el.firstChild;};this.createTemplate=function(o){var html=createHtml(o);return new YAHOO.ext.DomHelper.Template(html);};}();YAHOO.ext.DomHelper.Template=function(html){this.html=html;this.re=/\{(\w+)\}/g;};YAHOO.ext.DomHelper.Template.prototype={applyTemplate:function(values){if(this.compiled){return this.compiled(values);}
var empty='';var fn=function(match,index){if(typeof values[index]!='undefined'){return values[index];}else{return empty;}}
return this.html.replace(this.re,fn);},compile:function(){var html=this.html;var re=/\{(\w+)\}/g;var body=[];body.push("this.compiled = function(values){ return ");var result;var lastMatchEnd=0;while((result=re.exec(html))!=null){body.push("'",html.substring(lastMatchEnd,result.index),"' + ");body.push("values[",html.substring(result.index+1,re.lastIndex-1),"] + ");lastMatchEnd=re.lastIndex;}
body.push("'",html.substr(lastMatchEnd),"';};");eval(body.join(''));},insertBefore:function(el,values){el=YAHOO.util.Dom.get(el);return YAHOO.ext.DomHelper.insertHtml('beforeBegin',el,this.applyTemplate(values));},insertAfter:function(el,values){el=YAHOO.util.Dom.get(el);return YAHOO.ext.DomHelper.insertHtml('afterEnd',el,this.applyTemplate(values));},append:function(el,values){el=YAHOO.util.Dom.get(el);return YAHOO.ext.DomHelper.insertHtml('beforeEnd',el,this.applyTemplate(values));},overwrite:function(el,values){el=YAHOO.util.Dom.get(el);el.innerHTML='';return YAHOO.ext.DomHelper.insertHtml('beforeEnd',el,this.applyTemplate(values));}};