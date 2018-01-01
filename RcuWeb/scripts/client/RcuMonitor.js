RcuMonitor.prototype = new RcuObject();
function RcuMonitor(opt)
{
    RcuObject.call(this,opt);
    if (typeof RcuMonitor._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this.tabMonitorId = "tab-monitor-";
        this._data = null ;
        this._t = null ;
/**
 * public method
 */
        RcuMonitor.prototype.init = function (opt) 
        {
            this._jTarget = this._opt.target;
            this._jTarget.rcumonitor({"action":$.rcu.conststr.action.init,"param":{"tabid":this.tabMonitorId}});
        };
        
        RcuMonitor.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            var floor = 1;
            switch(action)
            {
            case $.rcu.conststr.action.init:
                floor = $.rcu.get("common").getFirstFloor();
                break;
            case $.rcu.conststr.action.add:
            case $.rcu.conststr.action.chg:
            case $.rcu.conststr.action.get:
                floor = opt.floor ;
                break;
            }
            /**
             * request的ajax参数如下:
             */
            url = "./scripts/server/rcu.php" ;
            var requireFile = "RcuMonitor.php";
            var processClass = "RcuMonitor";
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
                            "if_have":1,
                            "floor":floor
                        }
                    }
                };
            
            /**
             * 调用父类send函数，发送ajax信息
             */
            var tmpopt = {"url":url, "data":data, "type":type};
            RcuMonitor.prototype.baseSend = RcuObject.prototype.send ;
            this.baseSend(tmpopt);
        };
        
        RcuMonitor.prototype.addMonitor = function(opt)
        {
            var floor = opt.floor ;
            if(!this.hasFloorTab(floor))
            {
                this.send({"action":$.rcu.conststr.action.add,"floor":floor});
            }
            else
            {
                var index = this.getTabSel(floor)[2];
                this._jTarget.tabs( "select" , index );
            }
        };
        
        RcuMonitor.prototype.chgMonitor = function(opt)
        {
            var floor = opt.floor ;
            if(!this.hasFloorTab(floor))
            {
                this.send({"action":$.rcu.conststr.action.chg,"floor":floor});
            }
            else
            {
                var index = this.getTabSel(floor)[2];
                this._jTarget.tabs( "select" , index );
            }
        };
        
        RcuMonitor.prototype.fetchMonitor = function(opt)
        {
            var floor = opt.floor ;
            if(this.hasFloorTab(floor))
            {
                this.send({"action":$.rcu.conststr.action.get,"floor":floor});
            }
        };
        
        RcuMonitor.prototype.addTab = function(content, _title)
        {
            var jTarget = this._jTarget ;
            var floor = content.floor ;
            var tabid = "#" + this.tabMonitorId + floor ;
            var title = floor + "楼" ;
            if(!!title)
            {
                title = _title ;
            }
            
            jTarget.tabs( "add", tabid, title);
            var jCurTab = $(tabid);
            var len = jTarget.tabs( "length" );
            var curIndex = len - 1;
            this._data = content ;
            jCurTab.rcumo_main({"action":$.rcu.conststr.action.init,"param":this._data});
            jTarget.tabs( "select" , curIndex );
            var jTabClose = jTarget.children("ul").children("li:last span.ui-icon-close");
            jTabClose.bind("click",respTabClose);
        };
        
/**
 * private method
 */
        RcuMonitor.prototype._recvSucc = function (result)
        {
            var jTarget = this._jTarget ;
            var floor = result.content.floor ;
            switch(result.action)
            {
            case $.rcu.conststr.action.init:
                this._data = result.content ;
                this.getTabSel(floor)[1].rcumo_main({"action":$.rcu.conststr.action.init,"param":this._data});
                //创建tool tip
                $.rcu.get("tips").create({"type":$.rcu.conststr.tiptype.mo_cell});
                //创建定时器
                this.createTimer();
                break;
            case $.rcu.conststr.action.add:
                this.addTab(result.content);
                this.createTimer();
                break;
            case $.rcu.conststr.action.chg:
                var temp = this.getCurTabSel();
                var jCurLi = temp[0];
                var jCurTab = temp[1];
                var id = this.tabMonitorId + floor ;
                this._data = result.content ;
                jCurTab.html("").attr("id",id).rcumo_main({"action":$.rcu.conststr.action.init,"param":this._data});
                var jCurAnch = jCurLi.children("a");
                jCurAnch.attr("href","#" + id)
                        .children("span").text(floor + "楼");
                this.createTimer();
                break;
            case $.rcu.conststr.action.get:
                var temp = this.getCurTabSel();
                var jCurTab = temp[1];
                var curFloor = temp[3];
                if(floor == curFloor)
                {
                    this._data = result.content ;
                    jCurTab.rcumo_main({"action":$.rcu.conststr.action.put,"param":this._data});
                }
                break;
            }
        };
        
        function respTabClose(event)
        {
            var jTarget = $(event.currentTarget) ;
            var jUl = jTarget.parents("ul.ui-tabs-nav").first();
            var jLis = jUl.children("li");
            for(var i = 0; i < jLis.length ; ++i)
            {
                var jSpan = $(jLis[i]).children("span");
                if(1 == jSpan.length && jSpan.val() == jTarget.val())
                {
                    var jTab = jTarget.parents("div.ui-tabs").first();
                    jTab.tabs("remove",i);
                    break;
                }
            }
            
            return false ;
        }
        
        RcuMonitor.prototype._recvFail = function (result)
        {
            jTarget.append("加载房间监控失败!");
        };
        
        RcuMonitor.prototype.getCurTabSel = function()
        {
            var curIndex = this._jTarget.tabs(  "option", "selected" );
            var jCurTab = this._jTarget.children("div.ui-tabs-panel:eq(" + curIndex + ")");
            var jCurLi = this._jTarget.children("ul.ui-tabs-nav").children("li:eq(" + curIndex + ")") ;
            var tabid = jCurTab.attr("id");
            var floor = tabid.replace(this.tabMonitorId,"");
            return [jCurLi,jCurTab,curIndex,floor] ;
        };
        
        RcuMonitor.prototype.getTabSel = function(floor)
        {
            var id = this.tabMonitorId + floor ;
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
        
        RcuMonitor.prototype.hasFloorTab = function(floor)
        {
            var id = this.tabMonitorId + floor ;
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
        
        RcuMonitor.prototype.createTimer = function()
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
                    var floor = temp[3];
                    instance.fetchMonitor({"floor":floor});
                },
                $.rcu.timer.house
            );
        };
        
        RcuMonitor._initialized = true;
    }
};
