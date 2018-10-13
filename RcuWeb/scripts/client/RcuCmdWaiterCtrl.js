RcuCmdWaiterCtrl.prototype = new RcuWnd();
function RcuCmdWaiterCtrl(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuCmdWaiterCtrl._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.cmd_waiter_ctrl;
/**
 * public method
 */
        RcuCmdWaiterCtrl.prototype.init = function (opt) 
        {
            
        };
        
        RcuCmdWaiterCtrl.prototype.send = function (opt) 
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._sendCmd(this,opt);
        };
        
        RcuCmdWaiterCtrl.prototype.submit = function (event)
        {
            var opt = $.rcu.get($.rcu.conststr.tag.cmd_poll)._getCmdOpt(this._jTarget ,this._rcuTagName);
            this.send(opt);
        };
/**
 * protected method
 */        
        RcuCmdWaiterCtrl.prototype._initState = function (opt)
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._createIdTrees(this._jTarget);
        };
        
/**
 * private method
 */
        RcuCmdWaiterCtrl.prototype._recvSucc = function (result)
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
        
        RcuCmdWaiterCtrl.prototype._recvFail = function (result)
        {
        };
        
        RcuCmdWaiterCtrl._initialized = true;
    }
};
