/*
 * Ext JS Library 1.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

if(Ext.dd.DropZone){Ext.tree.TreeDropZone=function(_1,_2){this.allowParentInsert=false;this.allowContainerDrop=false;this.appendOnly=false;Ext.tree.TreeDropZone.superclass.constructor.call(this,_1.container,_2);this.tree=_1;this.lastInsertClass="x-tree-no-status";this.dragOverData={};};Ext.extend(Ext.tree.TreeDropZone,Ext.dd.DropZone,{ddGroup:"TreeDD",expandDelay:1000,expandNode:function(_3){if(_3.hasChildNodes()&&!_3.isExpanded()){_3.expand(false,null,this.triggerCacheRefresh.createDelegate(this));}},queueExpand:function(_4){this.expandProcId=this.expandNode.defer(this.expandDelay,this,[_4]);},cancelExpand:function(){if(this.expandProcId){clearTimeout(this.expandProcId);this.expandProcId=false;}},isValidDropPoint:function(n,pt,dd,e,_9){if(!n||!_9){return false;}var _a=n.node;var _b=_9.node;if(!(_a&&_a.isTarget&&pt)){return false;}if(pt=="append"&&_a.allowChildren===false){return false;}if((pt=="above"||pt=="below")&&(_a.parentNode&&_a.parentNode.allowChildren===false)){return false;}if(_b&&(_a==_b||_b.contains(_a))){return false;}var _c=this.dragOverData;_c.tree=this.tree;_c.target=_a;_c.data=_9;_c.point=pt;_c.source=dd;_c.rawEvent=e;_c.dropNode=_b;_c.cancel=false;var _d=this.tree.fireEvent("nodedragover",_c);return _c.cancel===false&&_d!==false;},getDropPoint:function(e,n,dd){var tn=n.node;if(tn.isRoot){return tn.allowChildren!==false?"append":false;}var _12=n.ddel;var t=Ext.lib.Dom.getY(_12),b=t+_12.offsetHeight;var y=Ext.lib.Event.getPageY(e);var _16=tn.allowChildren===false||tn.isLeaf();if(this.appendOnly||tn.parentNode.allowChildren===false){return _16?false:"append";}var _17=false;if(!this.allowParentInsert){_17=tn.hasChildNodes()&&tn.isExpanded();}var q=(b-t)/(_16?2:3);if(y>=t&&y<(t+q)){return "above";}else{if(!_17&&(_16||y>=b-q&&y<=b)){return "below";}else{return "append";}}},onNodeEnter:function(n,dd,e,_1c){this.cancelExpand();},onNodeOver:function(n,dd,e,_20){var pt=this.getDropPoint(e,n,dd);var _22=n.node;if(!this.expandProcId&&pt=="append"&&_22.hasChildNodes()&&!n.node.isExpanded()){this.queueExpand(_22);}else{if(pt!="append"){this.cancelExpand();}}var _23=this.dropNotAllowed;if(this.isValidDropPoint(n,pt,dd,e,_20)){if(pt){var el=n.ddel;var cls;if(pt=="above"){_23=n.node.isFirst()?"x-tree-drop-ok-above":"x-tree-drop-ok-between";cls="x-tree-drag-insert-above";}else{if(pt=="below"){_23=n.node.isLast()?"x-tree-drop-ok-below":"x-tree-drop-ok-between";cls="x-tree-drag-insert-below";}else{_23="x-tree-drop-ok-append";cls="x-tree-drag-append";}}if(this.lastInsertClass!=cls){Ext.fly(el).replaceClass(this.lastInsertClass,cls);this.lastInsertClass=cls;}}}return _23;},onNodeOut:function(n,dd,e,_29){this.cancelExpand();this.removeDropIndicators(n);},onNodeDrop:function(n,dd,e,_2d){var _2e=this.getDropPoint(e,n,dd);var _2f=n.node;_2f.ui.startDrop();if(!this.isValidDropPoint(n,_2e,dd,e,_2d)){_2f.ui.endDrop();return false;}var _30=_2d.node||(dd.getTreeNode?dd.getTreeNode(_2d,_2f,_2e,e):null);var _31={tree:this.tree,target:_2f,data:_2d,point:_2e,source:dd,rawEvent:e,dropNode:_30,cancel:!_30};var _32=this.tree.fireEvent("beforenodedrop",_31);if(_32===false||_31.cancel===true||!_31.dropNode){_2f.ui.endDrop();return false;}if(_2e=="append"&&!_2f.isExpanded()){_2f.expand(false,null,function(){this.completeDrop(_31);}.createDelegate(this));}else{this.completeDrop(_31);}return true;},completeDrop:function(de){var ns=de.dropNode,p=de.point,t=de.target;if(!(ns instanceof Array)){ns=[ns];}var n;for(var i=0,len=ns.length;i<len;i++){n=ns[i];if(p=="above"){t.parentNode.insertBefore(n,t);}else{if(p=="below"){t.parentNode.insertBefore(n,t.nextSibling);}else{t.appendChild(n);}}}n.ui.focus();if(this.tree.hlDrop){n.ui.highlight();}t.ui.endDrop();this.tree.fireEvent("nodedrop",de);},afterNodeMoved:function(dd,_3b,e,_3d,_3e){if(this.tree.hlDrop){_3e.ui.focus();_3e.ui.highlight();}this.tree.fireEvent("nodedrop",this.tree,_3d,_3b,dd,e);},getTree:function(){return this.tree;},removeDropIndicators:function(n){if(n&&n.ddel){var el=n.ddel;Ext.fly(el).removeClass(["x-tree-drag-insert-above","x-tree-drag-insert-below","x-tree-drag-append"]);this.lastInsertClass="_noclass";}},beforeDragDrop:function(_41,e,id){this.cancelExpand();return true;},afterRepair:function(_44){if(_44&&Ext.enableFx){_44.node.ui.highlight();}this.hideProxy();}});}
