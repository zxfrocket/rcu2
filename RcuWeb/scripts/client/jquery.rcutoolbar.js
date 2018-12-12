(function($){
    $.fn.rcutoolbar = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            var param = opt.param ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    var dispParam = $.rcu.get("common").getToolBarDispParam();
                    var infos = param.infos ;
                    
                    var jToolWrp = $("<div>");
                    this.append(jToolWrp);
                    
                    var wInner = dispParam.inner.width ;
                    var hInner = dispParam.inner.height ;
                    var wOuter = dispParam.outer.width ;
                    var hOuter = dispParam.outer.height ;
                    
                    for(var i = 0; i < infos.length ; ++i)
                    {
                        var curName = infos[i].name;
                        var items = infos[i].items ;
                        var jToolItemInner = $("<div>");
                        jToolItemInner.addClass("tool-item-inner")
                                 .attr("id","tool-item-inner-" + curName)
                                 .attr("name",curName)
                                 .css("padding","0px 0px 0px 0px")
                                 .css("margin-left",dispParam.inner.left + "px")
                                 .css("margin-top",dispParam.inner.top + "px")
                                 .width(wInner)
                                 .height(hInner);
                        if(items.length > 0)
                        {
                            jToolItemInner.addClass("tool-has-items")
                                          .data("items",items);
                        }
                        var jToolItemOuter = $("<div>");
                        jToolItemOuter.addClass("tool-item-outer")
                                    .attr("id","tool-item-outer-" + curName)
                                    .attr("name",curName)
                                    .css("padding","0px 0px 0px 0px")
                                    .css("margin-left",dispParam.outer.left + "px")
                                    .css("margin-top",dispParam.outer.top + "px")
                                    .width(wOuter)
                                    .height(hOuter)
                                    .css("float","left")
                                    .css("border-radius",dispParam.outer.radius + "px");
                        hideToolItem(jToolItemOuter, curName);
                        jToolItemOuter.append(jToolItemInner);
                        jToolWrp.append(jToolItemOuter);
                    }

                    jToolWrp.addClass("tool-item-wrp")
                            .css("padding","0px 0px 0px 0px")
                            .css("margin-left",dispParam.wrp.left + "px")
                            .css("margin-top",dispParam.wrp.top + "px")
                            .width(dispParam.wrp.width)
                            .height(dispParam.wrp.height);
                    break;
            }
        }
        
        return this;
    };

    function hideToolItem(jToolItemOuter, curName){
         //for waiter, only dispay alert window and waiter dock
         var userName = $.rcu.get("login").getUserName();
         if (userName === 'waiter' && curName !== 'cmd') {
            jToolItemOuter.css("visibility", "hidden");
         }
    }
    
})(jQuery);
