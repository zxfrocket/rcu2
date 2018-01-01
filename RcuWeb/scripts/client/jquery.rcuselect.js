(function($){
    $.fn.rcuselect_level = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    var param = opt.param ;
                    var curLevel = param.level ;
                    var optArr = $.rcu.get("common").getLowerLevels(curLevel);
                    for(var i = 0; i < optArr.length ; ++i){
                        var jOpt = $("<option>");
                        jOpt.attr("value",optArr[i].level)
                            .text(optArr[i].desc);
                        this.append(jOpt);
                    }
                    break;
            }
        }
        return this;
        
    };
    
    $.fn.rcuselect_usercoll = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    var param = opt.param ;
                    var curLevel = param.level ;
                    var optArr = $.rcu.get("common").getLowerUserColl(curLevel);
                    for(var i = 0; i < optArr.length ; ++i)
                    {
                        var jOpt = $("<option>");
                        jOpt.attr("value",optArr[i].level)
                            .text(optArr[i].username);
                        this.append(jOpt);
                    }
                    break;
                case $.rcu.conststr.action.chg:
                    var param = opt.param ;
                    var optArr = param.useropts ;
                    for(var i = 0; i < optArr.length ; ++i)
                    {
                        var jOpt = $("<option>");
                        jOpt.attr("value",optArr[i].level)
                            .text(optArr[i].username);
                        this.append(jOpt);
                    }
                    break;
            }
        }
        return this;
        
    };
    
    $.fn.rcuselect_configitems = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    //name = 'config_poll', 'config_opera', 'config_min_temp', 'config_max_temp'
                    var name = opt.name ;
                    var optArr = $.rcu.get("common").getConfigItems(name);
                    var curVal = $.rcu.get("common").getRealConfigValue(name);
                    for(var i = 0; i < optArr.length ; ++i)
                    {
                        var jOpt = $("<option>");
                        jOpt.attr("value",optArr[i].value)
                            .text(optArr[i].text);
                        if(optArr[i].value == curVal)
                        {
                            jOpt.attr("selected","selected");
                        }
                        this.append(jOpt);
                    }
                    
                    break;
            }
        }
        return this;
        
    };
    
})(jQuery);
