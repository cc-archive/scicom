/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 */


YAHOO.ext.grid.CellEditor=function(element){this.colIndex=null;this.rowIndex=null;this.grid=null;this.editing=false;this.originalValue=null;this.element=getEl(element,true);this.element.addClass('ygrid-editor');this.element.dom.tabIndex=1;this.initialized=false;this.callback=null;};YAHOO.ext.grid.CellEditor.prototype={init:function(grid,bodyElement,callback){if(this.initialized)return;this.initialized=true;this.callback=callback;this.grid=grid;bodyElement.appendChild(this.element.dom);this.initEvents();},initEvents:function(){var stopOnEnter=function(e){if(e.browserEvent.keyCode==e.RETURN){this.stopEditing(true);}}
this.element.mon('keydown',stopOnEnter,this,true);this.element.on('blur',this.stopEditing,this,true);},startEditing:function(value,row,cell){this.originalValue=value;this.rowIndex=row.rowIndex;this.colIndex=cell.columnIndex;this.cell=cell;this.setValue(value);var cellbox=getEl(cell,true).getBox();this.fitToCell(cellbox);this.editing=true;this.show();},stopEditing:function(focusCell){if(this.editing){this.editing=false;var newValue=this.getValue();this.hide();if(this.originalValue!=newValue){this.callback(newValue,this.rowIndex,this.colIndex);}}},setValue:function(value){this.element.dom.value=value;},getValue:function(){return this.element.dom.value;},fitToCell:function(box){this.element.setBox(box,true);},show:function(){this.element.show();this.element.focus();},hide:function(){try{this.element.dom.blur();}catch(e){}
this.element.hide();}};