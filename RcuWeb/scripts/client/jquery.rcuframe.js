(function($){
    $.fn.rcuframe = function()
    {
        this.rcutable_frame({"action":$.rcu.conststr.action.init});
        //TODO 在浏览器resize后，应该重新计算各个frame的高度
        var wndInfo = $.rcu.get("common").getBodyDispParam().wnd;
        var contentW = wndInfo.ContentWidth;
        var contentH = wndInfo.ContentHeight - 2;
        var itemNames = [$.rcu.conststr.tag.toolbar,
                         $.rcu.conststr.tag.index,
                         $.rcu.conststr.tag.monitor,
                         $.rcu.conststr.tag.dock];
        var gap = $.rcu.get("common").getBodyDispParam().gap;
        var leftOffSet = gap.x ;
        var topOffSet = gap.y ;
        var toolBarParam = $.rcu.get("common").getToolBarDispParam();
        var w1 = toolBarParam.wrp.width ;
        var indexParam = $.rcu.get("common").getIndexDispParam();
        var w2 = indexParam.wrp.width ;
        var monitorParam = $.rcu.get("common").getMonitorDispParam();
        var w3 = monitorParam.wrp.width ;
        var dockParam = $.rcu.get("common").getDockDispParam();
        var w4 = dockParam.wrp.width  ;
        for(var i = 0; i < itemNames.length ; ++i)
        {
            var obj = null ;
            var jItem = null ;
            var id = '';
            switch(itemNames[i])
            {
            case $.rcu.conststr.tag.toolbar:
                jItem = $("<div>");
                id = "rcu-frame-" + itemNames[i];
                jItem.addClass("rcu-frame")
                     .attr("name",itemNames[i])
                     .attr("id",id)
                     .attr("tabIndex",i+1)
                     .css("padding","0px 0px 0px 0px")
                     .css("float","left")
                     .width(w1)
                     .height(contentH)
                     .css("margin","0px 0px 0px 0px");
                obj = new RcuToolBar({"target":jItem});
                break;
            case $.rcu.conststr.tag.index:
                jItem = $("<div>");
                id = "rcu-frame-" + itemNames[i];
                jItem.addClass("rcu-frame")
                     .attr("name",itemNames[i])
                     .attr("id",id)
                     .attr("tabIndex",i+1)
                     .css("padding","0px 0px 0px 0px")
                     .css("float","left")
                     .width(w2)
                     .height(contentH - 16 - getExHeadHeight())
                     .css("margin",topOffSet + "px 0px 0px " + leftOffSet + "px");
                obj = new RcuIndex({"target":jItem});
                break;
            case $.rcu.conststr.tag.monitor:
                jItem = $("<div>");
                id = "rcu-frame-" + itemNames[i];
                jItem.addClass("rcu-frame")
                     .attr("name",itemNames[i])
                     .attr("id",id)
                     .attr("tabIndex",i+1)
                     .css("padding","0px 0px 0px 0px")
                     .css("float","left")
                     .width(w3)
                     .height(contentH - 16)
                     .css("margin",topOffSet + "px 0px 0px " + leftOffSet + "px")
                     .css("overflow-x","auto")
                     .css("overflow-y","hidden");
                //创建Tab
                jItem.append("<ul>");
                jItem.tabs(
                {
                    "add":respAddSubItem
                });
                jItem.tabs( "add", "#tab-mowrp-house", "监控窗口");
                //TODO 以后从数据库里读
                var currentLevel = $.rcu.get("login").getUserLevel();
                if(currentLevel <= 3)
                {
                    jItem.tabs( "add", "#tab-mowrp-search", "搜索窗口");
                    jItem.tabs( "add", "#tab-mowrp-alert", "报警窗口");
                }
                if(currentLevel <= 2)
                {
                    jItem.tabs( "add", "#tab-mowrp-log", "日志窗口");
                }
                break;
            case $.rcu.conststr.tag.dock:
                jItem = $("<div>");
                id = "rcu-frame-" + itemNames[i];
                jItem.width(w4)
                     .height(contentH - 16)
                     .addClass("rcu-frame")
                     .attr("name",itemNames[i])
                     .attr("id",id)
                     .attr("tabIndex",i+1)
                     .css("float","left")
                     .css("padding","0px 0px 0px 0px")
                     .css("margin",topOffSet + "px 0px 0px " + leftOffSet + "px")
                     .css("overflow","hidden")
                     .css("border","1px solid #aaaaaa");
                obj = new RcuDock({"target":jItem});
                break;
            }
            
            if(!!obj)
            {
                var str = "{'" + itemNames[i] + "':null}";
                var pair = eval("(" + str + ")");
                pair[itemNames[i]] = obj;
                $.extend(true,$.rcu.obj,pair);
                
                obj.init();
                if(obj.check())
                {
                    obj.send({"action":$.rcu.conststr.action.init});
                }
            }
            
            if(!!jItem)
            {
                this.rcutable_frame({"action":$.rcu.conststr.action.put,"item":jItem});
            }
        }
        
        function getExHeadHeight()
        {
            return (26 * ($.rcu.conststr.index.count + 1) + ($.rcu.conststr.index.count * 2 - 1 ));
        }
        
        function respAddSubItem(event,ui)
        {
            var jPanel = $(ui.panel);
            var jTab = $(ui.tab);
            var jUl = jTab.parents("div.ui-tabs-nav").first();
            var jParent = jPanel.parents("div.ui-tabs").first();
            var h = jParent.height();
            var w = jParent.width();
            var width = $.rcu.get("common").getMonitorDispParam().wrp.width;
            jPanel.height(h - 38)
                  .width(width)//必须一行显示6个
                  .css("overflow-x","hidden")
                  .css("overflow-y","auto")
                  .css("padding","0px 0px 0px 0px")
                  .css("margin","0px 0px 0px 0px");
            return false ;
        }

        function hideItem(jItem) {
            //for waiter, only dispay alert window and waiter dock
            var userName = $.rcu.get("login").getUserName();
            if (userName === 'waiter') {
                jItem.css("visibility", "hidden");
            }
        }

        return this;
    };
    
})(jQuery);
