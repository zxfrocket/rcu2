RcuCmdAirCtrl.prototype = new RcuWnd();
function RcuCmdAirCtrl(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuCmdAirCtrl._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.cmd_air_ctrl;
/**
 * public method
 */
        RcuCmdAirCtrl.prototype.init = function (opt) 
        {
            
        };
        
        RcuCmdAirCtrl.prototype.send = function (opt) 
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._sendCmd(this,opt);
        };
        
        RcuCmdAirCtrl.prototype.submit = function (event)
        {
            var opt = $.rcu.get($.rcu.conststr.tag.cmd_poll)._getCmdOpt(this._jTarget ,this._rcuTagName);
            this.send(opt);
        };
/**
 * protected method
 */        
        RcuCmdAirCtrl.prototype._initState = function (opt)
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._createIdTrees(this._jTarget);
        };
        
/**
 * private method
 */
        RcuCmdAirCtrl.prototype._recvSucc = function (result)
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
        
        RcuCmdAirCtrl.prototype._recvFail = function (result)
        {
        };
        
        RcuCmdAirCtrl._initialized = true;
    }
};
