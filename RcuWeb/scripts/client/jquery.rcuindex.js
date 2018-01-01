(function($){
    $.fn.rcuindex = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    var jAccWrp = $("<div>");
                    this.append(jAccWrp);
                    
                    jAccWrp.append("<h3><a href='#'>房间索引</a></h3>");
                    jAccWrp.append("<div>");
                    //TODO 暂时没有内容
                    /*
                    for(var i = 0; i < $.rcu.conststr.index.count ; ++i)
                    {
                        jAccWrp.append("<h3><a href='#'>自定义索引" + (i + 1 ) + "</a></h3>");
                        jAccWrp.append("<div>");
                    }
                    */
                    
                    jAccWrp.accordion(
                    {
                        "fillSpace": true
                    });
                    
                    break;
            }
        }
        return this;
        
    };
    
    $.fn.rcutree = function(data,opt)
    {
        this.children().remove();
        /**
         * data is like this:[a,b,c...]
         * a is {floor:1,rooms:[101,102,103...]}
         */
        /**
         * ===================================================================
         * id tree
         */
        /**
         * Hotel UL
         *  expandable +
         *  collapsable lastCollapsable -
         */
        var iconParam = $.rcu.get("common").getIndexDispParam().icon ;
        var chkParam = $.rcu.get("common").getIndexDispParam().chk ;
        var textParam = $.rcu.get("common").getIndexDispParam().text ;
        
        var fontSize = $.rcu.get("common").getBodyDispParam().font.size;
        var iconWidth = iconParam.width ;
        var iconHeight = iconParam.height ;
        var textWidth = textParam.width ;
        var textHeight = textParam.height ;
        var chkWidth = chkParam.width ;
        var chkHeight = chkParam.height ;
        
        var jUlRoot = $("<ul>");
        var check = eval(opt.flag.check) ;
        var menu = eval(opt.flag.menu) ;
        jUlRoot.addClass("rcu-tree-root");
        /**
         * Hotel Li(只有1个)
         */
        var jLiHotel = $("<li>");
        jLiHotel.attr("id","rcu-tree-root-0");
        jUlRoot.append(jLiHotel);
        /**
         * Hotel span
         */
        var jSpanHotel = $("<span class='rcu-tree-outer'>");
        jLiHotel.append(jSpanHotel);
        if(check)
        {
            /**
             * Hotel checkbox
             */
            var jChkHotel = $("<input type='checkbox'></input>");
            jChkHotel.addClass("rcu-tree-root");
            jSpanHotel.append(jChkHotel);
        }
        /**
         * Hotel text
         */
        var jHotelText = $("<div class='rcu-tree-inner'>");
        jHotelText.text("全部房间");
        jSpanHotel.append(jHotelText);
        /**
         * Floor UL
         */
        var jUlFloor = $("<ul>");
        jUlFloor.addClass("rcu-tree-floor");
        jLiHotel.append(jUlFloor);
        for(var i = 0; i < data.length ; ++i)
        {
            /**
             * Floor Li(共有data.length个)
             */
            var jLiFloor = $("<li>");
            var floorStr = data[i]["floor"];
            jLiFloor.unbind("click");
            jLiFloor.unbind("dblclick");
            jLiFloor.addClass("closed") 
                    .attr("id","rcu-tree-floor-" + floorStr)
                    .val(floorStr);
            if(menu)
            {
                jLiFloor.unbind("click");
                jLiFloor.unbind("dblclick");
                jLiFloor.bind("click",respFloorClick)
                        .bind("dblclick",respFloorDbclick);//TODO 暂时 双击增加tab，以后要改为，右键弹出menu
            }
            jUlFloor.append(jLiFloor);
            var jSpanFloor = $("<span class='rcu-tree-outer'>");
            jLiFloor.append(jSpanFloor);
            if(check)
            {
                /**
                 * Floor checkbox
                 */
                var jChkFloor = $("<input type='checkbox'></input>");
                jChkFloor.attr("id","rcu-tree-floor-" + floorStr)
                         .addClass("rcu-tree-floor");
                jSpanFloor.append(jChkFloor);
            }
            /**
             * Floor text
             */
            var jFloorText = $("<div class='rcu-tree-inner'>");
            jFloorText.text("第" + floorStr + "层");
            jSpanFloor.append(jFloorText);
            /**
             * Room UL
             */
            var jUlRoom = $("<ul>");
            jUlRoom.addClass("rcu-tree-room");
            jLiFloor.append(jUlRoom);
            for(var j = 0; j < data[i]["rooms"].length ; ++j)
            {
                for(var k = 0; k < data[i]["rooms"][j]["ids"].length; ++k)
                {
                    /**
                     * Room Li(共有data[i]["rooms"].length * data[i]["rooms"]["ids"].length个)
                     */
                    var roomname = data[i]["rooms"][j]["name"];
                    var roomid = data[i]["rooms"][j]["ids"][k];
                    var jLiRoom = $("<li>");
                    jLiRoom.attr("id","rcu-tree-room-" +  roomid)
                           .attr("name",roomname);
                    jUlRoom.append(jLiRoom);
                    var jSpanRoom = $("<span class='rcu-tree-outer'>");
                    jLiRoom.append(jSpanRoom);
                    if(check)
                    {
                        /**
                         * Room checkbox
                         */
                        var jChkRoom = $("<input type='checkbox'></input>");
                        jChkRoom.attr("id","rcu-tree-room-" + roomid)
                                .attr("name",roomname)
                                .addClass("rcu-tree-room");
                        jSpanRoom.append(jChkRoom);
                    }
                    /**
                     * Room text
                     */
                    var jRoomText = $("<div class='rcu-tree-inner'>");
                    jRoomText.text(roomname);
                    jSpanRoom.append(jRoomText);
                }
            }
        }
        jUlRoot.treeview({animated: "medium"});
        if(jLiHotel.hasClass("expandable"))
        {
            jLiHotel.removeClass("expandable");
            jLiHotel.addClass("collapsable");
        }
        if(jLiHotel.hasClass("lastExpandable"))
        {
            jLiHotel.removeClass("lastExpandable");
            jLiHotel.addClass("lastCollapsable");
        }
        this.append(jUlRoot);
        
        this.find("span.rcu-tree-outer")
                 .height(iconHeight)
                 .css("padding","0px 0px 0px 0px");
        
        var gapWidth = Math.ceil(fontSize / 2) ;
        var chkLeft = 0;
        var txtLeft = 0;
        if(check)
        {
            chkLeft = gapWidth + iconWidth ;
            txtLeft = gapWidth ;
        }
        else
        {
            txtLeft = gapWidth + iconWidth ;
        }
        
        this.find("div.rcu-tree-inner")
                 .height(textWidth)
                 .height(textHeight)
                 .css("font-size",fontSize)
                 .css("font-family","SimSun,arial,sans-serif")
                 .css("line-height",textHeight + "px")
                 .css("vertical-align","middle")
                 .css("text-align","left")
                 .css("overflow","hidden")
                 .css("padding","0px 0px 0px 0px")
                 .css("margin","0px  0px 0px " + txtLeft + "px")
                 .css("float","left");
        
        if(check)
        {
            this.find("input[type='checkbox']")
                     .width(chkWidth)
                     .height(chkHeight)
                     .css("padding","0px 0px 0px 0px")
                     .css("margin","0px 0px 0px " + chkLeft + "px")
                     .css("float","left");
            /**
             * 响应“选择房间”checkbox
             */
            this.find("input").bind('click',function(event){
                respRoomCheck(event);
            })
            .attr("flag","0");
        }
        
        return this ;
        
        function respFloorClick(event)
        {
            //TODO 要这样：chgMonitor切换没有完成之前，任何
            //tree上的其他item，都不可以响应click消息
            //doubleclick也是一样
            var jTarget = $(event.currentTarget);
            var floor = jTarget.val();
            //TODO 要加一个RcuMonitorMgr 在这里面加定位函数
            $("#rcu-frame-monitor").tabs( "select" , 0 );
            $.rcu.get("monitor").chgMonitor({"floor":floor});
            return false ;
        }
        
        function respFloorDbclick(event)
        {
            var jTarget = $(event.currentTarget);
            var floor = jTarget.val();
            $.rcu.get("monitor").addMonitor({"floor":floor});
            return false ;
        }
        
        function respRoomCheck(event)
        {
            var jChkBox = $(event.currentTarget);
            var jUlRoot = jChkBox.parents("ul.rcu-tree-root");
            var jInst = jUlRoot.parent("div");
            var jAllChkBox = jInst.find("input[type='checkbox']");
            if(jChkBox.attr("flag") == 2 )
            {
                jChkBox.attr("flag","0");
                if(jChkBox.hasClass("rcu-tree-root"))
                {
                    jInst.find("input").attr("flag","0");
                }
                else if(jChkBox.hasClass("rcu-tree-floor"))
                {
                    jChkBox.parent().next().children("li")
                           .children("span").children("input").attr("flag","0");
                }
            }
            else if(jChkBox.attr("flag") == 0 || jChkBox.attr("flag") == 1)
            {
                jChkBox.attr("flag","2");
                if(jChkBox.hasClass("rcu-tree-root"))
                {
                    jInst.find("input").attr("flag","2");
                }
                else if(jChkBox.hasClass("rcu-tree-floor"))
                {
                    jChkBox.parent().next().children("li")
                           .children("span").children("input").attr("flag","2");
                }
            }
            
            //check flag=1的情况
            var flag = -1 ;
            var jAllChkFloors = jAllChkBox.filter(".rcu-tree-floor");
            for(var i = 0; i < jAllChkFloors.length ;++i)
            {
                var jUlTemp = $(jAllChkFloors[i]).parent("span").next("ul");
                var len = jUlTemp.find("input.rcu-tree-room[flag='2']").length;
                if(len == 0)
                {
                    flag = 0 ;
                }
                else if(len > 0)
                {
                    flag = 1 ;
                }
                var len = jUlTemp.find("input.rcu-tree-room[flag='0']").length;
                if(len == 0)
                {
                    flag = 2 ;
                }
                $(jAllChkFloors[i]).attr("flag",flag);
            }
            
            var len1 = jUlRoot.find("input.rcu-tree-floor[flag='1']").length;
            var len2 = jUlRoot.find("input.rcu-tree-floor[flag='2']").length;
            len = len1 + len2 ;
            if(len == 0)
            {
                flag = 0 ;
            }
            else if(len > 0)
            {
                flag = 1 ;
            }
            len0 = jUlRoot.find("input.rcu-tree-floor[flag='0']").length;
            len = len0 + len1 ;
            if(len == 0)
            {
                flag = 2 ;
            }
            jUlRoot.find("input.rcu-tree-root").attr("flag",flag);
            
            var jChkColl = jAllChkBox.filter("[flag='2']");
            jChkColl.attr("checked","checked") ;
            jAllChkBox.filter("[flag='0']").removeAttr("checked") ;
            jAllChkBox.filter("[flag='1']").removeAttr("checked") ;
            /**
             * 如果没有check任何roomid，提交按钮无效，至少有一个roomid，提交按钮才有效
             */
            var hasCheck = null ;
            if(jChkColl.length > 0)
            {
                hasCheck = true ;
            }
            else
            {
                hasCheck = false ;
            }
            jInst.trigger("chkchg",hasCheck);
            
            return false;
        }
        
    };
    
    $.fn.rcutree_remove = function()
    {
        var jChkRoot = this.find("input[type='checkbox'][flag='2'].rcu-tree-root");
        if(jChkRoot.length > 0)
        {
            var jUlFloor = this.find("ul.rcu-tree-floor");
            jUlFloor.children().remove();
        }
        else
        {
            this.find("input[type='checkbox'][flag='2']").parent("span").parent("li").remove();
        }
        
        this.find("input[type='checkbox']").attr("flag","0");
        this.find("input[type='checkbox']").removeAttr("checked");
    };
    
    $.fn.rcutree_add = function(data,opt)
    {
      //TODO TEMP room name 唯一性限制或者让js也如同php代码一样，得到rooms->ids的关系
        var arr = $.rcu.get("index").getChkTree(this, false) ;
        this.data["idTree"] = arr ;
        
        if(!!this.data["idTree"])
        {
            for(var i = 0; i < data.length ; ++i)
            {
                var floor = data[i].floor ;
                var idx = getIndex(this.data["idTree"],floor);
                if(idx != -1)
                {
                    for(var j = 0; j < data[i].rooms.length ; ++j)
                    {
                        if(!hasRoom(this.data["idTree"][idx].rooms, data[i].rooms[j]["name"]))
                        {
                            this.data["idTree"][idx].rooms.push(data[i].rooms[j]);
                        }
                    }
                    this.data["idTree"][idx].rooms.sort();
                }
                else
                {
                    this.data["idTree"].push(data[i]);
                }
            }
        }
        else
        {
            this.data["idTree"] = data ;
        }
        
        this.data["idTree"].sort(sortFloor);
        this.rcutree(this.data["idTree"], opt);
        
        function getIndex(arr, floor)
        {
            for(var i = 0; i < arr.length ; ++i)
            {
                if(arr[i].floor == floor)
                {
                    return i ;
                }
            }
            return -1 ;
        }
        
        function hasRoom(arr, roomname)
        {
            for(var i = 0; i < arr.length ; ++i)
            {
                if(arr[i]['name'] == roomname)
                {
                    return true ;
                }
            }
            return false ;
        }
        
        function sortFloor(a, b)
        {
            return a.floor - b.floor ;
        }
    };
    
})(jQuery);
