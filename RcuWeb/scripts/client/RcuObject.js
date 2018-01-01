function RcuObject(opt)
{
    if (typeof RcuObject._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
/**
 * public method
 */
        RcuObject.prototype.init = function (opt) 
        {
            
        };
        
        RcuObject.prototype.check = function (opt) 
        {
            return true ;
        };
        
        RcuObject.prototype.send = function (opt) 
        {
            var url = opt.url ;
            var data = opt.data ;
            var type = opt.type ;
            var instance = this;
            
            $.post(url,data,function(result, status, jqXHR){
                instance.recv(result, status, jqXHR);
            },type);
        };
        
        RcuObject.prototype.recv = function (result, status, jqXHR)
        {
            if (status == "success")
            {
                this._recvSucc(result);
            }
            else
            {
                this._recvFail(result);
            }
        };
        
        RcuObject.prototype.getTarget = function()
        {
            return this._jTarget ;
        };
/**
 * private method
 */
        RcuObject.prototype._recvSucc = function (result)
        {
        };
        
        RcuObject.prototype._recvFail = function (result)
        {
            
        };
        
        RcuObject._initialized = true;
    }
};
