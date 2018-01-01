RcuLogView.prototype = new RcuObject();
function RcuLogView(opt)
{
    RcuObject.call(this,opt);
    if (typeof RcuLogView._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this.tabMonitorId = "tab-logview-";
        this._t = null ;
/**
 * public method
 */
        RcuLogView.prototype.init = function (opt) 
        {
            this._jTarget = this._opt.target;
            this._jTarget.rcuview({"action":$.rcu.conststr.action.init,
                 "param":{"name":$.rcu.conststr.tag.logview,"tabid":this.tabMonitorId}});
            this.getTabSel(0)[1].rcutable_grid({"action":$.rcu.conststr.action.init,
                                                "name":($.rcu.conststr.tag.logview + "_0")});
        };
        
        RcuLogView.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            var logtype = 0;
            switch(action)
            {
            case $.rcu.conststr.action.init:
                logtype = 0;
                break;
            case $.rcu.conststr.action.get:
                logtype = opt.logtype;
                break;
            }
            /**
             * request的ajax参数如下:
             */
            url = "./scripts/server/rcu.php" ;
            var requireFile = "RcuLog.php";
            var processClass = "RcuLog";
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
                            "logtype":logtype
                        }
                    }
                };
            
            /**
             * 调用父类send函数，发送ajax信息
             */
            var tmpopt = {"url":url, "data":data, "type":type};
            RcuLogView.prototype.baseSend = RcuObject.prototype.send ;
            this.baseSend(tmpopt);
        };
        
        RcuLogView.prototype.addMonitor = function(opt)
        {
        };
        
        //TODO chgMonitor 函数名字要换(把Monitor全换成别的)
        RcuLogView.prototype.chgMonitor = function(opt)
        {
            var logtype = opt.floor ;
            //TODO 这个分支还没写呢
            if(!this.hasFloorTab(logtype))
            {
            }
            else
            {
                var index = this.getTabSel(logtype)[2];
                this._jTarget.tabs( "select" , index );
            }
        };
        
        RcuLogView.prototype.fetchMonitor = function(opt)
        {
            var logtype = opt.logtype ;
            if(this.hasFloorTab(logtype))
            {
                this.send({"action":$.rcu.conststr.action.get,"logtype":logtype});
            }
        };
        
        RcuLogView.prototype.addTab = function(content, _title)
        {
        };
        
/**
 * private method
 */
        RcuLogView.prototype._recvSucc = function (result)
        {
            var jTarget = this._jTarget ;
            var content = result.content;
            var logtype = content.logtype ;
            var data = content.data ;
            switch(result.action)
            {
            case $.rcu.conststr.action.init:
                this.getTabSel(logtype)[1].rcutable_grid({"action":$.rcu.conststr.action.chg, 
                                                         "name":($.rcu.conststr.tag.logview + "_" + logtype), 
                                                         "data": data});
                //创建定时器
                this.createTimer();
                break;
            case $.rcu.conststr.action.get:
                var temp = this.getCurTabSel();
                var jCurTab = temp[1];
                var curLogtype = temp[3];
                if(logtype == curLogtype)
                {
                    jCurTab.rcutable_grid({"action":$.rcu.conststr.action.chg, 
                                        "update":true,
                                        "name":($.rcu.conststr.tag.logview + "_" + logtype), 
                                        "data": data});
                }
                break;
            }
        };
        
        function respTabClose(event)
        {
            return false ;
        }
        
        RcuLogView.prototype._recvFail = function (result)
        {
        };
        
        RcuLogView.prototype.getCurTabSel = function()
        {
            var curIndex = this._jTarget.tabs(  "option", "selected" );
            var jCurTab = this._jTarget.children("div.ui-tabs-panel:eq(" + curIndex + ")");
            var jCurLi = this._jTarget.children("ul.ui-tabs-nav").children("li:eq(" + curIndex + ")") ;
            var tabid = jCurTab.attr("id");
            var logtype = tabid.replace(this.tabMonitorId,"");
            return [jCurLi,jCurTab,curIndex,logtype] ;
        };
        
        RcuLogView.prototype.getTabSel = function(logtype)
        {
            var id = this.tabMonitorId + logtype ;
            var jTabs = this._jTarget.children("div.ui-tabs-panel") ;
            for(var i = 0; i < jTabs.length ; ++i)
            {
                var jCurTab = $(jTabs[i]) ;
                if(id == jCurTab.attr("id"))
                {
                    var jCurLi = this._jTarget.children("ul.ui-tabs-nav").children("li:eq(" + i + ")") ;
                    return [jCurLi,jCurTab,i];
                    break;
                }
            }
            return [null,null,null];
        };
        
        RcuLogView.prototype.hasFloorTab = function(logtype)
        {
            var id = this.tabMonitorId + logtype ;
            var jTabs = this._jTarget.children("div.ui-tabs-panel") ;
            for(var i = 0; i < jTabs.length ; ++i)
            {
                var jCurTab = $(jTabs[i]) ;
                if(id == jCurTab.attr("id"))
                {
                    return true;
                    break;
                }
            }
            return false;
        };
        
        RcuLogView.prototype.createTimer = function()
        {
            if(!!this._t)
            {
                clearInterval(this._t);
                this._t = null ;
            }
            
            var instance = this;
            this._t = setInterval
            (
                function()
                {
                    var temp = instance.getCurTabSel();
                    var logtype = temp[3];
                    instance.fetchMonitor({"logtype":logtype});
                },
                $.rcu.timer.log
            );
        };
        
        RcuLogView._initialized = true;
    }
};
