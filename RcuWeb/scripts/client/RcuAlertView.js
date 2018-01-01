RcuAlertView.prototype = new RcuObject();
function RcuAlertView(opt)
{
    RcuObject.call(this,opt);
    if (typeof RcuAlertView._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this.tabMonitorId = "tab-alertview-";
        this._t = null ;
/**
 * public method
 */
        RcuAlertView.prototype.init = function (opt) 
        {
            this._jTarget = this._opt.target;
            this._jTarget.rcuview({"action":$.rcu.conststr.action.init,
                 "param":{"name":$.rcu.conststr.tag.alertview,"tabid":this.tabMonitorId}});
            this.getTabSel(0)[1].rcutable_grid({"action":$.rcu.conststr.action.init,
                                                "name":($.rcu.conststr.tag.alertview + "_0")});
        };
        
        RcuAlertView.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            var alerttype = 0;
            switch(action)
            {
            case $.rcu.conststr.action.init:
                alerttype = 0;
                break;
            case $.rcu.conststr.action.get:
                alerttype = opt.alerttype;
                break;
            }
            /**
             * request的ajax参数如下:
             */
            url = "./scripts/server/rcu.php" ;
            var requireFile = "RcuAlert.php";
            var processClass = "RcuAlert";
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
                            "alerttype":alerttype
                        }
                    }
                };
            
            /**
             * 调用父类send函数，发送ajax信息
             */
            var tmpopt = {"url":url, "data":data, "type":type};
            RcuAlertView.prototype.baseSend = RcuObject.prototype.send ;
            this.baseSend(tmpopt);
        };
        
        RcuAlertView.prototype.addMonitor = function(opt)
        {
        };
        
        RcuAlertView.prototype.chgMonitor = function(opt)
        {
            var alerttype = opt.alerttype ;
            //TODO 这个分支还没写呢
            if(!this.hasFloorTab(alerttype))
            {
            }
            else
            {
                var index = this.getTabSel(alerttype)[2];
                this._jTarget.tabs( "select" , index );
            }
        };
        
        RcuAlertView.prototype.fetchMonitor = function(opt)
        {
            var alerttype = opt.alerttype ;
            if(this.hasFloorTab(alerttype))
            {
                this.send({"action":$.rcu.conststr.action.get,"alerttype":alerttype});
            }
        };
        
        RcuAlertView.prototype.addTab = function(content, _title)
        {
        };
        
/**
 * private method
 */
        RcuAlertView.prototype._recvSucc = function (result)
        {
            var jTarget = this._jTarget ;
            var alerttype = result.content.alerttype ;
            var data = result.content.data ;
            $.rcu.get("common").covertToMeanData(data);
            switch(result.action)
            {
            case $.rcu.conststr.action.init:
                this.getTabSel(alerttype)[1].rcutable_grid({"action":$.rcu.conststr.action.chg, 
                                                         "name":($.rcu.conststr.tag.alertview + "_" + alerttype), 
                                                         "data":data});
                //创建定时器
                this.createTimer();
                break;
            case $.rcu.conststr.action.get:
                var temp = this.getCurTabSel();
                var jCurTab = temp[1];
                var curalerttype = temp[3];
                if(alerttype == curalerttype)
                {
                    jCurTab.rcutable_grid({"action":$.rcu.conststr.action.chg, 
                                        "update":true,
                                        "name":($.rcu.conststr.tag.alertview + "_" + alerttype), 
                                        "data":data});
                }
                break;
            }
        };
        
        function respTabClose(event)
        {
            return false ;
        }
        
        RcuAlertView.prototype._recvFail = function (result)
        {
        };
        
        RcuAlertView.prototype.getCurTabSel = function()
        {
            var curIndex = this._jTarget.tabs(  "option", "selected" );
            var jCurTab = this._jTarget.children("div.ui-tabs-panel:eq(" + curIndex + ")");
            var jCurLi = this._jTarget.children("ul.ui-tabs-nav").children("li:eq(" + curIndex + ")") ;
            var tabid = jCurTab.attr("id");
            var alerttype = tabid.replace(this.tabMonitorId,"");
            return [jCurLi,jCurTab,curIndex,alerttype] ;
        };
        
        RcuAlertView.prototype.getTabSel = function(alerttype)
        {
            var id = this.tabMonitorId + alerttype ;
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
        
        RcuAlertView.prototype.hasFloorTab = function(alerttype)
        {
            var id = this.tabMonitorId + alerttype ;
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
        
        RcuAlertView.prototype.createTimer = function()
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
                    var alerttype = temp[3];
                    instance.fetchMonitor({"alerttype":alerttype});
                },
                $.rcu.timer.alert
            );
        };
        
        RcuAlertView._initialized = true;
    }
};
