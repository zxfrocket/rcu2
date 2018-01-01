RcuMoInfo.prototype = new RcuWnd();
function RcuMoInfo(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuMoInfo._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.mo_info;
/**
 * public method
 */
        RcuMoInfo.prototype.init = function (opt) 
        {
            
        };
        
        RcuMoInfo.prototype.send = function (opt) 
        {
        };
        
        RcuMoInfo.prototype.submit = function (event)
        {
        };
        
        RcuMoInfo.prototype.change = function (event)
        {
        };
        
/**
 * protected method
 */        
        RcuMoInfo.prototype._initState = function (opt)
        {
        };
        
/**
 * private method
 */
        RcuMoInfo.prototype._recvSucc = function (result)
        {
        };
        
        RcuMoInfo.prototype._recvFail = function (result)
        {
        };
        
        RcuMoInfo._initialized = true;
    }
};
