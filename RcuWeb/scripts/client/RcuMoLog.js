RcuMoLog.prototype = new RcuWnd();
function RcuMoLog(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuMoLog._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.mo_log;
/**
 * public method
 */
        RcuMoLog.prototype.init = function (opt) 
        {
            
        };
        
        RcuMoLog.prototype.send = function (opt) 
        {
        };
        
        RcuMoLog.prototype.submit = function (event)
        {
        };
        
        RcuMoLog.prototype.change = function (event)
        {
        };
        
/**
 * protected method
 */        
        RcuMoLog.prototype._initState = function (opt)
        {
        };
        
/**
 * private method
 */
        RcuMoLog.prototype._recvSucc = function (result)
        {
        };
        
        RcuMoLog.prototype._recvFail = function (result)
        {
        };
        
        RcuMoLog._initialized = true;
    }
};
