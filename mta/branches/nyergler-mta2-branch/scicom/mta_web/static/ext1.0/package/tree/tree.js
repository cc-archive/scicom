/*
 * Ext JS Library 1.0.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

Ext.data.Tree=function(_1){this.nodeHash={};this.root=null;if(_1){this.setRootNode(_1);}this.addEvents({"append":true,"remove":true,"move":true,"insert":true,"beforeappend":true,"beforeremove":true,"beforemove":true,"beforeinsert":true});Ext.data.Tree.superclass.constructor.call(this);};Ext.extend(Ext.data.Tree,Ext.util.Observable,{pathSeparator:"/",getRootNode:function(){return this.root;},setRootNode:function(_2){this.root=_2;_2.ownerTree=this;_2.isRoot=true;this.registerNode(_2);return _2;},getNodeById:function(id){return this.nodeHash[id];},registerNode:function(_4){this.nodeHash[_4.id]=_4;},unregisterNode:function(_5){delete this.nodeHash[_5.id];},toString:function(){return "[Tree"+(this.id?" "+this.id:"")+"]";}});Ext.data.Node=function(_6){this.attributes=_6||{};this.leaf=this.attributes.leaf;this.id=this.attributes.id;if(!this.id){this.id=Ext.id(null,"ynode-");this.attributes.id=this.id;}this.childNodes=[];if(!this.childNodes.indexOf){this.childNodes.indexOf=function(o){for(var i=0,_9=this.length;i<_9;i++){if(this[i]==o){return i;}}return -1;};}this.parentNode=null;this.firstChild=null;this.lastChild=null;this.previousSibling=null;this.nextSibling=null;this.addEvents({"append":true,"remove":true,"move":true,"insert":true,"beforeappend":true,"beforeremove":true,"beforemove":true,"beforeinsert":true});this.listeners=this.attributes.listeners;Ext.data.Node.superclass.constructor.call(this);};Ext.extend(Ext.data.Node,Ext.util.Observable,{fireEvent:function(_a){if(Ext.data.Node.superclass.fireEvent.apply(this,arguments)===false){return false;}var ot=this.getOwnerTree();if(ot){if(ot.fireEvent.apply(this.ownerTree,arguments)===false){return false;}}return true;},isLeaf:function(){return this.leaf===true;},setFirstChild:function(_c){this.firstChild=_c;},setLastChild:function(_d){this.lastChild=_d;},isLast:function(){return (!this.parentNode?true:this.parentNode.lastChild==this);},isFirst:function(){return (!this.parentNode?true:this.parentNode.firstChild==this);},hasChildNodes:function(){return !this.isLeaf()&&this.childNodes.length>0;},appendChild:function(_e){var _f=false;if(_e instanceof Array){_f=_e;}else{if(arguments.length>1){_f=arguments;}}if(_f){for(var i=0,len=_f.length;i<len;i++){this.appendChild(_f[i]);}}else{if(this.fireEvent("beforeappend",this.ownerTree,this,_e)===false){return false;}var _12=this.childNodes.length;var _13=_e.parentNode;if(_13){if(_e.fireEvent("beforemove",_e.getOwnerTree(),_e,_13,this,_12)===false){return false;}_13.removeChild(_e);}_12=this.childNodes.length;if(_12==0){this.setFirstChild(_e);}this.childNodes.push(_e);_e.parentNode=this;var ps=this.childNodes[_12-1];if(ps){_e.previousSibling=ps;ps.nextSibling=_e;}else{_e.previousSibling=null;}_e.nextSibling=null;this.setLastChild(_e);_e.setOwnerTree(this.getOwnerTree());this.fireEvent("append",this.ownerTree,this,_e,_12);if(_13){_e.fireEvent("move",this.ownerTree,_e,_13,this,_12);}return _e;}},removeChild:function(_15){var _16=this.childNodes.indexOf(_15);if(_16==-1){return false;}if(this.fireEvent("beforeremove",this.ownerTree,this,_15)===false){return false;}this.childNodes.splice(_16,1);if(_15.previousSibling){_15.previousSibling.nextSibling=_15.nextSibling;}if(_15.nextSibling){_15.nextSibling.previousSibling=_15.previousSibling;}if(this.firstChild==_15){this.setFirstChild(_15.nextSibling);}if(this.lastChild==_15){this.setLastChild(_15.previousSibling);}_15.setOwnerTree(null);_15.parentNode=null;_15.previousSibling=null;_15.nextSibling=null;this.fireEvent("remove",this.ownerTree,this,_15);return _15;},insertBefore:function(_17,_18){if(!_18){return this.appendChild(_17);}if(_17==_18){return false;}if(this.fireEvent("beforeinsert",this.ownerTree,this,_17,_18)===false){return false;}var _19=this.childNodes.indexOf(_18);var _1a=_17.parentNode;var _1b=_19;if(_1a==this&&this.childNodes.indexOf(_17)<_19){_1b--;}if(_1a){if(_17.fireEvent("beforemove",_17.getOwnerTree(),_17,_1a,this,_19,_18)===false){return false;}_1a.removeChild(_17);}if(_1b==0){this.setFirstChild(_17);}this.childNodes.splice(_1b,0,_17);_17.parentNode=this;var ps=this.childNodes[_1b-1];if(ps){_17.previousSibling=ps;ps.nextSibling=_17;}else{_17.previousSibling=null;}_17.nextSibling=_18;_18.previousSibling=_17;_17.setOwnerTree(this.getOwnerTree());this.fireEvent("insert",this.ownerTree,this,_17,_18);if(_1a){_17.fireEvent("move",this.ownerTree,_17,_1a,this,_1b,_18);}return _17;},item:function(_1d){return this.childNodes[_1d];},replaceChild:function(_1e,_1f){this.insertBefore(_1e,_1f);this.removeChild(_1f);return _1f;},indexOf:function(_20){return this.childNodes.indexOf(_20);},getOwnerTree:function(){if(!this.ownerTree){var p=this;while(p){if(p.ownerTree){this.ownerTree=p.ownerTree;break;}p=p.parentNode;}}return this.ownerTree;},getDepth:function(){var _22=0;var p=this;while(p.parentNode){++_22;p=p.parentNode;}return _22;},setOwnerTree:function(_24){if(_24!=this.ownerTree){if(this.ownerTree){this.ownerTree.unregisterNode(this);}this.ownerTree=_24;var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){cs[i].setOwnerTree(_24);}if(_24){_24.registerNode(this);}}},getPath:function(_28){_28=_28||"id";var p=this.parentNode;var b=[this.attributes[_28]];while(p){b.unshift(p.attributes[_28]);p=p.parentNode;}var sep=this.getOwnerTree().pathSeparator;return sep+b.join(sep);},bubble:function(fn,_2d,_2e){var p=this;while(p){if(fn.call(_2d||p,_2e||p)===false){break;}p=p.parentNode;}},cascade:function(fn,_31,_32){if(fn.call(_31||this,_32||this)!==false){var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){cs[i].cascade(fn,_31,_32);}}},eachChild:function(fn,_37,_38){var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){if(fn.call(_37||this,_38||cs[i])===false){break;}}},findChild:function(_3c,_3d){var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){if(cs[i].attributes[_3c]==_3d){return cs[i];}}return null;},findChildBy:function(fn,_42){var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){if(fn.call(_42||cs[i],cs[i])===true){return cs[i];}}return null;},sort:function(fn,_47){var cs=this.childNodes;var len=cs.length;if(len>0){var _4a=_47?function(){fn.apply(_47,arguments);}:fn;cs.sort(_4a);for(var i=0;i<len;i++){var n=cs[i];n.previousSibling=cs[i-1];n.nextSibling=cs[i+1];if(i==0){this.setFirstChild(n);}if(i==len-1){this.setLastChild(n);}}}},contains:function(_4d){return _4d.isAncestor(this);},isAncestor:function(_4e){var p=this.parentNode;while(p){if(p==_4e){return true;}p=p.parentNode;}return false;},toString:function(){return "[Node"+(this.id?" "+this.id:"")+"]";}});

Ext.tree.TreePanel=function(el,_2){Ext.tree.TreePanel.superclass.constructor.call(this);this.el=Ext.get(el);this.el.addClass("x-tree");this.id=this.el.id;Ext.apply(this,_2);this.addEvents({"beforeload":true,"load":true,"textchange":true,"beforeexpand":true,"beforecollapse":true,"expand":true,"disabledchange":true,"collapse":true,"beforeclick":true,"click":true,"dblclick":true,"contextmenu":true,"beforechildrenrendered":true,"startdrag":true,"enddrag":true,"dragdrop":true,"beforenodedrop":true,"nodedrop":true,"nodedragover":true});if(this.singleExpand){this.on("beforeexpand",this.restrictExpand,this);}};Ext.extend(Ext.tree.TreePanel,Ext.data.Tree,{rootVisible:true,animate:Ext.enableFx,lines:true,enableDD:false,hlDrop:Ext.enableFx,restrictExpand:function(_3){var p=_3.parentNode;if(p){if(p.expandedChild&&p.expandedChild.parentNode==p){p.expandedChild.collapse();}p.expandedChild=_3;}},setRootNode:function(_5){Ext.tree.TreePanel.superclass.setRootNode.call(this,_5);if(!this.rootVisible){_5.ui=new Ext.tree.RootTreeNodeUI(_5);}return _5;},getEl:function(){return this.el;},getLoader:function(){return this.loader;},expandAll:function(){this.root.expand(true);},collapseAll:function(){this.root.collapse(true);},getSelectionModel:function(){if(!this.selModel){this.selModel=new Ext.tree.DefaultSelectionModel();}return this.selModel;},expandPath:function(_6,_7,_8){_7=_7||"id";var _9=_6.split(this.pathSeparator);var _a=this.root;if(_a.attributes[_7]!=_9[1]){if(_8){_8(false,null);}return;}var _b=1;var f=function(){if(++_b==_9.length){if(_8){_8(true,_a);}return;}var c=_a.findChild(_7,_9[_b]);if(!c){if(_8){_8(false,_a);}return;}_a=c;c.expand(false,false,f);};_a.expand(false,false,f);},selectPath:function(_e,_f,_10){_f=_f||"id";var _11=_e.split(this.pathSeparator);var v=_11.pop();if(_11.length>0){var f=function(_14,_15){if(_14&&_15){var n=_15.findChild(_f,v);if(n){n.select();if(_10){_10(true,n);}}}else{if(_10){_10(false,n);}}};this.expandPath(_11.join(this.pathSeparator),_f,f);}else{this.root.select();if(_10){_10(true,this.root);}}},render:function(){this.container=this.el.createChild({tag:"ul",cls:"x-tree-root-ct "+(this.lines?"x-tree-lines":"x-tree-no-lines")});if(this.containerScroll){Ext.dd.ScrollManager.register(this.el);}if((this.enableDD||this.enableDrop)&&!this.dropZone){this.dropZone=new Ext.tree.TreeDropZone(this,this.dropConfig||{ddGroup:this.ddGroup||"TreeDD",appendOnly:this.ddAppendOnly===true});}if((this.enableDD||this.enableDrag)&&!this.dragZone){this.dragZone=new Ext.tree.TreeDragZone(this,this.dragConfig||{ddGroup:this.ddGroup||"TreeDD",scroll:this.ddScroll});}this.getSelectionModel().init(this);this.root.render();if(!this.rootVisible){this.root.renderChildren();}return this;}});

Ext.tree.DefaultSelectionModel=function(){this.selNode=null;this.addEvents({"selectionchange":true,"beforeselect":true});};Ext.extend(Ext.tree.DefaultSelectionModel,Ext.util.Observable,{init:function(_1){this.tree=_1;_1.el.on("keydown",this.onKeyDown,this);_1.on("click",this.onNodeClick,this);},onNodeClick:function(_2,e){this.select(_2);},select:function(_4){var _5=this.selNode;if(_5!=_4&&this.fireEvent("beforeselect",this,_4,_5)!==false){if(_5){_5.ui.onSelectedChange(false);}this.selNode=_4;_4.ui.onSelectedChange(true);this.fireEvent("selectionchange",this,_4,_5);}return _4;},unselect:function(_6){if(this.selNode==_6){this.clearSelections();}},clearSelections:function(){var n=this.selNode;if(n){n.ui.onSelectedChange(false);this.selNode=null;this.fireEvent("selectionchange",this,null);}return n;},getSelectedNode:function(){return this.selNode;},isSelected:function(_8){return this.selNode==_8;},selectPrevious:function(){var s=this.selNode||this.lastSelNode;if(!s){return null;}var ps=s.previousSibling;if(ps){if(!ps.isExpanded()||ps.childNodes.length<1){return this.select(ps);}else{var lc=ps.lastChild;while(lc&&lc.isExpanded()&&lc.childNodes.length>0){lc=lc.lastChild;}return this.select(lc);}}else{if(s.parentNode&&(this.tree.rootVisible||!s.parentNode.isRoot)){return this.select(s.parentNode);}}return null;},selectNext:function(){var s=this.selNode||this.lastSelNode;if(!s){return null;}if(s.firstChild&&s.isExpanded()){return this.select(s.firstChild);}else{if(s.nextSibling){return this.select(s.nextSibling);}else{if(s.parentNode){var _d=null;s.parentNode.bubble(function(){if(this.nextSibling){_d=this.getOwnerTree().selModel.select(this.nextSibling);return false;}});return _d;}}}return null;},onKeyDown:function(e){var s=this.selNode||this.lastSelNode;var sm=this;if(!s){return;}var k=e.getKey();switch(k){case e.DOWN:e.stopEvent();this.selectNext();break;case e.UP:e.stopEvent();this.selectPrevious();break;case e.RIGHT:e.preventDefault();if(s.hasChildNodes()){if(!s.isExpanded()){s.expand();}else{if(s.firstChild){this.select(s.firstChild,e);}}}break;case e.LEFT:e.preventDefault();if(s.hasChildNodes()&&s.isExpanded()){s.collapse();}else{if(s.parentNode&&(this.tree.rootVisible||s.parentNode!=this.tree.getRootNode())){this.select(s.parentNode,e);}}break;}}});Ext.tree.MultiSelectionModel=function(){this.selNodes=[];this.selMap={};this.addEvents({"selectionchange":true});};Ext.extend(Ext.tree.MultiSelectionModel,Ext.util.Observable,{init:function(_12){this.tree=_12;_12.el.on("keydown",this.onKeyDown,this);_12.on("click",this.onNodeClick,this);},onNodeClick:function(_13,e){this.select(_13,e,e.ctrlKey);},select:function(_15,e,_17){if(_17!==true){this.clearSelections(true);}if(this.isSelected(_15)){this.lastSelNode=_15;return _15;}this.selNodes.push(_15);this.selMap[_15.id]=_15;this.lastSelNode=_15;_15.ui.onSelectedChange(true);this.fireEvent("selectionchange",this,this.selNodes);return _15;},unselect:function(_18){if(this.selMap[_18.id]){_18.ui.onSelectedChange(false);var sn=this.selNodes;var _1a=-1;if(sn.indexOf){_1a=sn.indexOf(_18);}else{for(var i=0,len=sn.length;i<len;i++){if(sn[i]==_18){_1a=i;break;}}}if(_1a!=-1){this.selNodes.splice(_1a,1);}delete this.selMap[_18.id];this.fireEvent("selectionchange",this,this.selNodes);}},clearSelections:function(_1d){var sn=this.selNodes;if(sn.length>0){for(var i=0,len=sn.length;i<len;i++){sn[i].ui.onSelectedChange(false);}this.selNodes=[];this.selMap={};if(_1d!==true){this.fireEvent("selectionchange",this,this.selNodes);}}},isSelected:function(_21){return this.selMap[_21.id]?true:false;},getSelectedNodes:function(){return this.selNodes;},onKeyDown:Ext.tree.DefaultSelectionModel.prototype.onKeyDown,selectNext:Ext.tree.DefaultSelectionModel.prototype.selectNext,selectPrevious:Ext.tree.DefaultSelectionModel.prototype.selectPrevious});

Ext.tree.TreeNode=function(_1){_1=_1||{};if(typeof _1=="string"){_1={text:_1};}this.childrenRendered=false;this.rendered=false;Ext.tree.TreeNode.superclass.constructor.call(this,_1);this.expanded=_1.expanded===true;this.isTarget=_1.isTarget!==false;this.draggable=_1.draggable!==false&&_1.allowDrag!==false;this.allowChildren=_1.allowChildren!==false&&_1.allowDrop!==false;this.text=_1.text;this.disabled=_1.disabled===true;this.addEvents({"textchange":true,"beforeexpand":true,"beforecollapse":true,"expand":true,"disabledchange":true,"collapse":true,"beforeclick":true,"click":true,"dblclick":true,"contextmenu":true,"beforechildrenrendered":true});var _2=this.attributes.uiProvider||Ext.tree.TreeNodeUI;this.ui=new _2(this);};Ext.extend(Ext.tree.TreeNode,Ext.data.Node,{preventHScroll:true,isExpanded:function(){return this.expanded;},getUI:function(){return this.ui;},setFirstChild:function(_3){var of=this.firstChild;Ext.tree.TreeNode.superclass.setFirstChild.call(this,_3);if(this.childrenRendered&&of&&_3!=of){of.renderIndent(true,true);}if(this.rendered){this.renderIndent(true,true);}},setLastChild:function(_5){var ol=this.lastChild;Ext.tree.TreeNode.superclass.setLastChild.call(this,_5);if(this.childrenRendered&&ol&&_5!=ol){ol.renderIndent(true,true);}if(this.rendered){this.renderIndent(true,true);}},appendChild:function(){var _7=Ext.tree.TreeNode.superclass.appendChild.apply(this,arguments);if(_7&&this.childrenRendered){_7.render();}this.ui.updateExpandIcon();return _7;},removeChild:function(_8){this.ownerTree.getSelectionModel().unselect(_8);Ext.tree.TreeNode.superclass.removeChild.apply(this,arguments);if(this.childrenRendered){_8.ui.remove();}if(this.childNodes.length<1){this.collapse(false,false);}else{this.ui.updateExpandIcon();}return _8;},insertBefore:function(_9,_a){var _b=Ext.tree.TreeNode.superclass.insertBefore.apply(this,arguments);if(_b&&_a&&this.childrenRendered){_9.render();}this.ui.updateExpandIcon();return _b;},setText:function(_c){var _d=this.text;this.text=_c;this.attributes.text=_c;if(this.rendered){this.ui.onTextChange(this,_c,_d);}this.fireEvent("textchange",this,_c,_d);},select:function(){this.getOwnerTree().getSelectionModel().select(this);},unselect:function(){this.getOwnerTree().getSelectionModel().unselect(this);},isSelected:function(){return this.getOwnerTree().getSelectionModel().isSelected(this);},expand:function(_e,_f,_10){if(!this.expanded){if(this.fireEvent("beforeexpand",this,_e,_f)===false){return;}if(!this.childrenRendered){this.renderChildren();}this.expanded=true;if(!this.isHiddenRoot()&&(this.getOwnerTree().animate&&_f!==false)||_f){this.ui.animExpand(function(){this.fireEvent("expand",this);if(typeof _10=="function"){_10(this);}if(_e===true){this.expandChildNodes(true);}}.createDelegate(this));return;}else{this.ui.expand();this.fireEvent("expand",this);if(typeof _10=="function"){_10(this);}}}else{if(typeof _10=="function"){_10(this);}}if(_e===true){this.expandChildNodes(true);}},isHiddenRoot:function(){return this.isRoot&&!this.getOwnerTree().rootVisible;},collapse:function(_11,_12){if(this.expanded&&!this.isHiddenRoot()){if(this.fireEvent("beforecollapse",this,_11,_12)===false){return;}this.expanded=false;if((this.getOwnerTree().animate&&_12!==false)||_12){this.ui.animCollapse(function(){this.fireEvent("collapse",this);if(_11===true){this.collapseChildNodes(true);}}.createDelegate(this));return;}else{this.ui.collapse();this.fireEvent("collapse",this);}}if(_11===true){var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){cs[i].collapse(true);}}},delayedExpand:function(_16){if(!this.expandProcId){this.expandProcId=this.expand.defer(_16,this);}},cancelExpand:function(){if(this.expandProcId){clearTimeout(this.expandProcId);}this.expandProcId=false;},toggle:function(){if(this.expanded){this.collapse();}else{this.expand();}},ensureVisible:function(_17){var _18=this.getOwnerTree();_18.expandPath(this.getPath(),false,function(){_18.getEl().scrollChildIntoView(this.ui.anchor);Ext.callback(_17);}.createDelegate(this));},expandChildNodes:function(_19){var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){cs[i].expand(_19);}},collapseChildNodes:function(_1d){var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){cs[i].collapse(_1d);}},disable:function(){this.disabled=true;this.unselect();if(this.rendered&&this.ui.onDisableChange){this.ui.onDisableChange(this,true);}this.fireEvent("disabledchange",this,true);},enable:function(){this.disabled=false;if(this.rendered&&this.ui.onDisableChange){this.ui.onDisableChange(this,false);}this.fireEvent("disabledchange",this,false);},renderChildren:function(_21){if(_21!==false){this.fireEvent("beforechildrenrendered",this);}var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){cs[i].render(true);}this.childrenRendered=true;},sort:function(fn,_26){Ext.tree.TreeNode.superclass.sort.apply(this,arguments);if(this.childrenRendered){var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){cs[i].render(true);}}},render:function(_2a){this.ui.render(_2a);if(!this.rendered){this.rendered=true;if(this.expanded){this.expanded=false;this.expand(false,false);}}},renderIndent:function(_2b,_2c){if(_2c){this.ui.childIndent=null;}this.ui.renderIndent();if(_2b===true&&this.childrenRendered){var cs=this.childNodes;for(var i=0,len=cs.length;i<len;i++){cs[i].renderIndent(true,_2c);}}}});

Ext.tree.AsyncTreeNode=function(_1){this.loaded=false;this.loading=false;Ext.tree.AsyncTreeNode.superclass.constructor.apply(this,arguments);this.addEvents({"beforeload":true,"load":true});};Ext.extend(Ext.tree.AsyncTreeNode,Ext.tree.TreeNode,{expand:function(_2,_3,_4){if(this.loading){var _5;var f=function(){if(!this.loading){clearInterval(_5);this.expand(_2,_3,_4);}}.createDelegate(this);_5=setInterval(f,200);return;}if(!this.loaded){if(this.fireEvent("beforeload",this)===false){return;}this.loading=true;this.ui.beforeLoad(this);var _7=this.loader||this.attributes.loader||this.getOwnerTree().getLoader();if(_7){_7.load(this,this.loadComplete.createDelegate(this,[_2,_3,_4]));return;}}Ext.tree.AsyncTreeNode.superclass.expand.call(this,_2,_3,_4);},isLoading:function(){return this.loading;},loadComplete:function(_8,_9,_a){this.loading=false;this.loaded=true;this.ui.afterLoad(this);this.fireEvent("load",this);this.expand(_8,_9,_a);},isLoaded:function(){return this.loaded;},hasChildNodes:function(){if(!this.isLeaf()&&!this.loaded){return true;}else{return Ext.tree.AsyncTreeNode.superclass.hasChildNodes.call(this);}},reload:function(_b){this.collapse(false,false);while(this.firstChild){this.removeChild(this.firstChild);}this.childrenRendered=false;this.loaded=false;if(this.isHiddenRoot()){this.expanded=false;}this.expand(false,false,_b);}});

Ext.tree.TreeNodeUI=function(_1){this.node=_1;this.rendered=false;this.animating=false;this.emptyIcon=Ext.BLANK_IMAGE_URL;};Ext.tree.TreeNodeUI.prototype={removeChild:function(_2){if(this.rendered){this.ctNode.removeChild(_2.ui.getEl());}},beforeLoad:function(){this.addClass("x-tree-node-loading");},afterLoad:function(){this.removeClass("x-tree-node-loading");},onTextChange:function(_3,_4,_5){if(this.rendered){this.textNode.innerHTML=_4;}},onDisableChange:function(_6,_7){this.disabled=_7;if(_7){this.addClass("x-tree-node-disabled");}else{this.removeClass("x-tree-node-disabled");}},onSelectedChange:function(_8){if(_8){this.focus();this.addClass("x-tree-selected");}else{this.removeClass("x-tree-selected");}},onMove:function(_9,_a,_b,_c,_d,_e){this.childIndent=null;if(this.rendered){var _f=_c.ui.getContainer();if(!_f){this.holder=document.createElement("div");this.holder.appendChild(this.wrap);return;}var _10=_e?_e.ui.getEl():null;if(_10){_f.insertBefore(this.wrap,_10);}else{_f.appendChild(this.wrap);}this.node.renderIndent(true);}},addClass:function(cls){if(this.elNode){Ext.fly(this.elNode).addClass(cls);}},removeClass:function(cls){if(this.elNode){Ext.fly(this.elNode).removeClass(cls);}},remove:function(){if(this.rendered){this.holder=document.createElement("div");this.holder.appendChild(this.wrap);}},fireEvent:function(){return this.node.fireEvent.apply(this.node,arguments);},initEvents:function(){this.node.on("move",this.onMove,this);var E=Ext.EventManager;var a=this.anchor;var el=Ext.fly(a);if(Ext.isOpera){el.setStyle("text-decoration","none");}el.on("click",this.onClick,this);el.on("dblclick",this.onDblClick,this);el.on("contextmenu",this.onContextMenu,this);var _16=Ext.fly(this.iconNode);_16.on("click",this.onClick,this);_16.on("dblclick",this.onDblClick,this);_16.on("contextmenu",this.onContextMenu,this);E.on(this.ecNode,"click",this.ecClick,this,true);if(this.node.disabled){this.addClass("x-tree-node-disabled");}if(this.node.hidden){this.addClass("x-tree-node-disabled");}var ot=this.node.getOwnerTree();var dd=ot.enableDD||ot.enableDrag||ot.enableDrop;if(dd&&(!this.node.isRoot||ot.rootVisible)){Ext.dd.Registry.register(this.elNode,{node:this.node,handles:[this.iconNode,this.textNode],isHandle:false});}},hide:function(){if(this.rendered){this.wrap.style.display="none";}},show:function(){if(this.rendered){this.wrap.style.display="";}},onContextMenu:function(e){e.preventDefault();this.focus();this.fireEvent("contextmenu",this.node,e);},onClick:function(e){if(this.dropping){return;}if(this.fireEvent("beforeclick",this.node,e)!==false){if(!this.disabled&&this.node.attributes.href){this.fireEvent("click",this.node,e);return;}e.preventDefault();if(this.disabled){return;}if(this.node.attributes.singleClickExpand&&!this.animating&&this.node.hasChildNodes()){this.node.toggle();}this.fireEvent("click",this.node,e);}else{e.stopEvent();}},onDblClick:function(e){e.preventDefault();if(this.disabled){return;}if(!this.animating&&this.node.hasChildNodes()){this.node.toggle();}this.fireEvent("dblclick",this.node,e);},ecClick:function(e){if(!this.animating&&this.node.hasChildNodes()){this.node.toggle();}},startDrop:function(){this.dropping=true;},endDrop:function(){setTimeout(function(){this.dropping=false;}.createDelegate(this),50);},expand:function(){this.updateExpandIcon();this.ctNode.style.display="";},focus:function(){if(!this.node.preventHScroll){try{this.anchor.focus();}catch(e){}}else{if(!Ext.isIE){try{var _1d=this.node.getOwnerTree().el.dom;var l=_1d.scrollLeft;this.anchor.focus();_1d.scrollLeft=l;}catch(e){}}}},blur:function(){try{this.anchor.blur();}catch(e){}},animExpand:function(_1f){var ct=Ext.get(this.ctNode);ct.stopFx();if(!this.node.hasChildNodes()){this.updateExpandIcon();this.ctNode.style.display="";Ext.callback(_1f);return;}this.animating=true;this.updateExpandIcon();ct.slideIn("t",{callback:function(){this.animating=false;Ext.callback(_1f);},scope:this,duration:this.node.ownerTree.duration||0.25});},highlight:function(){var _21=this.node.getOwnerTree();Ext.fly(this.wrap).highlight(_21.hlColor||"C3DAF9",{endColor:_21.hlBaseColor});},collapse:function(){this.updateExpandIcon();this.ctNode.style.display="none";},animCollapse:function(_22){var ct=Ext.get(this.ctNode);ct.enableDisplayMode("block");ct.stopFx();this.animating=true;this.updateExpandIcon();ct.slideOut("t",{callback:function(){this.animating=false;Ext.callback(_22);},scope:this,duration:this.node.ownerTree.duration||0.25});},getContainer:function(){return this.ctNode;},getEl:function(){return this.wrap;},appendDDGhost:function(_24){_24.appendChild(this.elNode.cloneNode(true));},getDDRepairXY:function(){return Ext.lib.Dom.getXY(this.iconNode);},onRender:function(){this.render();},render:function(_25){var n=this.node;var _27=n.parentNode?n.parentNode.ui.getContainer():n.ownerTree.container.dom;if(!this.rendered){this.rendered=true;var a=n.attributes;this.indentMarkup="";if(n.parentNode){this.indentMarkup=n.parentNode.ui.getChildIndent();}var buf=["<li class=\"x-tree-node\"><div class=\"x-tree-node-el ",n.attributes.cls,"\">","<span class=\"x-tree-node-indent\">",this.indentMarkup,"</span>","<img src=\"",this.emptyIcon,"\" class=\"x-tree-ec-icon\">","<img src=\"",a.icon||this.emptyIcon,"\" class=\"x-tree-node-icon",(a.icon?" x-tree-node-inline-icon":""),(a.iconCls?" "+a.iconCls:""),"\" unselectable=\"on\">","<a hidefocus=\"on\" href=\"",a.href?a.href:"#","\" tabIndex=\"1\" ",a.hrefTarget?" target=\""+a.hrefTarget+"\"":"","><span unselectable=\"on\">",n.text,"</span></a></div>","<ul class=\"x-tree-node-ct\" style=\"display:none;\"></ul>","</li>"];if(_25!==true&&n.nextSibling&&n.nextSibling.ui.getEl()){this.wrap=Ext.DomHelper.insertHtml("beforeBegin",n.nextSibling.ui.getEl(),buf.join(""));}else{this.wrap=Ext.DomHelper.insertHtml("beforeEnd",_27,buf.join(""));}this.elNode=this.wrap.childNodes[0];this.ctNode=this.wrap.childNodes[1];var cs=this.elNode.childNodes;this.indentNode=cs[0];this.ecNode=cs[1];this.iconNode=cs[2];this.anchor=cs[3];this.textNode=cs[3].firstChild;if(a.qtip){if(this.textNode.setAttributeNS){this.textNode.setAttributeNS("ext","qtip",a.qtip);if(a.qtipTitle){this.textNode.setAttributeNS("ext","qtitle",a.qtipTitle);}}else{this.textNode.setAttribute("ext:qtip",a.qtip);if(a.qtipTitle){this.textNode.setAttribute("ext:qtitle",a.qtipTitle);}}}this.initEvents();if(!this.node.expanded){this.updateExpandIcon();}}else{if(_25===true){_27.appendChild(this.wrap);}}},getAnchor:function(){return this.anchor;},getTextEl:function(){return this.textNode;},getIconEl:function(){return this.iconNode;},updateExpandIcon:function(){if(this.rendered){var n=this.node,c1,c2;var cls=n.isLast()?"x-tree-elbow-end":"x-tree-elbow";var _2f=n.hasChildNodes();if(_2f){if(n.expanded){cls+="-minus";c1="x-tree-node-collapsed";c2="x-tree-node-expanded";}else{cls+="-plus";c1="x-tree-node-expanded";c2="x-tree-node-collapsed";}if(this.wasLeaf){this.removeClass("x-tree-node-leaf");this.wasLeaf=false;}if(this.c1!=c1||this.c2!=c2){Ext.fly(this.elNode).replaceClass(c1,c2);this.c1=c1;this.c2=c2;}}else{if(!this.wasLeaf){Ext.fly(this.elNode).replaceClass("x-tree-node-expanded","x-tree-node-leaf");this.wasLeaf=true;}}var ecc="x-tree-ec-icon "+cls;if(this.ecc!=ecc){this.ecNode.className=ecc;this.ecc=ecc;}}},getChildIndent:function(){if(!this.childIndent){var buf=[];var p=this.node;while(p){if(!p.isRoot||(p.isRoot&&p.ownerTree.rootVisible)){if(!p.isLast()){buf.unshift("<img src=\""+this.emptyIcon+"\" class=\"x-tree-elbow-line\">");}else{buf.unshift("<img src=\""+this.emptyIcon+"\" class=\"x-tree-icon\">");}}p=p.parentNode;}this.childIndent=buf.join("");}return this.childIndent;},renderIndent:function(){if(this.rendered){var _33="";var p=this.node.parentNode;if(p){_33=p.ui.getChildIndent();}if(this.indentMarkup!=_33){this.indentNode.innerHTML=_33;this.indentMarkup=_33;}this.updateExpandIcon();}}};Ext.tree.RootTreeNodeUI=function(){Ext.tree.RootTreeNodeUI.superclass.constructor.apply(this,arguments);};Ext.extend(Ext.tree.RootTreeNodeUI,Ext.tree.TreeNodeUI,{render:function(){if(!this.rendered){var _35=this.node.ownerTree.container.dom;this.node.expanded=true;_35.innerHTML="<div class=\"x-tree-root-node\"></div>";this.wrap=this.ctNode=_35.firstChild;}},collapse:function(){},expand:function(){}});

Ext.tree.TreeLoader=function(_1){this.baseParams={};this.requestMethod="POST";Ext.apply(this,_1);this.addEvents({"beforeload":true,"load":true,"loadexception":true});};Ext.extend(Ext.tree.TreeLoader,Ext.util.Observable,{uiProviders:{},clearOnLoad:true,load:function(_2,_3){if(this.clearOnLoad){while(_2.firstChild){_2.removeChild(_2.firstChild);}}if(_2.attributes.children){var cs=_2.attributes.children;for(var i=0,_6=cs.length;i<_6;i++){_2.appendChild(this.createNode(cs[i]));}if(typeof _3=="function"){_3();}}else{if(this.dataUrl){this.requestData(_2,_3);}}},getParams:function(_7){var _8=[],bp=this.baseParams;for(var _a in bp){if(typeof bp[_a]!="function"){_8.push(encodeURIComponent(_a),"=",encodeURIComponent(bp[_a]),"&");}}_8.push("node=",encodeURIComponent(_7.id));return _8.join("");},requestData:function(_b,_c){if(this.fireEvent("beforeload",this,_b,_c)!==false){var _d=this.getParams(_b);var cb={success:this.handleResponse,failure:this.handleFailure,scope:this,argument:{callback:_c,node:_b}};this.transId=Ext.lib.Ajax.request(this.requestMethod,this.dataUrl,cb,_d);}else{if(typeof _c=="function"){_c();}}},isLoading:function(){return this.transId?true:false;},abort:function(){if(this.isLoading()){Ext.lib.Ajax.abort(this.transId);}},createNode:function(_f){if(this.applyLoader!==false){_f.loader=this;}if(typeof _f.uiProvider=="string"){_f.uiProvider=this.uiProviders[_f.uiProvider]||eval(_f.uiProvider);}return (_f.leaf?new Ext.tree.TreeNode(_f):new Ext.tree.AsyncTreeNode(_f));},processResponse:function(_10,_11,_12){var _13=_10.responseText;try{var o=eval("("+_13+")");for(var i=0,len=o.length;i<len;i++){var n=this.createNode(o[i]);if(n){_11.appendChild(n);}}if(typeof _12=="function"){_12(this,_11);}}catch(e){this.handleFailure(_10);}},handleResponse:function(_18){this.transId=false;var a=_18.argument;this.processResponse(_18,a.node,a.callback);this.fireEvent("load",this,a.node,_18);},handleFailure:function(_1a){this.transId=false;var a=_1a.argument;this.fireEvent("loadexception",this,a.node,_1a);if(typeof a.callback=="function"){a.callback(this,a.node);}}});

Ext.tree.TreeFilter=function(_1,_2){this.tree=_1;this.filtered={};Ext.apply(this,_2,{clearBlank:false,reverse:false,autoClear:false,remove:false});};Ext.tree.TreeFilter.prototype={filter:function(_3,_4,_5){_4=_4||"text";var f;if(typeof _3=="string"){var _7=_3.length;if(_7==0&&this.clearBlank){this.clearFilter();return;}_3=_3.toLowerCase();f=function(n){return n.attributes[_4].substr(0,_7).toLowerCase()==_3;};}else{if(_3.exec){f=function(n){return _3.test(n.attributes[_4]);};}else{throw "Illegal filter type, must be string or regex";}}this.filterBy(f,null,_5);},filterBy:function(fn,_b,_c){_c=_c||this.tree.root;if(this.autoClear){this.clearFilter();}var af=this.filtered,rv=this.reverse;var f=function(n){if(n==_c){return true;}if(af[n.id]){return false;}var m=fn.call(_b||n,n);if(!m||rv){af[n.id]=n;n.ui.hide();return false;}return true;};_c.cascade(f);if(this.remove){for(var id in af){if(typeof id!="function"){var n=af[id];if(n&&n.parentNode){n.parentNode.removeChild(n);}}}}},clear:function(){var t=this.tree;var af=this.filtered;for(var id in af){if(typeof id!="function"){var n=af[id];if(n){n.ui.show();}}}this.filtered={};}};

Ext.tree.TreeSorter=function(_1,_2){Ext.apply(this,_2);_1.on("beforechildrenrendered",this.doSort,this);_1.on("append",this.updateSort,this);_1.on("insert",this.updateSort,this);var _3=this.dir&&this.dir.toLowerCase()=="desc";var p=this.property||"text";var _5=this.sortType;var fs=this.folderSort;var cs=this.caseSensitive===true;var _8=this.leafAttr||"leaf";this.sortFn=function(n1,n2){if(fs){if(n1.attributes[_8]&&!n2.attributes[_8]){return 1;}if(!n1.attributes[_8]&&n2.attributes[_8]){return -1;}}var v1=_5?_5(n1):(cs?n1[p]:n1[p].toUpperCase());var v2=_5?_5(n2):(cs?n2[p]:n2[p].toUpperCase());if(v1<v2){return _3?+1:-1;}else{if(v1>v2){return _3?-1:+1;}else{return 0;}}};};Ext.tree.TreeSorter.prototype={doSort:function(_d){_d.sort(this.sortFn);},compareNodes:function(n1,n2){return (n1.text.toUpperCase()>n2.text.toUpperCase()?1:-1);},updateSort:function(_10,_11){if(_11.childrenRendered){this.doSort.defer(1,this,[_11]);}}};

if(Ext.dd.DropZone){Ext.tree.TreeDropZone=function(_1,_2){this.allowParentInsert=false;this.allowContainerDrop=false;this.appendOnly=false;Ext.tree.TreeDropZone.superclass.constructor.call(this,_1.container,_2);this.tree=_1;this.lastInsertClass="x-tree-no-status";this.dragOverData={};};Ext.extend(Ext.tree.TreeDropZone,Ext.dd.DropZone,{ddGroup:"TreeDD",expandDelay:1000,expandNode:function(_3){if(_3.hasChildNodes()&&!_3.isExpanded()){_3.expand(false,null,this.triggerCacheRefresh.createDelegate(this));}},queueExpand:function(_4){this.expandProcId=this.expandNode.defer(this.expandDelay,this,[_4]);},cancelExpand:function(){if(this.expandProcId){clearTimeout(this.expandProcId);this.expandProcId=false;}},isValidDropPoint:function(n,pt,dd,e,_9){if(!n||!_9){return false;}var _a=n.node;var _b=_9.node;if(!(_a&&_a.isTarget&&pt)){return false;}if(pt=="append"&&_a.allowChildren===false){return false;}if((pt=="above"||pt=="below")&&(_a.parentNode&&_a.parentNode.allowChildren===false)){return false;}if(_b&&(_a==_b||_b.contains(_a))){return false;}var _c=this.dragOverData;_c.tree=this.tree;_c.target=_a;_c.data=_9;_c.point=pt;_c.source=dd;_c.rawEvent=e;_c.dropNode=_b;_c.cancel=false;var _d=this.tree.fireEvent("nodedragover",_c);return _c.cancel===false&&_d!==false;},getDropPoint:function(e,n,dd){var tn=n.node;if(tn.isRoot){return tn.allowChildren!==false?"append":false;}var _12=n.ddel;var t=Ext.lib.Dom.getY(_12),b=t+_12.offsetHeight;var y=Ext.lib.Event.getPageY(e);var _16=tn.allowChildren===false||tn.isLeaf();if(this.appendOnly||tn.parentNode.allowChildren===false){return _16?false:"append";}var _17=false;if(!this.allowParentInsert){_17=tn.hasChildNodes()&&tn.isExpanded();}var q=(b-t)/(_16?2:3);if(y>=t&&y<(t+q)){return "above";}else{if(!_17&&(_16||y>=b-q&&y<=b)){return "below";}else{return "append";}}},onNodeEnter:function(n,dd,e,_1c){this.cancelExpand();},onNodeOver:function(n,dd,e,_20){var pt=this.getDropPoint(e,n,dd);var _22=n.node;if(!this.expandProcId&&pt=="append"&&_22.hasChildNodes()&&!n.node.isExpanded()){this.queueExpand(_22);}else{if(pt!="append"){this.cancelExpand();}}var _23=this.dropNotAllowed;if(this.isValidDropPoint(n,pt,dd,e,_20)){if(pt){var el=n.ddel;var cls;if(pt=="above"){_23=n.node.isFirst()?"x-tree-drop-ok-above":"x-tree-drop-ok-between";cls="x-tree-drag-insert-above";}else{if(pt=="below"){_23=n.node.isLast()?"x-tree-drop-ok-below":"x-tree-drop-ok-between";cls="x-tree-drag-insert-below";}else{_23="x-tree-drop-ok-append";cls="x-tree-drag-append";}}if(this.lastInsertClass!=cls){Ext.fly(el).replaceClass(this.lastInsertClass,cls);this.lastInsertClass=cls;}}}return _23;},onNodeOut:function(n,dd,e,_29){this.cancelExpand();this.removeDropIndicators(n);},onNodeDrop:function(n,dd,e,_2d){var _2e=this.getDropPoint(e,n,dd);var _2f=n.node;_2f.ui.startDrop();if(!this.isValidDropPoint(n,_2e,dd,e,_2d)){_2f.ui.endDrop();return false;}var _30=_2d.node||(dd.getTreeNode?dd.getTreeNode(_2d,_2f,_2e,e):null);var _31={tree:this.tree,target:_2f,data:_2d,point:_2e,source:dd,rawEvent:e,dropNode:_30,cancel:!_30};var _32=this.tree.fireEvent("beforenodedrop",_31);if(_32===false||_31.cancel===true||!_31.dropNode){_2f.ui.endDrop();return false;}_2f=_31.target;if(_2e=="append"&&!_2f.isExpanded()){_2f.expand(false,null,function(){this.completeDrop(_31);}.createDelegate(this));}else{this.completeDrop(_31);}return true;},completeDrop:function(de){var ns=de.dropNode,p=de.point,t=de.target;if(!(ns instanceof Array)){ns=[ns];}var n;for(var i=0,len=ns.length;i<len;i++){n=ns[i];if(p=="above"){t.parentNode.insertBefore(n,t);}else{if(p=="below"){t.parentNode.insertBefore(n,t.nextSibling);}else{t.appendChild(n);}}}n.ui.focus();if(this.tree.hlDrop){n.ui.highlight();}t.ui.endDrop();this.tree.fireEvent("nodedrop",de);},afterNodeMoved:function(dd,_3b,e,_3d,_3e){if(this.tree.hlDrop){_3e.ui.focus();_3e.ui.highlight();}this.tree.fireEvent("nodedrop",this.tree,_3d,_3b,dd,e);},getTree:function(){return this.tree;},removeDropIndicators:function(n){if(n&&n.ddel){var el=n.ddel;Ext.fly(el).removeClass(["x-tree-drag-insert-above","x-tree-drag-insert-below","x-tree-drag-append"]);this.lastInsertClass="_noclass";}},beforeDragDrop:function(_41,e,id){this.cancelExpand();return true;},afterRepair:function(_44){if(_44&&Ext.enableFx){_44.node.ui.highlight();}this.hideProxy();}});}

if(Ext.dd.DragZone){Ext.tree.TreeDragZone=function(_1,_2){Ext.tree.TreeDragZone.superclass.constructor.call(this,_1.getEl(),_2);this.tree=_1;};Ext.extend(Ext.tree.TreeDragZone,Ext.dd.DragZone,{ddGroup:"TreeDD",onBeforeDrag:function(_3,e){var n=_3.node;return n&&n.draggable&&!n.disabled;},onInitDrag:function(e){var _7=this.dragData;this.tree.getSelectionModel().select(_7.node);this.proxy.update("");_7.node.ui.appendDDGhost(this.proxy.ghost.dom);this.tree.fireEvent("startdrag",this.tree,_7.node,e);},getRepairXY:function(e,_9){return _9.node.ui.getDDRepairXY();},onEndDrag:function(_a,e){this.tree.fireEvent("enddrag",this.tree,_a.node,e);},onValidDrop:function(dd,e,id){this.tree.fireEvent("dragdrop",this.tree,this.dragData.node,dd,e);this.hideProxy();},beforeInvalidDrop:function(e,id){var sm=this.tree.getSelectionModel();sm.clearSelections();sm.select(this.dragData.node);}});}

Ext.tree.TreeEditor=function(_1,_2){_2=_2||{};var _3=_2.events?_2:new Ext.form.TextField(_2);Ext.tree.TreeEditor.superclass.constructor.call(this,_3);this.tree=_1;_1.on("beforeclick",this.beforeNodeClick,this);_1.el.on("mousedown",this.hide,this);this.on("complete",this.updateNode,this);this.on("beforestartedit",this.fitToTree,this);this.on("startedit",this.bindScroll,this,{delay:10});this.on("specialkey",this.onSpecialKey,this);};Ext.extend(Ext.tree.TreeEditor,Ext.Editor,{alignment:"l-l",autoSize:false,hideEl:false,cls:"x-small-editor x-tree-editor",shim:false,shadow:"frame",maxWidth:250,fitToTree:function(ed,el){var td=this.tree.el.dom,nd=el.dom;if(td.scrollLeft>nd.offsetLeft){td.scrollLeft=nd.offsetLeft;}var w=Math.min(this.maxWidth,(td.clientWidth>20?td.clientWidth:td.offsetWidth)-Math.max(0,nd.offsetLeft-td.scrollLeft)-5);this.setSize(w,"");},triggerEdit:function(_9){this.completeEdit();this.editNode=_9;this.startEdit(_9.ui.textNode,_9.text);},bindScroll:function(){this.tree.el.on("scroll",this.cancelEdit,this);},beforeNodeClick:function(_a){if(this.tree.getSelectionModel().isSelected(_a)){this.triggerEdit(_a);return false;}},updateNode:function(ed,_c){this.tree.el.un("scroll",this.cancelEdit,this);this.editNode.setText(_c);},onSpecialKey:function(_d,e){var k=e.getKey();if(k==e.ESC){this.cancelEdit();e.stopEvent();}else{if(k==e.ENTER&&!e.hasModifier()){this.completeEdit();e.stopEvent();}}}});
