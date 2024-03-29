/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 */


YAHOO.ext.EventManager=new function(){this.wrap=function(fn,scope,override){var wrappedFn=function(e){YAHOO.ext.EventObject.setEvent(e);fn.call(override?scope||window:window,YAHOO.ext.EventObject,scope);};return wrappedFn;};this.addListener=function(element,eventName,fn,scope,override){var wrappedFn=this.wrap(fn,scope,override);YAHOO.util.Event.addListener(element,eventName,wrappedFn);return wrappedFn;};this.removeListener=function(element,eventName,wrappedFn){return YAHOO.util.Event.removeListener(element,eventName,wrappedFn);};this.on=function(element,eventName,fn,scope,override){var wrappedFn=this.wrap(fn,scope,override);YAHOO.util.Event.addListener(element,eventName,wrappedFn);return wrappedFn;};};YAHOO.ext.EventObject=new function(){this.browserEvent=null;this.button=-1;this.shiftKey=false;this.ctrlKey=false;this.altKey=false;this.BACKSPACE=8;this.TAB=9;this.RETURN=13;this.ESC=27;this.SPACE=32;this.PAGEUP=33;this.PAGEDOWN=34;this.END=35;this.HOME=36;this.LEFT=37;this.UP=38;this.RIGHT=39;this.DOWN=40;this.DELETE=46;this.F5=116;this.setEvent=function(e){this.browserEvent=e;if(e){this.button=e.button;this.shiftKey=e.shiftKey;this.ctrlKey=e.ctrlKey;this.altKey=e.altKey;}else{this.button=-1;this.shiftKey=false;this.ctrlKey=false;this.altKey=false;}};this.stopEvent=function(){if(this.browserEvent){YAHOO.util.Event.stopEvent(this.browserEvent);}};this.preventDefault=function(){if(this.browserEvent){YAHOO.util.Event.preventDefault(this.browserEvent);}};this.isNavKeyPress=function(){return(this.browserEvent.keyCode&&this.browserEvent.keyCode>=33&&this.browserEvent.keyCode<=40);};this.stopPropagation=function(){if(this.browserEvent){YAHOO.util.Event.stopPropagation(this.browserEvent);}};this.getCharCode=function(){if(this.browserEvent){return YAHOO.util.Event.getCharCode(this.browserEvent);}
return null;};this.getPageX=function(){if(this.browserEvent){return YAHOO.util.Event.getCharCode(this.browserEvent);}
return null;};this.getPageY=function(){if(this.browserEvent){return YAHOO.util.Event.getCharCode(this.browserEvent);}
return null;};this.getTime=function(){if(this.browserEvent){return YAHOO.util.Event.getTime(this.browserEvent);}
return null;};this.getXY=function(){if(this.browserEvent){return YAHOO.util.Event.getXY(this.browserEvent);}
return[];};this.getTarget=function(){if(this.browserEvent){return YAHOO.util.Event.getTarget(this.browserEvent);}
return null;};this.findTarget=function(className,tagName){if(tagName)tagName=tagName.toLowerCase();if(this.browserEvent){function isMatch(el){if(!el){return false;}
if(className&&!YAHOO.util.Dom.hasClass(el,className)){return false;}
if(tagName&&el.tagName.toLowerCase()!=tagName){return false;}
return true;};var t=this.getTarget();if(!t||isMatch(t)){return t;}
var p=t.parentNode;while(p&&p.tagName.toUpperCase()!='BODY'){if(isMatch(p)){return p;}
p=p.parentNode;}}
return null;};this.getRelatedTarget=function(){if(this.browserEvent){return YAHOO.util.Event.getRelatedTarget(this.browserEvent);}
return null;};this.getWheelDelta=function(){var e=this.browserEvent;var delta=0;if(e.wheelDelta){delta=e.wheelDelta/120;if(window.opera)delta=-delta;}else if(e.detail){delta=-e.detail/3;}
return delta;};this.hasModifier=function(){return this.ctrlKey||this.altKey||this.shiftKey;};}();