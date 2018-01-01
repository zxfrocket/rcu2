RcuTips.prototype = new RcuObject();
function RcuTips(opt)
{
    RcuObject.call(this,opt);
    if (typeof RcuTips._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
/**
 * public method
 */
        RcuTips.prototype.init = function (opt) 
        {
            this._jTarget = this._opt.target;
        };
        
        RcuTips.prototype.send = function (opt) 
        {
        };
        
        RcuTips.prototype.create = function (opt)
        {
            /**
             * type 的可能只为
             * mo-cell
             * toolbar
             * toolitem
             */
            var type = opt.type;
            var jCurTipWrp = $("<div>");
            jCurTipWrp.rcutip({"action":$.rcu.conststr.action.init,"param":{"type":type}});
            this._jTarget.append(jCurTipWrp);
        };
        
        RcuTips.prototype.chg = function (opt)
        {
            var type = opt.type;
            var id = type + "-tips";
            var jCurTip = this._jTarget.children("#" + id);
            jCurTip.rcutip({"action":$.rcu.conststr.action.chg,"param":{"type":$.rcu.conststr.tiptype.mo_cell}});
        };
        
/**
 * private method
 */
        RcuTips.prototype._recvSucc = function (result)
        {
        };
        
        RcuTips.prototype._recvFail = function (result)
        {
        };
        
        RcuTips._initialized = true;
    }
};
