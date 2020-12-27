RcuCommon.prototype = new RcuObject();
function RcuCommon(opt)
{
    RcuObject.call(this,opt);
    if (typeof RcuCommon._initialized == "undefined") 
    {
/**
 * private member
 */
        this._descs = null ;
        this._dispParam = {};
/**
 * public method
 */
        RcuCommon.prototype.init = function (opt) 
        {
            this.calcDispParam();
            this.loadMatchedCss();
        };
        
        RcuCommon.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            url = "./scripts/server/rcu.php" ;
            var requireFile = "RcuCommon.php";
            var processClass = "RcuCommon";
            if($.rcu.conststr.action.init == action)
            {
                data = 
                   {
                        "options":
                        {
                            "requesInfo":
                            {
                                "requireFile":requireFile,
                                "procClass":processClass,
                                "action":action
                            }
                        }
                    };
            }
            else if($.rcu.conststr.action.chg == action)
            {
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
                         "param": opt.param
                     }
                 };
            }
            var instance = this;
            
            $.ajax( 
              {
                  type: 'POST',
                  url: url,
                  data: data,
                  success: function(result, status, jqXHR){instance.recv(result, status, jqXHR);},
                  dataType: type,
                  async:false
              });
            
        };
        
        RcuCommon.prototype.getFilmHeader = function (pos)
        {
            if(pos >=0 && this._descs)
            {
                var g = this._descs.group ;
                if(!!g && g.length > pos)
                {
                    return g[pos];
                }
            }
            return null ;
        };
        
        RcuCommon.prototype.getStateDesc = function (name,value)
        {
            if(this._descs)
            {
                var s = this._descs.state ;
                if(!!s)
                {
                    var n = s[name];
                    if(!!n)
                    {
                        var v = n[value];
                        if(!!v)
                        {
                            return v ;
                        }
                    }
                }
            }
            return null ;
        };
        
        RcuCommon.prototype.getOneState = function (name)
        {
            if(this._descs)
            {
                var s = this._descs.state ;
                if(!!s)
                {
                    var n = s[name];
                    if(!!n)
                    {
                        var arr1 = [];
                        var arr2 = [];
                        for(val in n)
                        {
                            if(!isNaN( Number(val)))
                            {
                                arr1.push(val);//值,0,1
                                arr2.push(n[val]);//内容,未入住，已入住
                            }
                        }
                        return [arr1,arr2] ;
                    }
                }
            }
            return null ;
        };
        
        RcuCommon.prototype.getStateMeaning = function (name)
        {
            if(this._descs)
            {
                var s = this._descs.state ;
                if(!!s)
                {
                    var n = s[name];
                    if(!!n)
                    {
                        var m = n['meaning'];
                        if(!!m)
                        {
                            return m ;
                        }
                    }
                }
            }
            return null ;
        };
        
        RcuCommon.prototype.getStateNames = function ()
        {
            if(this._descs)
            {
                var s = this._descs.stnames ;
                if(!!s)
                {
                    return s ;
                }
            }
            return null ;
        };
        
        RcuCommon.prototype.getStateType = function (name)
        {
            if(this._descs)
            {
                var s = this._descs.state ;
                if(!!s)
                {
                    var n = s[name];
                    if(!!n)
                    {
                        var t = n['type'];
                        if(!!t)
                        {
                            return t ;
                        }
                    }
                }
            }
            return null ;
        };
        
        RcuCommon.prototype.getToolbarDesc = function (name)
        {
            if(this._descs)
            {
                var s = this._descs.toolbar ;
                if(!!s)
                {
                    var n = s[name];
                    if(!!n)
                    {
                        return n["desc"];
                    }
                    return n ;
                }
            }
            return null ;
        };
        
        RcuCommon.prototype.getToolItemDesc = function (name,subName)
        {
            if(this._descs)
            {
                var s = this._descs.toolbar ;
                if(!!s)
                {
                    var n = s[name];
                    if(!!n)
                    {
                        var items = n["items"];
                        if(!!items)
                        {
                            return items[subName];
                        }
                    }
                    return n ;
                }
            }
            return null ;
        };
        
        RcuCommon.prototype.getFirstFloor = function ()
        {
            if(this._descs)
            {
                var f = this._descs.first ;
                return f ;
            }
            return 1 ;
        };
        
        RcuCommon.prototype.getLowestLevel = function ()
        {
            if(this._descs)
            {
                var l = this._descs.lowest ;
                return l ;
            }
            return 0 ;
        };
        
        RcuCommon.prototype.getLevelDesc = function (curLevel)
        {
            if(this._descs)
            {
                var l = this._descs.level ;
                for(var i = 0; i < l.length ; ++i)
                {
                    if(curLevel == l[i]['level'])
                    {
                        return l[i]['desc'];
                        break;
                    }
                }
            }
            return "" ;
        };
        
        RcuCommon.prototype.getLowerLevels = function (curLevel)
        {
            if(this._descs)
            {
                var l = this._descs.level ;
                var arr = [];
                for(var i = 0; i < l.length ; ++i)
                {
                    if(i > curLevel)
                    {
                        arr.push(l[i]);
                    }
                }
                return arr ;
            }
            return [] ;
        };
        
        RcuCommon.prototype.getLowerUserColl = function (curLevel)
        {
            this.send({"action":$.rcu.conststr.action.chg,"param":{"name":"usercoll","level":curLevel}});
            if(this._descs)
            {
                return this._descs.usercoll ;
            }
            return [] ;
        };
        
        RcuCommon.prototype.getRealConfigValue = function (subname)
        {
            this.send({"action":$.rcu.conststr.action.chg,"param":{"name":"cfgvalue","subname":subname}});
            if(this._descs)
            {
                return this._descs.cfgvalue[subname] ;
            }
            return 0 ;
        };
        
        RcuCommon.prototype.getConfigValue = function (name)
        {
            if(this._descs && this._descs.config && this._descs.config.vals)
            {
                return parseInt(this._descs.config.vals[name]) ;
            }
            return -1 ;
        };
        
        RcuCommon.prototype.getConfigText = function (name,value)
        {
            if(this._descs && this._descs.config && this._descs.config.map)
            {
                var coll = this._descs.config.map[name] ;
                for(var i = 0; i < coll.length ; ++i)
                {
                    if(coll[i].value == value)
                    {
                        return coll[i].text ;
                    }
                }
            }
            return "" ;
        };
        
        //name = 'config_poll','config_opera','config_min_temp'
        RcuCommon.prototype.getConfigItems = function (name)
        {
            if(this._descs && this._descs.config && this._descs.config.map)
            {
                return this._descs.config.map[name] ;
            }
            return [] ;
        };
        
        RcuCommon.prototype.getToolBarDispParam = function ()
        {
            return this._dispParam.toolbar ;
        };
        
        RcuCommon.prototype.getToolItemDispParam = function ()
        {
            return this._dispParam.toolItem ;
        };
        
        RcuCommon.prototype.getBodyDispParam = function ()
        {
            return this._dispParam.body ;
        };
        
        RcuCommon.prototype.getIndexDispParam = function ()
        {
            return this._dispParam.index ;
        };
        
        RcuCommon.prototype.getMonitorDispParam = function ()
        {
            return this._dispParam.monitor ;
        };
        
        RcuCommon.prototype.getDockDispParam = function ()
        {
            return this._dispParam.dock ;
        };
        
        RcuCommon.prototype.getCurStrFontSize = function (str,size)
        {
            var canvas = $("<canvas></canvas>")[0];
            var ctx = canvas.getContext('2d');
            if(!!ctx)
            {
                ctx.font = ctx.font = size + "px SimSun";;
                var w = ctx.measureText(str).width;
                return w ;
            }
            return 0 ;
        };
        
        RcuCommon.prototype.getWindowInfo = function ()
        {
            var scrollX = 0, scrollY = 0, width = 0, height = 0, contentWidth = 0, contentHeight = 0;
            if (typeof (window.pageXOffset) == 'number')
            {
                scrollX = window.pageXOffset;
                scrollY = window.pageYOffset;
            }
            else
                if (document.body
                    && (document.body.scrollLeft || document.body.scrollTop))
                {
                    scrollX = document.body.scrollLeft;
                    scrollY = document.body.scrollTop;
                }
                else
                    if (document.documentElement
                        && (document.documentElement.scrollLeft || document.documentElement.scrollTop))
                    {
                        scrollX = document.documentElement.scrollLeft;
                        scrollY = document.documentElement.scrollTop;
                    }
            if (typeof (window.innerWidth) == 'number')
            {
                width = window.innerWidth;
                height = window.innerHeight;
            }
            else
                if (document.documentElement
                        && (document.documentElement.clientWidth || document.documentElement.clientHeight))
                {
                    width = document.documentElement.clientWidth;
                    height = document.documentElement.clientHeight;
                }
                else
                    if (document.body
                            && (document.body.clientWidth || document.body.clientHeight))
                    {
                        width = document.body.clientWidth;
                        height = document.body.clientHeight;
                    }
            if (document.documentElement
               && (document.documentElement.scrollHeight || document.documentElement.offsetHeight))
            {
                if (document.documentElement.scrollHeight > document.documentElement.offsetHeight)
                {
                    contentWidth = document.documentElement.scrollWidth;
                    contentHeight = document.documentElement.scrollHeight;
                }
                else
                {
                    contentWidth = document.documentElement.offsetWidth;
                    contentHeight = document.documentElement.offsetHeight;
                }
            }
            else
                if (document.body
                        && (document.body.scrollHeight || document.body.offsetHeight))
                {
                    if (document.body.scrollHeight > document.body.offsetHeight)
                    {
                        contentWidth = document.body.scrollWidth;
                        contentHeight = document.body.scrollHeight;
                    }
                    else
                    {
                        contentWidth = document.body.offsetWidth;
                        contentHeight = document.body.offsetHeight;
                    }
                }
                else
                {
                    contentWidth = width;
                    contentHeight = height;
                }
            if (height > contentHeight)
                height = contentHeight;
            if (width > contentWidth)
                width = contentWidth;
            var rect = new Object();
            rect.ScrollX = scrollX;
            rect.ScrollY = scrollY;
            rect.Width = width;
            rect.Height = height;
            rect.ContentWidth = contentWidth;
            rect.ContentHeight = contentHeight;
            return rect;
        };
        
       //获取元素的纵坐标
        RcuCommon.prototype.getTop = function(e){
            var offset=e.offsetTop;
            if(e.offsetParent!=null) offset += $.rcu.get("common").getTop(e.offsetParent);
            return offset;
        };

        //获取元素的横坐标
        RcuCommon.prototype.getLeft = function(e){
            var offset=e.offsetLeft;
            if(e.offsetParent!=null) offset += $.rcu.get("common").getLeft(e.offsetParent);
            return offset;
        };
        
        RcuCommon.prototype.getCurrentOption = function(jSelElem)
        {
            var index = jSelElem[0].selectedIndex;
            var opts = jSelElem[0].options;
            var jCurOpt = $(opts[index]);
            return jCurOpt ;
        };
        
        RcuCommon.prototype.getCmdInfo = function(cmd_name)
        {
            if(!!this._descs)
            {
                var cmd = this._descs.cmd;
                for(var i = 0; i < cmd.length ; ++i)
                {
                    if(cmd_name == cmd[i].name)
                    {
                        return cmd[i];
                    }
                }
            }
            return null ;
        };
        
        RcuCommon.prototype.getRoomTypePath = function(roomid)
        {
            if(!!this._descs)
            {
                var type = this._descs.idtype[roomid];
                return this._descs.typedesc[type].path ;
            }
            return null ;
        };
        
        RcuCommon.prototype.getRoomTypeDesc = function(roomid)
        {
            if(!!this._descs)
            {
                var type = this._descs.idtype[roomid];
                return this._descs.typedesc[type].desc ;
            }
            return null ;
        };
        
        RcuCommon.prototype.getRoomTypeSize = function(roomid)
        {
            if(!!this._descs)
            {
                var type = this._descs.idtype[roomid];
                return [this._descs.typedesc[type].width, this._descs.typedesc[type].height] ;
            }
            return null ;
        };
        
        RcuCommon.prototype.getTempColor = function(v)
        {
            var color = "#008000";//"Green";
            if(v <= 16 || v >= 30)
            {
                color = "#FF0000";//"Red";
            }
            else if(v <= 18 || v >= 29)
            {
                color = "#FFFF00";//"Yellow";
            }
            else if(v <= 21 || v >= 27)
            {
                color = "#FFA500";//"Orange";
            }
            return color ;
        };
        
        RcuCommon.prototype.getStateTitleArr = function()
        {
            var names = this._descs.stnames;
            var st = this._descs.state;
            var arr = [];
            //TODO 房间类型暂时不加，知道完成房价类型修改之后
            arr.push({"sTitle": "房间ID"});
            arr.push({"sTitle": "房间名"});
            for(var i = 0; i < names.length ; ++i)
            {
                var name = names[i];
                var cell = {"sTitle": st[name].meaning};
                arr.push(cell);
            }
            return arr ;
        };
        
      //data 参数是in out形式
        RcuCommon.prototype.covertToMeanData = function(data)
        {
            var names = $.rcu.get("common").getStateNames();
            //TODO 排除房间类型
            for(var i = 0; i < data.length ; ++i)
            {
                for(var j = 2 ; j < names.length ; ++j)
                {
                    var text = $.rcu.get("common").getStateDesc(names[j - 2],data[i][j]);
                    data[i][j] = text ;
                }
            }
        };
        
        RcuCommon.prototype.binaryToBCD = function(nBin)
        {
            //TODO 利用BCDToBinary的方式获得，而不是用C语言的风格
            var num = new Number(nBin);
            var str = num.toString(16);
            str = str.toLowerCase();
            str.replace("0x","");
            str = "0x" + str;
            return parseInt(str);
        };
        
        RcuCommon.prototype.BCDToBinary = function(nBCD)
        {
            var str = "0x" + nBCD.toString() ;
            var iBin = parseInt(str);
            return iBin;
        };
        
/**
 * private method
 */
        RcuCommon.prototype._recvSucc = function (result)
        {
            var content = result.content;
            if(!!content)
            {
                switch(result.action)
                {
                    case $.rcu.conststr.action.init:
                        this._descs = result.content.descs ;
                        break;
                    case $.rcu.conststr.action.chg:
                        for(var i = 0; i < content.length ; ++i){
                            var name = content[i].name;
                            if("usercoll" == name)
                            {
                                var desc = content[i].desc;
                                $.extend(true,this._descs,{"usercoll":null});
                                this._descs.usercoll = desc ;
                            }
                            else if("cfgvalue" == name)
                            {
                                var desc = content[i].desc;
                                $.extend(true,this._descs,{"cfgvalue":null});
                                this._descs.cfgvalue = desc ;
                            }
                        }
                        break;
                }
            }
        };
        
        RcuCommon.prototype._recvFail = function (result)
        {
            var jTarget = this._jTarget ;
            if(!!jTarget)
            {
                jTarget.append("加载初始化信息失败!");
            }
        };
        
        RcuCommon.prototype.calcDispParam = function (w, h)
        {
            this.calcDispParam_Body();
            this.calcDispParam_ToolBar();
            this.calcDispParam_ToolItem();
            this.calcDispParam_Index();
            this.calcDispParam_Dock();
            this.calcDispParam_Monitor();
            
        };
        
        RcuCommon.prototype.calcDispParam_Body = function ()
        {
            var size = 12 ;
            var height = 16 ;
            
            var w = screen.width;
            var h = screen.height;
            var isWidescreen = ((w / h) > 1.50 ? true : false);
            var gap_x = Math.ceil(w/200);
            var gap_y = isWidescreen ? Math.ceil(w/150) : Math.ceil(w/180);
            var wndInfo = this.getWindowInfo();
            //TODO TEMP
            //wndInfo.ContentWidth = 2560;
            //wndInfo.ContentHeight = 2048;
            var param = {"font":{"size":size,"height":height},"screen":{"flag":isWidescreen,"width":w,"height":h},
                    "gap":{"x":gap_x,"y":gap_y},"wnd": wndInfo} ;
            
            $.extend(true,this._dispParam,{"body":param});
        };
        
        RcuCommon.prototype.calcDispParam_ToolBar = function ()
        {
            var wndInfo = this._dispParam.body.wnd ;
            var contentW = wndInfo.ContentWidth;
            if(contentW < 800)
            {
                contentW = 800 ;
            }
            var contentH = wndInfo.ContentHeight;
            if(contentH < 600)
            {
                contentH = 600 ;
            }
            var toolBarDutyRatio = 0.5 ;
            if(this._dispParam.body.screen.flag)
            {
                toolBarDutyRatio = 5 / 7 ;
            }
            var toolBarHeight = contentH * toolBarDutyRatio;
            var toolBarMarginTop = (contentH - toolBarHeight)/2 ;
            var menuCount = 9 ;//目前是最多有9个menu
            var menuOuterMarginTop = contentH / 150;
            var menuMarginHeight = menuOuterMarginTop * (menuCount + 1);
            var menuPureHeight = toolBarHeight - menuMarginHeight ;
            var menuOuterHeight = menuPureHeight / menuCount ;
            var menuInOutRatio = 0.75 ;
            var menuInnerHeight = menuOuterHeight * menuInOutRatio ;

            var toolBarMarginLeft = 0 ;
            var menuOuterMarginLeft = menuOuterMarginTop;
            var menuOuterWidth = menuOuterHeight;
            var menuInnerWidth = menuInnerHeight;
            var menuInnerMaginTop = (menuOuterHeight - menuInnerHeight) / 2;
            var menuInnerMaginLeft = menuInnerMaginTop ;
            var toolBarWidth = menuOuterWidth + 2 * menuOuterMarginLeft ;
            var outerRadius = menuOuterWidth / 8 ;
            toolBarWidth *= (9/70 + 1);//为了将背景的阴影留出来
            toolBarHeight *= (6/596 + 1);//为了将背景的阴影留出来
            var toolBarParam = {"width":Math.ceil(toolBarWidth),"height":Math.ceil(toolBarHeight),
                               "left":Math.floor(toolBarMarginLeft),"top":Math.floor(toolBarMarginTop)};
            var outerParam = {"width":Math.ceil(menuOuterWidth),"height":Math.ceil(menuOuterHeight),
                               "left":Math.floor(menuOuterMarginLeft),"top":Math.floor(menuOuterMarginTop),"radius":Math.ceil(outerRadius)};
            var innerParam = {"width":Math.ceil(menuInnerWidth),"height":Math.ceil(menuInnerHeight),
                               "left":Math.floor(menuInnerMaginLeft),"top":Math.floor(menuInnerMaginTop)};
            
            var param = {"wrp":toolBarParam,"outer":outerParam,"inner":innerParam};
            
            $.extend(true,this._dispParam,{"toolbar":param});
        };
        
        RcuCommon.prototype.calcDispParam_ToolItem = function ()
        {
            var outerParam = this._dispParam.toolbar.outer ;
            
            var cellIconHeight = outerParam.height / 2 ;
            var cellIconWidth = cellIconHeight ;
            var cellIconTop = cellIconWidth/8 ;
            var cellRadius = cellIconWidth/8 ;
            var cellTextHeight = this._dispParam.body.font.height;
            
            var cellHeight = cellIconHeight + cellTextHeight + 3 * cellIconTop;
            var cellWidth = this.getCurStrFontSize("测测测测测") + 2 * cellIconTop;
            var maxVal = Math.max(cellHeight,cellWidth);
            var cellParam = {"width":Math.ceil(maxVal),"height":Math.ceil(maxVal),
                            "left":Math.floor(outerParam.left),"top":Math.floor(outerParam.top),"radius":Math.ceil(cellRadius)};
            
            var cellTextWidth = maxVal - 2 * cellIconTop;
            var cellTextLeft = cellIconTop ;
            var cellTextTop = cellIconTop ;
            
            var cellIconLeft = (maxVal - cellIconWidth) / 2 ;
            
            var cellIconParam = {"width":Math.ceil(cellIconWidth),"height":Math.ceil(cellIconHeight),
                                "left":Math.floor(cellIconLeft),"top":Math.floor(cellIconTop)};
            var cellTextParam = {"width":Math.ceil(cellTextWidth),"height":Math.ceil(cellTextHeight),
                                "left":Math.floor(cellTextLeft),"top":Math.floor(cellTextTop)};
            
            var param = {"cell":cellParam,"icon":cellIconParam,"text":cellTextParam};
            
            $.extend(true,this._dispParam,{"toolItem":param});
        };
        
        RcuCommon.prototype.calcDispParam_Index = function (font)
        {
            var wrpParam = {"width":190};
            var fontHeight = this._dispParam.body.font.height;
            var iconParam = {"width":fontHeight,"height":fontHeight};
            var chkParam = {"width":fontHeight,"height":fontHeight};
            var textParam = {"width":this.getCurStrFontSize("测测测测测"),"height":fontHeight};
            
            var param = {"wrp":wrpParam,"icon":iconParam,"chk":chkParam,"text":textParam};
            
            $.extend(true,this._dispParam,{"index":param});
        };
        
        RcuCommon.prototype.calcDispParam_Dock = function (font)
        {
            var iconHeight = this._dispParam.toolItem.icon.height ;
            var iconWidth = iconHeight ;
            var textHeight = this._dispParam.body.font.height ;
            var wrpHeight = Math.max(iconHeight,textHeight) ;
            var factor = 0 ;
            var screenParam = this._dispParam.body.screen ;
            if(screenParam.flag)
            {
                if(screenParam.width < 1000)
                {
                    factor = 4 ;
                }
                else if(screenParam.width < 1300)
                {
                    factor = 5 ;
                }
                else if(screenParam.width < 1700)
                {
                    factor = 6 ;
                }
                else if(screenParam.width < 2000)
                {
                    factor = 7 ;
                }
                else
                {
                    factor = 8 ;
                }
            }
            else
            {
                factor = 5;
            }
            var wrpWidth = wrpHeight * factor ;
            var iconLeft = 0 ;
            var iconTop = (wrpHeight - iconHeight) / 2 ;
            var textLeft = 2 * this._dispParam.toolItem.icon.top ;
            var textTop = (wrpHeight - textHeight) / 2 ;
            var textWidth = wrpWidth - iconLeft - iconWidth - 3 * this._dispParam.toolItem.icon.top;
            
            var wrpParam = {"width":wrpWidth};
            var headerParam = {"height":(iconHeight + 2 * this._dispParam.toolItem.icon.top),
                           "left":this._dispParam.toolItem.icon.top, "top":this._dispParam.toolItem.icon.top};
            var iconParam = {"width":iconWidth, "height":iconHeight,
                            "left":iconLeft, "top":Math.floor(iconTop)};
            var textParam = {"width":textWidth, "height":textHeight,
                    "left":textLeft, "top":Math.floor(textTop)};
            
            var param = {"wrp":wrpParam,"header":headerParam,"icon":iconParam,"text":textParam};
            $.extend(true,this._dispParam,{"dock":param});
        };
        
        RcuCommon.prototype.calcDispParam_Monitor = function (font)
        {
            var bodyParam = this._dispParam.body ;
            var gap_x = bodyParam.gap.x ;
            var toolBarWidth = this._dispParam.toolbar.wrp.width ;
            var indexWidth = this._dispParam.index.wrp.width ;
            var dockWidth = this._dispParam.dock.wrp.width ;
            var wndInfo = this._dispParam.body.wnd ;
            var monitorWidth = wndInfo.ContentWidth - toolBarWidth - indexWidth - dockWidth - 4 * gap_x;
            
            var monitorParam = {"width":monitorWidth};
            
            var scrollWidth = 20 ;
            var houseLeft = this._dispParam.toolbar.outer.left ;
            var houseTop = this._dispParam.toolbar.outer.top ;
            var houseCount = $.rcu.conststr.suite.count ;
            //*2因为suite中嵌套house，suite和house的margin一样;
            var houseAllWidth = monitorWidth - scrollWidth - (houseCount + 1) * 2 * houseLeft;
            var houseWidth = houseAllWidth / (houseCount + 0.25) ;
            var cellCount = $.rcu.conststr.house.count.x ;
            var cellLeft = houseLeft ;
            var cellTop = houseTop ;
            var cellAllWidth = houseWidth - (cellCount + 1) * cellLeft ;
            var cellWidth = Math.floor(cellAllWidth / cellCount);
            var cellHeight = cellWidth ;
            
            var houseParam = {"width":Math.ceil(houseWidth), "left":houseLeft, "top":houseTop};
            var cellParam = {"width":cellWidth, "height":cellHeight,"left":cellLeft, "top":cellTop,
                    "fontSize":Math.floor(cellWidth * 0.7),"radius":Math.ceil(cellWidth/6)};
            
            var param = {"wrp":monitorParam,"house":houseParam,"cell":cellParam};
            $.extend(true,this._dispParam,{"monitor":param});
        };
        
        RcuCommon.prototype.loadMatchedCss = function ()
        {
            this.loadMatchedCss_ToolBar();
            this.loadMatchedCss_ToolItem();
            this.loadMatchedCss_Index();
            this.loadMatchedCss_Dock();
            this.loadMatchedCss_Monitor();
            //TODO 根据不同酒店，加载不同的css
            loadCssDirectly("rcu.shanghai");
        };
        
        RcuCommon.prototype.loadMatchedCss_ToolBar = function ()
        {
            var param = this.getToolBarDispParam();
            var w = param.inner.width ;
            var arr = $.rcu.conststr.iconSize ;
            for(var i = 0; i < arr.length ; ++i)
            {
                var curSize =  arr[i];
                if(w <= curSize)
                {
                    loadCss("toolbar",curSize);
                    break;
                }
                //如果w大于最后的size，那么没有办法，只能让w=最后的size了，图像将放大
                //最后的size设定为1024，我想几十年内，不会有图标能这么大吧，也不好说。
                if(i == arr.length - 1)
                {
                    w = curSize;
                }
            }
        };
        
        RcuCommon.prototype.loadMatchedCss_Index = function ()
        {
            var param = this.getIndexDispParam();
            var w = param.icon.width ;
            var arr = $.rcu.conststr.iconSize ;
            for(var i = 0; i < arr.length ; ++i)
            {
                var curSize =  arr[i];
                if(w <= curSize)
                {
                    loadCss("index",curSize);
                    break;
                }
                if(i == arr.length - 1)
                {
                    w = curSize;
                }
            }
        };
        
        RcuCommon.prototype.loadMatchedCss_ToolItem = function ()
        {
            var param = this.getToolItemDispParam();
            var w = param.icon.width ;
            var arr = $.rcu.conststr.iconSize ;
            for(var i = 0; i < arr.length ; ++i)
            {
                var curSize =  arr[i];
                if(w <= curSize)
                {
                    loadCss("toolItem",curSize);
                    break;
                }
                if(i == arr.length - 1)
                {
                    w = curSize;
                }
            }
        };
        
        RcuCommon.prototype.loadMatchedCss_Monitor = function ()
        {
            var param = this.getMonitorDispParam();
            var w = param.cell.width ;
            var arr = $.rcu.conststr.iconSize ;
            for(var i = 0; i < arr.length ; ++i)
            {
                var curSize =  arr[i];
                if(w <= curSize)
                {
                    loadCss("monitor",curSize);
                    break;
                }
                if(i == arr.length - 1)
                {
                    w = curSize;
                }
            }
        };
        
        RcuCommon.prototype.loadMatchedCss_Dock = function ()
        {
            
        };
        
        function loadCss(name,size)
        {
            var jHead = $("head");
            var jLink = null ;
            var jTheLink = $("link[name='" + name + "']");
            if(1 == jTheLink.length)
            {
                jLink = jTheLink ;
            }
            else
            {
                jLink = $("<link>");
                jHead.append(jLink);
            }
            jLink.attr("name",name)
                 .attr("value",size)
                 .attr("rel","stylesheet")
                 .attr("type","text/css")
                 .attr("href","/css/" + name + "/jquery.rcu" + name + "_" + size + ".css");
        }
        
        function loadCssDirectly(name)
        {
            var jHead = $("head");
            var jLink = null ;
            var jTheLink = $("link[name='" + name + "']");
            if(1 == jTheLink.length)
            {
                jLink = jTheLink ;
            }
            else
            {
                jLink = $("<link>");
                jHead.append(jLink);
            }
            jLink.attr("name",name)
                 .attr("rel","stylesheet")
                 .attr("type","text/css")
                 .attr("href","/css/" + name + ".css");
        }
        
        RcuCommon._initialized = true;
    }
};
