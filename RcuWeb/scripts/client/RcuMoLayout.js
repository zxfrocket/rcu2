RcuMoLayout.prototype = new RcuWnd();
function RcuMoLayout(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuMoLayout._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTargets = [] ;
        this._rcuTagName = $.rcu.conststr.tag.mo_layout;
/**
 * public method
 */
        RcuMoLayout.prototype.init = function (opt) 
        {
            
        };
        
        RcuMoLayout.prototype.send = function (opt) 
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
                    var requireFile = "RcuMoLayout.php";
                    var processClass = "RcuMoLayout";
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
            RcuMoLayout.prototype.baseSend = RcuWnd.prototype.send ;
            this.baseSend(tmpopt);
        };
        
        RcuMoLayout.prototype.submit = function (event)
        {
            var jTarget = $(event.currentTarget);
            var roomid = jTarget.parents(".window_panel").attr("roomid");
            
            var jCanvas = $("div.rcu-layout-canvas");
            var x0 = $.rcu.get("common").getLeft(jCanvas[0]);
            var y0 = $.rcu.get("common").getTop(jCanvas[0]);
            var jItems = $("[id^=light-item-]");
            var arrayInfo = [];
            jItems.each(function(index,elem){
                var jElem = $(elem);
                var id = jElem.attr("id");
                var pos = id.lastIndexOf('-'); 
                var idx = parseInt(id.substr(pos+1));
                var info = null, pt = null;
                if(jElem.hasClass("light-bulb"))
                {
                    var l = elem.offsetLeft - x0;
                    var t = elem.offsetTop - y0;
                    var w = elem.clientWidth;
                    var h = elem.clientHeight;
                    info = {type: 'bulb', index: idx};
                    pt = {left:l, top:t, width:w, height:h};
                }
                else if(jElem.hasClass("light-band"))
                {
                    info = {type: 'band', index: idx};
                    pt = jElem.data("pt");
                }
                $.extend(true,info,{pt:pt});
                arrayInfo.push(info);
            });
            
            var sendopt = {"action":$.rcu.conststr.action.add,"param":{"roomid":roomid,"info":arrayInfo}};
            this.send(sendopt);
        };
        
        RcuMoLayout.prototype.change = function (event)
        {
        };
        
        RcuMoLayout.prototype.close = function (opt)
        {
            var roomid = opt.roomid ;
            this._jTargets[roomid] = null ;
        };
        //TODO 可以动态加载image了，onload函数保证图像的加载完成
        RcuMoLayout.prototype.open = function (opt)
        {
            var roomid = opt.roomid ;
            
            this._jTargets[roomid] = {"target":null,"data":null} ;
            var jCurTarget = this._jTargets[roomid].target;
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
        
        RcuMoLayout.prototype.show = function (opt)
        {
            var roomid = opt.roomid;
            var sendopt = {"action":$.rcu.conststr.action.chg,"param":{"roomid":roomid}};
            this.send(sendopt);
        };
        
/**
 * protected method
 */        
        RcuMoLayout.prototype._initState = function (opt)
        {
            var roomid = opt.roomid;
            var path = $.rcu.get("common").getRoomTypePath(roomid);
            var size = $.rcu.get("common").getRoomTypeSize(roomid);
            var jLayout = this._jTargets[roomid].target.getFrame().getLayout();
            jLayout.width(size[0])
                   .height(size[1])
                   .css("background-image","url('" + path + "')")
                   .css("background-size","auto")
                   .css("background-repeat","no-repeat");
            
        };
        
/**
 * private method
 */
        RcuMoLayout.prototype._recvSucc = function (result)
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
                            var lightstate = content.lightstate;
                            var lightname = content.lightname; 
                            var info = content.info; 
                            var data = {};
                            $.extend(true,data,{"lightstate":lightstate,"lightname":lightname,'info':info});
                            this._jTargets[roomid].data = data ;
                            
                            /**
                             * 加载设备(灯泡、灯带)
                             */
                            loadDevice(lightstate,result.content.info);
                            /**
                             * 点击tool的响应
                             */
                            $(".rcu-layout-item").unbind('click')
                                                 .bind('click',respToolClick);
                            /**
                             * 点击房间背景图(canvas)的响应
                             */
                            var jLayout = this._jTargets[roomid].target.getFrame().getLayout();
                            jLayout.unbind()
                                   .bind('click',function(event){respCanvasClick(event,data);})
                                   .bind('mousedown',function(event){respCanvasMouseDown(event,data);})
                                   .bind('mousemove',function(event){respCanvasMouseMove(event,data);})
                                   .bind('mouseup',function(event){respCanvasMouseUp(event,data);})
                                   .bind('dblclick',function(event){respCanvasDblclick(event,data);});
                        }
                    }
                    break;
                case $.rcu.conststr.action.add:
                    var flag = result.flag ;
                    if(flag)
                    {
                        var content = result.content;
                        var roomid = content.roomid ;
                        alert(roomid + "房间布局保存成功!");
                    }
                    break;
            }
        };
        
        RcuMoLayout.prototype._recvFail = function (result)
        {
        };
        
        function loadDevice(state,info)
        {
            /**
             * bulb是div，保存的位置信息是相对于rcu-layout-canvas的,但是css时，却要用绝对位置，
             * 所以存在+x0,+y0的情况
             * band是canvas，保存的当时画图形时，鼠标的位置，在画的时候，因为通过translate进行了坐标的转换，
             * 所以只要保证canvas和rcu-layout-canvas重合，那么在进行坐标转换时就不会出错。
             */
            var jCanvas = $("div.rcu-layout-canvas");
            var x0 = $.rcu.get("common").getLeft(jCanvas[0]);
            var y0 = $.rcu.get("common").getTop(jCanvas[0]);
            for(var i = 0; i < info.length ; ++i)
            {
                var type = info[i].type;
                var index = info[i].index;
                var pt = info[i].pt;
                if("bulb" == type)
                {
                    var x = parseInt(pt.left);
                    var y = parseInt(pt.top);
                    var w = parseInt(pt.width);
                    var h = parseInt(pt.height);
                    var elem = putBulbDiv(index,state[i],x + x0,y + y0,w,h);
                    jCanvas.append(elem);
                }
                else if("band" == type)
                {
                    var cvs = putBandCanvas(index,state[i]);
                    /**
                     * 一定要先将canvas嵌入到也买上，再画，因为在进行
                     * 坐标转换是，需要用到canvas的offSet属性，如果没有
                     * 嵌到页面上，那么这个属性为0
                     */
                    jCanvas.append(cvs);
                    drawLigthBand(cvs,pt,true);
                    $(cvs).removeClass("light-band-tmp");
                }
            }
        }
        
        function respToolClick(event)
        {
            var strClassToolOn = "rcu-layout-item-on";
            var strClassToolOff = "rcu-layout-item-off";
            var jCurTool = $(event.currentTarget);
            var jOnTool = $("." + strClassToolOn);
            if(jCurTool.attr("id") == jOnTool.attr("id"))
            {
                if(jOnTool.hasClass(strClassToolOn)){
                    jOnTool.removeClass(strClassToolOn)
                           .addClass(strClassToolOff);
                }
                else{
                    jOnTool.removeClass(strClassToolOff)
                           .addClass(strClassToolOn);
                }
            }
            else
            {
                removeAllNotPutLights();
                /**
                 * 移除先前为on的class
                 */
                jOnTool.removeClass(strClassToolOn)
                       .addClass(strClassToolOff);
                /**
                 * 当前tool设置为on
                 */
                jCurTool.removeClass(strClassToolOff)
                        .addClass(strClassToolOn);
            }
            /**
             * 如果存在on的Tool，那么Button全部无效
             */
            var len = $("div.rcu-layout-item-on").length ;
            var jSubmit = jCurTool.parents(".window_panel").find(".wnd-rcu-submit").children("div");
            if(len > 0)
            {
                jSubmit.hide();
            }
            else
            {
                jSubmit.show();
            }
        }
        
        function respCanvasMouseUp(event,data)
        {
            ResetIsmoveFlag();
        }
        
        function ResetIsmoveFlag()
        {
            var jElem = $("div.light-bulb-move-able");
            jElem.addClass("light-bulb-move-disable")
                 .removeClass("light-bulb-move-able")
                 .attr("offx","0")
                 .attr("offy","0");
        }
        
        function respCanvasMouseMove(event,data)
        {
            var x = event.pageX ;
            var y = event.pageY ;
            var strID = $("div.rcu-layout-item-on").attr("id");
            if("light-bulb-move" == strID)
            {
                var jElem = $("div.light-bulb-move-able");
                if(jElem.length > 0)
                {
                    var offx = parseInt(jElem.attr("offx"));
                    var offy = parseInt(jElem.attr("offy"));
                    jElem.css("left",x - offx)
                         .css("top",y - offy);
                }
            }
            else if("light-band-add" == strID)
            {
                if(existUnfinishedBand() && !bandPrepared())
                {
                    drawingLightBand(x, y);
                }
            }
        }
        
        function respCanvasMouseDown(event,data)
        {
            var x = event.pageX ;
            var y = event.pageY ;
            var strID = $("div.rcu-layout-item-on").attr("id");
            if("light-bulb-move" == strID)
            {
                $("div.light-bulb").each(function(index,elem){
                    var jElem = $(elem);
                    var l = elem.offsetLeft;
                    var t = elem.offsetTop;
                    var r = l + elem.offsetWidth;
                    var b = t + elem.offsetHeight;
                    if(x > l && x < r && y > t && y < b)
                    {
                        jElem.addClass("light-bulb-move-able")
                             .removeClass("light-bulb-move-disable")
                             .attr("offx", x - l)
                             .attr("offy", y - t);
                        return false;
                    }
                });
            }
        }
        
        function respCanvasDblclick(event,data)
        {
            var strID = $("div.rcu-layout-item-on").attr("id");
            if("light-band-add" == strID)
            {
                if(existUnfinishedBand())
                {
                    var x = event.pageX ;
                    var y = event.pageY ;
                    closeLightband(x,y);
                }
            }
        }
        
        function respCanvasClick(event,data)
        {
            var jCanvas = $(event.currentTarget);
            var x = event.pageX ;
            var y = event.pageY ;
            var strID = $("div.rcu-layout-item-on").attr("id");
            if("light-bulb-add" == strID ||
               "light-band-add" == strID)
            {
                if(!existUnfinishedBand() && !bandPrepared())
                {
                    var s = data.lightstate;
                    var name = data.lightname;
                    var elem = document.createElement("div");
                    var jElem = $(elem);
                    jElem.addClass("light-select-list");
                    var selElem = document.createElement("select");
                    /**
                     *灯组列表
                     */
                    var jSelElem = $(selElem);
                    for(var i = 0; i < name.length ;++i)
                    {
                        var opElem = document.createElement("option");
                        $(opElem).attr("index",i)/*灯的索引*/
                                 .attr("state",s[i])/*灯的状态*/
                                 .text(name[i]);/*灯的名字*/
                        jSelElem.append(opElem);
                    }
                    jElem.addClass("light-select-list")
                         .attr("value",strID)
                         .css("position","absolute")
                         .css("left",x)
                         .css("top",y);
                    jElem.append(selElem);
                    /**
                     * 确定按钮
                     */
                    var okElem = document.createElement("input");
                    var jOkElem = $(okElem);
                    jOkElem.attr("type","button")
                          .attr("name","OK")
                          .attr("value","确定");
                    jOkElem.unbind();
                    jOkElem.bind('click',function(event){
                        /**
                         * lightInfo[0] 灯索引
                         * lightInfo[1] 灯状态
                         */
                        var lightInfo = getLightInfo(event);
                        if("light-bulb-add" == strID){
                            createBulbDiv(event,lightInfo[0],lightInfo[1]);
                        }
                        else if("light-band-add" == strID){
                            createBandCanvas(event,lightInfo[0],lightInfo[1]);
                        }
                        return false;
                    });
                    jElem.append(okElem);
                    jCanvas.append(elem);
                    /**
                     * bind select click event
                     */
                    jSelElem.unbind();
                    jSelElem.bind('click',function(event){
                        return false ;
                    });
                }
                else
                {
                    if(!bandPrepared()){
                        plotLightBand(x, y);
                    }
                }
            }
            else if("light-bulb-del" == strID)
            {
                $("div.light-bulb").each(function(index,elem){
                    var jElem = $(elem);
                    var l = jElem.css("left").replace("px","");
                    var t = jElem.css("top").replace("px","");
                    var r = l + jElem.width();
                    var b = t + jElem.height();
                    if(x > l && x < r && y > t && y < b)
                    {
                        jElem.remove();
                        return false;
                    }
                });
            }
            else if("light-band-del" == strID)
            {
                $("canvas.light-band").each(function(index,elem){
                    var ctx = elem.getContext('2d');
                    var x0 = $.rcu.get("common").getLeft(elem);
                    var y0 = $.rcu.get("common").getTop(elem);
                    if(ctx.isPointInPath(x - x0 ,y - y0))
                    {
                        var jElem = $(elem);
                        jElem.remove();
                        return false;
                    }
                });
            }
            return false;
        }
        
        function closeLightband(x, y)
        {
            var jBandCanvas = $("canvas.light-band-tmp");
            var bandCanvas = jBandCanvas[0];
            if(jQuery.hasData(bandCanvas))
            {
                var pt = jBandCanvas.data("pt");
                pt.push([x,y]);
                drawLigthBand(bandCanvas, pt, true);
                jBandCanvas.removeClass("light-band-tmp");
            }
        }
        
        function drawingLightBand(x, y)
        {
            var jBandCanvas = $("canvas.light-band-tmp");
            var bandCanvas = jBandCanvas[0];
            if(jQuery.hasData(bandCanvas))
            {
                var pt = jBandCanvas.data("pt");
                var tmpPt = [];
                for(var i = 0; i < pt.length ; ++i)
                {
                    tmpPt.push(pt[i].slice(0));
                }
                tmpPt.push([x,y]);
                drawLigthBand(bandCanvas, tmpPt, false);
            }
        }
        
        function drawLigthBand(canvas, pt, close)
        {
            var jLightCanvas = $(canvas);
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            ctx.save();
            ctx.translate(-canvas.offsetLeft, -canvas.offsetTop);
            ctx.beginPath();
            ctx.moveTo(pt[0][0],pt[0][1]);
            for(var i = 1 ; i < pt.length ; ++i)
            {
                ctx.lineTo(pt[i][0],pt[i][1]);
            }
            if(close)
            {
                ctx.closePath();
                var s = jLightCanvas.attr("value");
                if(1 == s)
                {
                    ctx.fillStyle = "#FFFF00" ;
                    ctx.strokeStyle = "#FFFF00" ;
                }
                else if(0 == s)
                {
                    ctx.fillStyle = "#888800" ;
                    ctx.strokeStyle = "#888800" ;
                }
                ctx.fill();
            }
            ctx.stroke();
            ctx.restore();
        }
        
        function plotLightBand(x, y)
        {
            var jBandCanvas = $("canvas.light-band-tmp");
            var bandCanvas = jBandCanvas[0];
            if(!jQuery.hasData(bandCanvas))
            {
                var pt = [];
                pt.push([x,y]);
                jBandCanvas.data("pt",pt);
            }
            else
            {
                var pt = jBandCanvas.data("pt");
                pt.push([x,y]);
                drawLigthBand(bandCanvas, pt, false);
            }
        }
        
        function existUnfinishedBand()
        {
            var jBandCanvasExist = $("canvas.light-band");
            return jBandCanvasExist.hasClass("light-band-tmp");
        }
        
        function bandPrepared()
        {
            var strID = $("div.rcu-layout-item-on").attr("id");
            if("light-band-add" == strID)
            {
                var jCanvas = $("div.rcu-layout-canvas");
                var jList = $("div.light-select-list");
                if(jList.length > 0)
                {
                    return true ;
                }
            }
            return false;
        }
        
        function removeAllNotPutLights()
        {
            $("div.light-select-list").html("");
            removeTempBand();
        }
        
        function removeTempBand()
        {
            $("canvas.light-band-tmp").remove();
        }
        
        function putBandCanvas(index, state)
        {
            var jCanvas = $("div.rcu-layout-canvas");
            var x0 = $.rcu.get("common").getLeft(jCanvas[0]);
            var y0 = $.rcu.get("common").getTop(jCanvas[0]);
            var bandCanvas = document.createElement("canvas");
            var w = jCanvas.width();
            var h = jCanvas.height();
            bandCanvas.width = w;
            bandCanvas.height = h;
            jBandCanvas = $(bandCanvas);
            jBandCanvas.addClass("light-band")
                       .addClass("light-band-tmp")
                       .attr("value",state)
                       .attr("id","light-item-" + index)
                       .css("position","absolute")
                       .css("left",x0)
                       .css("top",y0);
            return bandCanvas ;
        }
        
        function createBandCanvas(event, index, state)
        {
            if(!existUnfinishedBand())
            {
                
                var jOkElem = $(event.currentTarget);
                var jOldDiv = jOkElem.parent("div.light-select-list");
                /**
                 * 用新的bandCanvas(灯带所在的canvas)替代原来的select(灯选择列表)
                 */
                var cvs = putBandCanvas(index, state);
                jOldDiv.replaceWith(cvs);
            }
        }
        
        function putBulbDiv(index,state,x,y,w,h)
        {
            var elem = document.createElement("div");
            var jElem = $(elem);
            jElem.addClass("light-bulb light-bulb-move-disable")
                 .attr("value",state)
                 .attr("offx","0")
                 .attr("offy","0")
                 .attr("id","light-item-" + index)
                 .css("position","absolute")
                 .css("left",x)
                 .css("top",y)
                 .css("background-repeat","no-repeat")
                 .css("background-size","contain")
                 .css("width",w)
                 .css("height",h);
            return elem ;
        }
        
        function createBulbDiv(event, index, state)
        {
            var jOkElem = $(event.currentTarget);
            var jOldDiv = jOkElem.parent("div.light-select-list");
            var x = jOldDiv.css("left");
            var y = jOldDiv.css("top");
            /**
             * 显示灯的图标
             */
            var elem = putBulbDiv(index,state,x,y,24,24);
            /**
             * 用新的elem(灯图标)替代原来的select(灯选择列表)
             */
            jOldDiv.replaceWith(elem);
        }
        
        function getLightInfo(event)
        {
            var jOkElem = $(event.currentTarget);
            /**
             * 得到灯的索引和灯状态
             */
            var jSelElem = jOkElem.prev("select");
            var lightIndex = jSelElem[0].selectedIndex;
            var opts = jSelElem[0].options;
            var jCurOpt = $(opts[lightIndex]);
            var i = jCurOpt.attr("index");
            var s = jCurOpt.attr("state");
            
            return [i,s];
        }
        
        RcuMoLayout._initialized = true;
    }
};
