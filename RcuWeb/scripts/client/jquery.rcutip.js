(function($){
    $.fn.rcutip = function(opt)
    {
        this.createMocellTip = function(jElems)
        {
            this.qtip(
            {
                content: " ",//必须是空格，空还不行
                position: 
                {
                    container: this,
                    target: 'event',
                    effect: false,
                    at: "top center",
                    my: "bottom center"
                },
                show: 
                {
                    delay: 1000,
                    target: jElems,
                    solo: true
                },
                hide: 
                {
                    target: jElems
                },
                style: 
                {
                    classes: "ui-tooltip-shadow ui-tooltip-dark"
                },
                events: 
                {
                    show: function(event, api) 
                    {
                        var jTarget = $(event.originalEvent.target);
                        if(jTarget.length) 
                        {
                            //desc应该是RCU_PARA_DEFINE中para_desc的值
                            var roomid = jTarget.data("roomid");
                            var roomname = $.rcu.get("index").getRoomNameFromId(roomid);
                            var name = jTarget.attr("name");
                            var value = jTarget.val();
                            var desc = $.rcu.get('common').getStateDesc(name,value) ;
                            var meaning = $.rcu.get('common').getStateMeaning(name) ;
                            var info = meaning + ": " + desc;
                            var title = roomname + "房间"; 
                            api.set('content.title.text', title);
                            api.set('content.text', info);
                        }
                    }
                }
            });
            this.addClass("rcu-tips-wrp")
                .attr("id",type + "-tips");
        };
        
        this.createToolbarTip = function(jElems)
        {
            this.qtip(
            {
                content: " ",//必须是空格，空还不行
                position: 
                {
                    container: this,
                    target: 'event',
                    effect: false,
                    at: "top center",
                    my: "bottom center"
                },
                show: 
                {
                    delay: 1000,
                    target: jElems,
                    solo: true
                },
                hide: 
                {
                    target: jElems
                },
                style: 
                {
                    classes: "ui-tooltip-shadow ui-tooltip-dark"
                },
                events: 
                {
                    show: function(event, api) 
                    {
                        var jTarget = $(event.originalEvent.target);
                        if(jTarget.length) 
                        {
                            //desc应该是RCU_TOOLBAR_DEFINE中tool_desc的值
                            var name = jTarget.attr("name");
                            var desc = $.rcu.get('common').getToolbarDesc(name) ;
                            api.set('content.text', desc);
                        }
                    }
                }
            });
            this.addClass("rcu-tips-wrp")
                .attr("id",type + "-tips");
        };
        
        this.createToolItemTip = function(jElems)
        {
            this.qtip(
            {
                content: 
                {
                    text: " ",//必须是空格，空还不行
                    title:
                    {
                        text: " ",
                        button: true
                    }
                },
                position: 
                {
                    container: this,
                    target: 'event',
                    effect: false,
                    at: "right center",
                    my: "left center"
                },
                show: 
                {
                    delay: 0,
                    target: jElems,
                    event: 'click',
                    solo: true
                },
                hide: 
                {
                    hide: false
                },
                style: 
                {
                    classes: "ui-tooltip-shadow ui-tooltip-jtools"
                },
                events: 
                {
                    show: function(event, api) 
                    {
                        var jTarget = $(event.target);
                        var jOrgTarget = $(event.originalEvent.target);
                        var param = $.rcu.get("common").getToolItemDispParam();
                        if(jTarget.length) 
                        {
                            //desc应该是RCU_TOOLBAR_DEFINE中tool_desc的值
                            var name = jOrgTarget.attr("name");
                            var title = $.rcu.get('common').getToolbarDesc(name) ;
                            var items = jOrgTarget.data("items");
                            var jItemsWrp = $("<div>");//纯为了输出.html而建的
                            var len = items.length;
                            var hCount = Math.floor((len - 1) / 4) + 1 ;
                            var cellWidth = param.cell.width ;
                            var cellHeight = param.cell.height ;
                            var cellLeft = param.cell.left ;
                            var cellTop = param.cell.top ;
                            var cellRadius = param.cell.radius ;
                            var w = 4 * cellWidth + 5 * cellLeft ;
                            var h = hCount * cellHeight + (hCount + 1) * cellTop ;
                            jContent = jTarget.children(".ui-tooltip-content");
                            jContent.width(w)
                                    .height(h)
                                    .css("overflow","hidden")
                                    .css("padding","0px 0px 0px 0px")
                                    .css("margin","0px 0px 0px 0px");
                            for(var i = 0; i < len ; ++i)
                            {
                                var subName = items[i] ;
                                var subText = $.rcu.get('common').getToolItemDesc(name,subName) ;
                                var jCell = $("<div>");
                                jItemsWrp.append(jCell);
                                jCell.addClass("tool-items-cell")
                                     .attr("name",name + "_" + subName)
                                     .width(cellWidth)
                                     .height(cellHeight)
                                     .css("float","left")
                                     .css("overflow","hidden")
                                     .css("padding","0px 0px 0px 0px")
                                     .css("margin-top",cellTop + "px")
                                     .css("margin-left",cellLeft + "px")
                                     .css("border-radius",cellRadius);
                                hideCell(jCell, subName);
                                var jCellIcon = $("<div>");
                                var jCellText = $("<div>");
                                jCell.append(jCellIcon);
                                jCell.append(jCellText);
                                var iconWidth = param.icon.width ; 
                                var iconHeight = param.icon.height ; 
                                var iconLeft = param.icon.left ; 
                                var iconTop = param.icon.top ; 
                                jCellIcon.width(iconWidth)
                                         .height(iconHeight)
                                         .css("padding","0px 0px 0px 0px")
                                         .css("margin-top",iconTop + "px")
                                         .css("margin-left",iconLeft + "px");
                                var textWidth = param.text.width ; 
                                var textHeight = param.text.height ; 
                                var textLeft = param.text.left ; 
                                var textTop = param.text.top ; 
                                var font = $.rcu.get("common").getBodyDispParam().font ; 
                                jCellText.width(textWidth)
                                         .height(textHeight)
                                         .css("padding","0px 0px 0px 0px")
                                         .css("margin-top",textTop + "px")
                                         .css("margin-left",textLeft + "px")
                                         .css("line-height",font.height + "px")
                                         .css("vertical-align","middle")
                                         .css("text-align","center")
                                         .css("overflow","hidden")
                                         .css("font-famliy","SimSun,arial,sans-serif")
                                         .css("font-size",font.size)
                                         .text(subText);
                            }
                            api.set('content.title.text', title);
                            api.set('content.text', jItemsWrp.html());
                            $(".tool-items-cell").bind("click",respItemClick);
                        }
                    }
                }
            });
            this.addClass("rcu-tips-wrp")
                .attr("id",type + "-tips");
        };
        
        var action = opt.action ;
        var param = opt.param ;
        var type = param.type ;
        /**
         * 得到要显示tips的Elems集合
         */
        var jElems = null;
        switch(type)
        {
            case $.rcu.conststr.tiptype.mo_cell:
                jElems = $("div.mo-cell[name!='holder']");
                break;
            case $.rcu.conststr.tiptype.toolbar:
                jElems = $("div.tool-item-inner");
                break;
            case $.rcu.conststr.tiptype.toolitem:
                jElems = $("div.tool-has-items");
                break;
        }
        /**
         * 创建对应的tip对象
         */
        switch(action)
        {
        case $.rcu.conststr.action.init:
            switch(type)
            {
                case $.rcu.conststr.tiptype.mo_cell:
                    this.createMocellTip(jElems);
                    break;
                case $.rcu.conststr.tiptype.toolbar:
                    this.createToolbarTip(jElems);
                    break;
                case $.rcu.conststr.tiptype.toolitem:
                    this.createToolItemTip(jElems);
                    break;
            }
            break;
        case $.rcu.conststr.action.chg:
            switch(type)
            {
                case $.rcu.conststr.tiptype.mo_cell:
                    this.qtip('option', 'show.target', jElems); 
                    this.qtip('option', 'hide.target', jElems); 
                    break;
            }
            break;
        }
        return this ;

        function hideCell(jCell, subName) {
            //for waiter, only dispay alert window and waiter dock
            var userName = $.rcu.get("login").getUserName();
            if (userName === 'waiter' && subName !== 'waiter_ctrl') {
                jCell.css("visibility", "hidden");
            }
        }
        
        function respItemClick(event)
        {
            var jTarget = $(event.currentTarget);
            var name = jTarget.attr("name");
            var desc = jTarget.children("div").last().text();
            var icon = jTarget.children("div").first().css("background-image");
            //var href = location.href ;
            //icon = icon.replace('url("','').replace('")','').replace(href, "");
            //icon = location.pathname + icon ;
            jTarget.parents("div.qtip").first().qtip('api').hide();
            switch(name)
            {
                case "user_add":
                    $.rcu.get($.rcu.conststr.tag.user_add).open({"title":desc,"icon":icon});
                    break;
                case "user_del":
                    $.rcu.get($.rcu.conststr.tag.user_del).open({"title":desc,"icon":icon});
                    break;
                case "user_chgpass":
                    $.rcu.get($.rcu.conststr.tag.user_chgpass).open({"title":desc,"icon":icon});
                    break;
                case "user_chglevel":
                    $.rcu.get($.rcu.conststr.tag.user_chglevel).open({"title":desc,"icon":icon});
                    break;
                case "rooms_add":
                    $.rcu.get($.rcu.conststr.tag.rooms_add).open({"title":desc,"icon":icon});
                    break;
                case "rooms_merge":
                    $.rcu.get($.rcu.conststr.tag.rooms_merge).open({"title":desc,"icon":icon});
                    break;
                case "rooms_rename":
                    $.rcu.get($.rcu.conststr.tag.rooms_rename).open({"title":desc,"icon":icon});
                    break;
                case "rooms_order":
                    $.rcu.get($.rcu.conststr.tag.rooms_order).open({"title":desc,"icon":icon});
                    break;
                case "cmd_poll":
                    $.rcu.get($.rcu.conststr.tag.cmd_poll).open({"title":desc,"icon":icon});
                    break;
                case "cmd_card_delay":
                    $.rcu.get($.rcu.conststr.tag.cmd_card_delay).open({"title":desc,"icon":icon});
                    break;
                case "cmd_door_clock":
                    $.rcu.get($.rcu.conststr.tag.cmd_door_clock).open({"title":desc,"icon":icon});
                    break;
                case "cmd_light_ctrl":
                    $.rcu.get($.rcu.conststr.tag.cmd_light_ctrl).open({"title":desc,"icon":icon});
                    break;
                case "cmd_air_ctrl":
                    $.rcu.get($.rcu.conststr.tag.cmd_air_ctrl).open({"title":desc,"icon":icon});
                    break;
                case "cmd_temp_ctrl":
                    $.rcu.get($.rcu.conststr.tag.cmd_temp_ctrl).open({"title":desc,"icon":icon});
                    break;
                case "cmd_mode_set":
                    $.rcu.get($.rcu.conststr.tag.cmd_mode_set).open({"title":desc,"icon":icon});
                    break;
                case "cmd_day_set":
                    $.rcu.get($.rcu.conststr.tag.cmd_day_set).open({"title":desc,"icon":icon});
                    break;
                case "cmd_night_set":
                    $.rcu.get($.rcu.conststr.tag.cmd_night_set).open({"title":desc,"icon":icon});
                    break;
                case "cmd_wind_set":
                    $.rcu.get($.rcu.conststr.tag.cmd_wind_set).open({"title":desc,"icon":icon});
                    break;
                case "cmd_temp_comp":
                    $.rcu.get($.rcu.conststr.tag.cmd_temp_comp).open({"title":desc,"icon":icon});
                    break;
                case "cmd_waiter_ctrl":
                    $.rcu.get($.rcu.conststr.tag.cmd_waiter_ctrl).open({"title":desc,"icon":icon});
                    break;
                case "cmd_in_set":
                    $.rcu.get($.rcu.conststr.tag.cmd_in_set).open({"title":desc,"icon":icon});
                    break;
                case "cmd_geotherm_set":
                    $.rcu.get($.rcu.conststr.tag.cmd_geotherm_set).open({"title":desc,"icon":icon});
                    break;
                case "cmd_link_set":
                    $.rcu.get($.rcu.conststr.tag.cmd_link_set).open({"title":desc,"icon":icon});
                    break;
                case "search_complex":
                    $.rcu.get($.rcu.conststr.tag.search_complex).open({"title":desc,"icon":icon});
                    break;
                case "config_poll":
                    $.rcu.get($.rcu.conststr.tag.config_poll).open({"title":desc,"icon":icon});
                    break;
                case "config_opera":
                    $.rcu.get($.rcu.conststr.tag.config_opera).open({"title":desc,"icon":icon});
                    break;
                case "config_alert":
                    $.rcu.get($.rcu.conststr.tag.config_alert).open({"title":desc,"icon":icon});
                    break;
                case "config_mode":
                    $.rcu.get($.rcu.conststr.tag.config_mode).open({"title":desc,"icon":icon});
                    break;
                case "log_cmd":
                    //TODO 要加一个RcuMonitorMgr 在这里面加定位函数
                    $("#rcu-frame-monitor").tabs( "select" , 3 );
                    $.rcu.get($.rcu.conststr.tag.logview).chgMonitor({"logtype":0});
                    break;
                case "alert_temp":
                    //TODO 要加一个RcuMonitorMgr 在这里面加定位函数
                    $("#rcu-frame-monitor").tabs( "select" , 2 );
                    $.rcu.get($.rcu.conststr.tag.alertview).chgMonitor({"alerttype":0});
                    break;
            }
            return false;
        };
    };
    
})(jQuery);
