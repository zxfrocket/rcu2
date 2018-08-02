(function($){
    $.fn.rcutable_frame = function(opt)
    {
        var action = opt.action;
        switch(action)
        {
        case $.rcu.conststr.action.init:
            jTbody = $("<tbody>");
            this.append(jTbody);
            jTr = $("<tr>");
            jTbody.append(jTr);
            jTr.append("<td class='rcu-td-frame' id='rcu-td-toolbar'>");
            jTr.append("<td class='rcu-td-frame' id='rcu-td-index'>");
            jTr.append("<td class='rcu-td-frame' id='rcu-td-monitor'>");
            jTr.append("<td class='rcu-td-frame' id='rcu-td-dock'>");
            this.css("padding","0px")
                .css("border-collapse","collapse")
                .css("border-spacing","0px");
            jTbody.css("padding","0px");
            jTr.css("padding","0px");
            jTr.children("td")
                   .css("vertical-align","top")
                   .css("padding","0px");
            break;
        case $.rcu.conststr.action.put:
            var jItem = opt.item ;
            var name = jItem.attr("name");
            var jCurTd = this.find("#rcu-td-" + name);
            jCurTd.append(jItem);
            break;
        }
        return this;
    };
    
    $.fn.rcutable_grid = function(opt)
    {
        var action = opt.action;
        switch(action)
        {
        case $.rcu.conststr.action.init:
            var name = opt.name ;
            var jMainTable = $("<table>");
            jMainTable.attr("id", name + "");
            this.append(jMainTable);
            
            break;
        case $.rcu.conststr.action.chg:
            var name = opt.name ;
            var aaData = opt.data;
            var bUpdate = opt.update ;
            
            if(bUpdate)
            {
                var tabInst = $(this).data("inst") ;
                if(!!tabInst)
                {
                    switch(name)
                    {
                        case $.rcu.conststr.tag.rooms_rename:
                            break;
                        case ($.rcu.conststr.tag.logview + "_0")://命令日志
                            //TODO 可能要分开处理日志，轮询的日志和命令的日志分开
                            /*var curData = tabInst.fnGetData();
                            if(aaData.length > curData.length && 
                               curData[0].toString() != aaData[0].toString())
                            {
                                var addData = getAddData(curData, aaData);
                                tabInst.fnAddData(addData);
                                tabInst.fnSort([[0,'desc']]);
                            }*/
                            tabInst.fnClearTable(false);
                            tabInst.fnAddData(aaData);
                            break;
                        case ($.rcu.conststr.tag.searchview + "_0")://结果1
                            tabInst.fnClearTable(false);
                            tabInst.fnAddData(aaData);
                            break;
                        case ($.rcu.conststr.tag.alertview + "_0")://异常报警
                            tabInst.fnClearTable(false);
                            var newAAData = getNewAAData(aaData);
                            tabInst.fnAddData(newAAData);
                            focusOnAlert(aaData);
                            bindAADataEvent();
                            break;
                    }
                }
            }
            else
            {
                var aoColumns = [] ;
                var aaSorting = [] ;
                switch(name)
                {
                    case $.rcu.conststr.tag.rooms_rename:
                        aoColumns = [{"sTitle": "房间ID"},{"sTitle": "房间名"},
                                     {"sTitle": "新房间名"},{"sTitle": ""}];
                        break;
                    case ($.rcu.conststr.tag.logview + "_0")://命令日志
                        aoColumns = [{"sTitle": "ID"},{"sTitle": "用户名"},{"sTitle": "类型"},
                                     {"sTitle": "时间"},{"sTitle": "数据"}];
                        aaSorting = [[ 0, "desc" ]];
                        break;
                    case ($.rcu.conststr.tag.searchview + "_0")://结果1
                    case ($.rcu.conststr.tag.alertview + "_0")://异常报警
                        //TODO 暂时先取前10个
                        aoColumns = $.rcu.get("common").getStateTitleArr().slice(0,11);
                        break;
                }
                var options = {
                        "oLanguage": 
                        {
                            "sUrl": "/third/DataTables/zh_ZH.txt"
                        },
                        "bFilter": true,
                        "bInfo": true,
                        "bLengthChange": true,
                        "bPaginate":true,
                        "aaSorting": [[ 0, "desc" ]],
                        "aoColumns" : aoColumns,
                        "aaData" : getNewAAData(aaData),
                        "bSort" : false,
                        "bAutoWidth": true
                    };
                var jMainTable = this.find("table");
                var tabInst = jMainTable.dataTable(options);
                $(this).data("inst",tabInst) ;
                bindAADataEvent();
            }
            
            break;
        }
        return this ;
        
        function getAddData(oldData,newData)
        {
            var dertLen = newData.length - oldData.length ;
            var retData = [];
            return newData.slice(0,dertLen);
        }

        function focusOnAlert(aaData) {
            var j2ndLi = $($('#rcu-td-monitor ul').children('li')[2]);
            if (!j2ndLi.hasClass('ui-state-active')) {
                for (var i = 0; i < aaData.length; ++i) {
                    if (aaData[i][10] === '有需求') {
                        j2ndLi.find('a').trigger('click');
                        break;
                    }
                }
            }
        }

        function getNewAAData(aaData) {
            var newAAData = JSON.parse(JSON.stringify(aaData));
            for(var i = 0; i < newAAData.length; ++i){
                newAAData[i][10] = aaData[i][10] + '<button class="rcu-waiter-alarm" id ="rcu-waiter-alarm-"' + aaData[i][0] + '>关</button>';
            }
            return newAAData;
        }

        function onClickWaiterAlarm(jEvent){
            console.log(jEvent);
        }

        function bindAADataEvent(){
            setTimeout( function delayBindAADataEvent(){
                $('.rcu-waiter-alarm')
                    .unbind('click')
                    .bind('click', onClickWaiterAlarm);
            }, 200);
        }

    };
    
})(jQuery);
