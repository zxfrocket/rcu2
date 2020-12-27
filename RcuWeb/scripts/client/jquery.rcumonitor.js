(function($){
    $.fn.rcuview = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            var param = opt.param;
            var name = param.name ;
            var tabMonitorId = param.tabid;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    //创建Tab
                    this.append("<ul>");
                    this.tabs(
                    {
                        "add":respAddItem
                    });
                    var tabid = "#" + tabMonitorId + "0" ;
                    var title = "";
                    switch(name)
                    {
                    case $.rcu.conststr.tag.logview:
                        title = "命令日志";
                        break;
                    case $.rcu.conststr.tag.searchview:
                        title = "结果1";
                        break;
                    case $.rcu.conststr.tag.alertview:
                        title = "温度报警";
                        break;
                    }
                    this.tabs( "add", tabid, title);
                    /**
                     * 修改tabs的template,加入删除叉叉
                     */
                    this.tabs(
                    {
                        tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>"
                    }); 
                    break;
            }
        }
        return this;
    };
    
    $.fn.rcumonitor = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            var tabMonitorId = opt.param.tabid;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    ($(this).parent(".rcu-frame"))
                        .bind("keydown",respKeyDown)
                        .bind("focus",respFocus)
                        .bind("blur",respBlur);
                    //创建Tab
                    this.append("<ul>");
                    this.tabs(
                    {
                        "add":respAddItem
                    });
                    var floor = $.rcu.get("common").getFirstFloor();
                    var tabid = "#" + tabMonitorId + floor ;
                    this.tabs( "add", tabid, floor + "楼");
                    /**
                     * 修改tabs的template,加入删除叉叉
                     */
                    this.tabs(
                    {
                        tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>"
                    }); 
                    break;
            }
        }
        return this;
        
        function respKeyDown(event)
        {
            var keyCode = event.keyCode ;
            if(188 == keyCode ||
               190 == keyCode ||
               37 == keyCode ||
               39 == keyCode)
            {
                var clsName = "mo-film-selected";
                var jSelFilms = $("div." + clsName);
                /**
                 * 188 <
                 * 190 >
                 */
                var offset = 0;
                if(188 == keyCode || 37 == keyCode)
                {
                    direction = "horizantal";
                    offset = -1;
                }
                else if(190 == keyCode || 39 == keyCode)
                {
                    direction = "horizantal";
                    offset = 1;
                }
                jSelFilms.each(function(){
                    $(this).rcumo_film({"action":$.rcu.conststr.action.chg,
                        "param":{"offset":offset,"direction":direction}});
                });
            }
            return false ;
        }
        
        function respFocus(event)
        {
            var clsName = $.rcu.conststr.clsname.item_focus;
            var jTarget = $(event.currentTarget);
            if(!jTarget.hasClass(clsName))
            {
                $("." + clsName).removeClass(clsName);
                jTarget.addClass(clsName);
            }
            
            return false ;
        }
        
        function respBlur(event)
        {
            var clsName = $.rcu.conststr.clsname.item_focus;
            var jTarget = $(event.currentTarget);
            if(jTarget.hasClass(clsName))
            {
                jTarget.removeClass(clsName);
            }
            clsName = "mo-film-selected";
            var jSelFilms = $("." + clsName);
            jSelFilms.removeClass(clsName);
            
            return false ;
        }
    };
    
    function respAddItem(event,ui)
    {
        var jPanel = $(ui.panel);
        var jTab = $(ui.tab);
        var jUl = jTab.parents("div.ui-tabs-nav").first();
        var jParent = jPanel.parents("div.ui-tabs").first();
        var h = jParent.height();
        var w = jParent.width();
        var width = $.rcu.get("common").getMonitorDispParam().wrp.width;
        jPanel.height(h - 38)
              .width(width)//必须一行显示6个
              .css("overflow-x","hidden")
              .css("overflow-y","auto")
              .css("padding","0px 0px 0px 0px")
              .css("margin","0px 0px 0px 0px");
        return false ;
    }
    
    /**
     * mo_main->suite->house(accordion)->film(响应键盘左右键)->grid->cell
     * mo_main->suite->house(accordion)->panel->btn
     */
    $.fn.rcumo_main = function(opt)
    {
        if(!!opt)
        {
            /**
             * opt = [a,b,c];
             * a = {suiteid:suiteid,suiteinfos:[a,b,c]}
             */
            var action = opt.action ;
            var param = opt.param ;
            switch(action)
            {
            case $.rcu.conststr.action.init:
                var infos = param.infos ;
                var floor = param.floor ;
                for(var i = 0; i < infos.length ; ++i)
                {
                    var jSuite = $("<div>");
                    this.append(jSuite);
                    jSuite.rcumo_suite({"action":$.rcu.conststr.action.init,"param":infos[i]});
                }
                this.addClass("mo-root")
                    //.例如id为tab-monitor-1，在RcuMonitor.js中的tabs.add时设置的
                    .val(floor);
                break;
            case $.rcu.conststr.action.put:
                var infos = param.infos ;
                var floor = param.floor ;
                for(var i = 0; i < infos.length ; ++i)
                {
                    var suiteid = infos[i].suiteid ;
                    var jSuite = this.find("#mo-suite-" + suiteid);
                    if(1 == jSuite.length)
                    {
                        jSuite.rcumo_suite({"action":$.rcu.conststr.action.put,"param":infos[i]});
                    }
                }
                break;
            }
            
        }
        return this ;
    };
    
    $.fn.rcumo_suite = function(opt)
    {
        if(!!opt)
        {
            /**
             * opt = {suiteid:suiteid,suiteinfos:[a,b,c]}
             * a = {roomid:101,houseinfos:{"moinfos":moinfos,"opinfos":opinfos}}
             * suiteid是suite的唯一标示RCU_SUITE_INFO
             */
            var action = opt.action ;
            switch(action)
            {
            case $.rcu.conststr.action.init:
                var param = opt.param ;
                var suiteid = param.suiteid ;
                var suiteinfos = param.suiteinfos ;
                if(!!suiteid && !!suiteinfos)
                {
                    var hw = 0 ;
                    var hh = 0 ;
                    for(var i = 0 ; i < suiteinfos.length ; ++i)
                    {
                        var houseopt = suiteinfos[i];
                        var jHouse = $("<div>").rcumo_house({"action":$.rcu.conststr.action.init,"param":houseopt});
                        if(0 == i)
                        {
                            hw = jHouse.width();
                            hh = jHouse.height();
                        }
                        this.append(jHouse);
                    }
                    var houseParam = $.rcu.get("common").getMonitorDispParam().house ;
                    var top = houseParam.top ;
                    var left = houseParam.left ;
                    var count = i ;
                    var sw = count * hw + (count + 1)*left ;
                    var sh = hh + 2*top ;
                    var rightMargin = 2*left*(count-1);
                    this.width(sw)
                        .height(sh)
                        .css("padding","0px 0px 0px 0px")
                        .css("margin",top + "px " + rightMargin +"px 0px " + left + "px")
                        .css("float","left")
                        .addClass("mo-suite")
                        .addClass("mo-suite-" + count)
                        .attr("id","mo-suite-" + suiteid)
                        .attr("value",count)
                        .data("suiteid",suiteid);
                }
                break;
            case $.rcu.conststr.action.put:
                var param = opt.param ;
                var suiteid = param.suiteid ;
                var suiteinfos = param.suiteinfos ;
                if(!!suiteid && !!suiteinfos)
                {
                    for(var i = 0 ; i < suiteinfos.length ; ++i)
                    {
                        var houseopt = suiteinfos[i];
                        var roomid = houseopt.roomid ;
                        var jHouse = this.find("#mo-house-" + roomid);
                        if(1 == jHouse.length)
                        {
                            jHouse.rcumo_house({"action":$.rcu.conststr.action.put,"param":houseopt});
                        }
                    }
                }
                break;
            }
        }
        return this ;
    };
    
    $.fn.rcumo_house = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            switch(action)
            {
            case $.rcu.conststr.action.init:
                /**
                 * opt ={roomid:101,houseinfos:{"moinfos":moinfos,"opinfos":opinfos}}
                 * moinfos = {groupInfos:[a, b,c],sliderinfos:{pos:0}}
                 * gridInfos是一个数组，每个元素是一个groupinfo
                 * a = [x,y,z]
                 * x = {name:card,value:1,desc:有卡}
                 * pos指当前slider应该在的位置
                 */
                var param = opt.param ;
                var roomid = param.roomid ;
                //TODO 既然 roomname是由roomid得到的，那么就不用从server端传过来了
                //但是，现在param中包含roomname，应该给它去掉
                var roomname = $.rcu.get("index").getRoomNameFromId(roomid);
                var roomdesc = param.roomdesc ;
                var infos = param.houseinfos ;
                if(!!roomid && !!infos)
                {
                    /**
                     * create grid
                     */
                    var moinfos = infos.moinfos ;
                    var groupInfos = moinfos.groupInfos ;
                    var pos = moinfos.sliderinfos.pos ;
                    var filmopt = {"action":$.rcu.conststr.action.init, "param":{"roomid":roomid,
                                  "infos":groupInfos,"pos":pos}};
                    var filmHeader = $.rcu.get("common").getFilmHeader(pos);
                    var jHFilm = $("<h3><a href='#'>" + roomname + " " + filmHeader + "</a></h3>");
                    var jFilm = $("<div>").rcumo_film(filmopt);
                    var fw = jFilm.width();
                    var fh = jFilm.height();
                    jHFilm.width(fw)
                          .css("overflow","hidden")
                          .css("white-space","nowrap")
                          .css("text-overflow","ellipsis");
                    /**
                     * create panel
                     */
                    var jHPanel = $("<h3><a href='#'>操作面板</a></h3>");
                    jHPanel.css("overflow","hidden")
                           .css("white-space","nowrap")
                           .css("text-overflow","ellipsis");
                    var jPanel = $("<div>").rcumo_panel({"action":$.rcu.conststr.action.init,"param":{"roomid":roomid,
                                 "layout":{"width":fw,"height":fh},"infos":infos.opinfos}});
                    this.append(jHFilm);
                    this.append(jFilm);
                    this.append(jHPanel);
                    this.append(jPanel);
                    this.accordion({ "autoHeight": false});
                    
                    var houseParam = $.rcu.get("common").getMonitorDispParam().house ;
                    var top = houseParam.top ;
                    var left = houseParam.left ;
                    this.width(fw)
                        .height(fh + 60)
                        .css("padding","0px 0px 0px 0px")
                        .css("margin",top + "px 0px 0px " + left + "px")
                        .css("float","left")
                        .addClass("mo-house")
                        .attr("id","mo-house-" + roomid)
                        .data("roomid",roomid)
                        .data("roomname",roomname)
                        .data("roomdesc",roomdesc);
                }
                break;
            case $.rcu.conststr.action.put:
                var param = opt.param ;
                var roomid = param.roomid ;
                var infos = param.houseinfos ;
                if(!!roomid && !!infos)
                {
                    var moinfos = infos.moinfos ;
                    var groupInfos = moinfos.groupInfos ;
                    jFilm = this.find("#mo-film-" + roomid);
                    if(1 == jFilm.length)
                    {
                        jFilm.rcumo_film({"action":$.rcu.conststr.action.put, "param":{"infos":groupInfos}});
                    }
                }
                break;
            }
        }
        return this ;
    };
    
    $.fn.rcumo_film = function(opt)
    {
        /**
         * opt ={roomid:101,infos:[a,b,c],pos:0}
         * infos是一个数组，每个元素是一个groupinfos
         * a = [x,y,z];x,y,z的顺序就是group_id的顺序
         * x = {name:card,value:1,desc:有卡}
         * pos指当前slider应该在的位置
         */
        if(!!opt)
        {
            var action = opt.action ;
            var param = opt.param ;
            
            if(!!param)
            {
                switch (action)
                {
                    case $.rcu.conststr.action.init:
                        var pos = param.pos ;
                        var infos = param.infos ;
                        if(pos < infos.length)
                        {
                            //grid
                            var roomid = param.roomid ;
                            var curinfos = infos[pos];
                            var tmpopt = {"action":$.rcu.conststr.action.init,"param":{"roomid":roomid,"group":pos,"infos":curinfos}};
                            var jGrid = $("<div>").rcumo_grid(tmpopt);
                            this.append(jGrid);
                            var gw = jGrid.width() ;
                            var gh = jGrid.height() ;
                            this.append(jGrid);
                            this.width(gw)
                                .height(gh)
                                .css("padding","0px 0px 0px 0px")
                                .css("overflow","hidden")
                                .addClass("mo-film")
                                .attr("id","mo-film-" + roomid)
                                .attr("value",pos)
                                .data("roomid",roomid)
                                .data("infos",infos)
                                .bind("click",respClick);
                            $.rcu.get("tips").chg({"type":"mo-cell"});
                        }
                        break;
                    case $.rcu.conststr.action.chg:
                        var offset = param.offset ;
                        var direction = param.direction ;
                        if("horizantal" == direction)
                        {
                            var pos = parseInt(this.val());
                            var retPos = pos + offset ;
                            var infos = this.data("infos");
                            var len = infos.length ;
                            if(retPos < 0)
                            {
                                retPos = len - 1;
                            }
                            else if(retPos >= len)
                            {
                                retPos = 0;
                            }
                            this.val(retPos);
                            this.html("");
                            var curinfos = infos[retPos];
                            var roomid = this.data("roomid");
                            var roomname = $.rcu.get("index").getRoomNameFromId(roomid);
                            var tmpopt = {"action":$.rcu.conststr.action.init,"param":{"roomid":roomid,"group":retPos,"infos":curinfos}};
                            var jGrid = $("<div>").rcumo_grid(tmpopt);
                            this.append(jGrid);
                            $.rcu.get("tips").chg({"type":"mo-cell"});
                            /**
                             * 改变Film Header的text
                             */
                            var filmHeader = $.rcu.get("common").getFilmHeader(retPos);
                            var jHFilm = this.prev("h3");
                            jHFilm.children("a").text(roomname + " " + filmHeader);
                        }
                        break;
                    case $.rcu.conststr.action.put:
                        var pos = this.val();
                        var infos = param.infos ;
                        var roomid = this.data("roomid");
                        this.data("infos",infos);
                        var jGrid = this.find("#mo-grid-" + pos + "-" + roomid);
                        if(1 == jGrid.length)
                        {
                            jGrid.rcumo_grid({"action":$.rcu.conststr.action.put,"param":{"infos":infos[pos]}});
                        }
                        
                        break;
                }
            }
        }
        return this;
        
        function respClick(event)
        {
            var clsName = "mo-film-selected";
            var jTarget = $(event.currentTarget);
            if(!!event.ctrlKey)
            {
                jTarget.toggleClass(clsName);
            }
            else
            {
                if(jTarget.hasClass(clsName))
                {
                    $("." + clsName).removeClass(clsName);
                }
                else
                {
                    $("." + clsName).removeClass(clsName);
                    jTarget.addClass(clsName);
                }
            }
            /**
             * Film Header与Film保持一致
             */
            if(jTarget.hasClass(clsName))
            {
                jTarget.prev("h3").addClass(clsName);
            }
            else
            {
                jTarget.prev("h3").removeClass(clsName);
            }
            
            return false;
        }
    };
    
    $.fn.rcumo_panel = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            var param = opt.param ;
            
            if(!!param)
            {
                var roomid = param.roomid ;
                var layout = param.layout ;
                var w = layout.width ;
                var h = layout.height ;
                switch (action)
                {
                    case $.rcu.conststr.action.init:
                        //TODO ONE 从数据库中加载，根据level
                        /*var jBtnInfo = $("<div>").rcumo_btn({"action":"init","param":{"roomid":roomid,"name":"info","desc":"详细信息"}});
                        this.append(jBtnInfo);*/
                        var currentLevel = $.rcu.get("login").getUserLevel();
                        if(currentLevel <= 0)
                        {
                            var jBtnLayout = $("<div>").rcumo_btn({"action":"init","param":{"roomid":roomid,"name":"layout","desc":"灯组布局"}});
                            this.append(jBtnLayout);
                        }
                        if(currentLevel <= 3)
                        {
                            var jBtnTemp = $("<div>").rcumo_btn({"action":"init","param":{"roomid":roomid,"name":"temp","desc":"温度曲线"}});
                            this.append(jBtnTemp);
                            //TODO 根据不同酒店，加载不同内容
                            var jBtnTemp1 = $("<div>").rcumo_btn({"action":"init","param":{"roomid":roomid,"name":"temp1","desc":"温度曲线1"}});
                            this.append(jBtnTemp1);
                            var jBtnTemp2 = $("<div>").rcumo_btn({"action":"init","param":{"roomid":roomid,"name":"temp2","desc":"温度曲线2"}});
                            this.append(jBtnTemp2);
                        }
                        /*var jBtnLog = $("<div>").rcumo_btn({"action":"init","param":{"roomid":roomid,"name":"log","desc":"日志信息"}});
                        this.append(jBtnLog);
                        var jBtnSet = $("<div>").rcumo_btn({"action":"init","param":{"roomid":roomid,"name":"set","desc":"命令设置"}});
                        this.append(jBtnSet);*/
                        this.width("css",w)
                            .height("css",h)
                            .css("padding","0px 0px 0px 0px")
                            .css("overflow","hidden")
                            .addClass("mo-panel")
                            .attr("id","mo-cell-" + roomid);
                        break;
                }
            }
        }
        return this;
    };
    
    $.fn.rcumo_grid = function(opt)
    {
        /**
         * opt ={roomid:101,group:0,infos:[a,b,c]}
         */
        if(!!opt)
        {
            var action = opt.action ;
            var param = opt.param ;
            
            if(!!param)
            {
                var roomid = param.roomid ;
                /**
                 * group指当前显示的哪一组图标，
                 * 因为所有图标不可能全部显示出来，
                 * 没有那么大的空间，光light状态就32个，
                 * RCU_STATE_GROUP
                 * group可能的值0,1,2，对应的可能是"common"或"light"或"welecom_light_day"
                 */
                var group = param.group ;//
                /**
                 * infos: [a,b,c]
                 * a,b,c应该和RCU_ROOM_STATE中的某一个字段名，比如card,card_delay
                 * a = {info:{name:card,value:1,desc:有卡}}
                 * a = {info:{name,busy,value:1,desc:勿扰}}
                 * a = {info:{name:wind,value:4,desc:高速}}
                 */
                var infos = param.infos ;
                switch (action)
                {
                    case $.rcu.conststr.action.init:
                        var cellw = 0;
                        var cellh = 0;
                        for(var i = 0; i < infos.length ; ++i)
                        {
                            var info = infos[i];
                            var name = info.name ;
                            var value = info.value ;
                            var tmpopt = {"action":$.rcu.conststr.action.init,param:{"roomid":roomid,
                                          "name":name,"value":value}};
                            var jCell = $("<div>").rcumo_cell(tmpopt);
                            if(0 == i)
                            {
                                cellw = jCell.width();
                                cellh = jCell.height();
                            }
                            this.append(jCell);
                        }
                        var cellParam = $.rcu.get("common").getMonitorDispParam().cell ;
                        var top = cellParam.top ;
                        var left = cellParam.left ;
                        var colCount = $.rcu.get("common").getConfigValue("config_col_count");
                        var rowCount = $.rcu.get("common").getConfigValue("config_row_count");
                        var w = cellw*colCount + left*(colCount+1) ;//一行有config_col_count个图标
                        var h = cellw*rowCount + top*(rowCount+1) ;//一列有config_row_count个图标
                        this.width(w)
                            .height(h)
                            .css("padding","0px 0px 0px 0px")
                            .css("overflow","hidden")
                            .addClass("mo-grid")
                            .addClass("mo-grid-" + group)
                            .attr("id","mo-grid-" + group + "-" + roomid)
                            .attr("value",group)
                            .data("roomid",roomid);
                        break;
                    case $.rcu.conststr.action.put:
                        for(var i = 0; i < infos.length ; ++i)
                        {
                            var roomid = this.data("roomid");
                            var info = infos[i];
                            var name = info.name ;
                            var value = info.value ;
                            var jCell = this.find("#mo-cell-" + name + "-" + roomid);
                            if(1 == jCell.length)
                            {
                                jCell.rcumo_cell({"action":$.rcu.conststr.action.chg,param:{"value":value}});
                            }
                        }
                        break;
                }
            }
        }
        return this;
    };
    
    $.fn.rcumo_cell = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            var param = opt.param ;
            
            if(!!param)
            {
                switch (action)
                {
                    case $.rcu.conststr.action.init:
                        var roomid = param.roomid ;
                        var name = param.name ;//state应该和RCU_ROOM_STATE中的某一个字段名，比如card,card_delay
                        var value = param.value ;//value应该是RCU_PARA_DEFINE中para_value的值
                        var type = $.rcu.get('common').getStateType(name) ;
                        var cellParam = $.rcu.get("common").getMonitorDispParam().cell ;
                        var top = cellParam.top ;
                        var left = cellParam.left ;
                        var w = cellParam.width ;
                        var h = cellParam.height ;
                        this.width(w)
                            .height(h)
                            .css("float","left")
                            .css("margin",top + "px 0px 0px " + left + "px")
                            .css("padding","0px 0px 0px 0px")
                            .css("line-height",w + "px")
                            .css("font-size",cellParam.fontSize + "px")
                            .addClass("mo-cell")
                            .addClass("mo-cell-" + name)
                            .attr("id","mo-cell-" + name + "-" + roomid)
                            .attr("name",name)
                            .attr("value",value)
                            .data("roomid",roomid);
                        var cellText = getCellText(value,type);
                        /*
                        //上海才有的地热，50和5要特殊处理
                        if("setting_geotherm" == name)
                        {
                            if(5 == value)
                            {
                                cellText = "关";
                            }
                            else if(50 == value)
                            {
                                cellText = "开";
                            }
                        }
                        */
                        if(cellText != null)
                        {
                            this.text(cellText);
                        }
                        if(1 == type)
                        {
                            this.addClass("mo-cell-temp");
                        }
                        break;
                    case $.rcu.conststr.action.chg:
                        var name = this.attr("name") ;
                        var value = param.value ;
                        var type = $.rcu.get('common').getStateType(name) ;
                        var oldval = this.val();
                        if(value != oldval)
                        {
                            var cellText = getCellText(value,type);
/*
                            //上海才有的地热，50和5要特殊处理
                            if("setting_geotherm" == name)
                            {
                                if(5 == value)
                                {
                                    cellText = "关";
                                }
                                else if(50 == value)
                                {
                                    cellText = "开";
                                }
                            }*/
                            
                            if(cellText != null)
                            {
                                this.text(cellText);
                            }
                            this.attr("value",value);
                        }
                        break;
                }
            }
        }
        return this;
        
        function getCellText(value,type)
        {
            if(1 == type)
            {
                return value ;
            }
            else if(2 == type)
            {
                if("temp_comp" == name)
                {
                    var tmpVal = parseInt(value);
                    if(tmpVal > 128)
                    {
                        tmpVal = 128 - tmpVal;
                    }
                    return tmpVal;
                }
                else
                {
                    return value ;
                }
            }
            return null ;
        }
    };
    
    $.fn.rcumo_btn = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            var param = opt.param ;
            
            if(!!param)
            {
                var roomid = param.roomid ;
                var name = param.name ;//info layout temp log set
                var desc = param.desc ;
                
                switch (action)
                {
                    case $.rcu.conststr.action.init:
                        var cellParam = $.rcu.get("common").getMonitorDispParam().cell ;
                        var top = cellParam.top ;
                        var left = cellParam.left ;
                        var w = cellParam.width ;
                        var h = cellParam.height ;
                        this.width(w)
                            .height(h)
                            .css("float","left")
                            .css("margin",top + "px 0px 0px " + left + "px")
                            .css("padding","0px 0px 0px 0px")
                            .css("border-radius",cellParam.radius + "px")
                            .addClass("mo-btn")
                            .addClass("mo-btn-" + name)
                            .attr("id","mo-btn-" + name + "-" + roomid)
                            .attr("name",name)
                            .attr("desc",desc)
                            .data("roomid",roomid)
                            .unbind("click")
                            .bind("click",respBtnClick);
                }
            }
        }
        return this;
        
        function respBtnClick(event)
        {
            var jTarget = $(event.currentTarget);
            var name = jTarget.attr("name");
            var desc = jTarget.attr("desc");
            var roomid = jTarget.data("roomid");
            var icon = jTarget.css("background-image");
            var title = roomid + desc ;
            switch(name)
            {
            case "info":
                $.rcu.get($.rcu.conststr.tag.mo_info).open({"title":title,"icon":icon,"roomid":roomid});
                break;
            case "layout":
                $.rcu.get($.rcu.conststr.tag.mo_layout).open({"title":title,"icon":icon,"roomid":roomid});
                break;
            case "temp":
                $.rcu.get($.rcu.conststr.tag.mo_temp).open({"title":title,"icon":icon,"roomid":roomid,"index":0});
                break;
            case "temp1":
                $.rcu.get($.rcu.conststr.tag.mo_temp).open({"title":title,"icon":icon,"roomid":roomid,"index":1});
                break;
            case "temp2":
                $.rcu.get($.rcu.conststr.tag.mo_temp).open({"title":title,"icon":icon,"roomid":roomid,"index":2});
                break;
            case "log":
                $.rcu.get($.rcu.conststr.tag.mo_log).open({"title":title,"icon":icon,"roomid":roomid});
                break;
            case "set":
                $.rcu.get($.rcu.conststr.tag.mo_set).open({"title":title,"icon":icon,"roomid":roomid});
                break;
            }
            return false;
        }
    };
    
})(jQuery);
