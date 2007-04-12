/*
 * Ext JS Library 1.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

Ext.data.DataProxy = function(){
    this.events = {
        beforeload : true,
        load : true,
        loadexception : true
    };
};

Ext.extend(Ext.data.DataProxy, Ext.util.Observable);