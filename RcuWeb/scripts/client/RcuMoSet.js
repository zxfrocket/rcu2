RcuMoSet.prototype = new RcuWnd();
function RcuMoSet(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuMoSet._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.mo_set;
/**
 * public method
 */
        RcuMoSet.prototype.init = function (opt) 
        {
            
        };
        
        RcuMoSet.prototype.send = function (opt) 
        {
        };
        
        RcuMoSet.prototype.submit = function (event)
        {
        };
        
        RcuMoSet.prototype.change = function (event)
        {
        };
        
/**
 * protected method
 */        
        RcuMoSet.prototype._initState = function (opt)
        {
        };
        
/**
 * private method
 */
        RcuMoSet.prototype._recvSucc = function (result)
        {
        };
        
        RcuMoSet.prototype._recvFail = function (result)
        {
        };
        
        RcuMoSet._initialized = true;
    }
};
