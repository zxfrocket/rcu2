RcuConfigMode.prototype = new RcuWnd();
function RcuConfigMode(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuConfigMode._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.config_mode;
        this._index = 100 ;
/**
 * public method
 */
        RcuConfigMode.prototype.init = function (opt) 
        {
            
        };
        
        RcuConfigMode.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuConfig.php";
                    var processClass = "RcuConfig";
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
            RcuConfigMode.prototype.baseSend = RcuWnd.prototype.send ;
            this.baseSend(tmpopt);
        };
        
        RcuConfigMode.prototype.submit = function (event)
        {
            var jFrm = this._jTarget.getFrame();
            var jSelElem1 = jFrm.find("select[name='daymode']") ;
            var jCurOpt1 = $.rcu.get("common").getCurrentOption(jSelElem1);
            var val1 = jCurOpt1.val();
            var jSelElem2 = jFrm.find("select[name='nightmode']") ;
            var jCurOpt2 = $.rcu.get("common").getCurrentOption(jSelElem2);
            var val2 = jCurOpt2.val();
            var opt = {"action":$.rcu.conststr.action.chg,
                       "param":{"infos": [{"name":"config_day", "value":val1},
                                          {"name":"config_night", "value":val2}]}};
            this.send(opt);
        };
        
        RcuConfigMode.prototype.open = function (opt)
        {
            /**
             * 调用父类send函数，发送ajax信息
             */
            RcuConfigMode.prototype.baseOpen = RcuWnd.prototype.open ;
            this.baseOpen(opt);
        };
        
        RcuConfigMode.prototype.change = function (event)
        {
        };
        
/**
 * private method
 */
        RcuConfigMode.prototype._recvSucc = function (result)
        {
            switch(result.action)
            {
            case $.rcu.conststr.action.chg:
                var content = result.content ;
                RcuConfig.recvActionChg(content);
                break;
            }
        };
        
        RcuConfigMode.prototype._recvFail = function (result)
        {
        };
        
        RcuConfigMode._initialized = true;
    }
};
