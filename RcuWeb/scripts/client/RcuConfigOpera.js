RcuConfigOpera.prototype = new RcuWnd();
function RcuConfigOpera(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuConfigOpera._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.config_opera;
        this._index = 100 ;
/**
 * public method
 */
        RcuConfigOpera.prototype.init = function (opt) 
        {
            
        };
        
        RcuConfigOpera.prototype.send = function (opt) 
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
            RcuConfigOpera.prototype.baseSend = RcuWnd.prototype.send ;
            this.baseSend(tmpopt);
        };
        
        RcuConfigOpera.prototype.submit = function (event)
        {
            var jFrm = this._jTarget.getFrame();
            var jSelElem = jFrm.find("select[name='operastate']") ;
            var jCurOpt = $.rcu.get("common").getCurrentOption(jSelElem);
            var val = jCurOpt.val();
            var opt = {"action":$.rcu.conststr.action.chg,
                       "param":{"infos":[{"name":$.rcu.conststr.tag.config_opera,"value":val}]}};
            this.send(opt);
        };
        
        RcuConfigOpera.prototype.open = function (opt)
        {
            /**
             * 调用父类send函数，发送ajax信息
             */
            RcuConfigOpera.prototype.baseOpen = RcuWnd.prototype.open ;
            this.baseOpen(opt);
        };
        
        RcuConfigOpera.prototype.change = function (event)
        {
        };
        
/**
 * private method
 */
        RcuConfigOpera.prototype._recvSucc = function (result)
        {
            switch(result.action)
            {
            case $.rcu.conststr.action.chg:
                var content = result.content ;
                RcuConfig.recvActionChg(content);
                break;
            }
        };
        
        RcuConfigOpera.prototype._recvFail = function (result)
        {
        };
        
        RcuConfigOpera._initialized = true;
    }
};
