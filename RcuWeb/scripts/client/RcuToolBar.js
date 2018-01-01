RcuToolBar.prototype = new RcuObject();
function RcuToolBar(opt)
{
    RcuObject.call(this,opt);
    if (typeof RcuToolBar._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
/**
 * public method
 */
        RcuToolBar.prototype.init = function (opt) 
        {
            this._jTarget = this._opt.target;
        };
        
        RcuToolBar.prototype.send = function (opt) 
        {
            var currentLevel = $.rcu.get("login").getUserLevel();
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            if($.rcu.conststr.action.init == action)
            {
                url = "./scripts/server/rcu.php" ;
                var requireFile = "RcuToolBar.php";
                var processClass = "RcuToolBar";
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
                            "param":
                            {
                                "level": currentLevel
                            }
                        }
                    };
            }
            
            /**
             * 调用父类send函数，发送ajax信息
             */
            var tmpopt = {"url":url, "data":data, "type":type};
            RcuToolBar.prototype.baseSend = RcuObject.prototype.send ;
            this.baseSend(tmpopt);
        };
        
/**
 * private method
 */
        RcuToolBar.prototype._recvSucc = function (result)
        {
            var content = result.content;
            if(!!content)
            {
                switch(result.action)
                {
                    case $.rcu.conststr.action.init:
                        var infos = content.infos ;
                        if(!!infos)
                        {
                            this._jTarget.rcutoolbar({"action":$.rcu.conststr.action.init,"param":{"infos":infos}});
                            //创建tool tip
                            $.rcu.get("tips").create({"type":$.rcu.conststr.tiptype.toolbar});
                            $.rcu.get("tips").create({"type":$.rcu.conststr.tiptype.toolitem});
                        }
                        break;
                }
            }
        };
        
        RcuToolBar.prototype._recvFail = function (result)
        {
            this._jTarget.append("加载操作栏失败!");
        };
        
        RcuToolBar._initialized = true;
    }
};
