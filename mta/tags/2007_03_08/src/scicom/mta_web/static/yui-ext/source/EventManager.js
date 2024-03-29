/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 */


/**
 * @class 
 * Registers event handlers that want to receive an EventObject instead of the standard browser event
 * See {@link YAHOO.ext.EventObject} for more details on the usage of this object.
 */
YAHOO.ext.EventManager = new function(){
    /** 
     * Places a simple wrapper around an event handler to override the browser event 
     * object with a YAHOO.ext.EventObject
     */
    this.wrap = function(fn, scope, override){
        var wrappedFn = function(e){
            YAHOO.ext.EventObject.setEvent(e);
            fn.call(override ? scope || window : window, YAHOO.ext.EventObject, scope);
        };
        return wrappedFn;
    };
    
    /**
     * Appends an event handler
     *
     * @param {Object}   element        The html element to assign the 
     *                             event to
     * @param {String}   eventName     The type of event to append
     * @param {Function} fn        The method the event invokes
     * @param {Object}   scope    An arbitrary object that will be 
     *                             passed as a parameter to the handler
     * @param {boolean}  override If true, the obj passed in becomes
     *                             the execution scope of the listener
     * @return {Function} The wrapper function created (to be used to remove the listener if necessary)
     */
    this.addListener = function(element, eventName, fn, scope, override){
        var wrappedFn = this.wrap(fn, scope, override);
        YAHOO.util.Event.addListener(element, eventName, wrappedFn);
        return wrappedFn;
    };
    
    /**
     * Removes an event handler
     *
     * @param {Object}   element        The html element to remove the 
     *                             event from
     * @param {String}   eventName     The type of event to append
     * @param {Function} wrappedFn        The wrapper method returned when adding the listener
     * @return {Boolean} True if a listener was actually removed
     */
    this.removeListener = function(element, eventName, wrappedFn){
        return YAHOO.util.Event.removeListener(element, eventName, wrappedFn);
    };
    
    /**
     * Appends an event handler (shorthand for addListener)
     *
     * @param {Object}   element        The html element to assign the 
     *                             event to
     * @param {String}   eventName     The type of event to append
     * @param {Function} fn        The method the event invokes
     * @param {Object}   scope    An arbitrary object that will be 
     *                             passed as a parameter to the handler
     * @param {boolean}  override If true, the obj passed in becomes
     *                             the execution scope of the listener
     * @return {Function} The wrapper function created (to be used to remove the listener if necessary)
     */
     this.on = function(element, eventName, fn, scope, override){
        var wrappedFn = this.wrap(fn, scope, override);
        YAHOO.util.Event.addListener(element, eventName, wrappedFn);
        return wrappedFn;
    };
};

/**
 * @class 
 * EventObject exposes the Yahoo! UI Event functionality directly on the object
 * passed to your event handler. It exists mostly for convenience. It also fixes the annoying null checks automatically to cleanup your code 
 * (All the YAHOO.util.Event methods throw javascript errors if the passed event is null).
 * To get an EventObject instead of the standard browser event,
 * your must register your listener thru the {@link YAHOO.ext.EventManager} or directly on an Element
 * with {@link YAHOO.ext.Element#addManagedListener} or the shorthanded equivalent {@link YAHOO.ext.Element#mon}.<br>
 * Example:
 * <pre><code>
 fu<>nction handleClick(e){ // e is not a standard event object, it is a YAHOO.ext.EventObject
    e.preventDefault();
    var target = e.getTarget();
    ...
 }
 var myDiv = getEl('myDiv');
 myDiv.mon('click', handleClick);
 //or
 YAHOO.ext.EventManager.on('myDiv', 'click', handleClick);
 YAHOO.ext.EventManager.addListener('myDiv', 'click', handleClick);
 </code></pre>
 */
YAHOO.ext.EventObject = new function(){
    /** The normal browser event */ 
    this.browserEvent = null;
    /** The button pressed in a mouse event */ 
    this.button = -1;
    /** True if the shift key was down during the event */ 
    this.shiftKey = false;
    /** True if the control key was down during the event */ 
    this.ctrlKey = false;
    /** True if the alt key was down during the event */ 
    this.altKey = false;
    
    /** Key constant @type Number */
    this.BACKSPACE = 8;
    /** Key constant @type Number */
    this.TAB = 9;
    /** Key constant @type Number */
    this.RETURN = 13;
    /** Key constant @type Number */
    this.ESC = 27;
    /** Key constant @type Number */
    this.SPACE = 32;
    /** Key constant @type Number */
    this.PAGEUP = 33;
    /** Key constant @type Number */
    this.PAGEDOWN = 34;
    /** Key constant @type Number */
    this.END = 35;
    /** Key constant @type Number */
    this.HOME = 36;
    /** Key constant @type Number */
    this.LEFT = 37;
    /** Key constant @type Number */
    this.UP = 38;
    /** Key constant @type Number */
    this.RIGHT = 39;
    /** Key constant @type Number */
    this.DOWN = 40;
    /** Key constant @type Number */
    this.DELETE = 46;
    /** Key constant @type Number */
    this.F5 = 116;

       /** @private */ 
    this.setEvent = function(e){
        this.browserEvent = e;
        if(e){
            this.button = e.button;
            this.shiftKey = e.shiftKey;
            this.ctrlKey = e.ctrlKey;
            this.altKey = e.altKey;
        }else{
            this.button = -1;
            this.shiftKey = false;
            this.ctrlKey = false;
            this.altKey = false;
        }
    };
    
    /**
     * Stop the event. Calls YAHOO.util.Event.stopEvent() if the event is not null.
     */ 
    this.stopEvent = function(){
        if(this.browserEvent){
            YAHOO.util.Event.stopEvent(this.browserEvent);
        }
    };
    
    /**
     * Prevents the browsers default handling of the event. Calls YAHOO.util.Event.preventDefault() if the event is not null.
     */ 
    this.preventDefault = function(){
        if(this.browserEvent){
            YAHOO.util.Event.preventDefault(this.browserEvent);
        }
    };
    
    /** @private */
    this.isNavKeyPress = function(){
        return (this.browserEvent.keyCode && this.browserEvent.keyCode >= 33 && this.browserEvent.keyCode <= 40);
    };
    
    /**
     * Cancels bubbling of the event. Calls YAHOO.util.Event.stopPropagation() if the event is not null.
     */ 
    this.stopPropagation = function(){
        if(this.browserEvent){
            YAHOO.util.Event.stopPropagation(this.browserEvent);
        }
    };
    
    /**
     * Gets the key code for the event. Returns value from YAHOO.util.Event.getCharCode() if the event is not null.
     * @return {Number}
     */ 
    this.getCharCode = function(){
        if(this.browserEvent){
            return YAHOO.util.Event.getCharCode(this.browserEvent);
        }
        return null;
    };
    
    /**
     * Gets the x coordinate of the event. Returns value from YAHOO.util.Event.getPageX() if the event is not null.
     * @return {Number}
     */ 
    this.getPageX = function(){
        if(this.browserEvent){
            return YAHOO.util.Event.getCharCode(this.browserEvent);
        }
        return null;
    };
    
    /**
     * Gets the y coordinate of the event. Returns value from YAHOO.util.Event.getPageY() if the event is not null.
     * @return {Number}
     */ 
    this.getPageY = function(){
        if(this.browserEvent){
            return YAHOO.util.Event.getCharCode(this.browserEvent);
        }
        return null;
    };
    
    /**
     * Gets the time of the event. Returns value from YAHOO.util.Event.getTime() if the event is not null.
     * @return {Number}
     */ 
    this.getTime = function(){
        if(this.browserEvent){
            return YAHOO.util.Event.getTime(this.browserEvent);
        }
        return null;
    };
    
    /**
     * Gets the page coordinates of the event. Returns value from YAHOO.util.Event.getXY() if the event is not null.
     * @return {Array} The xy values like [x, y]
     */ 
    this.getXY = function(){
        if(this.browserEvent){
            return YAHOO.util.Event.getXY(this.browserEvent);
        }
        return [];
    };
    
    /**
     * Gets the target for the event. Returns value from YAHOO.util.Event.getTarget() if the event is not null.
     * @return {HTMLelement}
     */ 
    this.getTarget = function(){
        if(this.browserEvent){
            return YAHOO.util.Event.getTarget(this.browserEvent);
        }
        return null;
    };
    
    /**
     * Walk up the DOM looking for a particular target - if the default target matches, it is returned.
     * @return {HTMLelement}
     */ 
    this.findTarget = function(className, tagName){
        if(tagName) tagName = tagName.toLowerCase();
        if(this.browserEvent){
            function isMatch(el){
               if(!el){
                   return false;
               }
               if(className && !YAHOO.util.Dom.hasClass(el, className)){
                   return false;
               }
               if(tagName && el.tagName.toLowerCase() != tagName){
                   return false;
               }
               return true;
            };
            
            var t = this.getTarget();
            if(!t || isMatch(t)){
    		    return t;
    	    }
    	    var p = t.parentNode;
    	    while(p && p.tagName.toUpperCase() != 'BODY'){
                if(isMatch(p)){
                	return p;
                }
                p = p.parentNode;
            }
    	}
        return null;
    };
    /**
     * Gets the related target. Returns value from YAHOO.util.Event.getRelatedTarget() if the event is not null.
     * @return {HTMLelement}
     */ 
    this.getRelatedTarget = function(){
        if(this.browserEvent){
            return YAHOO.util.Event.getRelatedTarget(this.browserEvent);
        }
        return null;
    };
    
    /**
     * Normalizes mouse wheel delta across browsers
     */
    this.getWheelDelta = function(){
        var e = this.browserEvent;
        var delta = 0;
        if(e.wheelDelta){ /* IE/Opera. */
            delta = e.wheelDelta/120;
            /** In Opera 9, delta differs in sign as compared to IE. */
            if(window.opera) delta = -delta;
        }else if(e.detail){ /** Mozilla case. */
            delta = -e.detail/3;
        }
        return delta;
    };
    
    /**
     * Returns true if the control, shift or alt key was pressed during this event.
     * @return {Boolean}
     */ 
    this.hasModifier = function(){
        return this.ctrlKey || this.altKey || this.shiftKey;
    };
}();
            
    