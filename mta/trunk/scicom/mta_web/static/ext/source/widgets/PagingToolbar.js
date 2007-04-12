/*
 * Ext JS Library 1.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

Ext.PagingToolbar = function(el, ds, config){
    Ext.PagingToolbar.superclass.constructor.call(this, el, null, config);
    this.ds = ds;
    this.cursor = 0;
    this.render(this.el);
    this.bind(ds);
};

Ext.extend(Ext.PagingToolbar, Ext.Toolbar, {
    pageSize: 20,
    displayMsg : 'Displaying {0} - {1} of {2}',
    emptyMsg : 'No data to display',

    render : function(el){
        this.first = this.addButton({
            tooltip: this.firstText,
            cls: "x-btn-icon x-grid-page-first",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["first"])
        });
        this.prev = this.addButton({
            tooltip: this.prevText,
            cls: "x-btn-icon x-grid-page-prev",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["prev"])
        });
        this.addSeparator();
        this.add(this.beforePageText);
        this.field = Ext.get(this.addDom({
           tag: "input",
           type: "text",
           size: "3",
           value: "1",
           cls: "x-grid-page-number"
        }).el);
        this.field.on("keydown", this.onPagingKeydown, this);
        this.field.on("focus", function(){this.dom.select();});
        this.afterTextEl = this.addText(String.format(this.afterPageText, 1));
        this.field.setHeight(18);
        this.addSeparator();
        this.next = this.addButton({
            tooltip: this.nextText,
            cls: "x-btn-icon x-grid-page-next",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["next"])
        });
        this.last = this.addButton({
            tooltip: this.lastText,
            cls: "x-btn-icon x-grid-page-last",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["last"])
        });
        this.addSeparator();
        this.loading = this.addButton({
            tooltip: this.refreshText,
            cls: "x-btn-icon x-grid-loading",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["refresh"])
        });

        if(this.displayInfo){
            this.displayEl = this.el.createChild({cls:'x-paging-info'});
        }
    },

    updateInfo : function(){
        if(this.displayEl){
            var count = this.ds.getCount();
            var msg = count == 0 ?
                this.emptyMsg :
                String.format(
                    this.displayMsg,
                    this.cursor+1, this.cursor+count, this.ds.getTotalCount()    
                );
            this.displayEl.update(msg);
        }
    },

    onLoad : function(ds, r, o){
       this.cursor = o.params ? o.params.start : 0;
       var d = this.getPageData(), ap = d.activePage, ps = d.pages;

       this.afterTextEl.el.innerHTML = String.format(this.afterPageText, d.pages);
       this.field.dom.value = ap;
       this.first.setDisabled(ap == 1);
       this.prev.setDisabled(ap == 1);
       this.next.setDisabled(ap == ps);
       this.last.setDisabled(ap == ps);
       this.loading.enable();
       this.updateInfo();
    },

    getPageData : function(){
        var total = this.ds.getTotalCount();
        return {
            total : total,
            activePage : Math.ceil((this.cursor+this.pageSize)/this.pageSize),
            pages :  total < this.pageSize ? 1 : Math.ceil(total/this.pageSize)
        };
    },

    onLoadError : function(){
        this.loading.enable();
    },

    onPagingKeydown : function(e){
        var k = e.getKey();
        var d = this.getPageData();
        if(k == e.RETURN){
            var v = this.field.dom.value, pageNum;
            if(!v || isNaN(pageNum = parseInt(v, 10))){
                this.field.dom.value = d.activePage;
                return;
            }
            pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
            this.ds.load({params:{start: pageNum * this.pageSize, limit: this.pageSize}});
            e.stopEvent();
        }
        else if(k == e.HOME || (k == e.UP && e.ctrlKey) || (k == e.PAGEUP && e.ctrlKey) || (k == e.RIGHT && e.ctrlKey) || k == e.END || (k == e.DOWN && e.ctrlKey) || (k == e.LEFT && e.ctrlKey) || (k == e.PAGEDOWN && e.ctrlKey))
        {
          var pageNum = (k == e.HOME || (k == e.DOWN && e.ctrlKey) || (k == e.LEFT && e.ctrlKey) || (k == e.PAGEDOWN && e.ctrlKey)) ? 1 : d.pages;
          this.field.dom.value = pageNum;
          this.ds.load({params:{start: (pageNum - 1) * this.pageSize, limit: this.pageSize}});
          e.stopEvent();
        }
        else if(k == e.UP || k == e.RIGHT || k == e.PAGEUP || k == e.DOWN || k == e.LEFT || k == e.PAGEDOWN)
        {
          var v = this.field.dom.value, pageNum; 
          var increment = (e.shiftKey) ? 10 : 1;
          if(k == e.DOWN || k == e.LEFT || k == e.PAGEDOWN)
            increment *= -1;
          if(!v || isNaN(pageNum = parseInt(v, 10))) {
            this.field.dom.value = d.activePage;
            return;
          }
          else if(parseInt(v, 10) + increment >= 1 & parseInt(v, 10) + increment <= d.pages)
          {
            this.field.dom.value = parseInt(v, 10) + increment;
            pageNum = Math.min(Math.max(1, pageNum + increment), d.pages) - 1;
            this.ds.load({params:{start: pageNum * this.pageSize, limit: this.pageSize}});
          }
          e.stopEvent();
        }
    },

    beforeLoad : function(){
        if(this.loading){
            this.loading.disable();
        }
    },

    onClick : function(which){
        var ds = this.ds;
        switch(which){
            case "first":
                ds.load({params:{start: 0, limit: this.pageSize}});
            break;
            case "prev":
                ds.load({params:{start: Math.max(0, this.cursor-this.pageSize), limit: this.pageSize}});
            break;
            case "next":
                ds.load({params:{start: this.cursor+this.pageSize, limit: this.pageSize}});
            break;
            case "last":
                var total = ds.getTotalCount();
                var extra = total % this.pageSize;
                var lastStart = extra ? (total - extra) : total-this.pageSize;
                ds.load({params:{start: lastStart, limit: this.pageSize}});
            break;
            case "refresh":
                ds.load({params:{start: this.cursor, limit: this.pageSize}});
            break;
        }
    },

    unbind : function(ds){
        ds.un("beforeload", this.beforeLoad, this);
        ds.un("load", this.onLoad, this);
        ds.un("loadexception", this.onLoadError, this);
    },

    bind : function(ds){
        ds.on("beforeload", this.beforeLoad, this);
        ds.on("load", this.onLoad, this);
        ds.on("loadexception", this.onLoadError, this);
    },

    /**
     * Customizable piece of the default paging text (defaults to "Page")
     * @type String
     */
    beforePageText : "Page",
    /**
     * Customizable piece of the default paging text (defaults to "of %0")
     * @type String
     */
    afterPageText : "of {0}",
    /**
     * Customizable piece of the default paging text (defaults to "First Page")
     * @type String
     */
    firstText : "First Page",
    /**
     * Customizable piece of the default paging text (defaults to "Previous Page")
     * @type String
     */
    prevText : "Previous Page",
    /**
     * Customizable piece of the default paging text (defaults to "Next Page")
     * @type String
     */
    nextText : "Next Page",
    /**
     * Customizable piece of the default paging text (defaults to "Last Page")
     * @type String
     */
    lastText : "Last Page",
    /**
     * Customizable piece of the default paging text (defaults to "Refresh")
     * @type String
     */
    refreshText : "Refresh"
});