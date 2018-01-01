RcuDock.prototype = new RcuObject();
function RcuDock(opt)
{
    RcuObject.call(this,opt);
    if (typeof RcuDock._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
/**
 * public method
 */
        RcuDock.prototype.init = function (opt) 
        {
            this._jTarget = this._opt.target;
            $.rcuwnd();
        };
        
        RcuDock.prototype.send = function (opt) 
        {
        };
        
/**
 * private method
 */
        RcuDock.prototype._recvSucc = function (result)
        {
        };
        
        RcuDock.prototype._recvFail = function (result)
        {
        };
        
        RcuDock._initialized = true;
    }
};
