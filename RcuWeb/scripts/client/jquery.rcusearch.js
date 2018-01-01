(function($){
    $.fn.rcusearch_unit = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    //TODO 增加选择项，括号
                    //var jAdd = $("<input type='button' value='...'></input>");
                    //var jBrac1 = $("<input type='button' value='('></input>");
                    var jItem = $("<select class='wnd-rcu-select search_item' pos='0'></select>");
                    var jOper = $("<select class='wnd-rcu-select search_oper' pos='0'></select>");
                    var jVal = $("<select class='wnd-rcu-select search_val' pos='0'></select>");
                    jItem.rcusearch_item({"action":$.rcu.conststr.action.init});
                    jOper.rcusearch_oper({"action":$.rcu.conststr.action.init});
                    jVal.rcusearch_val({"action":$.rcu.conststr.action.init});
                    //var jBrac2 = $("<input type='button' value=')'></input>");
                    jItem.width(120);
                    jOper.width(40);
                    jVal.width(100);
                    //this.append(jAdd);
                    //this.append(jBrac1);
                    this.append(jItem);
                    this.append(jOper);
                    this.append(jVal);
                    //this.append(jBrac2);
                    this.children().css("margin-left","5px");
                    break;
                case $.rcu.conststr.action.chg:
                    var jItem = this.find('.search_item');
                    var jOper = this.find('.search_oper');
                    var jVal = this.find('.search_val');
                    //item
                    var jCurItem = $.rcu.get("common").getCurrentOption(jItem);
                    var name = jCurItem.val();//如：if_in
                    //operation
                    var jCurOper = $.rcu.get("common").getCurrentOption(jOper);
                    var oper = jCurOper.val();//如：<>
                    //value
                    var jCurVal = $.rcu.get("common").getCurrentOption(jVal);
                    var val = jCurVal.val();//如：<>
                    var str = name + " " + oper +  " " + val;
                    this.data("str",str) ;
            }
        }
        return this;
        
    };
    
    $.fn.rcusearch_item = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    var allnames = $.rcu.get("common").getStateNames();
                    //TODO 暂时前8个
                    var names = allnames.slice(0,8);
                    for(var i = 0; i < names.length ; ++i)
                    {
                        var n = names[i];
                        var m = $.rcu.get("common").getStateMeaning(n);
                        var t = $.rcu.get("common").getStateType(n);
                        var jOpt = $("<option>");
                        jOpt.val(n)
                            .text(m)
                            .attr("type", t);
                        this.append(jOpt);
                    }
                    break;
            }
        }
        return this;
    };
    
    $.fn.rcusearch_oper = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    var vals = ['=','<>'];
                    var txts = ['=','!='];
                    for(var i = 0; i < vals.length ; ++i)
                    {
                        var jOpt = $("<option>");
                        jOpt.val(vals[i])
                            .attr("type",0)
                            .text(txts[i]);
                        this.append(jOpt);
                    }
                    break;
                case $.rcu.conststr.action.chg:
                    this.children().remove();
                    this.html("");
                    var param = opt.param ;
                    var type = param.type ;
                    var vals = ['=','<>'];
                    var txts = ['=','!='];
                    if(type > 0)
                    {
                        vals = ['=','<>','>','>=','<','<='];
                        txts = ['=','!=','>','>=','<','<='];
                    }
                    for(var i = 0; i < vals.length ; ++i)
                    {
                        var jOpt = $("<option>");
                        jOpt.val(vals[i])
                            .attr("type",0)
                            .text(txts[i]);
                        this.append(jOpt);
                    }
                    break;
            }
        }
        return this;
    };
    
    $.fn.rcusearch_val = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    attachOption(this, "break_count");
                    break;
                case $.rcu.conststr.action.chg:
                    this.children().remove();
                    this.html("");
                    var param = opt.param ;
                    var name = param.name ;
                    attachOption(this, name);
                    break;
            }
        }
        return this;
        
        function attachOption(jInst, name)
        {
            var arr = $.rcu.get("common").getOneState(name);
            var vals = arr[0];
            var txts = arr[1];
            for(var i = 0; i < vals.length ; ++i)
            {
                var jOpt = $("<option>");
                jOpt.val(vals[i])
                    .text(txts[i]);
                jInst.append(jOpt);
            }
        }
    };
    
})(jQuery);
