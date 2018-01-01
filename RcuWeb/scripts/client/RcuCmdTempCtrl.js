RcuCmdTempCtrl.prototype = new RcuWnd();
function RcuCmdTempCtrl(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuCmdTempCtrl._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.cmd_temp_ctrl;
/**
 * public method
 */
        RcuCmdTempCtrl.prototype.init = function (opt) 
        {
            
        };
        
        RcuCmdTempCtrl.prototype.send = function (opt) 
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._sendCmd(this,opt);
        };
        
        RcuCmdTempCtrl.prototype.submit = function (event)
        {
            var opt = $.rcu.get($.rcu.conststr.tag.cmd_poll)._getCmdOpt(this._jTarget ,this._rcuTagName);
            this.send(opt);
        };
/**
 * protected method
 */        
        RcuCmdTempCtrl.prototype._initState = function (opt)
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._createIdTrees(this._jTarget);
        };
        
/**
 * private method
 */
        RcuCmdTempCtrl.prototype._recvSucc = function (result)
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
        
        RcuCmdTempCtrl.prototype._recvFail = function (result)
        {
        };
        
        RcuCmdTempCtrl._initialized = true;
    }
};
