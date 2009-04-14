/*
 * Ext JS Library 1.0.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

YAHOO.util.Anim=function(el,_2,_3,_4){if(el){this.init(el,_2,_3,_4);}};YAHOO.util.Anim.prototype={toString:function(){var el=this.getEl();var id=el.id||el.tagName;return ("Anim "+id);},patterns:{noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i},doMethod:function(_7,_8,_9){return this.method(this.currentFrame,_8,_9-_8,this.totalFrames);},setAttribute:function(_a,_b,_c){if(this.patterns.noNegatives.test(_a)){_b=(_b>0)?_b:0;}YAHOO.util.Dom.setStyle(this.getEl(),_a,_b+_c);},getAttribute:function(_d){var el=this.getEl();var _f=YAHOO.util.Dom.getStyle(el,_d);if(_f!=="auto"&&!this.patterns.offsetUnit.test(_f)){return parseFloat(_f);}var a=this.patterns.offsetAttribute.exec(_d)||[];var pos=!!(a[3]);var box=!!(a[2]);if(box||(YAHOO.util.Dom.getStyle(el,"position")=="absolute"&&pos)){_f=el["offset"+a[0].charAt(0).toUpperCase()+a[0].substr(1)];}else{_f=0;}return _f;},getDefaultUnit:function(_13){if(this.patterns.defaultUnit.test(_13)){return "px";}return "";},setRuntimeAttribute:function(_14){var _15;var end;var _17=this.attributes;this.runtimeAttributes[_14]={};var _18=function(_19){return (typeof _19!=="undefined");};if(!_18(_17[_14]["to"])&&!_18(_17[_14]["by"])){return false;}_15=(_18(_17[_14]["from"]))?_17[_14]["from"]:this.getAttribute(_14);if(_18(_17[_14]["to"])){end=_17[_14]["to"];}else{if(_18(_17[_14]["by"])){if(_15.constructor==Array){end=[];for(var i=0,len=_15.length;i<len;++i){end[i]=_15[i]+_17[_14]["by"][i];}}else{end=_15+_17[_14]["by"];}}}this.runtimeAttributes[_14].start=_15;this.runtimeAttributes[_14].end=end;this.runtimeAttributes[_14].unit=(_18(_17[_14].unit))?_17[_14]["unit"]:this.getDefaultUnit(_14);},init:function(el,_1d,_1e,_1f){var _20=false;var _21=null;var _22=0;el=YAHOO.util.Dom.get(el);this.attributes=_1d||{};this.duration=_1e||1;this.method=_1f||YAHOO.util.Easing.easeNone;this.useSeconds=true;this.currentFrame=0;this.totalFrames=YAHOO.util.AnimMgr.fps;this.getEl=function(){return el;};this.isAnimated=function(){return _20;};this.getStartTime=function(){return _21;};this.runtimeAttributes={};this.animate=function(){if(this.isAnimated()){return false;}this.currentFrame=0;this.totalFrames=(this.useSeconds)?Math.ceil(YAHOO.util.AnimMgr.fps*this.duration):this.duration;YAHOO.util.AnimMgr.registerElement(this);};this.stop=function(_23){if(_23){this.currentFrame=this.totalFrames;this._onTween.fire();}YAHOO.util.AnimMgr.stop(this);};var _24=function(){this.onStart.fire();this.runtimeAttributes={};for(var _25 in this.attributes){this.setRuntimeAttribute(_25);}_20=true;_22=0;_21=new Date();};var _26=function(){var _27={duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame};_27.toString=function(){return ("duration: "+_27.duration+", currentFrame: "+_27.currentFrame);};this.onTween.fire(_27);var _28=this.runtimeAttributes;for(var _29 in _28){this.setAttribute(_29,this.doMethod(_29,_28[_29].start,_28[_29].end),_28[_29].unit);}_22+=1;};var _2a=function(){var _2b=(new Date()-_21)/1000;var _2c={duration:_2b,frames:_22,fps:_22/_2b};_2c.toString=function(){return ("duration: "+_2c.duration+", frames: "+_2c.frames+", fps: "+_2c.fps);};_20=false;_22=0;this.onComplete.fire(_2c);};this._onStart=new YAHOO.util.CustomEvent("_start",this,true);this.onStart=new YAHOO.util.CustomEvent("start",this);this.onTween=new YAHOO.util.CustomEvent("tween",this);this._onTween=new YAHOO.util.CustomEvent("_tween",this,true);this.onComplete=new YAHOO.util.CustomEvent("complete",this);this._onComplete=new YAHOO.util.CustomEvent("_complete",this,true);this._onStart.subscribe(_24);this._onTween.subscribe(_26);this._onComplete.subscribe(_2a);}};YAHOO.util.AnimMgr=new function(){var _2d=null;var _2e=[];var _2f=0;this.fps=1000;this.delay=1;this.registerElement=function(_30){_2e[_2e.length]=_30;_2f+=1;_30._onStart.fire();this.start();};this.unRegister=function(_31,_32){_31._onComplete.fire();_32=_32||_33(_31);if(_32!=-1){_2e.splice(_32,1);}_2f-=1;if(_2f<=0){this.stop();}};this.start=function(){if(_2d===null){_2d=setInterval(this.run,this.delay);}};this.stop=function(_34){if(!_34){clearInterval(_2d);for(var i=0,len=_2e.length;i<len;++i){if(_2e[0].isAnimated()){this.unRegister(_2e[0],0);}}_2e=[];_2d=null;_2f=0;}else{this.unRegister(_34);}};this.run=function(){for(var i=0,len=_2e.length;i<len;++i){var _39=_2e[i];if(!_39||!_39.isAnimated()){continue;}if(_39.currentFrame<_39.totalFrames||_39.totalFrames===null){_39.currentFrame+=1;if(_39.useSeconds){_3a(_39);}_39._onTween.fire();}else{YAHOO.util.AnimMgr.stop(_39,i);}}};var _33=function(_3b){for(var i=0,len=_2e.length;i<len;++i){if(_2e[i]==_3b){return i;}}return -1;};var _3a=function(_3e){var _3f=_3e.totalFrames;var _40=_3e.currentFrame;var _41=(_3e.currentFrame*_3e.duration*1000/_3e.totalFrames);var _42=(new Date()-_3e.getStartTime());var _43=0;if(_42<_3e.duration*1000){_43=Math.round((_42/_41-1)*_3e.currentFrame);}else{_43=_3f-(_40+1);}if(_43>0&&isFinite(_43)){if(_3e.currentFrame+_43>=_3f){_43=_3f-(_40+1);}_3e.currentFrame+=_43;}};};YAHOO.util.Bezier=new function(){this.getPosition=function(_44,t){var n=_44.length;var tmp=[];for(var i=0;i<n;++i){tmp[i]=[_44[i][0],_44[i][1]];}for(var j=1;j<n;++j){for(i=0;i<n-j;++i){tmp[i][0]=(1-t)*tmp[i][0]+t*tmp[parseInt(i+1,10)][0];tmp[i][1]=(1-t)*tmp[i][1]+t*tmp[parseInt(i+1,10)][1];}}return [tmp[0][0],tmp[0][1]];};};(function(){YAHOO.util.ColorAnim=function(el,_4b,_4c,_4d){YAHOO.util.ColorAnim.superclass.constructor.call(this,el,_4b,_4c,_4d);};YAHOO.extend(YAHOO.util.ColorAnim,YAHOO.util.Anim);var Y=YAHOO.util;var _4f=Y.ColorAnim.superclass;var _50=Y.ColorAnim.prototype;_50.toString=function(){var el=this.getEl();var id=el.id||el.tagName;return ("ColorAnim "+id);};_50.patterns.color=/color$/i;_50.patterns.rgb=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;_50.patterns.hex=/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;_50.patterns.hex3=/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;_50.patterns.transparent=/^transparent|rgba\(0, 0, 0, 0\)$/;_50.parseColor=function(s){if(s.length==3){return s;}var c=this.patterns.hex.exec(s);if(c&&c.length==4){return [parseInt(c[1],16),parseInt(c[2],16),parseInt(c[3],16)];}c=this.patterns.rgb.exec(s);if(c&&c.length==4){return [parseInt(c[1],10),parseInt(c[2],10),parseInt(c[3],10)];}c=this.patterns.hex3.exec(s);if(c&&c.length==4){return [parseInt(c[1]+c[1],16),parseInt(c[2]+c[2],16),parseInt(c[3]+c[3],16)];}return null;};_50.getAttribute=function(_55){var el=this.getEl();if(this.patterns.color.test(_55)){var val=YAHOO.util.Dom.getStyle(el,_55);if(this.patterns.transparent.test(val)){var _58=el.parentNode;val=Y.Dom.getStyle(_58,_55);while(_58&&this.patterns.transparent.test(val)){_58=_58.parentNode;val=Y.Dom.getStyle(_58,_55);if(_58.tagName.toUpperCase()=="HTML"){val="#fff";}}}}else{val=_4f.getAttribute.call(this,_55);}return val;};_50.doMethod=function(_59,_5a,end){var val;if(this.patterns.color.test(_59)){val=[];for(var i=0,len=_5a.length;i<len;++i){val[i]=_4f.doMethod.call(this,_59,_5a[i],end[i]);}val="rgb("+Math.floor(val[0])+","+Math.floor(val[1])+","+Math.floor(val[2])+")";}else{val=_4f.doMethod.call(this,_59,_5a,end);}return val;};_50.setRuntimeAttribute=function(_5f){_4f.setRuntimeAttribute.call(this,_5f);if(this.patterns.color.test(_5f)){var _60=this.attributes;var _61=this.parseColor(this.runtimeAttributes[_5f].start);var end=this.parseColor(this.runtimeAttributes[_5f].end);if(typeof _60[_5f]["to"]==="undefined"&&typeof _60[_5f]["by"]!=="undefined"){end=this.parseColor(_60[_5f].by);for(var i=0,len=_61.length;i<len;++i){end[i]=_61[i]+end[i];}}this.runtimeAttributes[_5f].start=_61;this.runtimeAttributes[_5f].end=end;}};})();YAHOO.util.Easing={easeNone:function(t,b,c,d){return c*t/d+b;},easeIn:function(t,b,c,d){return c*(t/=d)*t+b;},easeOut:function(t,b,c,d){return -c*(t/=d)*(t-2)+b;},easeBoth:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t+b;}return -c/2*((--t)*(t-2)-1)+b;},easeInStrong:function(t,b,c,d){return c*(t/=d)*t*t*t+b;},easeOutStrong:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b;},easeBothStrong:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t+b;}return -c/2*((t-=2)*t*t*t-2)+b;},elasticIn:function(t,b,c,d,a,p){if(t==0){return b;}if((t/=d)==1){return b+c;}if(!p){p=d*0.3;}if(!a||a<Math.abs(c)){a=c;var s=p/4;}else{var s=p/(2*Math.PI)*Math.asin(c/a);}return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;},elasticOut:function(t,b,c,d,a,p){if(t==0){return b;}if((t/=d)==1){return b+c;}if(!p){p=d*0.3;}if(!a||a<Math.abs(c)){a=c;var s=p/4;}else{var s=p/(2*Math.PI)*Math.asin(c/a);}return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},elasticBoth:function(t,b,c,d,a,p){if(t==0){return b;}if((t/=d/2)==2){return b+c;}if(!p){p=d*(0.3*1.5);}if(!a||a<Math.abs(c)){a=c;var s=p/4;}else{var s=p/(2*Math.PI)*Math.asin(c/a);}if(t<1){return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;}return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b;},backIn:function(t,b,c,d,s){if(typeof s=="undefined"){s=1.70158;}return c*(t/=d)*t*((s+1)*t-s)+b;},backOut:function(t,b,c,d,s){if(typeof s=="undefined"){s=1.70158;}return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},backBoth:function(t,b,c,d,s){if(typeof s=="undefined"){s=1.70158;}if((t/=d/2)<1){return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;}return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},bounceIn:function(t,b,c,d){return c-YAHOO.util.Easing.bounceOut(d-t,0,c,d)+b;},bounceOut:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else{if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b;}else{if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b;}}}return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b;},bounceBoth:function(t,b,c,d){if(t<d/2){return YAHOO.util.Easing.bounceIn(t*2,0,c,d)*0.5+b;}return YAHOO.util.Easing.bounceOut(t*2-d,0,c,d)*0.5+c*0.5+b;}};(function(){YAHOO.util.Motion=function(el,_b2,_b3,_b4){if(el){YAHOO.util.Motion.superclass.constructor.call(this,el,_b2,_b3,_b4);}};YAHOO.extend(YAHOO.util.Motion,YAHOO.util.ColorAnim);var Y=YAHOO.util;var _b6=Y.Motion.superclass;var _b7=Y.Motion.prototype;_b7.toString=function(){var el=this.getEl();var id=el.id||el.tagName;return ("Motion "+id);};_b7.patterns.points=/^points$/i;_b7.setAttribute=function(_ba,val,_bc){if(this.patterns.points.test(_ba)){_bc=_bc||"px";_b6.setAttribute.call(this,"left",val[0],_bc);_b6.setAttribute.call(this,"top",val[1],_bc);}else{_b6.setAttribute.call(this,_ba,val,_bc);}};_b7.getAttribute=function(_bd){if(this.patterns.points.test(_bd)){var val=[_b6.getAttribute.call(this,"left"),_b6.getAttribute.call(this,"top")];}else{val=_b6.getAttribute.call(this,_bd);}return val;};_b7.doMethod=function(_bf,_c0,end){var val=null;if(this.patterns.points.test(_bf)){var t=this.method(this.currentFrame,0,100,this.totalFrames)/100;val=Y.Bezier.getPosition(this.runtimeAttributes[_bf],t);}else{val=_b6.doMethod.call(this,_bf,_c0,end);}return val;};_b7.setRuntimeAttribute=function(_c4){if(this.patterns.points.test(_c4)){var el=this.getEl();var _c6=this.attributes;var _c7;var _c8=_c6["points"]["control"]||[];var end;var i,len;if(_c8.length>0&&!(_c8[0] instanceof Array)){_c8=[_c8];}else{var tmp=[];for(i=0,len=_c8.length;i<len;++i){tmp[i]=_c8[i];}_c8=tmp;}if(Y.Dom.getStyle(el,"position")=="static"){Y.Dom.setStyle(el,"position","relative");}if(_cd(_c6["points"]["from"])){Y.Dom.setXY(el,_c6["points"]["from"]);}else{Y.Dom.setXY(el,Y.Dom.getXY(el));}_c7=this.getAttribute("points");if(_cd(_c6["points"]["to"])){end=_ce.call(this,_c6["points"]["to"],_c7);var _cf=Y.Dom.getXY(this.getEl());for(i=0,len=_c8.length;i<len;++i){_c8[i]=_ce.call(this,_c8[i],_c7);}}else{if(_cd(_c6["points"]["by"])){end=[_c7[0]+_c6["points"]["by"][0],_c7[1]+_c6["points"]["by"][1]];for(i=0,len=_c8.length;i<len;++i){_c8[i]=[_c7[0]+_c8[i][0],_c7[1]+_c8[i][1]];}}}this.runtimeAttributes[_c4]=[_c7];if(_c8.length>0){this.runtimeAttributes[_c4]=this.runtimeAttributes[_c4].concat(_c8);}this.runtimeAttributes[_c4][this.runtimeAttributes[_c4].length]=end;}else{_b6.setRuntimeAttribute.call(this,_c4);}};var _ce=function(val,_d1){var _d2=Y.Dom.getXY(this.getEl());val=[val[0]-_d2[0]+_d1[0],val[1]-_d2[1]+_d1[1]];return val;};var _cd=function(_d3){return (typeof _d3!=="undefined");};})();(function(){YAHOO.util.Scroll=function(el,_d5,_d6,_d7){if(el){YAHOO.util.Scroll.superclass.constructor.call(this,el,_d5,_d6,_d7);}};YAHOO.extend(YAHOO.util.Scroll,YAHOO.util.ColorAnim);var Y=YAHOO.util;var _d9=Y.Scroll.superclass;var _da=Y.Scroll.prototype;_da.toString=function(){var el=this.getEl();var id=el.id||el.tagName;return ("Scroll "+id);};_da.doMethod=function(_dd,_de,end){var val=null;if(_dd=="scroll"){val=[this.method(this.currentFrame,_de[0],end[0]-_de[0],this.totalFrames),this.method(this.currentFrame,_de[1],end[1]-_de[1],this.totalFrames)];}else{val=_d9.doMethod.call(this,_dd,_de,end);}return val;};_da.getAttribute=function(_e1){var val=null;var el=this.getEl();if(_e1=="scroll"){val=[el.scrollLeft,el.scrollTop];}else{val=_d9.getAttribute.call(this,_e1);}return val;};_da.setAttribute=function(_e4,val,_e6){var el=this.getEl();if(_e4=="scroll"){el.scrollLeft=val[0];el.scrollTop=val[1];}else{_d9.setAttribute.call(this,_e4,val,_e6);}};})();YAHOO.register("animation",YAHOO.util.Anim,{version:"2.2.0",build:"127"});