RcuCmdLinkSet.prototype = new RcuWnd();
function RcuCmdLinkSet(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuCmdLinkSet._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.cmd_link_set;
/**
 * public method
 */
        RcuCmdLinkSet.prototype.init = function (opt) 
        {
            
        };
        
        RcuCmdLinkSet.prototype.send = function (opt) 
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._sendCmd(this,opt);
        };
        
        RcuCmdLinkSet.prototype.submit = function (event)
        {
            var opt = $.rcu.get($.rcu.conststr.tag.cmd_poll)._getCmdOpt(this._jTarget ,this._rcuTagName);
            this.send(opt);
        };
/**
 * protected method
 */        
        RcuCmdLinkSet.prototype._initState = function (opt)
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._createIdTrees(this._jTarget);
        };
        
/**
 * private method
 */
        RcuCmdLinkSet.prototype._recvSucc = function (result)
        {
            var action = result.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    var flag = result.flag ;
                    if(!!this._jTarget)
                    {
                        if(flag)
                        {
                            $.rcu.get($.rcu.conststr.tag.cmd_poll)._workSucc(this._rcuTagName);
                        }
                    }
                    break;
            }
        };
        
        RcuCmdLinkSet.prototype._recvFail = function (result)
        {
        };
        
        RcuCmdLinkSet._initialized = true;
    }
};
