/*
 * Ext JS Library 1.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

Ext.data.ScriptTagProxy = function(config){
    Ext.data.ScriptTagProxy.superclass.constructor.call(this);
    Ext.apply(this, config);
    this.head = document.getElementsByTagName("head")[0];
};

Ext.data.ScriptTagProxy.TRANS_ID = 1000;

Ext.extend(Ext.data.ScriptTagProxy, Ext.data.DataProxy, {
    timeout : 30000,
    callbackParam : "callback",
    nocache : true,
    
    load : function(params, reader, callback, scope, arg){
        if(this.fireEvent("beforeload", this, params) !== false){
            
            var p = Ext.urlEncode(Ext.apply(params, this.extraParams));
            
            var url = this.url;
            url += (url.indexOf("?") != -1 ? "&" : "?") + p;
            if(this.nocache){
                url += "&_dc=" + (new Date().getTime());
            }
            var transId = ++Ext.data.ScriptTagProxy.TRANS_ID;
            var trans = {
                id : transId,
                cb : "stcCallback"+transId,
                scriptId : "stcScript"+transId,
                params : params,
                arg : arg,
                url : url,
                callback : callback,
                scope : scope,
                reader : reader
            };
            var conn = this;
            
            window[trans.cb] = function(o){
                conn.handleResponse(o, trans);
            };
            
            url += String.format("&{0}={1}", this.callbackParam, trans.cb);
            
            if(this.autoAbort !== false){
                this.abort();
            }
            
            trans.timeoutId = this.handleFailure.defer(this.timeout, this, [trans]);
            
            var script = document.createElement("script");
            script.setAttribute("src", url);
            script.setAttribute("type", "text/javascript");
            script.setAttribute("id", trans.scriptId);
            this.head.appendChild(script);
            
            this.trans = trans;
        }else{
            callback.call(scope||this, null, arg, false);
        }
    },
    
    isLoading : function(){
        return this.trans ? true : false;  
    },
    
    abort : function(){
        if(this.isLoading()){
            this.destroyTrans(this.trans);
        }
    },
    
    destroyTrans : function(trans, isLoaded){
        this.head.removeChild(document.getElementById(trans.scriptId));
        clearTimeout(trans.timeoutId);
        if(isLoaded){
            window[trans.cb] = undefined;
            try{
                delete window[trans.cb];
            }catch(e){}
        }else{
            // if hasn't been loaded, wait for load to remove it to prevent script error
            window[trans.cb] = function(){
                window[trans.cb] = undefined;
                try{
                    delete window[trans.cb];
                }catch(e){}
            }; 
        }
    },
    
    handleResponse : function(o, trans){
        this.trans = false;
        this.destroyTrans(trans, true);
        var result;
        try {
            result = trans.reader.readRecords(o);
        }catch(e){
            this.fireEvent("loadexception", this, o, trans.arg, e);
            trans.callback.call(trans.scope||window, null, trans.arg, false);
            return;
        }
        this.fireEvent("load", this, o, trans.arg);
        trans.callback.call(trans.scope||window, result, trans.arg, true);
    },
    
    handleFailure : function(trans){
        this.trans = false;
        this.destroyTrans(trans, false);
        this.fireEvent("loadexception", this, null, trans.arg);
        trans.callback.call(trans.scope||window, null, trans.arg, false);
    }
});