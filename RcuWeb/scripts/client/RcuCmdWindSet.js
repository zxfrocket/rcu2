RcuCmdWindSet.prototype = new RcuWnd();
function RcuCmdWindSet(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuCmdWindSet._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.cmd_wind_set;
/**
 * public method
 */
        RcuCmdWindSet.prototype.init = function (opt) 
        {
            
        };
        
        RcuCmdWindSet.prototype.send = function (opt) 
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._sendCmd(this,opt);
        };
        
        RcuCmdWindSet.prototype.submit = function (event)
        {
            var opt = $.rcu.get($.rcu.conststr.tag.cmd_poll)._getCmdOpt(this._jTarget ,this._rcuTagName);
            this.send(opt);
        };
/**
 * protected method
 */        
        RcuCmdWindSet.prototype._initState = function (opt)
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._createIdTrees(this._jTarget);
        };
        
/**
 * private method
 */
        RcuCmdWindSet.prototype._recvSucc = function (result)
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
        
        RcuCmdWindSet.prototype._recvFail = function (result)
        {
        };
        
        RcuCmdWindSet._initialized = true;
    }
};
