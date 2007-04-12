/*
 * Ext JS Library 1.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

(function(){var D=Ext.lib.Dom;var E=Ext.lib.Event;var A=Ext.lib.Anim;var _4={};var _5=/(-[a-z])/gi;var _6=function(m,a){return a.charAt(1).toUpperCase();};var _9=document.defaultView;Ext.Element=function(_a,_b){var _c=typeof _a=="string"?document.getElementById(_a):_a;if(!_c){return null;}if(!_b&&Ext.Element.cache[_c.id]){return Ext.Element.cache[_c.id];}this.dom=_c;this.id=_c.id||Ext.id(_c);};var El=Ext.Element;El.prototype={originalDisplay:"",visibilityMode:1,defaultUnit:"px",setVisibilityMode:function(_e){this.visibilityMode=_e;return this;},enableDisplayMode:function(_f){this.setVisibilityMode(El.DISPLAY);if(typeof _f!="undefined"){this.originalDisplay=_f;}return this;},findParent:function(_10,_11,_12){var p=this.dom,b=document.body,_15=0,dq=Ext.DomQuery,_17;_11=_11||50;if(typeof _11!="number"){_17=Ext.getDom(_11);_11=10;}while(p&&p.nodeType==1&&_15<_11&&p!=b&&p!=_17){if(dq.is(p,_10)){return _12?Ext.get(p):p;}_15++;p=p.parentNode;}return null;},findParentNode:function(_18,_19,_1a){var p=Ext.fly(this.dom.parentNode,"_internal");return p?p.findParent(_18,_19,_1a):null;},is:function(_1c){return Ext.DomQuery.is(this.dom,_1c);},animate:function(_1d,_1e,_1f,_20,_21){this.anim(_1d,{duration:_1e,callback:_1f,easing:_20},_21);return this;},anim:function(_22,opt,_24,_25,_26,cb){_24=_24||"run";opt=opt||{};var _28=Ext.lib.Anim[_24](this.dom,_22,(opt.duration||_25)||0.35,(opt.easing||_26)||"easeOut",function(){Ext.callback(cb,this);Ext.callback(opt.callback,opt.scope||this,[this,opt]);},this);opt.anim=_28;return _28;},preanim:function(a,i){return !a[i]?false:(typeof a[i]=="object"?a[i]:{duration:a[i+1],callback:a[i+2],easing:a[i+3]});},clean:function(_2b){if(this.isCleaned&&_2b!==true){return this;}var ns=/\S/;var d=this.dom,n=d.firstChild,ni=-1;while(n){var nx=n.nextSibling;if(n.nodeType==3&&!ns.test(n.nodeValue)){d.removeChild(n);}else{n.nodeIndex=++ni;}n=nx;}this.isCleaned=true;return this;},calcOffsetsTo:function(el){el=Ext.get(el),d=el.dom;var _32=false;if(el.getStyle("position")=="static"){el.position("relative");_32=true;}var x=0,y=0;var op=this.dom;while(op&&op!=d&&op.tagName!="HTML"){x+=op.offsetLeft;y+=op.offsetTop;op=op.offsetParent;}if(_32){el.position("static");}return [x,y];},scrollIntoView:function(_36,_37){var c=Ext.getDom(_36)||document.body;var el=this.dom;var o=this.calcOffsetsTo(c),l=o[0],t=o[1],b=t+el.offsetHeight,r=l+el.offsetWidth;var ch=c.clientHeight;var ct=parseInt(c.scrollTop,10);var cl=parseInt(c.scrollLeft,10);var cb=ct+ch;var cr=cl+c.clientWidth;if(t<ct){c.scrollTop=t;}else{if(b>cb){c.scrollTop=b-ch;}}if(_37!==false){if(l<cl){c.scrollLeft=l;}else{if(r>cr){c.scrollLeft=r-c.clientWidth;}}}return this;},scrollChildIntoView:function(_44){Ext.fly(_44,"_scrollChildIntoView").scrollIntoView(this);},autoHeight:function(_45,_46,_47,_48){var _49=this.getHeight();this.clip();this.setHeight(1);setTimeout(function(){var _4a=parseInt(this.dom.scrollHeight,10);if(!_45){this.setHeight(_4a);this.unclip();if(typeof _47=="function"){_47();}}else{this.setHeight(_49);this.setHeight(_4a,_45,_46,function(){this.unclip();if(typeof _47=="function"){_47();}}.createDelegate(this),_48);}}.createDelegate(this),0);return this;},contains:function(el){if(!el){return false;}return D.isAncestor(this.dom,el.dom?el.dom:el);},isVisible:function(_4c){var vis=!(this.getStyle("visibility")=="hidden"||this.getStyle("display")=="none");if(_4c!==true||!vis){return vis;}var p=this.dom.parentNode;while(p&&p.tagName.toLowerCase()!="body"){if(!Ext.fly(p,"_isVisible").isVisible()){return false;}p=p.parentNode;}return true;},select:function(_4f,_50){return El.select("#"+Ext.id(this.dom)+" "+_4f,_50);},query:function(_51,_52){return Ext.DomQuery.select(_51,this.dom);},child:function(_53,_54){var n=Ext.DomQuery.selectNode(_53,this.dom);return _54?n:Ext.get(n);},initDD:function(_56,_57,_58){var dd=new Ext.dd.DD(Ext.id(this.dom),_56,_57);return Ext.apply(dd,_58);},initDDProxy:function(_5a,_5b,_5c){var dd=new Ext.dd.DDProxy(Ext.id(this.dom),_5a,_5b);return Ext.apply(dd,_5c);},initDDTarget:function(_5e,_5f,_60){var dd=new Ext.dd.DDTarget(Ext.id(this.dom),_5e,_5f);return Ext.apply(dd,_60);},setVisible:function(_62,_63){if(!_63||!A){if(this.visibilityMode==El.DISPLAY){this.setDisplayed(_62);}else{this.fixDisplay();this.dom.style.visibility=_62?"visible":"hidden";}}else{var dom=this.dom;var _65=this.visibilityMode;if(_62){this.setOpacity(0.01);this.setVisible(true);}this.anim({opacity:{to:(_62?1:0)}},this.preanim(arguments,1),null,0.35,"easeIn",function(){if(!_62){if(_65==El.DISPLAY){dom.style.display="none";}else{dom.style.visibility="hidden";}Ext.get(dom).setOpacity(1);}});}return this;},isDisplayed:function(){return this.getStyle("display")!="none";},toggle:function(_66){this.setVisible(!this.isVisible(),this.preanim(arguments,0));return this;},setDisplayed:function(_67){if(typeof _67=="boolean"){_67=_67?this.originalDisplay:"none";}this.setStyle("display",_67);return this;},focus:function(){try{this.dom.focus();}catch(e){}return this;},blur:function(){try{this.dom.blur();}catch(e){}return this;},addClass:function(_68){if(_68 instanceof Array){for(var i=0,len=_68.length;i<len;i++){this.addClass(_68[i]);}}else{if(_68&&!this.hasClass(_68)){this.dom.className=this.dom.className+" "+_68;}}return this;},radioClass:function(_6b){var _6c=this.dom.parentNode.childNodes;for(var i=0;i<_6c.length;i++){var s=_6c[i];if(s.nodeType==1){Ext.get(s).removeClass(_6b);}}this.addClass(_6b);return this;},removeClass:function(_6f){if(!_6f||!this.dom.className){return this;}if(_6f instanceof Array){for(var i=0,len=_6f.length;i<len;i++){this.removeClass(_6f[i]);}}else{if(this.hasClass(_6f)){var re=this.classReCache[_6f];if(!re){re=new RegExp("(?:^|\\s+)"+_6f+"(?:\\s+|$)","g");this.classReCache[_6f]=re;}this.dom.className=this.dom.className.replace(re," ");}}return this;},classReCache:{},toggleClass:function(_73){if(this.hasClass(_73)){this.removeClass(_73);}else{this.addClass(_73);}return this;},hasClass:function(_74){return _74&&(" "+this.dom.className+" ").indexOf(" "+_74+" ")!=-1;},replaceClass:function(_75,_76){this.removeClass(_75);this.addClass(_76);return this;},getStyles:function(){var a=arguments,len=a.length,r={};for(var i=0;i<len;i++){r[a[i]]=this.getStyle(a[i]);}return r;},getStyle:function(){return _9&&_9.getComputedStyle?function(_7b){var el=this.dom,v,cs,_7f;if(_7b=="float"){_7b="cssFloat";}if(v=el.style[_7b]){return v;}if(cs=_9.getComputedStyle(el,"")){if(!(_7f=_4[_7b])){_7f=_4[_7b]=_7b.replace(_5,_6);}return cs[_7f];}return null;}:function(_80){var el=this.dom,v,cs,_84;if(_80=="opacity"){if(typeof el.filter=="string"){var fv=parseFloat(el.filter.match(/alpha\(opacity=(.*)\)/i)[1]);if(!isNaN(fv)){return fv?fv/100:0;}}return 1;}else{if(_80=="float"){_80="styleFloat";}}if(!(_84=_4[_80])){_84=_4[_80]=_80.replace(_5,_6);}if(v=el.style[_84]){return v;}if(cs=el.currentStyle){return cs[_84];}return null;};}(),setStyle:function(_86,_87){if(typeof _86=="string"){var _88;if(!(_88=_4[_86])){_88=_4[_86]=_86.replace(_5,_6);}if(_88=="opacity"){this.setOpacity(_87);}else{this.dom.style[_88]=_87;}}else{for(var _89 in _86){if(typeof _86[_89]!="function"){this.setStyle(_89,_86[_89]);}}}return this;},applyStyles:function(_8a){Ext.DomHelper.applyStyles(this.dom,_8a);return this;},getX:function(){return D.getX(this.dom);},getY:function(){return D.getY(this.dom);},getXY:function(){return D.getXY(this.dom);},setX:function(x,_8c){if(!_8c||!A){D.setX(this.dom,x);}else{this.setXY([x,this.getY()],this.preanim(arguments,1));}return this;},setY:function(y,_8e){if(!_8e||!A){D.setY(this.dom,y);}else{this.setXY([this.getX(),y],this.preanim(arguments,1));}return this;},setLeft:function(_8f){this.setStyle("left",this.addUnits(_8f));return this;},setTop:function(top){this.setStyle("top",this.addUnits(top));return this;},setRight:function(_91){this.setStyle("right",this.addUnits(_91));return this;},setBottom:function(_92){this.setStyle("bottom",this.addUnits(_92));return this;},setXY:function(pos,_94){if(!_94||!A){D.setXY(this.dom,pos);}else{this.anim({points:{to:pos}},this.preanim(arguments,1),"motion");}return this;},setLocation:function(x,y,_97){this.setXY([x,y],this.preanim(arguments,2));return this;},moveTo:function(x,y,_9a){this.setXY([x,y],this.preanim(arguments,2));return this;},getRegion:function(){return D.getRegion(this.dom);},getHeight:function(_9b){var h=this.dom.offsetHeight||0;return _9b!==true?h:h-this.getBorderWidth("tb")-this.getPadding("tb");},getWidth:function(_9d){var w=this.dom.offsetWidth||0;return _9d!==true?w:w-this.getBorderWidth("lr")-this.getPadding("lr");},getComputedHeight:function(){var h=Math.max(this.dom.offsetHeight,this.dom.clientHeight);if(!h){h=parseInt(this.getStyle("height"),10)||0;if(!this.isBorderBox()){h+=this.getFrameWidth("tb");}}return h;},getComputedWidth:function(){var w=Math.max(this.dom.offsetWidth,this.dom.clientWidth);if(!w){w=parseInt(this.getStyle("width"),10)||0;if(!this.isBorderBox()){w+=this.getFrameWidth("lr");}}return w;},getSize:function(_a1){return {width:this.getWidth(_a1),height:this.getHeight(_a1)};},getValue:function(_a2){return _a2?parseInt(this.dom.value,10):this.dom.value;},adjustWidth:function(_a3){if(typeof _a3=="number"){if(this.autoBoxAdjust&&!this.isBorderBox()){_a3-=(this.getBorderWidth("lr")+this.getPadding("lr"));}if(_a3<0){_a3=0;}}return _a3;},adjustHeight:function(_a4){if(typeof _a4=="number"){if(this.autoBoxAdjust&&!this.isBorderBox()){_a4-=(this.getBorderWidth("tb")+this.getPadding("tb"));}if(_a4<0){_a4=0;}}return _a4;},setWidth:function(_a5,_a6){_a5=this.adjustWidth(_a5);if(!_a6||!A){this.dom.style.width=this.addUnits(_a5);}else{this.anim({width:{to:_a5}},this.preanim(arguments,1));}return this;},setHeight:function(_a7,_a8){_a7=this.adjustHeight(_a7);if(!_a8||!A){this.dom.style.height=this.addUnits(_a7);}else{this.anim({height:{to:_a7}},this.preanim(arguments,1));}return this;},setSize:function(_a9,_aa,_ab){if(typeof _a9=="object"){_aa=_a9.height;_a9=_a9.width;}_a9=this.adjustWidth(_a9);_aa=this.adjustHeight(_aa);if(!_ab||!A){this.dom.style.width=this.addUnits(_a9);this.dom.style.height=this.addUnits(_aa);}else{this.anim({width:{to:_a9},height:{to:_aa}},this.preanim(arguments,2));}return this;},setBounds:function(x,y,_ae,_af,_b0){if(!_b0||!A){this.setSize(_ae,_af);this.setLocation(x,y);}else{_ae=this.adjustWidth(_ae);_af=this.adjustHeight(_af);this.anim({points:{to:[x,y]},width:{to:_ae},height:{to:_af}},this.preanim(arguments,4),"motion");}return this;},setRegion:function(_b1,_b2){this.setBounds(_b1.left,_b1.top,_b1.right-_b1.left,_b1.bottom-_b1.top,this.preanim(arguments,1));return this;},addListener:function(_b3,fn,_b5,_b6){Ext.EventManager.on(this.dom,_b3,fn,_b5||this,_b6);},removeListener:function(_b7,fn){Ext.EventManager.removeListener(this.dom,_b7,fn);return this;},removeAllListeners:function(){E.purgeElement(this.dom);return this;},relayEvent:function(_b9,_ba){this.on(_b9,function(e){_ba.fireEvent(_b9,e);});},setOpacity:function(_bc,_bd){if(!_bd||!A){var s=this.dom.style;if(Ext.isIE){s.zoom=1;s.filter=(s.filter||"").replace(/alpha\([^\)]*\)/gi,"")+(_bc==1?"":"alpha(opacity="+_bc*100+")");}else{s.opacity=_bc;}}else{this.anim({opacity:{to:_bc}},this.preanim(arguments,1),null,0.35,"easeIn");}return this;},getLeft:function(_bf){if(!_bf){return this.getX();}else{return parseInt(this.getStyle("left"),10)||0;}},getRight:function(_c0){if(!_c0){return this.getX()+this.getWidth();}else{return (this.getLeft(true)+this.getWidth())||0;}},getTop:function(_c1){if(!_c1){return this.getY();}else{return parseInt(this.getStyle("top"),10)||0;}},getBottom:function(_c2){if(!_c2){return this.getY()+this.getHeight();}else{return (this.getTop(true)+this.getHeight())||0;}},position:function(pos,_c4,x,y){if(!pos){if(this.getStyle("position")=="static"){this.setStyle("position","relative");}}else{this.setStyle("position",pos);}if(_c4){this.setStyle("z-index",_c4);}if(x!==undefined&&y!==undefined){this.setXY([x,y]);}else{if(x!==undefined){this.setX(x);}else{if(y!==undefined){this.setY(y);}}}},clearPositioning:function(_c7){_c7=_c7||"";this.setStyle({"left":_c7,"right":_c7,"top":_c7,"bottom":_c7,"z-index":"","position":"static"});return this;},getPositioning:function(){var l=this.getStyle("left");var t=this.getStyle("top");return {"position":this.getStyle("position"),"left":l,"right":l?"":this.getStyle("right"),"top":t,"bottom":t?"":this.getStyle("bottom"),"z-index":this.getStyle("z-index")};},getBorderWidth:function(_ca){return this.addStyles(_ca,El.borders);},getPadding:function(_cb){return this.addStyles(_cb,El.paddings);},setPositioning:function(pc){this.applyStyles(pc);if(pc.right=="auto"){this.dom.style.right="";}if(pc.bottom=="auto"){this.dom.style.bottom="";}return this;},fixDisplay:function(){if(this.getStyle("display")=="none"){this.setStyle("visibility","hidden");this.setStyle("display",this.originalDisplay);if(this.getStyle("display")=="none"){this.setStyle("display","block");}}},setLeftTop:function(_cd,top){this.dom.style.left=this.addUnits(_cd);this.dom.style.top=this.addUnits(top);return this;},move:function(_cf,_d0,_d1){var xy=this.getXY();_cf=_cf.toLowerCase();switch(_cf){case "l":case "left":this.moveTo(xy[0]-_d0,xy[1],this.preanim(arguments,2));break;case "r":case "right":this.moveTo(xy[0]+_d0,xy[1],this.preanim(arguments,2));break;case "t":case "top":case "up":this.moveTo(xy[0],xy[1]-_d0,this.preanim(arguments,2));break;case "b":case "bottom":case "down":this.moveTo(xy[0],xy[1]+_d0,this.preanim(arguments,2));break;}return this;},clip:function(){if(!this.isClipped){this.isClipped=true;this.originalClip={"o":this.getStyle("overflow"),"x":this.getStyle("overflow-x"),"y":this.getStyle("overflow-y")};this.setStyle("overflow","hidden");this.setStyle("overflow-x","hidden");this.setStyle("overflow-y","hidden");}return this;},unclip:function(){if(this.isClipped){this.isClipped=false;var o=this.originalClip;if(o.o){this.setStyle("overflow",o.o);}if(o.x){this.setStyle("overflow-x",o.x);}if(o.y){this.setStyle("overflow-y",o.y);}}return this;},getAnchorXY:function(_d4,_d5,s){var w,h,vp=false;if(!s){var d=this.dom;if(d==document.body||d==document){vp=true;w=D.getViewWidth();h=D.getViewHeight();}else{w=this.getWidth();h=this.getHeight();}}else{w=s.width;h=s.height;}var x=0,y=0,r=Math.round;switch((_d4||"tl").toLowerCase()){case "c":x=r(w*0.5);y=r(h*0.5);break;case "t":x=r(w*0.5);y=0;break;case "l":x=0;y=r(h*0.5);break;case "r":x=w;y=r(h*0.5);break;case "b":x=r(w*0.5);y=h;break;case "tl":x=0;y=0;break;case "bl":x=0;y=h;break;case "br":x=w;y=h;break;case "tr":x=w;y=0;break;}if(_d5===true){return [x,y];}if(vp){var sc=this.getScroll();return [x+sc.left,y+sc.top];}var o=this.getXY();return [x+o[0],y+o[1]];},getAlignToXY:function(el,p,o){el=Ext.get(el),d=this.dom;if(!el.dom){throw "Element.alignTo with an element that doesn't exist";}var c=false;var p1="",p2="";o=o||[0,0];if(!p){p="tl-bl";}else{if(p=="?"){p="tl-bl?";}else{if(p.indexOf("-")==-1){p="tl-"+p;}}}p=p.toLowerCase();var m=p.match(/^([a-z]+)-([a-z]+)(\?)?$/);if(!m){throw "Element.alignTo with an invalid alignment "+p;}p1=m[1],p2=m[2],c=m[3]?true:false;var a1=this.getAnchorXY(p1,true);var a2=el.getAnchorXY(p2,false);var x=a2[0]-a1[0]+o[0];var y=a2[1]-a1[1]+o[1];if(c){var w=this.getWidth(),h=this.getHeight(),r=el.getRegion();var dw=D.getViewWidth()-5,dh=D.getViewHeight()-5;var p1y=p1.charAt(0),p1x=p1.charAt(p1.length-1);var p2y=p2.charAt(0),p2x=p2.charAt(p2.length-1);var _f4=((p1y=="t"&&p2y=="b")||(p1y=="b"&&p2y=="t"));var _f5=((p1x=="r"&&p2x=="l")||(p1x=="l"&&p2x=="r"));var doc=document;var _f7=(doc.documentElement.scrollLeft||doc.body.scrollLeft||0)+5;var _f8=(doc.documentElement.scrollTop||doc.body.scrollTop||0)+5;if((x+w)>dw){x=_f5?r.left-w:dw-w;}if(x<_f7){x=_f5?r.right:_f7;}if((y+h)>dh){y=_f4?r.top-h:dh-h;}if(y<_f8){y=_f4?r.bottom:_f8;}}return [x,y];},alignTo:function(_f9,_fa,_fb,_fc){var xy=this.getAlignToXY(_f9,_fa,_fb);this.setXY(xy,this.preanim(arguments,3));return this;},anchorTo:function(el,_ff,_100,_101,_102,_103){var _104=function(){this.alignTo(el,_ff,_100,_101);Ext.callback(_103,this);};Ext.EventManager.onWindowResize(_104,this);var tm=typeof _102;if(tm!="undefined"){Ext.EventManager.on(window,"scroll",_104,this,{buffer:tm=="number"?_102:50});}_104.call(this);return this;},clearOpacity:function(){if(window.ActiveXObject){this.dom.style.filter="";}else{this.dom.style.opacity="";this.dom.style["-moz-opacity"]="";this.dom.style["-khtml-opacity"]="";}return this;},hide:function(_106){this.setVisible(false,this.preanim(arguments,0));return this;},show:function(_107){this.setVisible(true,this.preanim(arguments,0));return this;},addUnits:function(size){return Ext.Element.addUnits(size,this.defaultUnit);},beginMeasure:function(){var el=this.dom;if(el.offsetWidth||el.offsetHeight){return this;}var _10a=[];var p=this.dom,b=document.body;while((!el.offsetWidth&&!el.offsetHeight)&&p&&p.tagName&&p!=b){var pe=Ext.get(p);if(pe.getStyle("display")=="none"){_10a.push({el:p,visibility:pe.getStyle("visibility")});p.style.visibility="hidden";p.style.display="block";}p=p.parentNode;}this._measureChanged=_10a;return this;},endMeasure:function(){var _10e=this._measureChanged;if(_10e){for(var i=0,len=_10e.length;i<len;i++){var r=_10e[i];r.el.style.visibility=r.visibility;r.el.style.display="none";}this._measureChanged=null;}return this;},update:function(html,_113,_114){if(typeof html=="undefined"){html="";}if(_113!==true){this.dom.innerHTML=html;if(typeof _114=="function"){_114();}return this;}var id=Ext.id();var dom=this.dom;html+="<span id=\""+id+"\"></span>";E.onAvailable(id,function(){var hd=document.getElementsByTagName("head")[0];var re=/(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/img;var _119=/\ssrc=([\'\"])(.*?)\1/i;var _11a;while(_11a=re.exec(html)){var _11b=_11a[1]?_11a[1].match(_119):false;if(_11b&&_11b[2]){var s=document.createElement("script");s.src=_11b[2];hd.appendChild(s);}else{if(_11a[2]&&_11a[2].length>0){eval(_11a[2]);}}}var el=document.getElementById(id);if(el){el.parentNode.removeChild(el);}if(typeof _114=="function"){_114();}});dom.innerHTML=html.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/img,"");return this;},load:function(){var um=this.getUpdateManager();um.update.apply(um,arguments);return this;},getUpdateManager:function(){if(!this.updateManager){this.updateManager=new Ext.UpdateManager(this);}return this.updateManager;},unselectable:function(){this.dom.unselectable="on";this.swallowEvent("selectstart",true);this.applyStyles("-moz-user-select:none;-khtml-user-select:none;");this.addClass("x-unselectable");return this;},getCenterXY:function(){return this.getAlignToXY(document,"c-c");},center:function(_11f){this.alignTo(_11f||document,"c-c");return this;},isBorderBox:function(){return _120[this.dom.tagName.toLowerCase()]||Ext.isBorderBox;},getBox:function(_121,_122){var xy;if(!_122){xy=this.getXY();}else{var left=parseInt(this.getStyle("left"),10)||0;var top=parseInt(this.getStyle("top"),10)||0;xy=[left,top];}var el=this.dom,w=el.offsetWidth,h=el.offsetHeight,bx;if(!_121){bx={x:xy[0],y:xy[1],width:w,height:h};}else{var l=this.getBorderWidth("l")+this.getPadding("l");var r=this.getBorderWidth("r")+this.getPadding("r");var t=this.getBorderWidth("t")+this.getPadding("t");var b=this.getBorderWidth("b")+this.getPadding("b");bx={x:xy[0]+l,y:xy[1]+t,width:w-(l+r),height:h-(t+b)};}bx.right=bx.x+bx.width;bx.bottom=bx.y+bx.height;return bx;},getFrameWidth:function(_12e){return this.getPadding(_12e)+this.getBorderWidth(_12e);},setBox:function(box,_130,_131){var w=box.width,h=box.height;if((_130&&!this.autoBoxAdjust)&&!this.isBorderBox()){w-=(this.getBorderWidth("lr")+this.getPadding("lr"));h-=(this.getBorderWidth("tb")+this.getPadding("tb"));}this.setBounds(box.x,box.y,w,h,this.preanim(arguments,2));return this;},repaint:function(){var dom=this.dom;this.addClass("x-repaint");setTimeout(function(){Ext.get(dom).removeClass("x-repaint");},1);return this;},getMargins:function(side){if(!side){return {top:parseInt(this.getStyle("margin-top"),10)||0,left:parseInt(this.getStyle("margin-left"),10)||0,bottom:parseInt(this.getStyle("margin-bottom"),10)||0,right:parseInt(this.getStyle("margin-right"),10)||0};}else{return this.addStyles(side,El.margins);}},addStyles:function(_136,_137){var val=0;for(var i=0,len=_136.length;i<len;i++){var w=parseInt(this.getStyle(_137[_136.charAt(i)]),10);if(!isNaN(w)){val+=w;}}return val;},createProxy:function(_13c,_13d,_13e){if(_13d){_13d=Ext.getDom(_13d);}else{_13d=document.body;}_13c=typeof _13c=="object"?_13c:{tag:"div",cls:_13c};var _13f=Ext.DomHelper.append(_13d,_13c,true);if(_13e){_13f.setBox(this.getBox());}return _13f;},mask:function(msg,_141){if(this.getStyle("position")=="static"){this.setStyle("position","relative");}if(!this._mask){this._mask=Ext.DomHelper.append(this.dom,{tag:"div",cls:"ext-el-mask"},true);}this.addClass("x-masked");this._mask.setDisplayed(true);if(typeof msg=="string"){if(!this._maskMsg){this._maskMsg=Ext.DomHelper.append(this.dom,{tag:"div",cls:"ext-el-mask-msg",cn:{tag:"div"}},true);}var mm=this._maskMsg;mm.dom.className=_141?"ext-el-mask-msg "+_141:"ext-el-mask-msg";mm.dom.firstChild.innerHTML=msg;mm.setDisplayed(true);mm.center(this);}return this._mask;},unmask:function(_143){if(this._mask){if(_143===true){this._mask.remove();delete this._mask;if(this._maskMsg){this._maskMsg.remove();delete this._maskMsg;}}else{this._mask.setDisplayed(false);if(this._maskMsg){this._maskMsg.setDisplayed(false);}}}this.removeClass("x-masked");},isMasked:function(){return this._mask&&this._mask.isVisible();},createShim:function(){var _144={tag:"iframe",frameBorder:"no",cls:"yiframe-shim",style:"position:absolute;visibility:hidden;left:0;top:0;overflow:hidden;",src:Ext.SSL_SECURE_URL};var shim=Ext.DomHelper.insertBefore(this.dom,_144,true);shim.setOpacity(0.01);shim.setBox(this.getBox());return shim;},remove:function(){if(this.dom.parentNode){this.dom.parentNode.removeChild(this.dom);}delete El.cache[this.dom.id];},addClassOnOver:function(_146,_147){this.on("mouseover",function(){Ext.fly(this,"_internal").addClass(_146);},this.dom);var _148=function(e){if(_147!==true||!e.within(this,true)){Ext.fly(this,"_internal").removeClass(_146);}};this.on("mouseout",_148,this.dom);return this;},addClassOnFocus:function(_14a){this.on("focus",function(){Ext.fly(this,"_internal").addClass(_14a);},this.dom);this.on("blur",function(){Ext.fly(this,"_internal").removeClass(_14a);},this.dom);return this;},addClassOnClick:function(_14b){var dom=this.dom;this.on("mousedown",function(){Ext.fly(dom,"_internal").addClass(_14b);var d=Ext.get(document);var fn=function(){Ext.fly(dom,"_internal").removeClass(_14b);d.removeListener("mouseup",fn);};d.on("mouseup",fn);});return this;},swallowEvent:function(_14f,_150){var fn=function(e){e.stopPropagation();if(_150){e.preventDefault();}};if(_14f instanceof Array){for(var i=0,len=_14f.length;i<len;i++){this.on(_14f[i],fn);}return this;}this.on(_14f,fn);return this;},fitToParent:function(_155,_156){var p=Ext.get(_156||this.dom.parentNode);this.setSize(p.getComputedWidth()-p.getFrameWidth("lr"),p.getComputedHeight()-p.getFrameWidth("tb"));if(_155===true){Ext.EventManager.onWindowResize(this.fitToParent.createDelegate(this,[]));}return this;},getNextSibling:function(){var n=this.dom.nextSibling;while(n&&n.nodeType!=1){n=n.nextSibling;}return n;},getPrevSibling:function(){var n=this.dom.previousSibling;while(n&&n.nodeType!=1){n=n.previousSibling;}return n;},appendChild:function(el){el=Ext.get(el);el.appendTo(this);return this;},createChild:function(_15b,_15c,_15d){_15b=_15b||{tag:"div"};if(_15c){return Ext.DomHelper.insertBefore(_15c,_15b,_15d!==true);}return Ext.DomHelper.append(this.dom,_15b,_15d!==true);},appendTo:function(el){el=Ext.getDom(el);el.appendChild(this.dom);return this;},insertBefore:function(el){el=Ext.getDom(el);el.parentNode.insertBefore(this.dom,el);return this;},insertAfter:function(el){el=Ext.getDom(el);el.parentNode.insertBefore(this.dom,el.nextSibling);return this;},insertFirst:function(el,_162){el=el||{};if(typeof el=="object"&&!el.nodeType){return this.createChild(el,this.dom.firstChild,_162);}else{el=Ext.getDom(el);this.dom.insertBefore(el,this.dom.firstChild);return !_162?Ext.get(el):el;}},insertSibling:function(el,_164,_165){_164=_164?_164.toLowerCase():"before";el=el||{};var rt,_167=_164=="before"?this.dom:this.dom.nextSibling;if(typeof el=="object"&&!el.nodeType){if(_164=="after"&&!this.dom.nextSibling){rt=Ext.DomHelper.append(this.dom.parentNode,el,!_165);}else{rt=Ext.DomHelper[_164=="after"?"insertAfter":"insertBefore"](this.dom,el,!_165);}}else{rt=this.dom.parentNode.insertBefore(Ext.getDom(el),_164=="before"?this.dom:this.dom.nextSibling);if(!_165){rt=Ext.get(rt);}}return rt;},wrap:function(_168,_169){if(!_168){_168={tag:"div"};}var _16a=Ext.DomHelper.insertBefore(this.dom,_168,!_169);_16a.dom?_16a.dom.appendChild(this.dom):_16a.appendChild(this.dom);return _16a;},replace:function(el){el=Ext.get(el);this.insertBefore(el);el.remove();return this;},insertHtml:function(_16c,html){return Ext.DomHelper.insertHtml(_16c,this.dom,html);},set:function(o,_16f){var el=this.dom;_16f=typeof _16f=="undefined"?(el.setAttribute?true:false):_16f;for(var attr in o){if(attr=="style"||typeof o[attr]=="function"){continue;}if(attr=="cls"){el.className=o["cls"];}else{if(_16f){el.setAttribute(attr,o[attr]);}else{el[attr]=o[attr];}}}Ext.DomHelper.applyStyles(el,o.style);return this;},addKeyListener:function(key,fn,_174){var _175;if(typeof key!="object"||key instanceof Array){_175={key:key,fn:fn,scope:_174};}else{_175={key:key.key,shift:key.shift,ctrl:key.ctrl,alt:key.alt,fn:fn,scope:_174};}return new Ext.KeyMap(this,_175);},addKeyMap:function(_176){return new Ext.KeyMap(this,_176);},isScrollable:function(){var dom=this.dom;return dom.scrollHeight>dom.clientHeight||dom.scrollWidth>dom.clientWidth;},scrollTo:function(side,_179,_17a){var prop=side.toLowerCase()=="left"?"scrollLeft":"scrollTop";if(!_17a||!A){this.dom[prop]=_179;}else{var to=prop=="scrollLeft"?[_179,this.dom.scrollTop]:[this.dom.scrollLeft,_179];this.anim({scroll:{"to":to}},this.preanim(arguments,2),"scroll");}return this;},scroll:function(_17d,_17e,_17f){if(!this.isScrollable()){return;}var el=this.dom;var l=el.scrollLeft,t=el.scrollTop;var w=el.scrollWidth,h=el.scrollHeight;var cw=el.clientWidth,ch=el.clientHeight;_17d=_17d.toLowerCase();var _187=false;var a=this.preanim(arguments,2);switch(_17d){case "l":case "left":if(w-l>cw){var v=Math.min(l+_17e,w-cw);this.scrollTo("left",v,a);_187=true;}break;case "r":case "right":if(l>0){var v=Math.max(l-_17e,0);this.scrollTo("left",v,a);_187=true;}break;case "t":case "top":case "up":if(t>0){var v=Math.max(t-_17e,0);this.scrollTo("top",v,a);_187=true;}break;case "b":case "bottom":case "down":if(h-t>ch){var v=Math.min(t+_17e,h-ch);this.scrollTo("top",v,a);_187=true;}break;}return _187;},translatePoints:function(x,y){if(typeof x=="object"||x instanceof Array){y=x[1];x=x[0];}var p=this.getStyle("position");var o=this.getXY();var l=parseInt(this.getStyle("left"),10);var t=parseInt(this.getStyle("top"),10);if(isNaN(l)){l=(p=="relative")?0:this.dom.offsetLeft;}if(isNaN(t)){t=(p=="relative")?0:this.dom.offsetTop;}return {left:(x-o[0]+l),top:(y-o[1]+t)};},getScroll:function(){var d=this.dom,doc=document;if(d==doc||d==doc.body){var l=window.pageXOffset||doc.documentElement.scrollLeft||doc.body.scrollLeft||0;var t=window.pageYOffset||doc.documentElement.scrollTop||doc.body.scrollTop||0;return {left:l,top:t};}else{return {left:d.scrollLeft,top:d.scrollTop};}},getColor:function(attr,_195,_196){var v=this.getStyle(attr);if(!v||v=="transparent"||v=="inherit"){return _195;}var _198=typeof _196=="undefined"?"#":_196;if(v.substr(0,4)=="rgb("){var rvs=v.slice(4,v.length-1).split(",");for(var i=0;i<3;i++){var h=parseInt(rvs[i]).toString(16);if(h<16){h="0"+h;}_198+=h;}}else{if(v.substr(0,1)=="#"){if(v.length==4){for(var i=1;i<4;i++){var c=v.charAt(i);_198+=c+c;}}else{if(v.length==7){_198+=v.substr(1);}}}}return (_198.length>5?_198.toLowerCase():_195);},boxWrap:function(cls){cls=cls||"x-box";var el=Ext.get(this.insertHtml("beforeBegin",String.format("<div class=\"{0}\"><div class=\"{0}-tl\"><div class=\"{0}-tr\"><div class=\"{0}-tc\"></div></div></div><div class=\"{0}-ml\"><div class=\"{0}-mr\"><div class=\"{0}-mc\"></div></div></div><div class=\"{0}-bl\"><div class=\"{0}-br\"><div class=\"{0}-bc\"></div></div></div></div>",cls)));el.child("."+cls+"-mc").dom.appendChild(this.dom);return el;},getAttributeNS:Ext.isIE?function(ns,name){var d=this.dom;var type=typeof d[ns+":"+name];if(type!="undefined"&&type!="unknown"){return d[ns+":"+name];}return d[name];}:function(ns,name){var d=this.dom;return d.getAttributeNS(ns,name)||d.getAttribute(ns+":"+name)||d.getAttribute(name)||d[name];}};var ep=El.prototype;ep.on=ep.addListener;ep.mon=ep.addListener;ep.un=ep.removeListener;ep.autoBoxAdjust=true;ep.autoDisplayMode=true;El.unitPattern=/\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i;El.addUnits=function(v,_1a8){if(v===""||v=="auto"){return v;}if(v===undefined){return "";}if(typeof v=="number"||!El.unitPattern.test(v)){return v+(_1a8||"px");}return v;};El.VISIBILITY=1;El.DISPLAY=2;El.borders={l:"border-left-width",r:"border-right-width",t:"border-top-width",b:"border-bottom-width"};El.paddings={l:"padding-left",r:"padding-right",t:"padding-top",b:"padding-bottom"};El.margins={l:"margin-left",r:"margin-right",t:"margin-top",b:"margin-bottom"};El.cache={};var _1a9;El.get=function(el){var ex,elm,id;if(!el){return null;}if(typeof el=="string"){if(!(elm=document.getElementById(el))){return null;}if(ex=El.cache[el]){ex.dom=elm;}else{ex=El.cache[el]=new El(elm);}return ex;}else{if(el.tagName){if(!(id=el.id)){id=Ext.id(el);}if(ex=El.cache[id]){ex.dom=el;}else{ex=El.cache[id]=new El(el);}return ex;}else{if(el instanceof El){if(el!=_1a9){el.dom=document.getElementById(el.id)||el.dom;El.cache[el.id]=el;}return el;}else{if(el.isComposite){return el;}else{if(el instanceof Array){return El.select(el);}else{if(el==document){if(!_1a9){var f=function(){};f.prototype=El.prototype;_1a9=new f();_1a9.dom=document;}return _1a9;}}}}}}return null;};El.Flyweight=function(dom){this.dom=dom;};El.Flyweight.prototype=El.prototype;El._flyweights={};El.fly=function(el,_1b1){_1b1=_1b1||"_global";el=Ext.getDom(el);if(!el){return null;}if(!El._flyweights[_1b1]){El._flyweights[_1b1]=new El.Flyweight();}El._flyweights[_1b1].dom=el;return El._flyweights[_1b1];};Ext.get=El.get;Ext.fly=El.fly;var _120=Ext.isStrict?{select:1}:{input:1,select:1,textarea:1};if(Ext.isIE||Ext.isGecko){_120["button"]=1;}})();
