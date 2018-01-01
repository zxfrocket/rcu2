RcuSearchComplex.prototype = new RcuWnd();
function RcuSearchComplex(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuSearchComplex._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.search_complex;
        this._index = 100 ;
/**
 * public method
 */
        RcuSearchComplex.prototype.init = function (opt) 
        {
            
        };
        
        RcuSearchComplex.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuSearchComplex.php";
                    var processClass = "RcuSearchComplex";
                    data = 
                       {
                            "options":
                            {
                                "requesInfo":
                                {
                                    "requireFile":requireFile,
                                    "procClass":processClass,
                                    "action":action
                                },
                                "param":opt.param
                            }
                        };
                    break;
            }
            
            /**
             * 调用父类send函数，发送ajax信息
             */
            var tmpopt = {"url":url, "data":data, "type":type};
            RcuSearchComplex.prototype.baseSend = RcuWnd.prototype.send ;
            this.baseSend(tmpopt);
        };
        
        RcuSearchComplex.prototype.submit = function (event)
        {
            var jFrm = this._jTarget.getFrame();
            var str = "" ;
            jFrm.find(".search_unit").each(function(){
                $(this).rcusearch_unit({"action":$.rcu.conststr.action.chg});
                str += $(this).data("str") ;
            });
            var opt = {"action":$.rcu.conststr.action.chg,"param":{"cond":str}};
            this.send(opt);
        };
        
        RcuSearchComplex.prototype.open = function (opt)
        {
            /**
             * 调用父类send函数，发送ajax信息
             */
            RcuSearchComplex.prototype.baseOpen = RcuWnd.prototype.open ;
            this.baseOpen(opt);
        };
        
        RcuSearchComplex.prototype.change = function (event)
        {
            var jSelElem = $(event.currentTarget);
            if(jSelElem.hasClass('search_item'))
            {
                var jCurOpt = $.rcu.get("common").getCurrentOption(jSelElem);
                var val = jCurOpt.val();
                var type = jCurOpt.attr("type");
                var pos = jSelElem.attr("pos");
                
                var jSelOper = this._jTarget.getFrame().find(".search_oper[pos=" + pos + "]");
                var operType = jSelOper.attr("type");
                if(operType != type)
                {
                    jSelOper.rcusearch_oper({"action":$.rcu.conststr.action.chg,"param":{"type":type}});
                }
                
                var jSelVal = this._jTarget.getFrame().find(".search_val[pos=" + pos + "]");
                jSelVal.rcusearch_val({"action":$.rcu.conststr.action.chg,"param":{"name":val}});
            }
            else if(jSelElem.hasClass('search_oper'))
            {
                
            }
            else if(jSelElem.hasClass('search_val'))
            {
                
            }
            
        };
        
/**
 * private method
 */
        RcuSearchComplex.prototype._recvSucc = function (result)
        {
            switch(result.action)
            {
            case $.rcu.conststr.action.chg:
                //TODO 搜索结果Next显示，或者搜索结果只list显示
                var content = result.content ;
                var data = content.data ;
                $.rcu.get("common").covertToMeanData(data);
                $("#rcu-frame-monitor").tabs( "select" , 1 );
                $.rcu.get($.rcu.conststr.tag.searchview).chgMonitor({"retIndex":0});
                $.rcu.get($.rcu.conststr.tag.searchview).fetchMonitor({"retIndex":0,"data":data});
                break;
            }
        };
        
        RcuSearchComplex.prototype._recvFail = function (result)
        {
        };
        
        RcuSearchComplex._initialized = true;
    }
};
