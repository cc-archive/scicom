/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 */


YAHOO.ext.grid.EditorSelectionModel=function(){YAHOO.ext.grid.EditorSelectionModel.superclass.constructor.call(this);this.clicksToActivateCell=1;this.events['cellactivate']=new YAHOO.util.CustomEvent('cellactivate');};YAHOO.extendX(YAHOO.ext.grid.EditorSelectionModel,YAHOO.ext.grid.DefaultSelectionModel);YAHOO.ext.grid.EditorSelectionModel.prototype.disableArrowNavigation=false;YAHOO.ext.grid.EditorSelectionModel.prototype.controlForArrowNavigation=false;YAHOO.ext.grid.EditorSelectionModel.prototype.initEvents=function(){this.grid.addListener("cellclick",this.onCellClick,this,true);this.grid.addListener("celldblclick",this.onCellDblClick,this,true);this.grid.addListener("keydown",this.keyDown,this,true);};YAHOO.ext.grid.EditorSelectionModel.prototype.onCellClick=function(grid,rowIndex,colIndex){if(this.clicksToActivateCell==1){var row=this.grid.getRow(rowIndex);var cell=row.childNodes[colIndex];if(cell){this.activate(row,cell);}}};YAHOO.ext.grid.EditorSelectionModel.prototype.activate=function(row,cell){this.fireEvent('cellactivate',this,row,cell);this.grid.doEdit(row,cell);};YAHOO.ext.grid.EditorSelectionModel.prototype.onCellDblClick=function(grid,rowIndex,colIndex){if(this.clicksToActivateCell==2){var row=this.grid.getRow(rowIndex);var cell=row.childNodes[colIndex];if(cell){this.activate(row,cell);}}};YAHOO.ext.grid.EditorSelectionModel.prototype.setRowState=function(row,selected){YAHOO.ext.grid.EditorSelectionModel.superclass.setRowState.call(this,row,false,false);};YAHOO.ext.grid.EditorSelectionModel.prototype.focusRow=function(row,selected){};YAHOO.ext.grid.EditorSelectionModel.prototype.getEditorCellAfter=function(cell,spanRows){var g=this.grid;var next=g.getCellAfter(cell);while(next&&!g.colModel.isCellEditable(next.columnIndex)){next=g.getCellAfter(next);}
if(!next&&spanRows){var row=g.getRowAfter(g.getRowFromChild(cell));next=g.getFirstCell(row);if(!g.colModel.isCellEditable(next.columnIndex)){next=this.getEditorCellAfter(next);}}
return next;};YAHOO.ext.grid.EditorSelectionModel.prototype.getEditorCellBefore=function(cell,spanRows){var g=this.grid;var prev=g.getCellBefore(cell);while(prev&&!g.colModel.isCellEditable(prev.columnIndex)){prev=g.getCellBefore(prev);}
if(!prev&&spanRows){var row=g.getRowBefore(g.getRowFromChild(cell));prev=g.getLastCell(row);if(!g.colModel.isCellEditable(prev.columnIndex)){prev=this.getEditorCellBefore(prev);}}
return prev;};YAHOO.ext.grid.EditorSelectionModel.prototype.allowArrowNav=function(e){return(!this.disableArrowNavigation&&(!this.controlForArrowNavigation||e.ctrlKey));}
YAHOO.ext.grid.EditorSelectionModel.prototype.keyDown=function(e){var g=this.grid,cm=g.colModel,cell=g.getEditingCell();if(!cell)return;var newCell;switch(e.browserEvent.keyCode){case e.TAB:if(e.shiftKey){newCell=this.getEditorCellBefore(cell,true);}else{newCell=this.getEditorCellAfter(cell,true);}
break;case e.DOWN:if(this.allowArrowNav(e)){var next=g.getRowAfter(g.getRowFromChild(cell));if(next){newCell=next.childNodes[cell.columnIndex];}}
break;case e.UP:if(this.allowArrowNav(e)){var prev=g.getRowBefore(g.getRowFromChild(cell));if(prev){newCell=prev.childNodes[cell.columnIndex];}}
break;case e.RETURN:if(e.shiftKey){var prev=g.getRowBefore(g.getRowFromChild(cell));if(prev){newCell=prev.childNodes[cell.columnIndex];}}else{var next=g.getRowAfter(g.getRowFromChild(cell));if(next){newCell=next.childNodes[cell.columnIndex];}}
break;case e.RIGHT:if(this.allowArrowNav(e)){newCell=this.getEditorCellAfter(cell);}
break;case e.LEFT:if(this.allowArrowNav(e)){newCell=this.getEditorCellBefore(cell);}
break;};if(newCell){this.activate(g.getRowFromChild(newCell),newCell);e.stopEvent();}};