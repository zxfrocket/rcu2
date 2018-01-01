RcuRoomsOrder.prototype = new RcuWnd();
function RcuRoomsOrder(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuRoomsOrder._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.rooms_add;
/**
 * public method
 */
        RcuRoomsOrder.prototype.init = function (opt) 
        {
            
        };
        
        RcuRoomsOrder.prototype.send = function (opt) 
        {
        };
        
        RcuRoomsOrder.prototype.submit = function (event)
        {
        };
        
        RcuRoomsOrder.prototype.open = function (opt)
        {
            /**
             * 调用父类send函数，发送ajax信息
             */
            RcuRoomsOrder.prototype.baseOpen = RcuWnd.prototype.open ;
            this.baseOpen(opt);
        };
        
        RcuRoomsOrder.prototype.change = function (event)
        {
        };
        
        RcuRoomsOrder.prototype._initState = function (opt)
        {
        };
        
/**
 * private method
 */
        RcuRoomsOrder.prototype._recvSucc = function (result)
        {
        };
        
        RcuRoomsOrder.prototype._recvFail = function (result)
        {
        };
        
        RcuRoomsOrder._initialized = true;
    }
};
