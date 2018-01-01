RcuCmdLightCtrl.prototype = new RcuWnd();
function RcuCmdLightCtrl(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuCmdLightCtrl._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.cmd_light_ctrl;
/**
 * public method
 */
        RcuCmdLightCtrl.prototype.init = function (opt) 
        {
            
        };
        
        RcuCmdLightCtrl.prototype.send = function (opt) 
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._sendCmd(this,opt);
        };
        
        RcuCmdLightCtrl.prototype.submit = function (event)
        {
            var opt = $.rcu.get($.rcu.conststr.tag.cmd_poll)._getCmdOpt(this._jTarget ,this._rcuTagName);
            this.send(opt);
        };
        
        RcuCmdLightCtrl.prototype.change = function (event)
        {
            var jSelElem = $(event.currentTarget);
            if(jSelElem.attr("name").indexOf("light_state_") == 0)
            {
                this._setOption(jSelElem[0]);
            }
            
        };
/**
 * protected method
 */        
        RcuCmdLightCtrl.prototype._initState = function (opt)
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._createIdTrees(this._jTarget);
        };
        
/**
 * private method
 */
        RcuCmdLightCtrl.prototype._recvSucc = function (result)
        {
            var action = result.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    var flag = result.flag ;
                    if(!!this._jTarget)
                    {
                        if(flag)
                        {
                            $.rcu.get($.rcu.conststr.tag.cmd_poll)._workSucc(this._rcuTagName);
                        }
                    }
                    break;
            }
        };
        
        RcuCmdLightCtrl.prototype._recvFail = function (result)
        {
        };
        
        RcuCmdLightCtrl.prototype._setOption = function (elem)
        {
            var jCurrent = $(elem);
            var jLabel = jCurrent.parent("td").prev("td").children("label");
            var idx = elem.selectedIndex ;
            if(0 == idx)
            {
                jCurrent.css("color","gray");
                jLabel.css("color","white");
            }
            else if(1 == idx)
            {
                jCurrent.css("color","red");
                jLabel.css("color","red");
            }
        };
        
        RcuCmdLightCtrl._initialized = true;
    }
};
