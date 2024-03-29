/*
 * YUI Extensions
 * Copyright(c) 2006, Jack Slocum.
 * 
 * This code is licensed under BSD license. 
 * http://www.opensource.org/licenses/bsd-license.php
 */

YAHOO.ext.grid.TextEditor = function(config){
    var element = document.createElement('input');
    element.type = 'text';
    element.className = 'ygrid-editor ygrid-text-editor';
    element.setAttribute('autocomplete', 'off');
    document.body.appendChild(element);
    YAHOO.ext.grid.TextEditor.superclass.constructor.call(this, element);
    YAHOO.ext.util.Config.apply(this, config);
};
YAHOO.extendX(YAHOO.ext.grid.TextEditor, YAHOO.ext.grid.CellEditor);

YAHOO.ext.grid.TextEditor.prototype.validate = function(){
    var dom = this.element.dom;
    var value = dom.value;
    if(value.length < 1){ // if it's blank
         if(this.allowBlank){
             dom.title = '';
             this.element.removeClass('ygrid-editor-invalid');
             return true;
         }else{
             dom.title = this.blankText;
             this.element.addClass('ygrid-editor-invalid');
             return false;
         }
    }
    var msg = this.validator(value);
    if(msg !== true){
        dom.title = msg;
        this.element.addClass('ygrid-editor-invalid');
        return false;
    }
    if(this.regex && !this.regex.test(value)){
        dom.title = this.regexText;
        this.element.addClass('ygrid-editor-invalid');
        return false;
    }
    dom.title = '';
    this.element.removeClass('ygrid-editor-invalid');
    return true;
};

YAHOO.ext.grid.TextEditor.prototype.initEvents = function(){
    YAHOO.ext.grid.TextEditor.superclass.initEvents.call(this);
    var vtask = new YAHOO.ext.util.DelayedTask(this.validate, this);
    this.element.mon('keyup', vtask.delay.createDelegate(vtask, [this.validationDelay]));
};

YAHOO.ext.grid.TextEditor.prototype.show = function(){
    this.element.dom.title = '';
    YAHOO.ext.grid.TextEditor.superclass.show.call(this);
    this.element.focus();
    if(this.selectOnFocus){
        try{
            this.element.dom.select();
        }catch(e){}
    }
    this.validate(this.element.dom.value);
};

YAHOO.ext.grid.TextEditor.prototype.getValue = function(){
   if(!this.validate()){
       return this.originalValue;
   }else{
       return this.element.dom.value;
   }   
};

YAHOO.ext.grid.TextEditor.prototype.allowBlank = true;
YAHOO.ext.grid.TextEditor.prototype.selectOnFocus = true;
YAHOO.ext.grid.TextEditor.prototype.blankText = 'This field cannot be blank';
YAHOO.ext.grid.TextEditor.prototype.validator = function(){return true;};
YAHOO.ext.grid.TextEditor.prototype.validationDelay = 200;
YAHOO.ext.grid.TextEditor.prototype.regex = null;
YAHOO.ext.grid.TextEditor.prototype.regexText = '';