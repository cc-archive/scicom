/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 */


YAHOO.ext.DatePicker=function(id,parentElement){this.id=id;this.selectedDate=new Date();this.visibleDate=new Date();this.element=null;this.shadow=null;this.callback=null;this.buildControl(parentElement||document.body);this.mouseDownHandler=YAHOO.ext.EventManager.wrap(this.handleMouseDown,this,true);this.keyDownHandler=YAHOO.ext.EventManager.wrap(this.handleKeyDown,this,true);this.wheelHandler=YAHOO.ext.EventManager.wrap(this.handleMouseWheel,this,true);};YAHOO.ext.DatePicker.prototype={show:function(x,y,value,callback){this.hide();this.selectedDate=value;this.visibleDate=value;this.callback=callback;this.refresh();this.element.show();this.element.moveTo(x,y);this.shadow.show();this.shadow.setRegion(this.element.getRegion());this.element.dom.tabIndex=1;this.element.focus();YAHOO.util.Event.on(document,"mousedown",this.mouseDownHandler);YAHOO.util.Event.on(document,"keydown",this.keyDownHandler);YAHOO.util.Event.on(document,"mousewheel",this.wheelHandler);YAHOO.util.Event.on(document,"DOMMouseScroll",this.wheelHandler);},hide:function(){this.shadow.hide();this.element.hide();YAHOO.util.Event.removeListener(document,"mousedown",this.mouseDownHandler);YAHOO.util.Event.removeListener(document,"keydown",this.keyDownHandler);YAHOO.util.Event.removeListener(document,"mousewheel",this.wheelHandler);YAHOO.util.Event.removeListener(document,"DOMMouseScroll",this.wheelHandler);},setSelectedDate:function(date){this.selectedDate=date;},getSelectedDate:function(){return this.selectedDate;},showPrevMonth:function(){this.visibleDate=this.getPrevMonth(this.visibleDate);this.refresh();},showNextMonth:function(){this.visibleDate=this.getNextMonth(this.visibleDate);this.refresh();},showPrevYear:function(){var d=this.visibleDate;this.visibleDate=new Date(d.getFullYear()-1,d.getMonth(),d.getDate());this.refresh();},showNextYear:function(){var d=this.visibleDate;this.visibleDate=new Date(d.getFullYear()+1,d.getMonth(),d.getDate());this.refresh();},handleMouseDown:function(e){var target=e.getTarget();if(target!=this.element.dom&&!YAHOO.util.Dom.isAncestor(this.element.dom,target)){this.hide();}},handleKeyDown:function(e){switch(e.browserEvent.keyCode){case e.LEFT:this.showPrevMonth();e.stopEvent();break;case e.RIGHT:this.showNextMonth();e.stopEvent();break;case e.DOWN:this.showPrevYear();e.stopEvent();break;case e.UP:this.showNextYear();e.stopEvent();break;}},handleMouseWheel:function(e){var delta=e.getWheelDelta();if(delta>0){this.showPrevMonth();e.stopEvent();}else if(delta<0){this.showNextMonth();e.stopEvent();}},handleClick:function(e){var d=this.visibleDate;var t=e.getTarget();if(t&&t.className){switch(t.className){case'active':this.handleSelection(new Date(d.getFullYear(),d.getMonth(),parseInt(t.innerHTML)));break;case'prevday':var p=this.getPrevMonth(d);this.handleSelection(new Date(p.getFullYear(),p.getMonth(),parseInt(t.innerHTML)));break;case'nextday':var n=this.getNextMonth(d);this.handleSelection(new Date(n.getFullYear(),n.getMonth(),parseInt(t.innerHTML)));break;case'ypopcal-today':this.handleSelection(new Date());break;case'next-month':this.showNextMonth();break;case'prev-month':this.showPrevMonth();break;}}
e.stopEvent();},selectToday:function(){this.handleSelection(new Date());},handleSelection:function(date){this.selectedDate=date;this.callback(date);this.hide();},getPrevMonth:function(d){var m=d.getMonth();var y=d.getFullYear();return(m==0?new Date(--y,11,1):new Date(y,--m,1));},getNextMonth:function(d){var m=d.getMonth();var y=d.getFullYear();return(m==11?new Date(++y,0,1):new Date(y,++m,1));},getDaysInMonth:function(m,y){return(m==1||m==3||m==5||m==7||m==8||m==10||m==12)?31:(m==4||m==6||m==9||m==11)?30:this.isLeapYear(y)?29:28;},isLeapYear:function(y){return(((y%4)==0)&&((y%100)!=0)||((y%400)==0));},clearTime:function(date){if(date){date.setHours(0);date.setMinutes(0);date.setSeconds(0);date.setMilliseconds(0);}
return date;},refresh:function(){var d=this.visibleDate;this.buildInnerCal(d);this.calHead.update(this.monthNames[d.getMonth()]+' '+d.getFullYear());if(this.element.isVisible()){this.shadow.setRegion(this.element.getRegion());}}};YAHOO.ext.DatePicker.prototype.buildControl=function(parentElement){var c=document.createElement('div');c.style.position='absolute';c.style.visibility='hidden';document.body.appendChild(c);var html='<iframe id="'+this.id+'_shdw" frameborder="0" style="position:absolute; z-index:2000; display:none; top:0px; left:0px;" class="ypopcal-shadow"></iframe>'+'<div hidefocus="true" class="ypopcal" id="'+this.id+'" style="-moz-outline:none; position:absolute; z-index:2001; display:none; top:0px; left:0px;">'+'<table class="ypopcal-head" border=0 cellpadding=0 cellspacing=0><tbody><tr><td class="ypopcal-arrow"><div class="prev-month">&nbsp;</div></td><td class="ypopcal-month">&nbsp;</td><td class="ypopcal-arrow"><div class="next-month">&nbsp;</div></td></tr></tbody></table>'+'<center><div class="ypopcal-inner">';html+="<table border=0 cellpadding=2 cellspacing=0 class=\"ypopcal-table\"><thead><tr class=\"ypopcal-daynames\">";var names=this.dayNames;for(var i=0;i<names.length;i++){html+='<td>'+names[i].substr(0,1)+'</td>';}
html+="</tr></thead><tbody><tr>";for(var i=0;i<42;i++){if(i%7==0&&i!=0){html+='</tr><tr>';}
html+="<td>&nbsp;</td>";}
html+="</tr></tbody></table>";html+='</div><button class="ypopcal-today" style="margin-top:2px;">'+this.todayText+'</button></center></div>';c.innerHTML=html;this.shadow=getEl(c.childNodes[0],true);this.shadow.enableDisplayMode();this.element=getEl(c.childNodes[1],true);this.element.enableDisplayMode();document.body.appendChild(this.shadow.dom);document.body.appendChild(this.element.dom);document.body.removeChild(c);this.element.on("selectstart",function(){return false;});var tbody=this.element.dom.getElementsByTagName('tbody')[1];this.cells=tbody.getElementsByTagName('td');this.calHead=this.element.getChildrenByClassName('ypopcal-month','td')[0];this.element.mon('mousedown',this.handleClick,this,true);};YAHOO.ext.DatePicker.prototype.buildInnerCal=function(dateVal){var days=this.getDaysInMonth(dateVal.getMonth()+1,dateVal.getFullYear());var firstOfMonth=new Date(dateVal.getFullYear(),dateVal.getMonth(),1);var startingPos=firstOfMonth.getDay();if(startingPos==0)startingPos=7;var pm=this.getPrevMonth(dateVal);var prevStart=this.getDaysInMonth(pm.getMonth()+1,pm.getFullYear())-startingPos;var cells=this.cells;days+=startingPos;var day=86400000;var date=this.clearTime(new Date(pm.getFullYear(),pm.getMonth(),prevStart));var today=this.clearTime(new Date()).getTime();var sel=this.selectedDate?this.clearTime(this.selectedDate).getTime():today+1;var min=this.minDate?this.clearTime(this.minDate).getTime():Number.NEGATIVE_INFINITY;var max=this.maxDate?this.clearTime(this.maxDate).getTime():Number.POSITIVE_INFINITY;var ddMatch=this.disabledDatesRE;var ddText=this.disabledDatesText;var ddays=this.disabledDays;var ddaysText=this.disabledDaysText;var format=this.format;var setCellClass=function(cal,cell,d){cell.title='';var t=d.getTime();if(t==today){cell.className+=' today';cell.title=cal.todayText;}
if(t==sel){cell.className+=' selected';}
if(t<min){cell.className=' ypopcal-disabled';cell.title=cal.minText;return;}
if(t>max){cell.className=' ypopcal-disabled';cell.title=cal.maxText;return;}
if(ddays){var day=d.getDay();for(var i=0;i<ddays.length;i++){if(day===ddays[i]){cell.title=ddaysText;cell.className=' ypopcal-disabled';return;}}}
if(ddMatch&&format){var fvalue=d.format(format);if(ddMatch.test(fvalue)){cell.title=ddText.replace('%0',fvalue);cell.className=' ypopcal-disabled';return;}}};var i=0;for(;i<startingPos;i++){cells[i].innerHTML=(++prevStart);date.setDate(date.getDate()+1);cells[i].className='prevday';setCellClass(this,cells[i],date);}
for(;i<days;i++){intDay=i-startingPos+1;cells[i].innerHTML=(intDay);date.setDate(date.getDate()+1);cells[i].className='active';setCellClass(this,cells[i],date);}
var extraDays=0;for(;i<42;i++){cells[i].innerHTML=(++extraDays);date.setDate(date.getDate()+1);cells[i].className='nextday';setCellClass(this,cells[i],date);}};YAHOO.ext.DatePicker.prototype.todayText="Today";YAHOO.ext.DatePicker.prototype.minDate=null;YAHOO.ext.DatePicker.prototype.maxDate=null;YAHOO.ext.DatePicker.prototype.minText="This date is before the minimum date";YAHOO.ext.DatePicker.prototype.maxText="This date is after the maximum date";YAHOO.ext.DatePicker.prototype.format='m/d/y';YAHOO.ext.DatePicker.prototype.disabledDays=null;YAHOO.ext.DatePicker.prototype.disabledDaysText='';YAHOO.ext.DatePicker.prototype.disabledDatesRE=null;YAHOO.ext.DatePicker.prototype.disabledDatesText='';YAHOO.ext.DatePicker.prototype.monthNames=Date.monthNames;YAHOO.ext.DatePicker.prototype.dayNames=Date.dayNames;