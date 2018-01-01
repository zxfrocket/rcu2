RcuFrame.prototype = new RcuObject();
function RcuFrame()
{
    RcuObject.call(this);
    if (typeof RcuFrame._initialized == "undefined") 
    {
/**
 * private member
 */
        this._jTarget = null ;
/**
 * public method
 */
        RcuFrame.prototype.init = function () 
        {
            var jBody = $("body");
            var font = $.rcu.get("common").getBodyDispParam().font ;
            jBody.css("padding","0px 0px 0px 0px")
                 .css("margin","0px 0px 0px 0px")
                 .css("font-size",font.size + "px")
                 .css("font-family","SimSun,Arial,Sans-serif")
                 .css("line-height",font.height + "px")
                 .css("vertical-align","middle");
            this._jTarget = $("<table>");
            this._jTarget.rcuframe();
            jBody.append(this._jTarget);
        };
        
        RcuFrame.prototype.send = function (opt) 
        {
        };
        
/**
 * private method
 */
        RcuFrame.prototype._recvSucc = function (result)
        {
        };
        
        RcuFrame.prototype._recvFail = function (result)
        {
        };
        
        RcuFrame._initialized = true;
    }
};
