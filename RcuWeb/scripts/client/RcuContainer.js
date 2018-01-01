RcuContainer.prototype = new RcuObject();
function RcuContainer()
{
    RcuObject.call(this);
    if (typeof RcuContainer._initialized == "undefined") 
    {
/**
 * private member
 */
        this._jTarget = null ;
/**
 * public method
 */
        RcuContainer.prototype.init = function () 
        {
            var jBody = $("body");
            this._jTarget = $("<div>");
            this._jTarget.rcucontainer();
            jBody.append(this._jTarget);
        };
        
        RcuContainer.prototype.send = function (opt) 
        {
        };
        
/**
 * private method
 */
        RcuContainer.prototype._recvSucc = function (result)
        {
        };
        
        RcuContainer.prototype._recvFail = function (result)
        {
        };
        
        RcuContainer._initialized = true;
    }
};
