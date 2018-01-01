RcuSearchView.prototype = new RcuObject();
function RcuSearchView(opt)
{
    RcuObject.call(this,opt);
    if (typeof RcuSearchView._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this.tabMonitorId = "tab-searchview-";
/**
 * public method
 */
        RcuSearchView.prototype.init = function (opt) 
        {
            this._jTarget = this._opt.target;
            this._jTarget.rcuview({"action":$.rcu.conststr.action.init,
                "param":{"name":$.rcu.conststr.tag.searchview,"tabid":this.tabMonitorId}});
            this.getTabSel(0)[1].rcutable_grid({"action":$.rcu.conststr.action.init,
                                                "name":($.rcu.conststr.tag.searchview + "_0")});
            this.getTabSel(0)[1].rcutable_grid({"action":$.rcu.conststr.action.chg,
                                                "name":($.rcu.conststr.tag.searchview + "_0"),
                                                "data":[]});
        };
        
        RcuSearchView.prototype.send = function (opt) 
        {
        };
        
        RcuSearchView.prototype.addMonitor = function(opt)
        {
        };
        
        //TODO chgMonitor 函数名字要换(把Monitor全换成别的)
        RcuSearchView.prototype.chgMonitor = function(opt)
        {
            var retIndex = opt.retIndex ;
            //TODO 这个分支还没写呢
            if(!this.hasFloorTab(retIndex))
            {
            }
            else
            {
                var index = this.getTabSel(retIndex)[2];
                this._jTarget.tabs( "select" , index );
            }
        };
        
        RcuSearchView.prototype.fetchMonitor = function(opt)
        {
            var retIndex = opt.retIndex ;
            if(this.hasFloorTab(retIndex))
            {
                this.getTabSel(0)[1].rcutable_grid({"action":$.rcu.conststr.action.chg,
                    "name":($.rcu.conststr.tag.searchview + "_" + retIndex),
                    "update":true,
                    "data":opt.data});
            }
        };
        
        RcuSearchView.prototype.addTab = function(content, _title)
        {
        };
        
/**
 * private method
 */
        RcuSearchView.prototype._recvSucc = function (result)
        {
        };
        
        function respTabClose(event)
        {
            return false ;
        }
        
        RcuSearchView.prototype._recvFail = function (result)
        {
        };
        
        RcuSearchView.prototype.getCurTabSel = function()
        {
        };
        
        RcuSearchView.prototype.getTabSel = function(retIndex)
        {
            var id = this.tabMonitorId + retIndex ;
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
        
        RcuSearchView.prototype.hasFloorTab = function(retIndex)
        {
            var id = this.tabMonitorId + retIndex ;
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
        
        RcuSearchView.prototype.createTimer = function()
        {
        };
        
        RcuSearchView._initialized = true;
    }
};
