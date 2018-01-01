RcuCmdGeothermSet.prototype = new RcuWnd();
function RcuCmdGeothermSet(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuCmdGeothermSet._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.cmd_geotherm_set;
/**
 * public method
 */
        RcuCmdGeothermSet.prototype.init = function (opt) 
        {
        };
        
        RcuCmdGeothermSet.prototype.send = function (opt) 
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._sendCmd(this,opt);
        };
        
        RcuCmdGeothermSet.prototype.submit = function (event)
        {
            var opt = $.rcu.get($.rcu.conststr.tag.cmd_poll)._getCmdOpt(this._jTarget ,this._rcuTagName);
            //将set_geotherm_operation,set_geotherm_state,set_geotherm_yes,set_geotherm_no转化成
            //geotherm_flag_state,geotherm_value_yes,geotherm_value_no
            //RCU_SET_CONFIG中的set_id:set_geotherm_state,set_geotherm_yes,set_geotherm_no
            //和set_define不一致，其他命令中，这二者的名字是一致的，如果一条RCU命令设置的不合理，就会导致这种情况，
            var data = opt.param.data;
            var geoOperation = null ;
            var geoState = null ;
            var geoYesRun = null ;
            var geoYesStop = null ;
            var geoNoRun = null ;
            var geoNoStop = null ;
            for(var i = 0; i < data.length ; ++i)
            {
                var name = data[i].name;
                var value = data[i].value;
                switch(name)
                {
                case "set_geotherm_operation":
                    geoOperation = parseInt(value) ;
                    break;
                case "set_geotherm_state":
                    geoState = parseInt(value) ;
                    break;
                case "set_geotherm_yes_run":
                    geoYesRun = parseInt(value) ;
                    break;
                case "set_geotherm_yes_stop":
                    geoYesStop = parseInt(value) ;
                    break;
                case "set_geotherm_no_run":
                    geoNoRun = parseInt(value) ;
                    break;
                case "set_geotherm_no_stop":
                    geoNoStop = parseInt(value) ;
                    break;
                }
            }
            var geoFlag = null ;
            var geoValueYesRun = null ;
            var geoValueYesStop = null ;
            var geoValueNoRun = null ;
            var geoValueNoStop = null ;
            if(0 == geoOperation)
            {
                //关闭地热
                if(0 == geoState)
                {
                    geoFlag = 0 ;
                    geoValueYesRun = 0;
                    geoValueYesStop = 0;
                    geoValueNoRun = 0;
                    geoValueNoStop = 0;
                }
                //打开地热
                else if(1 == geoState)
                {
                    geoFlag = 1 ;
                    geoValueYesRun = 0;
                    geoValueYesStop = 0;
                    geoValueNoRun = 0;
                    geoValueNoStop = 0;
                }
            }
            //设置地热温度
            else if(1 == geoOperation)
            {
                geoFlag = 2 ;
                geoValueYesRun = $.rcu.get("common").binaryToBCD(geoYesRun);;
                geoValueYesStop = $.rcu.get("common").binaryToBCD(geoYesStop);;
                geoValueNoRun = $.rcu.get("common").binaryToBCD(geoNoRun);;
                geoValueNoStop = $.rcu.get("common").binaryToBCD(geoNoStop);;
            }
            if(geoFlag != null && geoValueYesRun != null && geoValueYesStop != null 
               && geoValueNoRun != null && geoValueNoStop != null)
            {
                var newData = [];
                newData.push({"name":"geotherm_flag_state","value":geoFlag});
                newData.push({"name":"geotherm_yes_run","value":geoValueYesRun});
                newData.push({"name":"geotherm_yes_stop","value":geoValueYesStop});
                newData.push({"name":"geotherm_no_run","value":geoValueNoRun});
                newData.push({"name":"geotherm_no_stop","value":geoValueNoStop});
                opt.param.data = newData ;
                this.send(opt);
            }
            
        };
        
        RcuCmdGeothermSet.prototype.change = function (event)
        {
            var jSelElem = $(event.currentTarget);
            if("set_geotherm_operation" == jSelElem.attr("name"))
            {
                this._setOption(jSelElem[0]);
            }
            
        };
/**
 * protected method
 */        
        RcuCmdGeothermSet.prototype._initState = function (opt)
        {
            $.rcu.get($.rcu.conststr.tag.cmd_poll)._createIdTrees(this._jTarget);
            var jSelElem = this._jTarget.getFrame().find("select[name='set_geotherm_operation']");
            this._setOption(jSelElem[0]);
        };
        
/**
 * private method
 */
        RcuCmdGeothermSet.prototype._recvSucc = function (result)
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
        
        RcuCmdGeothermSet.prototype._recvFail = function (result)
        {
        };
        
        RcuCmdGeothermSet.prototype._setOption = function (elem)
        {
            var jFrm = this._jTarget.getFrame();
            var idx = elem.selectedIndex ;
            var jTr0 = jFrm.find("select[name='set_geotherm_state']").parent("td").parent("tr");
            var jTr1 = jTr0.next();
            var jTr2 = jTr1.next();
            var jTr3 = jTr2.next();
            var jTr4 = jTr3.next();
            if(0 == idx)
            {
                jTr0.show();
                jTr1.hide();
                jTr2.hide();
                jTr3.hide();
                jTr4.hide();
            }
            else if(1 == idx)
            {
                jTr0.hide();
                jTr1.show();
                jTr2.show();
                jTr3.show();
                jTr4.show();
            }
        };
        
        RcuCmdGeothermSet._initialized = true;
    }
};
