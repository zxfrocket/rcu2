RcuBackInst.prototype = new RcuObject();
function RcuBackInst()
{
    RcuObject.call(this);
    if (typeof RcuBackInst._initialized == "undefined") 
    {
/**
 * private member
 */
        this._jTarget = null ;
/**
 * public method
 */
        RcuBackInst.prototype.init = function () 
        {
            var itemNames = [$.rcu.conststr.tag.monitor,
                             $.rcu.conststr.tag.wnd,
                             $.rcu.conststr.tag.user_add,
                             $.rcu.conststr.tag.user_del,
                             $.rcu.conststr.tag.user_chgpass,
                             $.rcu.conststr.tag.user_chglevel,
                             $.rcu.conststr.tag.rooms_add,
                             $.rcu.conststr.tag.rooms_merge,
                             $.rcu.conststr.tag.rooms_rename,
                             $.rcu.conststr.tag.rooms_order,
                             $.rcu.conststr.tag.cmd_poll,
                             $.rcu.conststr.tag.cmd_card_delay,
                             $.rcu.conststr.tag.cmd_door_clock,
                             $.rcu.conststr.tag.cmd_light_ctrl,
                             $.rcu.conststr.tag.cmd_air_ctrl,
                             $.rcu.conststr.tag.cmd_temp_ctrl,
                             $.rcu.conststr.tag.cmd_mode_set,
                             $.rcu.conststr.tag.cmd_day_set,
                             $.rcu.conststr.tag.cmd_night_set,
                             $.rcu.conststr.tag.cmd_wind_set,
                             $.rcu.conststr.tag.cmd_temp_comp,
                             $.rcu.conststr.tag.cmd_in_set,
                             $.rcu.conststr.tag.cmd_geotherm_set,
                             $.rcu.conststr.tag.cmd_link_set,
                             $.rcu.conststr.tag.mo_info,
                             $.rcu.conststr.tag.mo_layout,
                             $.rcu.conststr.tag.mo_temp,
                             $.rcu.conststr.tag.mo_log,
                             $.rcu.conststr.tag.mo_set,
                             $.rcu.conststr.tag.search_complex,
                             $.rcu.conststr.tag.config_poll,
                             $.rcu.conststr.tag.config_opera,
                             $.rcu.conststr.tag.config_alert,
                             $.rcu.conststr.tag.config_mode];

            //TODO 以后从数据库里读
            var currentLevel = $.rcu.get("login").getUserLevel();
            if(currentLevel <= 3)
            {
                itemNames.push($.rcu.conststr.tag.searchview);
                itemNames.push($.rcu.conststr.tag.alertview);
            }
            if(currentLevel <= 2)
            {
                itemNames.push($.rcu.conststr.tag.logview);
            }
            for(var i = 0; i < itemNames.length ; ++i)
            {
                var obj = null ;
                switch(itemNames[i])
                {
                case $.rcu.conststr.tag.wnd:
                    obj = new RcuWnd();
                    break;
                case $.rcu.conststr.tag.user_add:
                    obj = new RcuUserAdd();
                    break;
                case $.rcu.conststr.tag.user_del:
                    obj = new RcuUserDel();
                    break;
                case $.rcu.conststr.tag.user_chgpass:
                    obj = new RcuUserChgPass();
                    break;
                case $.rcu.conststr.tag.user_chglevel:
                    obj = new RcuUserChgLevel();
                    break;
                case $.rcu.conststr.tag.rooms_add:
                    obj = new RcuRoomsAdd();
                    break;
                case $.rcu.conststr.tag.rooms_merge:
                    obj = new RcuRoomsMerge();
                    break;
                case $.rcu.conststr.tag.rooms_rename:
                    obj = new RcuRoomsRename();
                    break;
                case $.rcu.conststr.tag.rooms_order:
                    obj = new RcuRoomsOrder();
                    break;
                case $.rcu.conststr.tag.cmd_poll:
                    obj = new RcuCmdPoll();
                    break;
                case $.rcu.conststr.tag.cmd_card_delay:
                    obj = new RcuCmdCardDelay();
                    break;
                case $.rcu.conststr.tag.cmd_door_clock:
                    obj = new RcuCmdDoorClock();
                    break;
                case $.rcu.conststr.tag.cmd_light_ctrl:
                    obj = new RcuCmdLightCtrl();
                    break;
                case $.rcu.conststr.tag.cmd_air_ctrl:
                    obj = new RcuCmdAirCtrl();
                    break;
                case $.rcu.conststr.tag.cmd_temp_ctrl:
                    obj = new RcuCmdTempCtrl();
                    break;
                case $.rcu.conststr.tag.cmd_mode_set:
                    obj = new RcuCmdModeSet();
                    break;
                case $.rcu.conststr.tag.cmd_day_set:
                    obj = new RcuCmdDaySet();
                    break;
                case $.rcu.conststr.tag.cmd_night_set:
                    obj = new RcuCmdNightSet();
                    break;
                case $.rcu.conststr.tag.cmd_wind_set:
                    obj = new RcuCmdWindSet();
                    break;
                case $.rcu.conststr.tag.cmd_temp_comp:
                    obj = new RcuCmdTempComp();
                    break;
                case $.rcu.conststr.tag.cmd_in_set:
                    obj = new RcuCmdInSet();
                    break;
                case $.rcu.conststr.tag.cmd_geotherm_set:
                    obj = new RcuCmdGeothermSet();
                    break;
                case $.rcu.conststr.tag.cmd_link_set:
                    obj = new RcuCmdLinkSet();
                    break;
                case $.rcu.conststr.tag.mo_info:
                    obj = new RcuMoInfo();
                    break;
                case $.rcu.conststr.tag.mo_layout:
                    obj = new RcuMoLayout();
                    break;
                case $.rcu.conststr.tag.mo_temp:
                    obj = new RcuMoTemp();
                    break;
                case $.rcu.conststr.tag.mo_log:
                    obj = new RcuMoLog();
                    break;
                case $.rcu.conststr.tag.mo_set:
                    obj = new RcuMoSet();
                    break;
                case $.rcu.conststr.tag.search_complex:
                    obj = new RcuSearchComplex();
                    break;
                case $.rcu.conststr.tag.config_poll:
                    obj = new RcuConfigPoll();
                    break;
                case $.rcu.conststr.tag.config_opera:
                    obj = new RcuConfigOpera();
                    break;
                case $.rcu.conststr.tag.config_alert:
                    obj = new RcuConfigAlert();
                    break;
                case $.rcu.conststr.tag.config_mode:
                    obj = new RcuConfigMode();
                    break;
                case $.rcu.conststr.tag.monitor:
                    obj = new RcuMonitor({"target":$("div#rcu-frame-monitor").children("div#tab-mowrp-house")});
                    break;
                case $.rcu.conststr.tag.searchview:
                    obj = new RcuSearchView({"target":$("div#rcu-frame-monitor").children("div#tab-mowrp-search")});
                    break;
                case $.rcu.conststr.tag.alertview:
                    obj = new RcuAlertView({"target":$("div#rcu-frame-monitor").children("div##tab-mowrp-alert")});
                    break;
                case $.rcu.conststr.tag.logview:
                    obj = new RcuLogView({"target":$("div#rcu-frame-monitor").children("div#tab-mowrp-log")});
                    break;
                }
                
                if(!!obj)
                {
                    var str = "{'" + itemNames[i] + "':null}";
                    var pair = eval("(" + str + ")");
                    pair[itemNames[i]] = obj;
                    $.extend(true,$.rcu.obj,pair);
                    
                    obj.init();
                    if(obj.check())
                    {
                        obj.send({"action":$.rcu.conststr.action.init});
                    }
                }
                
            }
            
        };
        
        RcuBackInst.prototype.send = function (opt) 
        {
        };
        
/**
 * private method
 */
        RcuBackInst.prototype._recvSucc = function (result)
        {
        };
        
        RcuBackInst.prototype._recvFail = function (result)
        {
        };
        
        RcuBackInst._initialized = true;
    }
};
