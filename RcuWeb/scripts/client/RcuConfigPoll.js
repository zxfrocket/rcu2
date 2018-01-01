RcuConfigPoll.prototype = new RcuWnd();
function RcuConfigPoll(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuConfigPoll._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.config_poll;
        this._index = 100 ;
/**
 * public method
 */
        RcuConfigPoll.prototype.init = function (opt) 
        {
            
        };
        
        RcuConfigPoll.prototype.send = function (opt) 
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
            RcuConfigPoll.prototype.baseSend = RcuWnd.prototype.send ;
            this.baseSend(tmpopt);
        };
        
        RcuConfigPoll.prototype.submit = function (event)
        {
            var jFrm = this._jTarget.getFrame();
            var jSelElem = jFrm.find("select[name='pollstate']") ;
            var jCurOpt = $.rcu.get("common").getCurrentOption(jSelElem);
            var val = jCurOpt.val();
            var opt = {"action":$.rcu.conststr.action.chg,
                       "param":{"infos":[{"name":$.rcu.conststr.tag.config_poll,"value":val}]}};
            this.send(opt);
        };
        
        RcuConfigPoll.prototype.open = function (opt)
        {
            /**
             * 调用父类send函数，发送ajax信息
             */
            RcuConfigPoll.prototype.baseOpen = RcuWnd.prototype.open ;
            this.baseOpen(opt);
        };
        
        RcuConfigPoll.prototype.change = function (event)
        {
        };
        
        RcuConfig = {};
        RcuConfig.recvActionChg = function (content)
        {
            var infos = content.infos ;
            var str = "" ;
            for(var i = 0; i < infos.length ; ++i)
            {
                var info = infos[i];
                var name = info.name ;
                var value = info.value ;
                str += $.rcu.get("common").getConfigText(name,value);
                str += "\n";
            }
            //TODO alert改为自动消失
            alert(str + "设置成功!");
        };
        
/**
 * private method
 */
        RcuConfigPoll.prototype._recvSucc = function (result)
        {
            switch(result.action)
            {
            case $.rcu.conststr.action.chg:
                var content = result.content ;
                RcuConfig.recvActionChg(content);
                break;
            }
        };
        
        RcuConfigPoll.prototype._recvFail = function (result)
        {
        };
        
        RcuConfigPoll._initialized = true;
    }
};
