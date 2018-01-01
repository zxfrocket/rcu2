/**
 * process rcu
 */
(function($){
    $.rcu = function(){};
    
    $.rcu.obj = {};
    
    $.rcu.main = function(opt)
    {
        var obj = new RcuLogin();
        $.extend(true,$.rcu.obj,{"login":obj});
        $.rcu.get($.rcu.conststr.tag.login).open({"title":"大连广电智能RCU系统"});
    };
    
    $.rcu.get = function(key)
    {
        return $.rcu.obj[key];
    };
    
/**
 * ====================================================================================
 * 定义通用的一些字符串
 */
    $.rcu.conststr = 
    {
            "action":
            {
                "init":"init",
                "chg":"chg",
                "add":"add",
                "close":"close",
                "open":"open",
                "put":"put",
                "notify":"notify",
                "get":"get"
            },
            "clsname":
            {
                "item_focus":"item-focus"
            },
            "tiptype":
            {
                "mo_cell":"mo-cell",
                "toolbar":"toolbar",
                "toolitem":"toolitem"
            },
            "house":
            {
                "count":
                {
                    "x": 4,
                    "y": 2
                }
            },
            //TODO 这个参数设定之初，应该是为了保证每行显示的house数目，
            //但是目前看，修改这个参数，house数目并没有跟着变化
            "suite":
            {
                "count": 6
            },
            "index":
            {
                "count": 5
            },
            "tag":
            {
                "login": "login",
                "toolbar": "toolbar",
                "index": "index",
                "monitor": "monitor",
                "searchview": "searchview",
                "alertview": "alertview",
                "logview": "logview",
                "tips": "tips",
                "dock": "dock",
                "wnd": "wnd",
                "user_add": "user_add",
                "user_del": "user_del",
                "user_chgpass": "user_chgpass",
                "user_chglevel": "user_chglevel",
                "rooms_add": "rooms_add",
                "rooms_merge": "rooms_merge",
                "rooms_rename": "rooms_rename",
                "rooms_order": "rooms_order",
                "cmd_poll": "cmd_poll",
                "cmd_card_delay": "cmd_card_delay",
                "cmd_door_clock": "cmd_door_clock",
                "cmd_light_ctrl": "cmd_light_ctrl",
                "cmd_air_ctrl": "cmd_air_ctrl",
                "cmd_temp_ctrl": "cmd_temp_ctrl",
                "cmd_mode_set": "cmd_mode_set",
                "cmd_day_set": "cmd_day_set",
                "cmd_night_set": "cmd_night_set",
                "cmd_wind_set": "cmd_wind_set",
                "cmd_temp_comp": "cmd_temp_comp",
                "cmd_in_set": "cmd_in_set",
                "cmd_geotherm_set": "cmd_geotherm_set",
                "cmd_link_set": "cmd_link_set",
                "mo_info": "mo_info",
                "mo_layout": "mo_layout",
                "mo_temp": "mo_temp",
                "mo_log": "mo_log",
                "mo_set": "mo_set",
                "search_complex": "search_complex",
                "config_poll": "config_poll",
                "config_opera": "config_opera",
                "config_alert": "config_alert",
                "config_mode": "config_mode",
                "alert_temp": "alert_temp"
            },
            "iconSize":[16,24,32,48,64,72,96,128,256,512,1024],
            "size":
            {
                "wnd":
                {
                    "btn_ok":[109,39]
                }
            }
    };
    
    $.rcu.timer = 
    {
            "house": 5000,
            "log": 5000,
            "alert": 5000
    };
    
/**
 * ====================================================================================
 * 对Javascript既有内容的扩展
 */
    // 对Date的扩展，将 Date 转化为指定格式的String   
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    // 例子：   
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
    Date.prototype.Format = function(fmt)   
    { //author: meizz   
      var o = {   
        "M+" : this.getMonth()+1,                 //月份   
        "d+" : this.getDate(),                    //日   
        "h+" : this.getHours(),                   //小时   
        "m+" : this.getMinutes(),                 //分   
        "s+" : this.getSeconds(),                 //秒   
        "q+" : Math.floor((this.getMonth()+3)/3), //季度   
        "S"  : this.getMilliseconds()             //毫秒   
      };   
      if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
      for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
      return fmt;   
    };

})(jQuery);
