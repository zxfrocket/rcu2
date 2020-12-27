RcuMoTemp.prototype = new RcuWnd();
function RcuMoTemp(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuMoTemp._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTargets = [] ;
        this._jChart = [] ;
        this._rcuTagName = $.rcu.conststr.tag.mo_temp;
        this._index = 0 ;
/**
 * public method
 */
        RcuMoTemp.prototype.init = function (opt) 
        {
            
        };
        
        RcuMoTemp.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                case $.rcu.conststr.action.add:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuMoTemp.php";
                    var processClass = "RcuMoTemp";
                    $.extend(true, opt.param, {"index": this._index});
                    data = 
                       {
                            "options":
                            {
                                "requesInfo":
                                {
                                    "requireFile":requireFile,
                                    "procClass":processClass,
                                    "action":action
                                },
                                "param":opt.param
                            }
                        };
                    break;
            }
            
            /**
             * 调用父类send函数，发送ajax信息
             */
            var tmpopt = {"url":url, "data":data, "type":type};
            RcuMoTemp.prototype.baseSend = RcuWnd.prototype.send ;
            this.baseSend(tmpopt);
        };
        
        RcuMoTemp.prototype.submit = function (event)
        {
            var jTarget = $(event.currentTarget);
            var roomid = jTarget.parents(".window_panel").attr("roomid");
            
            var jFrom = $('#mo-temp-from-' + roomid);
            var str1 = jFrom.val() + " 00:00:00";
            var str2 = jFrom.val() + " 23:59:59";
            if(str1.search(/^\d\d\d\d\-\d\d\-\d\d\ \d\d\:\d\d\:\d\d$/) != -1 
            && str2.search(/^\d\d\d\d\-\d\d\-\d\d\ \d\d\:\d\d\:\d\d$/) != -1
            && str1 < str2)
            {
                var sendopt = {"action":$.rcu.conststr.action.add,"param":{"roomid":roomid,"from":str1, "to":str2}};
                this.send(sendopt);
            }
        };
        
        RcuMoTemp.prototype.change = function (event)
        {
        };
        
        RcuMoTemp.prototype.open = function (opt)
        {
            var roomid = opt.roomid ;
            this._index = opt.index ;
            
            this._jTargets[roomid] = {"target":null,"data":null} ;
            var jCurTarget = this._jTargets[roomid].target;
            var time1 = new Date();
            var time2 = new Date();
            var span1 = time1.getTime();
            var spanOneDay = 24 * 60 * 60 * 1000;
            var subSpan = span1 - spanOneDay ;
            time2.setTime(subSpan);
            var str1 = time1.Format("yyyy-MM-dd hh:mm:ss");
            var str2 = time2.Format("yyyy-MM-dd hh:mm:ss");
            var sendopt = {"action":$.rcu.conststr.action.chg,"param":{"roomid":roomid,"from":str1, "to":str2}};
            this.send(sendopt);
            if(!jCurTarget)
            {
                var title = opt.title ;
                var icon = opt.icon ;
                jCurTarget = $.rcuwnd_mownd(
                        {
                            "action":$.rcu.conststr.action.init,
                            "param":
                            {
                                "tag": this._rcuTagName,
                                "title": title,
                                "icon": icon,
                                "roomid": roomid
                            }
                        });
                this._jTargets[roomid].target = jCurTarget ;
            }
            else
            {
                if(jCurTarget.isMinimized())
                {
                    jCurTarget.restore();
                }
                else if(!jCurTarget.isSelected())
                {
                    jCurTarget.select();
                }
            }
            this._initState(opt) ;
        };
        
        RcuMoTemp.prototype.show = function (opt)
        {
            var roomid = opt.roomid ;
            var jCurTarget = this._jTargets[roomid].target;
            var data = jCurTarget.getFrame().data("chartData");
            if(!!data)
            {
                this.plotChart(roomid, data);
            }
        };
        
/**
 * protected method
 */        
        RcuMoTemp.prototype._initState = function (opt)
        {
            var roomid = opt.roomid ;
            var jCurTarget = this._jTargets[roomid].target;
            jCurTarget.getFrame().find(".rcu-temp-canvas").attr("id","rcu-temp-canvas-" + roomid);
            jCurTarget.getFrame().find(".mo-temp-from").attr("id","mo-temp-from-" + roomid);
            //TODO 要做成时间格式不对，那么不显示button
            //jCurTarget.getFrame().getSubmit().hide();
            
            $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
            //TODO 未来可能要做成datetimerpicker
            $('#mo-temp-from-' + roomid).datepicker({
                //showSecond: true,
                //timeFormat: 'hh:mm:ss',
                onClose: function(dateText, inst) 
                {
                    var endDateTextBox = $('#mo-temp-to-' + roomid);
                    if (endDateTextBox.val() != '') 
                    {
                        var testStartDate = new Date(dateText);
                        var testEndDate = new Date(endDateTextBox.val());
                        if (testStartDate > testEndDate)
                        {
                            endDateTextBox.val(dateText);
                        }
                    }
                    else 
                    {
                        endDateTextBox.val(dateText);
                    }
                },
                onSelect: function (selectedDateTime)
                {
                    var start = $(this).datetimepicker('getDate');
                    $('#mo-temp-to-' + roomid).datetimepicker('option', 'minDate', new Date(start.getTime()));
                }
            });
        };
        
/**
 * private method
 */
        RcuMoTemp.prototype._recvSucc = function (result)
        {
            var action = result.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    var flag = result.flag ;
                    if(flag)
                    {
                        var content = result.content;
                        var roomid = content.roomid ;
                        if(!!this._jTargets[roomid] )
                        {
                            var data = content.data ;
                            var jCurTarget = this._jTargets[roomid].target;
                            jCurTarget.getFrame().data("chartData",data);
                        }
                    }
                    break;
                case $.rcu.conststr.action.add:
                    var flag = result.flag ;
                    if(flag)
                    {
                        var content = result.content;
                        var roomid = content.roomid ;
                        if(!!this._jTargets[roomid] )
                        {
                            var data = content.data ;
                            this.plotChart(roomid, data);
                        }
                    }
                    break;
            }
        };
        
        RcuMoTemp.prototype._recvFail = function (result)
        {
        };
        
        RcuMoTemp.prototype.plotChart = function (roomid, data)
        {
            var id = "rcu-temp-canvas-" + roomid ;
            var title = roomid + "房间温度变化图";
            var arr1d = [];
            var arr2d = [];
            var ticks = [];
            for(var i = 0; i < data.length; ++i)
            {
                arr1d.push(parseInt(data[i].temp)) ;
                ticks.push(getPrecision(data[i].time));
            }
            arr2d.push(arr1d);
            var options = 
            { 
                title: 
                { 
                    text: title
                },
                seriesDefaults:
                {
                    renderer: $.jqplot.BarRenderer
                },
                axes: 
                {
                    xaxis:
                    {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks,
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions:
                        {
                            angle: -45
                        }
                    },
                    yaxis:
                    {
                        ticks: [0,5,10,15,20,25,30,35,40,45,50]
                    }
                },
                highlighter: 
                {
                    show: true,
                    showTooltip: true,
                    followMouse: false,
                    tooltipLocation: 'n',
                    tooltipAxes: 'y',
                    useAxesFormatters: false,
                    showMarker: false
                    
                },
                cursor: 
                {
                    show: false
                }
            };
            var oldPlot = this._jChart[roomid];
            if(!!oldPlot)
            {
                oldPlot.destroy();
            }
            $("#" + id).children().remove();
            var plot = $.jqplot(id, arr2d,options);
            this._jChart[roomid] = plot ;
            
            function getPrecision(time)
            {
                //time is 2010-10-12 13:50:00
                var real = time.substring(0,16);
                return real;
            }
        };
        
        RcuMoTemp._initialized = true;
    }
};
