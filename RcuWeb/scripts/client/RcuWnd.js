function RcuWnd(opt)
{
    if (typeof RcuWnd._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = "" ;
/**
 * public method
 */
        RcuWnd.prototype.init = function (opt) 
        {
            
        };
        
        RcuWnd.prototype.check = function (opt) 
        {
            return true ;
        };
        
        RcuWnd.prototype.send = function (opt) 
        {
            var url = opt.url ;
            var data = opt.data ;
            var type = opt.type ;
            var instance = this;
            
            if(!!url && !!data)
            {
                $.post(url,data,function(result, status, jqXHR){
                    instance.recv(result, status, jqXHR);
                },type);
            }
        };
        
        RcuWnd.prototype.recv = function (result, status, jqXHR)
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
        
        RcuWnd.prototype.getTarget = function()
        {
            return this._jTarget ;
        };
        
        RcuWnd.prototype.close = function (opt)
        {
            this._jTarget = null ;
        };
        
        RcuWnd.prototype.open = function (opt)
        {
            if(!this._jTarget)
            {
                var title = opt.title ;
                var icon = opt.icon ;
                this._jTarget = $.rcuwnd_window(
                {
                    "action":$.rcu.conststr.action.init,
                    "param":
                    {
                        "tag": this._rcuTagName,
                        "title": title,
                        "icon": icon
                    }
                });
            }
            else
            {
                if(this._jTarget.isMinimized())
                {
                    this._jTarget.restore();
                }
                else if(!this._jTarget.isSelected())
                {
                    this._jTarget.select();
                }
            }
            this._initState() ;
        };
/**
 * protected method
 */        
        RcuWnd.prototype._initState = function (opt)
        {
        };
        
/**
 * private method
 */
        RcuWnd.prototype._recvSucc = function (result)
        {
        };
        
        RcuWnd.prototype._recvFail = function (result)
        {
        };
        
        RcuWnd._initialized = true;
    }
};
