(function($){
    $.fn.rcucontainer = function()
    {
        var itemNames = [$.rcu.conststr.tag.tips] ;
        for(var i = 0; i < itemNames.length ; ++i)
        {
            var obj = null ;
            var jItem = null ;
            var id = '';
            switch(itemNames[i])
            {
            case $.rcu.conststr.tag.tips:
                jItem = $("<div>");
                id = "rcu-containter-" + itemNames[i];
                jItem.addClass("rcu-container")
                     .attr("id",id);
                obj = new RcuTips({"target":jItem});
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
                this.append(jItem);
            }
        }
        
        return this;
    };
    
})(jQuery);
