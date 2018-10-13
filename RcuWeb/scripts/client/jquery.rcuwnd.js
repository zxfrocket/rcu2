(function($){
    $.rcuwnd = function()
    {
        $.window.prepare({
            dock: 'left',
            dockArea: $.rcu.get("dock").getTarget(),
            minWinNarrow: $.rcu.get("common").getDockDispParam().wrp.width,
            minWinLong: $.rcu.get("common").getDockDispParam().header.height
         });

        liveWndEvent();
    };
    
    $.rcuwnd_mownd = function(opt)
    {
        if(!!opt)
        {
            if(!!opt)
            {
                var action = opt.action ;
                
                switch (action)
                {
                    case $.rcu.conststr.action.init:
                        var param = opt.param || {} ;
                        
                        //扩展的header和frm类名
                        var header = "wnd-max-header" ;
                        //var frm = "wnd-max-frm" ;
                        param.header = header ;
                        //param.frm = frm ;
                        
                        //根据tag计算高度和宽度
                        var size = getWndSize(param.tag) ;
                        $.extend(true,param,size) ;
                        
                        var jContent = $("<div>");
                        jContent.rcuwnd_frame({"action":$.rcu.conststr.action.init,
                                                "param":param});
                        
                        var jTarget = $.window(
                        {
                            content: jContent.html(),
                            showFooter: false,
                            resizable: false,
                            maximizable: false,
                            scrollable: false,
                            draggable: false,
                            headerClass:header,
                            //frameClass:frm,
                            onOpen: function(wnd){
                                wnd.getContainer().attr("roomid",param.roomid);
                                processUI_Open(wnd,param);
                            },
                            onShow: function(wnd){wnd.maximize();},
                            onCascade: function(wnd){wnd.maximize();},
                            afterMinimize: function(wnd){processUI_Min(wnd,param);},
                            onMaximize:function(wnd){processUI_Max(wnd,param,false);},
                            afterMaximize:function(wnd){
                                processUI_Max(wnd,param,true);
                                var name = wnd.getContainer().attr("name");
                                $.rcu.get(name).show({"roomid":param.roomid});
                            },
                            onSelect: function(wnd)
                            {
                                if(!!wnd)
                                {
                                    var zidx = wnd.attr("z-index");
                                    wnd.attr("z-index",zidx + 100);
                                }
                            },
                            onClose: function(wnd){
                                if(!!wnd)
                                {
                                    $.rcu.get(param.tag).close({"roomid":param.roomid}) ;
                                }
                            }
                        });
                        
                        switch(param.tag)
                        {
                        case $.rcu.conststr.tag.mo_layout:
                            extMoLayoutWndFunc(jTarget);
                            break;
                        case $.rcu.conststr.tag.mo_temp:
                            extMoTempWndFunc(jTarget);
                            break;
                        }
                   
                        return jTarget ;
                        break;
                }
            }
        }
        return null ;
    };
    
    $.rcuwnd_window = function(opt)
    {
        if(!!opt)
        {
            if(!!opt)
            {
                var action = opt.action ;
                
                switch (action)
                {
                    case $.rcu.conststr.action.init:
                        var param = opt.param || {} ;
                        
                        //扩展的header和frm类名
                        var header = "wnd-normal-header" ;
                        var frm = "wnd-normal-frm" ;
                        if($.rcu.conststr.tag.alert == param.tag)
                        {
                            header = "wnd-alert-header" ;
                        }
                        param.header = header ;
                        param.frm = frm ;
                        
                        //根据tag计算高度和宽度
                        var size = getWndSize(param.tag) ;
                        $.extend(true,param,size) ;
                        
                        var jContent = $("<div>");
                        jContent.rcuwnd_frame({"action":$.rcu.conststr.action.init,
                                                "param":param});
                        
                        var jTarget = $.window(
                        {
                            content: jContent.html(),
                            showFooter: false,
                            resizable: false,
                            maximizable: false,
                            scrollable: false,
                            width : param.w,
                            height: param.h,
                            headerClass:header,
                            frameClass:frm,
                            checkBoundary: true,
                            withinBrowserWindow: true,
                            createRandomOffset:{x:100,y:50},
                            onOpen: function(wnd){processUI_Open(wnd,param);},
                            onShow: function(wnd){processUI_Cascade(wnd,param);},
                            onCascade: function(wnd){processUI_Cascade(wnd,param);},
                            afterCascade: function(wnd){processUI_Cascade(wnd,param);},
                            afterMinimize: function(wnd){processUI_Min(wnd,param);},
                            onSelect: function(wnd)
                            {
                                if(!!wnd)
                                {
                                    var zidx = wnd.attr("z-index");
                                    wnd.attr("z-index",zidx + 100);
                                }
                            },
                            onClose: function(wnd){
                                if(!!wnd)
                                {
                                    $.rcu.get(param.tag).close() ;
                                }
                            }
                        });
                        
                        extCommWndFunc(jTarget);
                        
                        return jTarget ;
                        break;
                }
            }
        }
        return null ;
    };
    
    $.rcuwnd_login = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    var param = opt.param || {};
                    //根据tag计算高度和宽度
                    var size = getWndSize(param.tag) ;
                    $.extend(true,param,size) ;
                    
                    var jContent = $("<div>");
                    jContent.rcuwnd_frame({"action":$.rcu.conststr.action.init,
                                             "param":param});
                    
                    var jTarget = $.window(
                    {
                        content: jContent.html(),
                        showFooter: false,
                        resizable: false,
                        minimizable: false,
                        maximizable: false,
                        scrollable: false,
                        draggable: false,
                        closable: false,
                        showModal: true,
                        modalOpacity: 0.7,
                        width :param.w,
                        height: param.h,
                        headerClass:"wnd-login-header",
                        frameClass:"wnd-login-frm",
                        onOpen: function(wnd){ processUI_Open(wnd,param);},
                        onShow: function(wnd){processUI_Cascade(wnd,param);}
                    });
                    extCommWndFunc(jTarget);
                    
                    liveWndEvent();
                    
                    return jTarget ;
                    break;
            }
        }
        return null ;
    };
    
    $.fn.rcuwnd_frame = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    var param = opt.param ;
                    var tag = param.tag ;
                    var w = param.w ;
                    var h = param.h2 ;
                    var left = param.left ;
                    var bottom = param.bottom ;
                    //frame下第一层table
                    var jTable = $("<table class='wnd-rcu-table'>");
                    var tabWidth = w - 2 * left ;
                    var tabHeight = h - bottom ;
                    jTable.width(tabWidth)
                          .height(tabHeight)
                          .css("table-layout","fixed")
                          .css("margin-left",left)
                          .css("margin-right",left);
                    this.append(jTable);
                    var jTBody = $("<tbody>");
                    jTable.append(jTBody);
                    var jTr = $("<tr>");
                    jTBody.append(jTr);
                    jRTd = $("<td>");
                    var rightWidth = tabWidth ;
                    switch(tag)
                    {
                        case $.rcu.conststr.tag.login:
                        case $.rcu.conststr.tag.user_add:
                        case $.rcu.conststr.tag.user_del:
                        case $.rcu.conststr.tag.user_chgpass:
                        case $.rcu.conststr.tag.user_chglevel:
                        case $.rcu.conststr.tag.search_complex:
                        case $.rcu.conststr.tag.rooms_add:
                        case $.rcu.conststr.tag.rooms_merge:
                        case $.rcu.conststr.tag.rooms_rename:
                        case $.rcu.conststr.tag.rooms_order:
                        case $.rcu.conststr.tag.config_poll:
                        case $.rcu.conststr.tag.config_opera:
                        case $.rcu.conststr.tag.config_alert:
                        case $.rcu.conststr.tag.config_mode:
                            jRTd.css("width","100%")
                                .css("height","100%");
                            jTr.append(jRTd);
                            break;
                        case $.rcu.conststr.tag.cmd_poll:
                        case $.rcu.conststr.tag.cmd_card_delay:
                        case $.rcu.conststr.tag.cmd_door_clock:
                        case $.rcu.conststr.tag.cmd_light_ctrl:
                        case $.rcu.conststr.tag.cmd_air_ctrl:
                        case $.rcu.conststr.tag.cmd_temp_ctrl:
                        case $.rcu.conststr.tag.cmd_mode_set:
                        case $.rcu.conststr.tag.cmd_day_set:
                        case $.rcu.conststr.tag.cmd_night_set:
                        case $.rcu.conststr.tag.cmd_wind_set:
                        case $.rcu.conststr.tag.cmd_temp_comp:
                        case $.rcu.conststr.tag.cmd_waiter_ctrl:
                        case $.rcu.conststr.tag.cmd_in_set:
                        case $.rcu.conststr.tag.cmd_geotherm_set:
                        case $.rcu.conststr.tag.cmd_link_set:
                            var jTdIndex = $("<td class='wnd-rcu-index'>");
                            var indexWidth = $.rcu.get("common").getIndexDispParam().wrp.width ;
                            jTdIndex.css("width",indexWidth)
                                    .css("height","100%");
                            jTr.append(jTdIndex);
                            rightWidth = tabWidth - indexWidth ;
                            jRTd.css("width",rightWidth)
                                .css("height","100%");
                            jTr.append(jRTd);
                            
                            jTdIndex.rcuwnd_frame_index(tabHeight);
                            break;
                        case $.rcu.conststr.tag.mo_layout:
                            var jTdToolbar = $("<td class='wnd-rcu-toolbar'>");
                            var indexWidth = 150 ;
                            jTdToolbar.css("width",indexWidth)
                                    .css("height","100%");
                            jTr.append(jTdToolbar);
                            rightWidth = $.rcu.get("common").getBodyDispParam().screen.width - indexWidth ;
                            jRTd.css("width",rightWidth)
                                .css("height","100%");
                            jTr.append(jRTd);
                            
                            jTdToolbar.rcuwnd_frame_toolbar(tag,tabHeight);
                            break;
                        case $.rcu.conststr.tag.mo_temp:
                            var jTdToolbar = $("<td class='wnd-rcu-toolbar'>");
                            var indexWidth = 220 ;
                            jTdToolbar.css("width",indexWidth)
                                    .css("height","100%");
                            jTr.append(jTdToolbar);
                            rightWidth = $.rcu.get("common").getBodyDispParam().screen.width - indexWidth ;
                            jRTd.css("width",rightWidth)
                                .css("height","100%");
                            jTr.append(jRTd);
                            
                            jTdToolbar.rcuwnd_frame_toolbar(tag,tabHeight);
                            break;
                    }
                    //右侧内嵌Table
                    var jRTable = $("<table width='100%' height='100%'>");
                    jRTable.css("width","100%")
                           .css("height","100%")
                           .css("table-layout","fixed");
                    jRTd.append(jRTable);
                    var jRTBody = $("<tbody>");
                    jRTable.append(jRTBody);
                    var jRTrTop = $("<tr>");
                    jRTBody.append(jRTrTop);
                    var jRTrBottom = $("<tr>");
                    jRTBody.append(jRTrBottom);
                    var btnOKSize = $.rcu.conststr.size.wnd.btn_ok ;
                    var submitHeight = btnOKSize[1] + 16;
                    var formHeight = tabHeight - submitHeight;
                    var jTdForm = $("<td class='wnd-rcu-form'>");
                    switch(tag)
                    {
                        case $.rcu.conststr.tag.login:
                        case $.rcu.conststr.tag.user_add:
                        case $.rcu.conststr.tag.user_del:
                        case $.rcu.conststr.tag.user_chgpass:
                        case $.rcu.conststr.tag.user_chglevel:
                        case $.rcu.conststr.tag.cmd_poll:
                        case $.rcu.conststr.tag.cmd_air_ctrl:
                        case $.rcu.conststr.tag.cmd_card_delay:
                        case $.rcu.conststr.tag.cmd_door_clock:
                        case $.rcu.conststr.tag.cmd_temp_ctrl:
                        case $.rcu.conststr.tag.cmd_mode_set:
                        case $.rcu.conststr.tag.cmd_wind_set:
                        case $.rcu.conststr.tag.cmd_temp_comp:
                        case $.rcu.conststr.tag.cmd_waiter_ctrl:
                        case $.rcu.conststr.tag.cmd_in_set:
                        case $.rcu.conststr.tag.cmd_geotherm_set:
                        case $.rcu.conststr.tag.cmd_link_set:
                            jTdForm.addClass('wnd-rcu-form-common');
                            break;
                        case $.rcu.conststr.tag.rooms_add:
                            jTdForm.addClass('wnd-rcu-form-rooms-add');
                            break;
                        case $.rcu.conststr.tag.rooms_merge:
                            jTdForm.addClass('wnd-rcu-form-rooms-merge');
                            break;
                        case $.rcu.conststr.tag.rooms_rename:
                            jTdForm.addClass('wnd-rcu-form-rooms-rename');
                            break;
                        case $.rcu.conststr.tag.search_complex:
                            jTdForm.addClass('wnd-rcu-form-search');
                            break;
                        case $.rcu.conststr.tag.config_poll:
                        case $.rcu.conststr.tag.config_opera:
                        case $.rcu.conststr.tag.config_alert:
                        case $.rcu.conststr.tag.config_mode:
                            jTdForm.addClass('wnd-rcu-form-config');
                            break;
                        case $.rcu.conststr.tag.cmd_light_ctrl:
                        case $.rcu.conststr.tag.cmd_day_set:
                        case $.rcu.conststr.tag.cmd_night_set:
                            jTdForm.addClass('wnd-rcu-form-light');
                            break;
                        case $.rcu.conststr.tag.mo_layout:
                            jTdForm.addClass('wnd-rcu-form-layout');
                            break;
                        case $.rcu.conststr.tag.mo_layout:
                            jTdForm.addClass('wnd-rcu-form-temp');
                            break;
                    }
                    jTdForm.css("height",formHeight + "px");
                    jRTrTop.append(jTdForm);
                    var jTdSubmit = $("<td class='wnd-rcu-submit'>");
                    jTdSubmit.css("height",submitHeight + "px");
                    jRTrBottom.append(jTdSubmit);
                    
                    switch(tag)
                    {
                        case $.rcu.conststr.tag.login:
                        case $.rcu.conststr.tag.user_add:
                        case $.rcu.conststr.tag.user_del:
                        case $.rcu.conststr.tag.user_chgpass:
                        case $.rcu.conststr.tag.user_chglevel:
                        case $.rcu.conststr.tag.rooms_add:
                        case $.rcu.conststr.tag.rooms_merge:
                        case $.rcu.conststr.tag.rooms_rename:
                        case $.rcu.conststr.tag.rooms_order:
                        case $.rcu.conststr.tag.cmd_poll:
                        case $.rcu.conststr.tag.cmd_air_ctrl:
                        case $.rcu.conststr.tag.cmd_card_delay:
                        case $.rcu.conststr.tag.cmd_door_clock:
                        case $.rcu.conststr.tag.cmd_temp_ctrl:
                        case $.rcu.conststr.tag.cmd_mode_set:
                        case $.rcu.conststr.tag.cmd_wind_set:
                        case $.rcu.conststr.tag.cmd_temp_comp:
                        case $.rcu.conststr.tag.cmd_waiter_ctrl:
                        case $.rcu.conststr.tag.cmd_in_set:
                        case $.rcu.conststr.tag.cmd_light_ctrl:
                        case $.rcu.conststr.tag.cmd_day_set:
                        case $.rcu.conststr.tag.cmd_night_set:
                        case $.rcu.conststr.tag.cmd_geotherm_set:
                        case $.rcu.conststr.tag.cmd_link_set:
                        case $.rcu.conststr.tag.search_complex:
                        case $.rcu.conststr.tag.config_poll:
                        case $.rcu.conststr.tag.config_opera:
                        case $.rcu.conststr.tag.config_alert:
                        case $.rcu.conststr.tag.config_mode:
                            jTdForm.rcuwnd_frame_form(tag,formHeight);
                            break;
                        case $.rcu.conststr.tag.mo_layout:
                            jTdForm.rcuwnd_frame_layout(rightWidth,formHeight);
                            break;
                        case $.rcu.conststr.tag.mo_temp:
                            jTdForm.rcuwnd_frame_temp(rightWidth,formHeight);
                            break;
                    }
                    jTdSubmit.rcuwnd_frame_submit(rightWidth);
                    
                    break;
            }
        }
        return this;
        
    };
    
    $.fn.rcuwnd_frame_index = function(tabHeight)
    {
        this.css("vertical-align","top");
        var jDivWrp = $("<div>");
        var width = Math.ceil($.rcu.get("common").getIndexDispParam().wrp.width * 0.9) ;
        var left = Math.floor(width * 0.05) ;
        var height = Math.ceil(tabHeight * 0.92) ;
        var top = Math.floor(tabHeight * 0.04) ;
        jDivWrp.css("width",width)
               .css("height",height)
               .css("margin-left",left)
               .css("margin-top",top)
               .css("overflow","auto")
               .css("background-color","white");
        this.append(jDivWrp);
        return this;
    };
    
    $.fn.rcuwnd_frame_toolbar = function(type,tabHeight)
    {
        this.css("vertical-align","top");
        var jDivWrp = $("<div>");
        jDivWrp.css("width","100%")
               .css("height","100%")
               .css("margin-top","5%")
               .css("margin-bottom","5%")
               .css("padding","0px 0px 0px 0px")
               .css("margin","0px 0px 0px 0px")
               .css("overflow","auto")
               .css("border","1px solid #aaaaaa")
               .css("border-radius","4px"); 
        this.append(jDivWrp);
        
        switch(type)
        {
            case $.rcu.conststr.tag.mo_layout:
                jDivWrp.append("<div class='rcu-layout-item rcu-layout-item-off' id='light-bulb-add'>增加灯泡</div>");
                jDivWrp.append("<div class='rcu-layout-item rcu-layout-item-off' id='light-bulb-del'>删除灯泡</div>");
                jDivWrp.append("<div class='rcu-layout-item rcu-layout-item-off' id='light-bulb-move'>移动灯泡</div>");
                jDivWrp.append("<div class='rcu-layout-item rcu-layout-item-off' id='light-band-add'>增加灯带</div>");
                jDivWrp.append("<div class='rcu-layout-item rcu-layout-item-off' id='light-band-del'>删除灯带</div>");
                //jDivWrp.append("<div class='rcu-layout-item rcu-layout-item-off' id='light-band-move'>移动灯带</div>");
                //jDivWrp.append("<div class='rcu-layout-item rcu-layout-item-off' id='light-edit'>编辑灯组</div>");
                break;
            case $.rcu.conststr.tag.mo_temp:
                var jLabel1 = $("<label>日期:</label>");
                var jInput1 = $("<input class='mo-temp-from' type='text' name='from'></input>");
                var jDiv1 = $("<div class='rcu-mo-temp-item'></div>");
                jDiv1.append(jLabel1);
                jDiv1.append(jInput1);
                jDivWrp.append(jDiv1);
                break;
        }
        
        return this;
    };
    
    $.fn.rcuwnd_frame_layout = function(w,h)
    {
        var jDivWrp = $("<div>");
        this.append(jDivWrp);
        jDivWrp.width(w)
            .height(h)
            .css("overflow","auto");
        var jImageDiv = $("<div class='rcu-layout-canvas'>");
        jDivWrp.append(jImageDiv);
    };
    
    $.fn.rcuwnd_frame_temp = function(w,h)
    {
        var jDivWrp = $("<div>");
        this.append(jDivWrp);
        jDivWrp.width(w)
            .height(h)
            .css("overflow","auto");
        var jImageDiv = $("<div class='rcu-temp-canvas'>");
        jDivWrp.append(jImageDiv);
        jImageDiv.width(800)
                 .height(600);
    };
    
    $.fn.rcuwnd_frame_form = function(tag,formHeight)
    {
        var jTable = $("<table>");
        var jTBody = $("<tbody>");
        jTable.css("width","100%");
        this.append(jTable);
        jTable.append(jTBody);
        switch(tag)
        {
        case $.rcu.conststr.tag.login:
            jTBody.rcuwnd_form_Login();
            break;
        case $.rcu.conststr.tag.user_add:
            jTBody.rcuwnd_form_UserAdd();
            break;
        case $.rcu.conststr.tag.user_del:
            jTBody.rcuwnd_form_UserDel();
            break;
        case $.rcu.conststr.tag.user_chgpass:
            jTBody.rcuwnd_form_ChgPass();
            break;
        case $.rcu.conststr.tag.user_chglevel:
            jTBody.rcuwnd_form_ChgLevel();
            break;
        case $.rcu.conststr.tag.rooms_add:
            jTBody.rcuwnd_form_RoomsAdd(formHeight);
            break;
        case $.rcu.conststr.tag.rooms_merge:
            jTBody.rcuwnd_form_RoomsMerge(formHeight);
            break;
        case $.rcu.conststr.tag.rooms_rename:
            jTBody.rcuwnd_form_RoomsRename();
            break;
        case $.rcu.conststr.tag.rooms_order:
            jTBody.rcuwnd_form_RoomsOrder();
            break;
        case $.rcu.conststr.tag.cmd_poll:
            jTBody.rcuwnd_form_CmdPoll(tag);
            break;
        case $.rcu.conststr.tag.cmd_card_delay:
            jTBody.rcuwnd_form_CmdCardDelay(tag);
            break;
        case $.rcu.conststr.tag.cmd_door_clock:
            jTBody.rcuwnd_form_CmdDoorClock(tag);
            break;
        case $.rcu.conststr.tag.cmd_light_ctrl:
            jTBody.rcuwnd_form_CmdLightCtrl(tag);
            break;
        case $.rcu.conststr.tag.cmd_air_ctrl:
            jTBody.rcuwnd_form_CmdAirCtrl(tag);
            break;
        case $.rcu.conststr.tag.cmd_temp_ctrl:
            jTBody.rcuwnd_form_CmdTempCtrl(tag);
            break;
        case $.rcu.conststr.tag.cmd_mode_set:
            jTBody.rcuwnd_form_CmdModeSet(tag);
            break;
        case $.rcu.conststr.tag.cmd_day_set:
            jTBody.rcuwnd_form_CmdDaySet(tag);
            break;
        case $.rcu.conststr.tag.cmd_night_set:
            jTBody.rcuwnd_form_CmdNightSet(tag);
            break;
        case $.rcu.conststr.tag.cmd_wind_set:
            jTBody.rcuwnd_form_CmdWindSet(tag);
            break;
        case $.rcu.conststr.tag.cmd_temp_comp:
            jTBody.rcuwnd_form_CmdTempComp(tag);
            break;
        case $.rcu.conststr.tag.cmd_waiter_ctrl:
            jTBody.rcuwnd_form_CmdWaiterCtrl(tag);
            break;
        case $.rcu.conststr.tag.cmd_in_set:
            jTBody.rcuwnd_form_CmdInSet(tag);
            break;
        case $.rcu.conststr.tag.cmd_geotherm_set:
            jTBody.rcuwnd_form_CmdGeothermSet(tag);
            break;
        case $.rcu.conststr.tag.cmd_link_set:
            jTBody.rcuwnd_form_CmdLinkSet(tag);
            break;
        case $.rcu.conststr.tag.mo_info:
            jTBody.rcuwnd_form_MoInfo(tag);
            break;
        case $.rcu.conststr.tag.mo_layout:
            jTBody.rcuwnd_form_MoLayout(tag);
            break;
        case $.rcu.conststr.tag.mo_temp:
            jTBody.rcuwnd_form_MoTemp(tag);
            break;
        case $.rcu.conststr.tag.mo_log:
            jTBody.rcuwnd_form_MoLog(tag);
            break;
        case $.rcu.conststr.tag.mo_set:
            jTBody.rcuwnd_form_MoSet(tag);
            break;
        case $.rcu.conststr.tag.search_complex:
            jTBody.rcuwnd_form_SearchComplex();
            break;
        case $.rcu.conststr.tag.config_poll:
            jTBody.rcuwnd_form_ConfigPoll();
            break;
        case $.rcu.conststr.tag.config_opera:
            jTBody.rcuwnd_form_ConfigOpera();
            break;
        case $.rcu.conststr.tag.config_alert:
            jTBody.rcuwnd_form_ConfigAlert();
            break;
        case $.rcu.conststr.tag.config_mode:
            jTBody.rcuwnd_form_ConfigMode();
            break;
        }
        
        jTBody.rcuwnd_form_error({"action":$.rcu.conststr.action.init});
        
        return this;
    };
    
    $.fn.rcuwnd_frame_submit = function(tabWidth)
    {
        //计算Btn的位置
        var btnSize = $.rcu.conststr.size.wnd.btn_ok ;
        var left = Math.floor((tabWidth - btnSize[0]) / 2) ;
        var jBtn = $("<div class='wnd-rcu-btn'>");
        jBtn.unbind("click");
        jBtn.width(btnSize[0])
            .height(btnSize[1])
            .css("padding", "0px 0px 0px 0px")
            .css("margin-left",left)
            .css("line-height",btnSize[1] + "px")
            .css("overflow","hidden")
            .css("font-famuly","SimSun, arial, sans-serif")
            .css("font-size","30px")
            .css("font-weight","900")
            .css("color","#006699")
            .css("text-align","center")
            .css("vertical-align","middle")
            .css("white-space","nowrap")
            .css("text-overflow","ellipsis")
            .text("确定");
        this.append(jBtn);
        return this;
    };
    
    
    $.rcuwnd_common = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.notify:
                    var param = opt.param ;
                    var type = param.type ;
                    var jInst = param.inst ;
                    if("reset" == type )
                    {
                        var jFrm = jInst.getFrame() ;
                        jFrm.find("input[readonly!='readonly']").val("");
                        jFrm.find("option").removeAttr("selected");
                        jFrm.find("select option:first").attr("selected","selected");
                        jFrm.find("span.wnd-rcu-err").text("");
                        jFrm.find(".wnd-rcu-err").hide();
                    }
                    break;
            }
        }
        return null ;
    };
    $.fn.rcuwnd_form_error = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    var jTrError = $("<tr>");
                    this.append(jTrError);
                    
                    //Error
                    var jTdErrorLabel = $("<td>");
                    var jTdErrorContent = $("<td>");
                    jTrError.append(jTdErrorLabel);
                    jTrError.append(jTdErrorContent);
                    var jErrorLabel = $("<label class='wnd-rcu-err'>");
                    var jErrorContent = $("<span class='wnd-rcu-err'>");
                    jTdErrorLabel.append(jErrorLabel);
                    jTdErrorContent.append(jErrorContent);
                    jErrorLabel.text("错误信息:");
                    jErrorLabel.hide();
                    jErrorContent.hide();
                    break;
                case $.rcu.conststr.action.chg:
                    var param = opt.param ;
                    var type = param.type ;
                    if("error" == type)
                    {
                        var info = param.info ;
                        var jLabel = this.find("label.wnd-rcu-err");
                        var jContent = this.find("span.wnd-rcu-err");
                        jContent.text(info);
                        jLabel.show();
                        jContent.show();
                    }
                    break;
            }
        }
        
        return this;
    };
    
    $.fn.rcuwnd_form_Login = function()
    {
        var jTrUsername = $("<tr>");
        var jTrPass = $("<tr>");
        this.append(jTrUsername);
        this.append(jTrPass);
        
        //Username
        var jTdUsernameLabel = $("<td>");
        var jTdUsernameContent = $("<td>");
        jTrUsername.append(jTdUsernameLabel);
        jTrUsername.append(jTdUsernameContent);
        var jUsernameLabel = $("<label>");
        var jUsernameContent = $("<input type='text' name='username'>");
        jTdUsernameLabel.append(jUsernameLabel);
        jTdUsernameContent.append(jUsernameContent);
        jUsernameLabel.text("用户名:");
        //Pass
        var jTdPassLabel = $("<td>");
        var jTdPassContent = $("<td>");
        jTrPass.append(jTdPassLabel);
        jTrPass.append(jTdPassContent);
        var jPassLabel = $("<label>");
        var jPassContent = $("<input type='password' name='password'>");
        jTdPassLabel.append(jPassLabel);
        jTdPassContent.append(jPassContent);
        jPassLabel.text("密码:");
        
        return this;
    };
    
    $.fn.rcuwnd_form_UserAdd = function()
    {
        var jTrUsername = $("<tr>");
        var jTrLevel = $("<tr>");
        var jTrPass1 = $("<tr>");
        var jTrPass2 = $("<tr>");
        this.append(jTrUsername);
        this.append(jTrLevel);
        this.append(jTrPass1);
        this.append(jTrPass2);
        
        //Username
        var jTdUsernameLabel = $("<td>");
        var jTdUsernameContent = $("<td>");
        jTrUsername.append(jTdUsernameLabel);
        jTrUsername.append(jTdUsernameContent);
        var jUsernameLabel = $("<label>");
        var jUsernameContent = $("<input type='text' name='username'>");
        jTdUsernameLabel.append(jUsernameLabel);
        jTdUsernameContent.append(jUsernameContent);
        jUsernameLabel.text("用户名:");
        //Level
        var jTdLevelLabel = $("<td>");
        var jTdLevelContent = $("<td>");
        jTrLevel.append(jTdLevelLabel);
        jTrLevel.append(jTdLevelContent);
        var jLevelLabel = $("<label>");
        var jLevelContent = $("<select name='level'>");
        jLevelContent.rcuselect_level({"action":$.rcu.conststr.action.init,
                     "param":{"level":$.rcu.get("login").getUserLevel()}});
        jTdLevelLabel.append(jLevelLabel);
        jTdLevelContent.append(jLevelContent);
        jLevelLabel.text("用户级别:");
        //Pass1
        var jTdPass1Label = $("<td>");
        var jTdPass1Content = $("<td>");
        jTrPass1.append(jTdPass1Label);
        jTrPass1.append(jTdPass1Content);
        var jPass1Label = $("<label>");
        var jPass1Content = $("<input type='password' name='password1'>");
        jTdPass1Label.append(jPass1Label);
        jTdPass1Content.append(jPass1Content);
        jPass1Label.text("密码:");
        //Pass2
        var jTdPass2Label = $("<td>");
        var jTdPass2Content = $("<td>");
        jTrPass2.append(jTdPass2Label);
        jTrPass2.append(jTdPass2Content);
        var jPass2Label = $("<label>");
        var jPass2Content = $("<input type='password' name='password2'>");
        jTdPass2Label.append(jPass2Label);
        jTdPass2Content.append(jPass2Content);
        jPass2Label.text("密码确认:");
        return this;
    };
    
    $.fn.rcuwnd_form_UserDel = function()
    {
        var jTrUsername = $("<tr>");
        var jTrLevel = $("<tr>");
        this.append(jTrUsername);
        this.append(jTrLevel);
        
        //Username
        var jTdUsernameLabel = $("<td>");
        var jTdUsernameContent = $("<td>");
        jTrUsername.append(jTdUsernameLabel);
        jTrUsername.append(jTdUsernameContent);
        var jUsernameLabel = $("<label>");
        var jUsernameContent = $("<select name='username' class='wnd-rcu-select'>");
        jTdUsernameLabel.append(jUsernameLabel);
        jTdUsernameContent.append(jUsernameContent);
        jUsernameContent.rcuselect_usercoll({"action":$.rcu.conststr.action.init,
            "param":{"level":$.rcu.get("login").getUserLevel()}});
        jUsernameLabel.text("用户名:");
        //Level
        var jTdLevelLabel = $("<td>");
        var jTdLevelContent = $("<td>"); 
        jTrLevel.append(jTdLevelLabel);
        jTrLevel.append(jTdLevelContent);
        var jLevelLabel = $("<label>");
        var jLevelContent = $("<input type='text' readonly='readonly' name='level'>");
        jTdLevelLabel.append(jLevelLabel);
        jTdLevelContent.append(jLevelContent);
        jLevelLabel.text("用户级别:");
        return this;
    };
    
    $.fn.rcuwnd_form_ChgPass = function()
    {
        var jTrUsername = $("<tr>");
        var jTrOldPass = $("<tr>");
        var jTrPass1 = $("<tr>");
        var jTrPass2 = $("<tr>");
        this.append(jTrUsername);
        this.append(jTrOldPass);
        this.append(jTrPass1);
        this.append(jTrPass2);
        
        //Username
        var jTdUsernameLabel = $("<td>");
        var jTdUsernameContent = $("<td>");
        jTrUsername.append(jTdUsernameLabel);
        jTrUsername.append(jTdUsernameContent);
        var jUsernameLabel = $("<label>");
        var jUsernameContent = $("<input type='text' readonly='readonly' name='username'>");
        jTdUsernameLabel.append(jUsernameLabel);
        jTdUsernameContent.append(jUsernameContent);
        jUsernameLabel.text("用户名:");
        //OldPass
        var jTdOldPassLabel = $("<td>");
        var jTdOldPassContent = $("<td>");
        jTrOldPass.append(jTdOldPassLabel);
        jTrOldPass.append(jTdOldPassContent);
        var jOldPassLabel = $("<label>");
        var jOldPassContent = $("<input type='password' name='oldpass'>");
        jTdOldPassLabel.append(jOldPassLabel);
        jTdOldPassContent.append(jOldPassContent);
        jOldPassLabel.text("旧密码:");
        //Pass1
        var jTdPass1Label = $("<td>");
        var jTdPass1Content = $("<td>");
        jTrPass1.append(jTdPass1Label);
        jTrPass1.append(jTdPass1Content);
        var jPass1Label = $("<label>");
        var jPass2Content = $("<input type='password' name='newpass1'>");
        jTdPass1Label.append(jPass1Label);
        jTdPass1Content.append(jPass2Content);
        jPass1Label.text("新密码:");
        //Pass2
        var jTdPass2Label = $("<td>");
        var jTdPass2Content = $("<td>");
        jTrPass2.append(jTdPass2Label);
        jTrPass2.append(jTdPass2Content);
        var jPass2Label = $("<label>");
        var jPass2Content = $("<input type='password' name='newpass2'>");
        jTdPass2Label.append(jPass2Label);
        jTdPass2Content.append(jPass2Content);
        jPass2Label.text("新密码确认:");
        return this;
    };
    
    $.fn.rcuwnd_form_ChgLevel = function()
    {
        var jTrUsername = $("<tr>");
        var jTrOldLevel = $("<tr>");
        var jTrNewLevel = $("<tr>");
        this.append(jTrUsername);
        this.append(jTrOldLevel);
        this.append(jTrNewLevel);
        
        //Username
        var jTdUsernameLabel = $("<td>");
        var jTdUsernameContent = $("<td>");
        jTrUsername.append(jTdUsernameLabel);
        jTrUsername.append(jTdUsernameContent);
        var jUsernameLabel = $("<label>");
        var jUsernameContent = $("<select class='wnd-rcu-select' name='username'>");
        jUsernameContent.rcuselect_usercoll({"action":$.rcu.conststr.action.init,
            "param":{"level":$.rcu.get("login").getUserLevel()}});
        jTdUsernameLabel.append(jUsernameLabel);
        jTdUsernameContent.append(jUsernameContent);
        jUsernameLabel.text("用户名:");
        //OldOldLevel
        var jTdOldLevelLabel = $("<td>");
        var jTdOldLevelContent = $("<td>");
        jTrOldLevel.append(jTdOldLevelLabel);
        jTrOldLevel.append(jTdOldLevelContent);
        var jOldLevelLabel = $("<label>");
        var jOldLevelContent = $("<input type='text' readonly='readonly' name='oldlevel'>");
        jTdOldLevelLabel.append(jOldLevelLabel);
        jTdOldLevelContent.append(jOldLevelContent);
        jOldLevelLabel.text("修改前级别:");
        //NewOldLevel
        var jTdNewLevelLabel = $("<td>");
        var jTdNewLevelContent = $("<td>");
        jTrNewLevel.append(jTdNewLevelLabel);
        jTrNewLevel.append(jTdNewLevelContent);
        var jNewLevelLabel = $("<label>");
        var jNewLevelContent = $("<select name='newlevel'>");
        jNewLevelContent.rcuselect_level({"action":$.rcu.conststr.action.init,
                     "param":{"level":$.rcu.get("login").getUserLevel()}});
        jTdNewLevelLabel.append(jNewLevelLabel);
        jTdNewLevelContent.append(jNewLevelContent);
        jNewLevelLabel.text("修改后级别:");
        return this;
    };
    
    $.fn.rcuwnd_form_RoomsAdd = function(formHeight)
    {
        var jTrTitle = $("<tr>");
        var jTrTree = $("<tr>");
        this.append(jTrTitle);
        this.append(jTrTree);
        
        var jTdTitle1 = $("<td>");
        var jTdTitle2 = $("<td>");
        jTrTitle.append(jTdTitle1);
        jTrTitle.append(jTdTitle2);
        jTdTitle1.text("选择-删除房间");
        jTdTitle2.text("选择-恢复房间");
        
        var jTdTree1 = $("<td class='rcu-wnd-index-yes'>");
        var jTdTree2 = $("<td class='rcu-wnd-index-no'>");
        var indexWidth = $.rcu.get("common").getIndexDispParam().wrp.width ;
        var indexHeight = 0.9 * formHeight ;
        jTdTree1.css("width",indexWidth)
                .css("height",indexHeight);
        jTdTree2.css("width",indexWidth)
                .css("height",indexHeight);
        jTdTree1.rcuwnd_frame_index(indexHeight);
        jTdTree2.rcuwnd_frame_index(indexHeight);
        jTrTree.append(jTdTree1);
        jTrTree.append(jTdTree2);
        
        return this;
    };
    
    $.fn.rcuwnd_form_RoomsMerge = function(formHeight)
    {
        var jTrTitle = $("<tr>");
        var jTrTree = $("<tr>");
        this.append(jTrTitle);
        this.append(jTrTree);
        
        var jTdTitle1 = $("<td>");
        var jTdTitle2 = $("<td>");
        jTrTitle.append(jTdTitle1);
        jTrTitle.append(jTdTitle2);
        jTdTitle1.text("已连通房间");
        jTdTitle2.text("未连通房间");
        
        var jTdTree1 = $("<td class='rcu-wnd-index-yes'>");
        var jTdTree2 = $("<td class='rcu-wnd-index-no'>");
        var indexWidth = $.rcu.get("common").getIndexDispParam().wrp.width ;
        var indexHeight = 0.9 * formHeight ;
        jTdTree1.css("width",indexWidth)
                .css("height",indexHeight);
        jTdTree2.css("width",indexWidth)
                .css("height",indexHeight);
        jTdTree1.rcuwnd_frame_index(indexHeight);
        jTdTree2.rcuwnd_frame_index(indexHeight);
        jTrTree.append(jTdTree1);
        jTrTree.append(jTdTree2);
        
        return this;
    };
    
    $.fn.rcuwnd_form_RoomsRename = function()
    {
        var jTrWrp = $("<tr>");
        this.append(jTrWrp);
        
        var jTdWrp = $("<td colspan='2'>");
        jTrWrp.append(jTdWrp);
        
        var jDiv = $("<div id='rename_cnt'>");
        jDiv.rcutable_grid({"action":$.rcu.conststr.action.init , "name":$.rcu.conststr.tag.rooms_rename});
        jTdWrp.append(jDiv);
        
        return this;
    };
    
    $.fn.rcuwnd_form_RoomsOrder = function()
    {
        return this;
    };
    
    $.fn.rcuwnd_form_SearchComplex = function()
    {
        var jTrUnit = $("<tr>");
        this.append(jTrUnit);
        var jTdUnit = $("<td colspan='3'>");
        jTrUnit.append(jTdUnit);
        var jDivUnit = $("<div class='search_unit'>");
        jTdUnit.append(jDivUnit);
        jDivUnit.rcusearch_unit({"action":$.rcu.conststr.action.init});//一个搜索单元
        return this;
    };
    
    $.fn.rcuwnd_form_ConfigPoll = function()
    {
        var jTrPollState = $("<tr>");
        this.append(jTrPollState);
        
        //PollState
        var jTdPollStateLabel = $("<td>");
        var jTdPollStateContent = $("<td>");
        jTrPollState.append(jTdPollStateLabel);
        jTrPollState.append(jTdPollStateContent);
        var jPollStateLabel = $("<label>");
        var jPollStateContent = $("<select class='wnd-rcu-select' name='pollstate'>");
        jPollStateContent.rcuselect_configitems({"action":$.rcu.conststr.action.init,
                                                "name":$.rcu.conststr.tag.config_poll});
        jTdPollStateLabel.append(jPollStateLabel);
        jTdPollStateContent.append(jPollStateContent);
        jPollStateLabel.text("轮询状态:");
        
        return this;
    };
    
    $.fn.rcuwnd_form_ConfigOpera = function()
    {
        var jTrOperaState = $("<tr>");
        this.append(jTrOperaState);
        
        //OperaState
        var jTdOperaStateLabel = $("<td>");
        var jTdOperaStateContent = $("<td>");
        jTrOperaState.append(jTdOperaStateLabel);
        jTrOperaState.append(jTdOperaStateContent);
        var jOperaStateLabel = $("<label>");
        var jOperaStateContent = $("<select class='wnd-rcu-select' name='operastate'>");
        jOperaStateContent.rcuselect_configitems({"action":$.rcu.conststr.action.init,
                                                  "name":$.rcu.conststr.tag.config_opera});
        jTdOperaStateLabel.append(jOperaStateLabel);
        jTdOperaStateContent.append(jOperaStateContent);
        jOperaStateLabel.text("Op状态:");
        
        return this;
    };
    
    $.fn.rcuwnd_form_ConfigAlert = function()
    {
        //MinTemp
        var jTrMinTemp = $("<tr>");
        this.append(jTrMinTemp);
        var jTdMinTempLabel = $("<td>");
        var jTdMinTempContent = $("<td>");
        jTrMinTemp.append(jTdMinTempLabel);
        jTrMinTemp.append(jTdMinTempContent);
        var jMinTempLabel = $("<label>");
        var jMinTempContent = $("<select class='wnd-rcu-select' name='mintemp'>");
        jMinTempContent.rcuselect_configitems({"action":$.rcu.conststr.action.init,
                                                  "name":"config_min_temp"});
        jTdMinTempLabel.append(jMinTempLabel);
        jTdMinTempContent.append(jMinTempContent);
        jMinTempLabel.text("报警温度下限:");
        
        //MaxTemp
        var jTrMaxTemp = $("<tr>");
        this.append(jTrMaxTemp);
        var jTdMaxTempLabel = $("<td>");
        var jTdMaxTempContent = $("<td>");
        jTrMaxTemp.append(jTdMaxTempLabel);
        jTrMaxTemp.append(jTdMaxTempContent);
        var jMaxTempLabel = $("<label>");
        var jMaxTempContent = $("<select class='wnd-rcu-select' name='maxtemp'>");
        jMaxTempContent.rcuselect_configitems({"action":$.rcu.conststr.action.init,
                                                  "name":"config_max_temp"});
        jTdMaxTempLabel.append(jMaxTempLabel);
        jTdMaxTempContent.append(jMaxTempContent);
        jMaxTempLabel.text("报警温度上限:");
        
        return this;
    };
    
    $.fn.rcuwnd_form_ConfigMode = function()
    {
        //Day
        var jTrDay = $("<tr>");
        this.append(jTrDay);
        var jTdDayLabel = $("<td>");
        var jTdDayContent = $("<td>");
        jTrDay.append(jTdDayLabel);
        jTrDay.append(jTdDayContent);
        var jDayLabel = $("<label>");
        var jDayContent = $("<select class='wnd-rcu-select' name='daymode'>");
        jDayContent.rcuselect_configitems({"action":$.rcu.conststr.action.init,
                                                  "name":"config_day"});
        jTdDayLabel.append(jDayLabel);
        jTdDayContent.append(jDayContent);
        jDayLabel.text("白天模式时间:");
        
        //Night
        var jTrNight = $("<tr>");
        this.append(jTrNight);
        var jTdNightLabel = $("<td>");
        var jTdNightContent = $("<td>");
        jTrNight.append(jTdNightLabel);
        jTrNight.append(jTdNightContent);
        var jNightLabel = $("<label>");
        var jNightContent = $("<select class='wnd-rcu-select' name='nightmode'>");
        jNightContent.rcuselect_configitems({"action":$.rcu.conststr.action.init,
                                                  "name":"config_night"});
        jTdNightLabel.append(jNightLabel);
        jTdNightContent.append(jNightContent);
        jNightLabel.text("夜晚模式时间:");
        
        return this;
    };
    
    $.fn.rcuwnd_form_CmdPoll = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdCardDelay = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdDoorClock = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdLightCtrl = function(tag)
    {
        createLightCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdAirCtrl = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdTempCtrl = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdModeSet = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdDaySet = function(tag)
    {
        createLightCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdNightSet = function(tag)
    {
        createLightCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdWindSet = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdTempComp = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };

    $.fn.rcuwnd_form_CmdWaiterCtrl = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdInSet = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdGeothermSet = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_CmdLinkSet = function(tag)
    {
        createCommonCmd(tag,this);
        return this;
    };
    
    $.fn.rcuwnd_form_MoInfo = function(tag)
    {
        return this;
    };
    
    $.fn.rcuwnd_form_MoLayout = function(tag)
    {
        return this;
    };
    
    $.fn.rcuwnd_form_MoTemp = function(tag)
    {
        return this;
    };
    
    $.fn.rcuwnd_form_MoLog = function(tag)
    {
        return this;
    };
    
    $.fn.rcuwnd_form_MoSet = function(tag)
    {
        return this;
    };
    
/**
 * 内部处理函数
 */
    function respOK(event)
    {
        var jTarget = $(event.currentTarget);
        var jContainer = jTarget.parents(".window_panel");
        var name = jContainer.attr("name");
        switch(name)
        {
        case $.rcu.conststr.tag.login:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.user_add:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.user_del:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.user_chgpass:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.user_chglevel:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_poll:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_card_delay:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_door_clock:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_light_ctrl:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_air_ctrl:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_temp_ctrl:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_mode_set:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_day_set:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_night_set:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_wind_set:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_temp_comp:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_waiter_ctrl:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_in_set:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_geotherm_set:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.cmd_link_set:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.mo_info:
            break;
        case $.rcu.conststr.tag.mo_layout:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.mo_temp:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.mo_log:
            break;
        case $.rcu.conststr.tag.mo_set:
            break;
        case $.rcu.conststr.tag.search_complex:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.rooms_add:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.rooms_merge:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.config_poll:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.config_opera:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.config_alert:
            $.rcu.get(name).submit(event);
            break;
        case $.rcu.conststr.tag.config_mode:
            $.rcu.get(name).submit(event);
            break;
        }
        return false;
    }
    
    function respRenameOK(event)
    {
        var jTarget = $(event.currentTarget);
        var jContainer = jTarget.parents(".window_panel");
        var name = jContainer.attr("name");
        switch(name)
        {
            case $.rcu.conststr.tag.rooms_rename:
                $.rcu.get(name).submit(event);
                break;
        }
        return false;
    }
    
    
    function respChg(event)
    {
        var jTarget = $(event.currentTarget);
        var jContainer = jTarget.parents(".window_panel");
        var name = jContainer.attr("name");
        switch(name)
        {
        case $.rcu.conststr.tag.login:
            break;
        case $.rcu.conststr.tag.user_add:
            break;
        case $.rcu.conststr.tag.user_del:
            $.rcu.get(name).change(event);
            break;
        case $.rcu.conststr.tag.user_chgpass:
            break;
        case $.rcu.conststr.tag.user_chglevel:
            $.rcu.get(name).change(event);
            break;
        case $.rcu.conststr.tag.cmd_poll:
            break;
        case $.rcu.conststr.tag.cmd_card_delay:
            break;
        case $.rcu.conststr.tag.cmd_door_clock:
            break;
        case $.rcu.conststr.tag.cmd_light_ctrl:
            $.rcu.get(name).change(event);
            break;
        case $.rcu.conststr.tag.cmd_air_ctrl:
            break;
        case $.rcu.conststr.tag.cmd_temp_ctrl:
            break;
        case $.rcu.conststr.tag.cmd_mode_set:
            break;
        case $.rcu.conststr.tag.cmd_day_set:
            break;
        case $.rcu.conststr.tag.cmd_night_set:
            break;
        case $.rcu.conststr.tag.cmd_wind_set:
            break;
        case $.rcu.conststr.tag.cmd_temp_comp:
            break;
        case $.rcu.conststr.tag.cmd_waiter_ctrl:
            break;
        case $.rcu.conststr.tag.cmd_in_set:
            break;
        case $.rcu.conststr.tag.cmd_geotherm_set:
            $.rcu.get(name).change(event);
            break;
        case $.rcu.conststr.tag.cmd_link_set:
            break;
        case $.rcu.conststr.tag.search_complex:
            $.rcu.get(name).change(event);
            break;
        }
        return false;
    }
    
    function extMoLayoutWndFunc(wnd)
    {
        var jFrm = wnd.getFrame();
        jFrm.getToolbar = function(){
            var jToolbar = jFrm.find(".wnd-rcu-toolbar").children("div");
            return jToolbar ;
        };
        jFrm.getLayout = function(){
            var jLayout = jFrm.find(".wnd-rcu-form-layout").children("div").children("div");
            return jLayout ;
        };
        jFrm.getSubmit = function(){
            var jSubmit = jFrm.find(".wnd-rcu-submit").children("div");
            return jSubmit ;
        };
    }
    
    function extMoTempWndFunc(wnd)
    {
        var jFrm = wnd.getFrame();
        jFrm.getToolbar = function(){
            var jToolbar = jFrm.find(".wnd-rcu-toolbar").children("div");
            return jToolbar ;
        };
        jFrm.getLayout = function(){
            var jLayout = jFrm.find(".wnd-rcu-form-temp").children("div").children("div");
            return jLayout ;
        };
        jFrm.getSubmit = function(){
            var jSubmit = jFrm.find(".wnd-rcu-submit").children("div");
            return jSubmit ;
        };
    }
    
    function extCommWndFunc(wnd)
    {
        var jFrm = wnd.getFrame();
        jFrm.getIndex = function(){
            var jIndex = jFrm.find(".wnd-rcu-index").children("div");
            return jIndex ;
        };
        jFrm.getForm = function(){
            var jForm = jFrm.find(".wnd-rcu-form").children("table").children("tbody");
            return jForm ;
        };
        jFrm.getSubmit = function(){
            var jSubmit = jFrm.find(".wnd-rcu-submit").children("div");
            return jSubmit ;
        };
    }
    
    function liveWndEvent()
    {
        $(".wnd-rcu-btn").die("click");
        $(".wnd-rcu-select").die("change");
        $(".wnd-rcu-btn").live("click",respOK);
        $(".wnd-rcu-select").live("change",respChg);
        $(".wnd-rcu-rename-ok").live("click",respRenameOK);
    }
    
    function processUI_Open(wnd,opt)
    {
        if(!!wnd)
        {
            var jContainter = wnd.getContainer();
            jContainter.css("background-color","transparent")
                       .css("border-style","none")
                       .css("padding","0px 0px 0px 0px")
                       .attr("name",opt.tag);
        }
    }
    
    function processUI_Max(wnd,opt,dspTitle)
    {
        if(!!wnd)
        {
            var w = wnd.getFrame().width();
            var h1 = opt.h1 ;
            var h2 = opt.h2 ;
            var title = opt.title ;
            var jHeader = wnd.getHeader();
            var jHeadIcon = jHeader.children(".wnd-rcu-icon");
            var jHeadTxt = jHeader.children(".window_title_text");
            var jHeadBar = jHeader.children(".window_function_bar");
            //做一些预处理
            jHeader.unbind("mouseenter")
                   .unbind("mouseleave");
            if(!jHeader.hasClass(opt.header))
            {
                jHeader.addClass(opt.header);
            }
            if(jHeader.hasClass("ui-widget-header"))
            {
                jHeader.removeClass("ui-widget-header");
            }
            jHeader.width("100%")
                   .height(h1)
                   .css("background-color","transparent")
                   .css("border-style","none")
                   .css("margin","0px 0px 0px 0px")
                   .css("padding","0px 0px 0px 0px")
                   .bind("mouseenter",function(){
                       jHeadBar.show();
                   })
                   .bind("mouseleave",function(){
                       jHeadBar.hide();
                   });
            if(dspTitle)
            {
                var txtWidth = w * 0.75 ;
                var txtLeft = (w - txtWidth) / 2 ;
                jHeadTxt.width(txtWidth)
                        .height(h1)
                        .css("position","static")
                        .css("left","0px")
                        .css("top","0px")
                        .css("margin","0px 0px 0px " + txtLeft + "px")
                        .css("overflow","hidden")
                        .css("font-famuly","SimSun, arial, sans-serif")
                        .css("font-size","30px")
                        .css("font-weight","900")
                        .css("color","#006699")
                        .css("text-align","center")
                        .css("line-height",h1 + "px") 
                        .css("vertical-align","middle") ;
                jHeadTxt.text(title);
            }
            if(!!jHeadIcon)
            {
                jHeadIcon.hide();
            }
            if(!!jHeadBar)
            {
                jHeadBar.hide();
            }
        }
    };
    
    function processUI_Cascade(wnd,opt)
    {
        if(!!wnd)
        {
            var w = opt.w ;
            var h1 = opt.h1 ;
            var h2 = opt.h2 ;
            var title = opt.title ;
            var jHeader = wnd.getHeader();
            var jHeadIcon = jHeader.children(".wnd-rcu-icon");
            var jHeadTxt = jHeader.children(".window_title_text");
            var jHeadBar = jHeader.children(".window_function_bar");
            //做一些预处理
            jHeader.unbind("mouseenter")
                   .unbind("mouseleave");
            if(!jHeader.hasClass(opt.header))
            {
                jHeader.addClass(opt.header);
            }
            if(jHeader.hasClass("ui-widget-header"))
            {
                jHeader.removeClass("ui-widget-header");
            }
            jHeader.width(w)
                   .height(h1)
                   .css("background-color","transparent")
                   .css("border-style","none")
                   .css("margin","0px 0px 0px 0px")
                   .css("padding","0px 0px 0px 0px")
                   .bind("mouseenter",function(){
                       jHeadBar.show();
                   })
                   .bind("mouseleave",function(){
                       jHeadBar.hide();
                   });
            var txtWidth = w * 0.75 ;
            var txtLeft = (w - txtWidth) / 2 ;
            jHeadTxt.width(txtWidth)
                    .height(h1)
                    .css("position","static")
                    .css("left","0px")
                    .css("top","0px")
                    .css("margin","0px 0px 0px " + txtLeft + "px")
                    .css("overflow","hidden")
                    .css("font-famuly","SimSun, arial, sans-serif")
                    .css("font-size","30px")
                    .css("font-weight","900")
                    .css("color","#006699")
                    .css("text-align","center")
                    .css("line-height",h1 + "px") 
                    .css("vertical-align","middle") ;
            jHeadTxt.text(title);
            if(!!jHeadIcon)
            {
                jHeadIcon.hide();
            }
            if(!!jHeadBar)
            {
                jHeadBar.hide();
            }
            var jFrm = wnd.getFrame();
            jFrm.removeClass("ui-widget-content")
                   .width(w)
                   .height(h2)
                   .css("background-color","transparent")
                   .css("border-style","none")
                   .css("margin","0px 0px 0px 0px")
                   .css("padding","0px 0px 0px 0px")
                   .css("border-bottom-right-radius",12)
                   .css("border-bottom-left-radius",12);
        }
    };
    
    function processUI_Min(wnd,opt)
    {
        if(!!wnd)
        {
            var jHeader = wnd.getHeader();
            var jHeadIcon = jHeader.children(".wnd-rcu-icon");
            var jHeadTxt = jHeader.children(".window_title_text");
            var jHeadBar = jHeader.children(".window_function_bar");
            if(!!jHeadIcon)
            {
                jHeadIcon = $("<div>");
                jHeadIcon.addClass("wnd-rcu-icon");
                jHeader.prepend(jHeadIcon);
            }
            //做一些预处理
            jHeader.unbind("mouseenter")
                   .unbind("mouseleave");
            if(jHeader.hasClass(opt.header))
            {
                jHeader.removeClass(opt.header);
            }
            jHeadIcon.show();
            var dockParam = $.rcu.get("common").getDockDispParam();
            var headerParam = dockParam.header ;
            var iconParam = dockParam.icon ;
            var textParam = dockParam.text ;
            var font = $.rcu.get("common").getBodyDispParam().font;
            jHeader.height(headerParam.height);
                   //.css("border","1px solid #222222")
            jHeadIcon.width(iconParam.width)
                     .height(iconParam.height)
                     .css("background-image",opt.icon)
                     .css("background-size","contain")
                     .css("background-repeat","no-repeat")
                     .css("float","left")
                     .css("margin",iconParam.top + "px 0px 0px " + iconParam.left + "px");
            jHeadTxt.width(textParam.width)
                    .height(textParam.height)
                    .css("float","left")
                    .css("margin",textParam.top + "px 0px 0px " + textParam.left + "px")
                    .css("font-size",font.size + "px")
                    .css("font-weight","normal")
                    .css("color","#222222")
                    .css("text-align","left")
                    .css("line-height", + font.height + "px") 
                    .css("white-space","nowrap")
                    .css("text-overflow","ellipsis")
                    .text(opt.title);
            jHeadBar.hide();
        }
    };
    
    function getWndSize(name)
    {
        var w = 0 ;
        var h1 = 0;
        var h2 = 0;
        var h = 0 ;
        var left = 0 ;
        var bottom = 0 ;
        switch(name)
        {
        case $.rcu.conststr.tag.login:
        case $.rcu.conststr.tag.user_add:
        case $.rcu.conststr.tag.user_del:
        case $.rcu.conststr.tag.user_chgpass:
        case $.rcu.conststr.tag.user_chglevel:
        case $.rcu.conststr.tag.search_complex:
        case $.rcu.conststr.tag.config_poll:
        case $.rcu.conststr.tag.config_opera:
        case $.rcu.conststr.tag.config_alert:
        case $.rcu.conststr.tag.config_mode:
            w = 450 ;
            h1 = 57 ;//title高度
            h2 = w * 311/433 ;//frame高度
            h2 = Math.ceil(h2);
            h = h1 + h2 ;
            left = Math.ceil(w * 7 / 446) ;
            bottom = Math.ceil(w * 16 / 326) ;
            break;
        case $.rcu.conststr.tag.rooms_add:
        case $.rcu.conststr.tag.rooms_merge:
        case $.rcu.conststr.tag.rooms_rename:
        case $.rcu.conststr.tag.rooms_order:
        case $.rcu.conststr.tag.cmd_poll:
        case $.rcu.conststr.tag.cmd_card_delay:
        case $.rcu.conststr.tag.cmd_door_clock:
        case $.rcu.conststr.tag.cmd_light_ctrl:
        case $.rcu.conststr.tag.cmd_air_ctrl:
        case $.rcu.conststr.tag.cmd_temp_ctrl:
        case $.rcu.conststr.tag.cmd_mode_set:
        case $.rcu.conststr.tag.cmd_day_set:
        case $.rcu.conststr.tag.cmd_night_set:
        case $.rcu.conststr.tag.cmd_wind_set:
        case $.rcu.conststr.tag.cmd_temp_comp:
        case $.rcu.conststr.tag.cmd_waiter_ctrl:
        case $.rcu.conststr.tag.cmd_in_set:
        case $.rcu.conststr.tag.cmd_geotherm_set:
        case $.rcu.conststr.tag.cmd_link_set:
            w = 600 ;
            h1 = 57 ;//title高度
            h2 = w * 311/433 ;//frame高度
            h2 = Math.ceil(h2);
            h = h1 + h2 ;
            left = Math.ceil(w * 7 / 446) ;
            bottom = Math.ceil(w * 16 / 326) ;
            break;
        case $.rcu.conststr.tag.mo_info:
        case $.rcu.conststr.tag.mo_layout:
        case $.rcu.conststr.tag.mo_temp:
        case $.rcu.conststr.tag.mo_log:
        case $.rcu.conststr.tag.mo_set:
            var wndInfo = $.rcu.get("common").getBodyDispParam().wnd;
            var gap = $.rcu.get("common").getBodyDispParam().gap;
            w = wndInfo.ContentWidth ;
            h1 = 57 ;//title高度
            h = wndInfo.ContentHeight ;
            h2 = h - h1 ;
            left = gap.x ;
            bottom = gap.y ;
            break;
        case $.rcu.conststr.tag.alert:
            w = 600 ;
            h1 = 57 ;//title高度
            h2 = w * 311/433 ;//frame高度
            h2 = Math.ceil(h2);
            h = h1 + h2 ;
            left = Math.ceil(w * 7 / 446) ;
            bottom = Math.ceil(w * 16 / 326) ;
            break;
        }
        return {"w":w,"h":h,"h1":h1,"h2":h2,"left":left,"bottom":bottom} ;
    }
    
    function createCommonCmd(name,jInst)
    {
        var cname = name ;
        var cinfo = $.rcu.get("common").getCmdInfo(cname) ;
        var items = cinfo.item ;
        for(var i = 0; i < items.length ; ++i)
        {
            var item = items[i];
            var jTr = $("<tr>");
            jInst.append(jTr);
            var jTd1 = $("<td>");
            var jTd2 = $("<td>");
            jTr.append(jTd1);
            jTr.append(jTd2);
            var jLabel = $("<label>");
            var jSel = $("<select class='wnd-rcu-select'>");
            jTd1.append(jLabel);
            jTd2.append(jSel);
            jSel.attr("name",item.name);
            jLabel.text(item.desc + ":");
            for(var n = 0; n < item.data.length; ++n)
            {
                var jOpt = $("<option>");
                var data = item.data[n];
                jOpt.attr("value",data.value)
                    .text(data.desc);
                jSel.append(jOpt);
            }
        }
    }
    
    function createLightCmd(name,jInst)
    {
        var cname = name ;
        var cinfo = $.rcu.get("common").getCmdInfo(cname) ;
        var items = cinfo.item ;
        for(var i = 0; i < items.length ; ++i)
        {
            var item = items[i];
            if(i % 3 == 0)
            {
                var jTr = $("<tr>");
                jInst.append(jTr);
            }
            var jTd1 = $("<td>");
            var jTd2 = $("<td>");
            jTr.append(jTd1);
            jTr.append(jTd2);
            var jLabel = $("<label>");
            var jSel = $("<select class='wnd-rcu-select'>");
            jTd1.append(jLabel);
            jTd2.append(jSel);
            jSel.attr("name",item.name);
            jLabel.text(item.desc + ":");
            for(var n = 0; n < item.data.length; ++n)
            {
                var jOpt = $("<option>");
                var data = item.data[n];
                jOpt.attr("value",data.value)
                    .text(data.desc);
                jSel.append(jOpt);
            }
        }
    }
    
})(jQuery);
