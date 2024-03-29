/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 */

/**
 * @class Provides AJAX-style update for Element object using Yahoo 
 * UI library YAHOO.util.Connect functionality.<br><br>
 * Usage:<br>
 * <pre><code>
 * // Get it from a YAHOO.ext.Element object
 * var mgr = myElement.getUpdateManager();
 * mgr.update('http://myserver.com/index.php', 'param1=1&amp;param2=2');
 * ...
 * mgr.formUpdate('myFormId', 'http://myserver.com/index.php');
 * <br>
 * // or directly (returns the same UpdateManager instance)
 * var mgr = new YAHOO.ext.UpdateManager('myElementId');
 * mgr.startAutoRefresh('http://myserver.com/index.php', 60);
 * mgr.onUpdate.subscribe(myFcnNeedsToKnow);
 * <br>
 * </code></pre>
 * @requires YAHOO.ext.Element
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @requires YAHOO.util.CustomEvent 
 * @requires YAHOO.util.Connect
 * @constructor
 * Create new UpdateManager.
 * @param {String/HTMLElement/YAHOO.ext.Element} el The element to update 
 * @param {<i>Boolean</i>} forceNew (optional) By default the constructor checks to see if the passed element already has an UpdateManager and if it does it returns the same instance. This will skip that check (useful for extending this class).
 */
YAHOO.ext.UpdateManager = function(el, forceNew){
    el = YAHOO.ext.Element.get(el);
    if(!forceNew && el.updateManager){
        return el.updateManager;
    }
    /**
     * The Element object
     * @type YAHOO.ext.Element
     */
    this.el = el;
    /**
     * Cached url to use for refreshes. Overwritten every time update() is called unless 'discardUrl' param is set to true.
     * @type String
     */
    this.defaultUrl = null;
    /**
     * fired before update is made, return false from your handler and the update is cancelled. 
     * Uses fireDirect with signature: (oElement, url, params)
     * @type YAHOO.util.CustomEvent
     */
    this.beforeUpdate = new YAHOO.util.CustomEvent('UpdateManager.beforeUpdate');
    /**
     * Fired after successful update is made. Uses fireDirect with signature: (oElement, oResponseObject)
     * @type YAHOO.util.CustomEvent
     */
    this.onUpdate = new YAHOO.util.CustomEvent('UpdateManager.onUpdate');
    /**
     * Fired on update failure. Uses fireDirect with signature: (oElement, oResponseObject)
     * @type YAHOO.util.CustomEvent
     */
    this.onFailure = new YAHOO.util.CustomEvent('UpdateManager.onFailure');
    
    /**
     * Blank page URL to use with SSL file uploads (Defaults to YAHOO.ext.UpdateManager.defaults.sslBlankUrl or 'about:blank'). 
     * @type String
     */
    this.sslBlankUrl = YAHOO.ext.UpdateManager.defaults.sslBlankUrl;
    /**
     * Whether to append unique parameter on get request to disable caching (Defaults to YAHOO.ext.UpdateManager.defaults.disableCaching or false). 
     * @type Boolean
     */
    this.disableCaching = YAHOO.ext.UpdateManager.defaults.disableCaching;
    /**
     * Text for loading indicator (Defaults to YAHOO.ext.UpdateManager.defaults.indicatorText or '&lt;div class="loading-indicator"&gt;Loading...&lt;/div&gt;'). 
     * @type String
     */
    this.indicatorText = YAHOO.ext.UpdateManager.defaults.indicatorText;
    /**
     * Whether to show indicatorText when loading (Defaults to YAHOO.ext.UpdateManager.defaults.showLoadIndicator or true). 
     * @type String
     */
    this.showLoadIndicator = YAHOO.ext.UpdateManager.defaults.showLoadIndicator;
    /**
     * Timeout for requests or form posts in seconds (Defaults to YAHOO.ext.UpdateManager.defaults.timeout or 30 seconds). 
     * @type Number
     */
    this.timeout = YAHOO.ext.UpdateManager.defaults.timeout;
    /**
     * @private
     */
    this.autoRefreshProcId = null;
    /**
     * Delegate for refresh() prebound to 'this', use myUpdater.refreshDelegate.createCallback(arg1, arg2) to bind arguments
     * @type Function
     */
    this.refreshDelegate = this.refresh.createDelegate(this);
    /**
     * Delegate for update() prebound to 'this', use myUpdater.updateDelegate.createCallback(arg1, arg2) to bind arguments
     * @type Function
     */
    this.updateDelegate = this.update.createDelegate(this);
    /**
     * Delegate for formUpdate() prebound to 'this', use myUpdater.formUpdateDelegate.createCallback(arg1, arg2) to bind arguments
     * @type Function
     */
    this.formUpdateDelegate = this.formUpdate.createDelegate(this);
    /**
     * @private
     */
    this.successDelegate = this.processSuccess.createDelegate(this);
    /**
     * @private
     */
     this.failureDelegate = this.processFailure.createDelegate(this);
     
     /**
      * The renderer for this UpdateManager. Defaults to {@link YAHOO.ext.UpdateManager.BasicRenderer}. 
      */
      this.renderer = new YAHOO.ext.UpdateManager.BasicRenderer();
}

YAHOO.ext.UpdateManager.prototype = {
    /**
     * Get the Element this UpdateManager is bound to
     * @return {YAHOO.ext.Element} The element
     */
    getEl : function(){
        return this.el;
    },
    
    /**
     * Performs an async request, updating this element with the response. If params are specified it uses POST, otherwise it uses GET.
     * @param {String/Function} url The url for this request or a function to call to get the url
     * @param {<i>String/Object</i>} params (optional) The parameters to pass as either a url encoded string "param1=1&amp;param2=2" or as an object {param1: 1, param2: 2}
     * @param {<i>Function</i>} callback (optional) Callback when transaction is complete - called with signature (oElement, bSuccess)
     * @param {<i>Boolean</i>} discardUrl (optional) By default when you execute an update the defaultUrl is changed to the last used url. If true, it will not store the url.
     */
    update : function(url, params, callback, discardUrl){
        if(this.beforeUpdate.fireDirect(this.el, url, params) !== false){
            this.showLoading();
            if(!discardUrl){
                this.defaultUrl = url;
            }
            if(typeof url == 'function'){
                url = url();
            }
            if(params && typeof params != 'string'){ // must be object
                var buf = [];
                for(key in params){
                    buf.push(encodeURIComponent(key), '=', encodeURIComponent(params[key]), '&');
                }
                delete buf[buf.length-1];
                params = buf.join('');
            }
            var callback = {
                success: this.successDelegate,
                failure: this.failureDelegate,
                timeout: (this.timeout*1000),
                argument: {'url': url, 'form': null, 'callback': callback, 'params': params}
            };
            var method = params ? 'POST' : 'GET';
            if(method == 'GET'){
                url = this.prepareUrl(url);
            }
            YAHOO.util.Connect.asyncRequest(method, url, callback, params);
        }
    },
    
    /**
     * Performs an async form post, updating this element with the response. If the form has the attribute enctype="multipart/form-data", it assumes it's a file upload.
     * Uses this.sslBlankUrl for SSL file uploads to prevent IE security warning. See YUI docs for more info. 
     * @param {String/HTMLElement} form The form Id or form element
     * @param {<i>String</i>} url (optional) The url to pass the form to. If omitted the action attribute on the form will be used.
     * @param {<i>Boolean</i>} reset (optional) Whether to try to reset the form after the update
     * @param {<i>Function</i>} callback (optional) Callback when transaction is complete - called with signature (oElement, bSuccess)
     */
    formUpdate : function(form, url, reset, callback){
        if(this.beforeUpdate.fireDirect(this.el, form, url) !== false){
            this.showLoading();
            formEl = YAHOO.util.Dom.get(form);
            if(typeof url == 'function'){
                url = url();
            }
            url = url || formEl.action;
            var callback = {
                success: this.successDelegate,
                failure: this.failureDelegate,
                timeout: (this.timeout*1000),
                argument: {'url': url, 'form': form, 'callback': callback, 'reset': reset}
            };
            var isUpload = false;
            var enctype = formEl.getAttribute('enctype');
            if(enctype && enctype.toLowerCase() == 'multipart/form-data'){
                isUpload = true;
            }
            YAHOO.util.Connect.setForm(form, isUpload, this.sslBlankUrl);
            YAHOO.util.Connect.asyncRequest('POST', url, callback);
        }
    },
    
    /**
     * Refresh the element with the last used url or defaultUrl. If there is no url, it returns immediately
     * @param {Function} callback (optional) Callback when transaction is complete - called with signature (oElement, bSuccess)
     */
    refresh : function(callback){
        if(this.defaultUrl == null){
            return;
        }
        this.update(this.defaultUrl, null, callback, true);
    },
    
    /**
     * Set this element to auto refresh.
     * @param {Number} interval How often to update (in seconds).
     * @param {<i>String/Function</i>} url (optional) The url for this request or a function to call to get the url (Defaults to the last used url)
     * @param {<i>String/Object</i>} params (optional) The parameters to pass as either a url encoded string "&param1=1&param2=2" or as an object {param1: 1, param2: 2}
     * @param {<i>Function</i>} callback (optional) Callback when transaction is complete - called with signature (oElement, bSuccess)
     * @param {<i>Boolean</i>} refreshNow (optional) Whether to execute the refresh now, or wait the interval
     */
    startAutoRefresh : function(interval, url, params, callback, refreshNow){
        if(refreshNow){
            this.update(url || this.defaultUrl, params, callback, true);
        }
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
        }
        this.autoRefreshProcId = setInterval(this.update.createDelegate(this, [url || this.defaultUrl, params, callback, true]), interval*1000);
    },
    
    /**
     * Stop auto refresh on this element.
     */
     stopAutoRefresh : function(){
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
        }
    },
    
    /**
     * Called to update the element to "Loading" state. Override to perform custom action.
     */
    showLoading : function(){
        if(this.showLoadIndicator){
            this.el.update(this.indicatorText);
        }
    },
    
    /**
     * Adds unique parameter to query string if disableCaching = true
     * @private
     */
    prepareUrl : function(url){
        if(this.disableCaching){
            var append = '_dc=' + (new Date().getTime());
            if(url.indexOf('?') !== -1){
                url += '&' + append;
            }else{
                url += '?' + append;
            }
        }
        return url;
    },
    
    /**
     * @private
     */
    processSuccess : function(response){
        this.renderer.render(this.el, response);
        if(response.argument.form && response.argument.reset){
            try{ // put in try/catch since some older FF releases had problems with this
                response.argument.form.reset();
            }catch(e){}
        }
        this.onUpdate.fireDirect(this.el, response);
        if(typeof response.argument.callback == 'function'){
            response.argument.callback(this.el, true);
        }
    },
    
    /**
     * @private
     */
    processFailure : function(response){
        this.onFailure.fireDirect(this.el, response);
        if(typeof response.argument.callback == 'function'){
            response.argument.callback(this.el, false);
        }
    },
    
    /**
     * Set the content renderer for this UpdateManager. See {@link YAHOO.ext.UpdateManager.BasicRenderer#render} for more details.
     * @param {Object} renderer The object implementing the render() method
     */
    setRenderer : function(renderer){
        this.renderer = renderer;
    },
    
    /**
     * Set the defaultUrl used for updates
     * @param {String/Function} defaultUrl The url or a function to call to get the url
     */
    setDefaultUrl : function(defaultUrl){
        this.defaultUrl = defaultUrl;
    }
};

/**
 * @class
 * Default Content renderer. Updates the elements innerHTML with the responseText.
 */ 
YAHOO.ext.UpdateManager.BasicRenderer = function(){};

YAHOO.ext.UpdateManager.BasicRenderer.prototype = {
    /**
     * This is called when the transaction is completed and it's time to update the element - The BasicRenderer 
     * updates the elements innerHTML with the responseText - To perform a custom render (i.e. XML or JSON processing), 
     * create an object with a "render(el, response)" method and pass it to setRenderer on the UpdateManager.
     * @param {YAHOO.ext.Element} el The element being rendered
     * @param {Object} response The YUI Connect response object
     */
     render : function(el, response){
        el.update(response.responseText);
    }
};

/**
 * The defaults collection enables customizing the default behavior of UpdateManager
 */
YAHOO.ext.UpdateManager.defaults = {};
/**
 * Timeout for requests or form posts in seconds (Defaults 30 seconds). 
 * @type Number
 */
 YAHOO.ext.UpdateManager.defaults.timeout = 30;
/**
* Blank page URL to use with SSL file uploads (Defaults to 'about:blank'). 
* @type String
*/
YAHOO.ext.UpdateManager.defaults.sslBlankUrl = 'about:blank';
/**
 * Whether to append unique parameter on get request to disable caching (Defaults to false). 
 * @type Boolean
 */
YAHOO.ext.UpdateManager.defaults.disableCaching = false;
/**
 * Whether to show indicatorText when loading (Defaults to true). 
 * @type String
 */
YAHOO.ext.UpdateManager.defaults.showLoadIndicator = true;
/**
 * Text for loading indicator (Defaults to '&lt;div class="loading-indicator"&gt;Loading...&lt;/div&gt;'). 
 * @type String
 */
YAHOO.ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Loading...</div>';