/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 */

/*
 * splitbar.js, version .7
 * Copyright(c) 2006, Jack Slocum.
 * Code licensed under the BSD License
 */

YAHOO.util.DragDropMgr.clickTimeThresh = 350;

//
/**
 * Patch DDProxy for drag element with a width or height less than 4px
 * @ignore
*/  
YAHOO.util.DDProxy.prototype._resizeProxy = function() {
    var DOM    = YAHOO.util.Dom;
    var el     = this.getEl();
    var dragEl = this.getDragEl();

    if (this.resizeFrame) {
        var bt = parseInt( DOM.getStyle(dragEl, "borderTopWidth"    ), 10);
        var br = parseInt( DOM.getStyle(dragEl, "borderRightWidth"  ), 10);
        var bb = parseInt( DOM.getStyle(dragEl, "borderBottomWidth" ), 10);
        var bl = parseInt( DOM.getStyle(dragEl, "borderLeftWidth"   ), 10);

        if (isNaN(bt)) { bt = 0; }
        if (isNaN(br)) { br = 0; }
        if (isNaN(bb)) { bb = 0; }
        if (isNaN(bl)) { bl = 0; }

        // original evaluates to negative number if width or height is less than 4px
        //var newWidth  = el.offsetWidth - br - bl;
        //var newHeight = el.offsetHeight - bt - bb;
        var newWidth  = Math.max(0, el.offsetWidth - br - bl);
        var newHeight = Math.max(0, el.offsetHeight - bt - bb);


        DOM.setStyle( dragEl, "width",  newWidth  + "px" );
        DOM.setStyle( dragEl, "height", newHeight + "px" );
    }
};
/**
 * @class Creates draggable splitter bar functionality from two elements.
 * <br><br>
 * Usage:
 * <pre><code>
 * var split = new YAHOO.ext.SplitBar('elementToDrag', 'elementToSize', 
 *                   YAHOO.ext.SplitBar.HORIZONTAL, YAHOO.ext.SplitBar.LEFT);
 * split.setAdapter(new YAHOO.ext.SplitBar.AbsoluteLayoutAdapter("container"));
 * split.minSize = 100;
 * split.maxSize = 600;
 * split.animate = true;
 * split.onMoved.subscribe(splitterMoved);
 * </code></pre>
 * @requires YAHOO.ext.Element
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @requires YAHOO.util.CustomEvent 
 * @requires YAHOO.util.DDProxy
 * @requires YAHOO.util.Anim (optional) to support animation
 * @requires YAHOO.util.Easing (optional) to support animation
 * @constructor
 * @param {String/HTMLElement/Element} dragElement The element to be dragged and act as the SplitBar. 
 * @param {String/HTMLElement/Element} resizingElement The element to be resized based on where the SplitBar element is dragged 
 * @param {Number} orientation (optional) Either YAHOO.ext.SplitBar.HORIZONTAL or YAHOO.ext.SplitBar.VERTICAL. (Defaults to HORIZONTAL)
 * @param {Number} placement (optional) Either YAHOO.ext.SplitBar.LEFT or YAHOO.ext.SplitBar.RIGHT for horizontal or  
                        YAHOO.ext.SplitBar.TOP or YAHOO.ext.SplitBar.BOTTOM for vertical. (By default, this is determined automatically by the intial position 
                        position of the SplitBar).
 */
YAHOO.ext.SplitBar = function(dragElement, resizingElement, orientation, placement){
    
    /** @private */
    this.el = YAHOO.ext.Element.get(dragElement, true);
    
    /** @private */
    this.resizingEl = YAHOO.ext.Element.get(resizingElement, true);
    
    /**
     * @private
     * The orientation of the split. Either YAHOO.ext.SplitBar.HORIZONTAL or YAHOO.ext.SplitBar.VERTICAL. (Defaults to HORIZONTAL)
     * Note: If this is changed after creating the SplitBar, the placement property must be manually updated
     * @type Number
     */
    this.orientation = orientation || YAHOO.ext.SplitBar.HORIZONTAL;
    
    /**
     * The minimum size of the resizing element. (Defaults to 0)
     * @type Number
     */
    this.minSize = 0;
    
    /**
     * The maximum size of the resizing element. (Defaults to 2000)
     * @type Number
     */
    this.maxSize = 2000;
    
    /**
     * Fires when the SplitBar is moved. Uses fireDirect with signature: (this, newSize)
     * @type CustomEvent
     */
    this.onMoved = new YAHOO.util.CustomEvent("SplitBarMoved", this);
    
    /**
     * Whether to animate the transition to the new size
     * @type Boolean
     */
    this.animate = false;
    
    /**
     * Whether to create a transparent shim that overlays the page when dragging, enables dragging across iframes.
     * @type Boolean
     */
    this.useShim = false;
    
    /** @private */
    this.shim = null;
    
    /** @private */
    this.proxy = YAHOO.ext.SplitBar.createProxy(this.orientation);
    
    /** @private */
    this.dd = new YAHOO.util.DDProxy(this.el.dom.id, "SplitBars", {dragElId : this.proxy.id});
    
    /** @private */
    this.dd.b4StartDrag = this.onStartProxyDrag.createDelegate(this);
    
    /** @private */
    this.dd.endDrag = this.onEndProxyDrag.createDelegate(this);
    
    /** @private */
    this.dragSpecs = {};
    
    /**
     * @private The adapter to use to positon and resize elements
     */
    this.adapter = new YAHOO.ext.SplitBar.BasicLayoutAdapter();
    this.adapter.init(this);
    
    if(this.orientation == YAHOO.ext.SplitBar.HORIZONTAL){
        /** @private */
        this.placement = placement || (this.el.getX() > this.resizingEl.getX() ? YAHOO.ext.SplitBar.LEFT : YAHOO.ext.SplitBar.RIGHT);
        this.el.setStyle('cursor', 'e-resize');
    }else{
        /** @private */
        this.placement = placement || (this.el.getY() > this.resizingEl.getY() ? YAHOO.ext.SplitBar.TOP : YAHOO.ext.SplitBar.BOTTOM);
        this.el.setStyle('cursor', 'n-resize');
    }
}

YAHOO.ext.SplitBar.prototype = {
    /** 
     * @private Called before drag operation begins by the DDProxy
     */
    onStartProxyDrag : function(x, y){
        if(this.useShim){
            if(!this.shim){
                this.shim = YAHOO.ext.SplitBar.createShim();
            }
            this.shim.setVisible(true);
        }
        YAHOO.util.Dom.setStyle(this.proxy, 'display', 'block');
        var size = this.adapter.getElementSize(this);
        var c1 = size - this.minSize;
        var c2 = Math.max(this.maxSize - size, 0);
        if(this.orientation == YAHOO.ext.SplitBar.HORIZONTAL){
            this.dd.resetConstraints();
            this.dd.setXConstraint(
                this.placement == YAHOO.ext.SplitBar.LEFT ? c1 : c2, 
                this.placement == YAHOO.ext.SplitBar.LEFT ? c2 : c1
            );
            this.dd.setYConstraint(0, 0);
        }else{
            this.dd.resetConstraints();
            this.dd.setXConstraint(0, 0);
            this.dd.setYConstraint(
                this.placement == YAHOO.ext.SplitBar.TOP ? c1 : c2, 
                this.placement == YAHOO.ext.SplitBar.TOP ? c2 : c1
            );
         }
        this.dragSpecs.startSize = size;
        this.dragSpecs.startPoint = [x, y];
        
        YAHOO.util.DDProxy.prototype.b4StartDrag.call(this.dd, x, y);
    },
    
    /** 
     * @private Called after the drag operation by the DDProxy
     */
    onEndProxyDrag : function(e){
        YAHOO.util.Dom.setStyle(this.proxy, 'display', 'none');
        var endPoint = YAHOO.util.Event.getXY(e);
        if(this.useShim){
            this.shim.setVisible(false);
        }
        var newSize;
        if(this.orientation == YAHOO.ext.SplitBar.HORIZONTAL){
            newSize = this.dragSpecs.startSize + 
                (this.placement == YAHOO.ext.SplitBar.LEFT ?
                    endPoint[0] - this.dragSpecs.startPoint[0] :
                    this.dragSpecs.startPoint[0] - endPoint[0]
                );
        }else{
            newSize = this.dragSpecs.startSize + 
                (this.placement == YAHOO.ext.SplitBar.TOP ?
                    endPoint[1] - this.dragSpecs.startPoint[1] :
                    this.dragSpecs.startPoint[1] - endPoint[1]
                );
        }
        newSize = Math.min(Math.max(newSize, this.minSize), this.maxSize);
        if(newSize != this.dragSpecs.startSize){
            this.adapter.setElementSize(this, newSize);
            this.onMoved.fireDirect(this, newSize);
        }
    },
    
    /**
     * Get the adapter this SplitBar uses
     * @return The adapter object
     */
    getAdapter : function(){
        return this.adapter;
    },
    
    /**
     * Set the adapter this SplitBar uses
     * @param {Object} adapter A SplitBar adapter object
     */
    setAdapter : function(adapter){
        this.adapter = adapter;
        this.adapter.init(this);
    },
    
    /**
     * Gets the minimum size for the resizing element
     * @return {Number} The minimum size
     */
    getMinimumSize : function(){
        return this.minSize;
    },
    
    /**
     * Sets the minimum size for the resizing element
     * @param {Number} minSize The minimum size
     */
    setMinimumSize : function(minSize){
        this.minSize = minSize;
    },
    
    /**
     * Gets the maximum size for the resizing element
     * @return {Number} The maximum size
     */
    getMaximumSize : function(){
        return this.maxSize;
    },
    
    /**
     * Sets the maximum size for the resizing element
     * @param {Number} maxSize The maximum size
     */
    setMaximumSize : function(maxSize){
        this.maxSize = maxSize;
    },
    
    /**
     * Sets the initialize size for the resizing element
     * @param {Number} size The initial size
     */
    setCurrentSize : function(size){
        var oldAnimate = this.animate;
        this.animate = false;
        this.adapter.setElementSize(this, size);
        this.animate = oldAnimate;
    }
};

/**
 * @private static Create the shim to drag over iframes
 */
YAHOO.ext.SplitBar.createShim = function(){
    var shim = document.createElement('div');
    YAHOO.util.Dom.generateId(shim, 'split-shim');
    YAHOO.util.Dom.setStyle(shim, 'width', '100%');
    YAHOO.util.Dom.setStyle(shim, 'height', '100%');
    YAHOO.util.Dom.setStyle(shim, 'position', 'absolute');
    YAHOO.util.Dom.setStyle(shim, 'background', 'white');
    YAHOO.util.Dom.setStyle(shim, 'visibility', 'hidden');
    YAHOO.util.Dom.setStyle(shim, 'z-index', 2);
    window.document.body.appendChild(shim);
    var shimEl = YAHOO.ext.Element.get(shim);
    shimEl.setOpacity(.01);
    shimEl.setXY([0, 0]);  
    return shimEl;
}

/**
 * @private static Create our own proxy element element. So it will be the same same size on all browsers, we won't use borders. Instead we use a background color.
 */
YAHOO.ext.SplitBar.createProxy = function(orientation){
    var proxy = document.createElement('div');
    YAHOO.util.Dom.generateId(proxy, 'split-proxy');
    YAHOO.util.Dom.setStyle(proxy, 'position', 'absolute');
    YAHOO.util.Dom.setStyle(proxy, 'visibility', 'hidden');
    YAHOO.util.Dom.setStyle(proxy, 'z-index', 999);
    YAHOO.util.Dom.setStyle(proxy, 'background-color', "#aaa");
    if(orientation == YAHOO.ext.SplitBar.HORIZONTAL){
        YAHOO.util.Dom.setStyle(proxy, 'cursor', 'e-resize');
    }else{
        YAHOO.util.Dom.setStyle(proxy, 'cursor', 'n-resize');
    }
    // the next 2 fix IE abs position div height problem
    YAHOO.util.Dom.setStyle(proxy, 'line-height', '0px');
    YAHOO.util.Dom.setStyle(proxy, 'font-size', '0px');
    window.document.body.appendChild(proxy);
    return proxy;
}

/** 
 * @class
 * Default Adapter. It assumes the splitter and resizing element are not positioned
 * elements and only gets/sets the width of the element. Generally used for table based layouts.
 */
YAHOO.ext.SplitBar.BasicLayoutAdapter = function(){
}

YAHOO.ext.SplitBar.BasicLayoutAdapter.prototype = {
    // do nothing for now
    init : function(s){
    
    },
    /**
     * Called before drag operations to get the current size of the resizing element. 
     * @param {YAHOO.ext.SplitBar} s The SplitBar using this adapter
     */
     getElementSize : function(s){
        if(s.orientation == YAHOO.ext.SplitBar.HORIZONTAL){
            return s.resizingEl.getWidth();
        }else{
            return s.resizingEl.getHeight();
        }
    },
    
    /**
     * Called after drag operations to set the size of the resizing element.
     * @param {YAHOO.ext.SplitBar} s The SplitBar using this adapter
     * @param {Number} newSize The new size to set
     * @param {Function} onComplete A function to be invoke when resizing is complete
     */
    setElementSize : function(s, newSize, onComplete){
        if(s.orientation == YAHOO.ext.SplitBar.HORIZONTAL){
            if(!YAHOO.util.Anim || !s.animate){
                s.resizingEl.setWidth(newSize);
                if(onComplete){
                    onComplete(s, newSize);
                }
            }else{
                s.resizingEl.setWidth(newSize, true, .1, onComplete, YAHOO.util.Easing.easeOut);
            }
        }else{
            
            if(!YAHOO.util.Anim || !s.animate){
                s.resizingEl.setHeight(newSize);
                if(onComplete){
                    onComplete(s, newSize);
                }
            }else{
                s.resizingEl.setHeight(newSize, true, .1, onComplete, YAHOO.util.Easing.easeOut);
            }
        }
    }
};

/** 
 *@class
 * Adapter that  moves the splitter element to align with the resized sizing element. 
 * Used with an absolute positioned SplitBar.
 * @param {String/HTMLElement/Element} container The container that wraps around the absolute positioned content. If it's
 * document.body, make sure you assign an id to the body element.
 */
YAHOO.ext.SplitBar.AbsoluteLayoutAdapter = function(container){
    this.basic = new YAHOO.ext.SplitBar.BasicLayoutAdapter();
    this.container = getEl(container);
}

YAHOO.ext.SplitBar.AbsoluteLayoutAdapter.prototype = {
    init : function(s){
        this.basic.init(s);
        //YAHOO.util.Event.on(window, 'resize', this.moveSplitter.createDelegate(this, [s]));
    },
    
    getElementSize : function(s){
        return this.basic.getElementSize(s);
    },
    
    setElementSize : function(s, newSize, onComplete){
        this.basic.setElementSize(s, newSize, this.moveSplitter.createDelegate(this, [s]));
    },
    
    moveSplitter : function(s){
        var yes = YAHOO.ext.SplitBar;
        switch(s.placement){
            case yes.LEFT:
                s.el.setX(s.resizingEl.getRight());
                break;
            case yes.RIGHT:
                s.el.setStyle('right', (this.container.getWidth() - s.resizingEl.getLeft()) + 'px');
                break;
            case yes.TOP:
                s.el.setY(s.resizingEl.getBottom());
                break;
            case yes.BOTTOM:
                s.el.setY(s.resizingEl.getTop() - s.el.getHeight());
                break;
        }
    }
};

/**
 * Orientation constant - Create a vertical SplitBar
 * @type Number
 */
YAHOO.ext.SplitBar.VERTICAL = 1;

/**
 * Orientation constant - Create a horizontal SplitBar
 * @type Number
 */
YAHOO.ext.SplitBar.HORIZONTAL = 2;

/**
 * Placement constant - The resizing element is to the left of the splitter element
 * @type Number
 */
YAHOO.ext.SplitBar.LEFT = 1;

/**
 * Placement constant - The resizing element is to the right of the splitter element
 * @type Number
 */
YAHOO.ext.SplitBar.RIGHT = 2;

/**
 * Placement constant - The resizing element is positioned above the splitter element
 * @type Number
 */
YAHOO.ext.SplitBar.TOP = 3;

/**
 * Placement constant - The resizing element is positioned under splitter element
 * @type Number
 */
YAHOO.ext.SplitBar.BOTTOM = 4;
