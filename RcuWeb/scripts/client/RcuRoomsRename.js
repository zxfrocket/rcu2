RcuRoomsRename.prototype = new RcuWnd();
function RcuRoomsRename(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuRoomsRename._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.rooms_rename;
/**
 * public method
 */
        RcuRoomsRename.prototype.init = function (opt) 
        {
            
        };
        
        RcuRoomsRename.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            switch(action)
            {
                case $.rcu.conststr.action.get:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuRoomsRename.php";
                    var processClass = "RcuRoomsRename";
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
                    break;
                case $.rcu.conststr.action.chg:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuRoomsRename.php";
                    var processClass = "RcuRoomsRename";
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
            
            if(!!url && !!data)
            {
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
            }
        };
        
        RcuRoomsRename.prototype.submit = function (event)
        {
            var jCurBtn = $(event.currentTarget);
            var jNewname = jCurBtn.parent("td").prev("td");
            var jOldname = jNewname.prev("td");
            var roomid = jOldname.prev("td").text();
            var newname = jNewname.children("input").val();
            var oldname = jOldname.text();
            if(newname != "" && newname != oldname)
            {
                var opt = {"action":$.rcu.conststr.action.chg,"param":{"roomid":roomid,"newname":newname}};
                this.send(opt);
            }
        };
        
        RcuRoomsRename.prototype.open = function (opt)
        {
            /**
             * 调用父类send函数，发送ajax信息
             */
            RcuRoomsRename.prototype.baseOpen = RcuWnd.prototype.open ;
            this.baseOpen(opt);
        };
        
        RcuRoomsRename.prototype.change = function (event)
        {
        };
        
        RcuRoomsRename.prototype._initState = function (opt)
        {
            var opt = {"action":$.rcu.conststr.action.get};
            this.send(opt);
            this._jTarget.getFrame().find('td.wnd-rcu-submit').children().hide();
        };
        
/**
 * private method
 */
        RcuRoomsRename.prototype._recvSucc = function (result)
        {
            var action = result.action ;
            switch(action)
            {
                case $.rcu.conststr.action.get:
                    var flag = result.flag ;
                    if(!!this._jTarget)
                    {
                        if(flag)
                        {
                            this.createDataTable(result.data);
                        }
                    }
                    break;
                case $.rcu.conststr.action.chg:
                    var flag = result.flag ;
                    if(!!this._jTarget)
                    {
                        if(flag)
                        {
                            var content = result.content ;
                            var roomid = content.roomid ;
                            var newname = content.newname ;
                            var jCurBtn = this._jTarget.getFrame().find("input[roomid='" + roomid + "']");
                            var jNewname = jCurBtn.parent("td").prev("td");
                            var jOldname = jNewname.prev("td");
                            jNewname.children("input").val("");
                            jOldname.text(newname);
                        }
                    }
                    break;
            }
        };
        
        RcuRoomsRename.prototype._recvFail = function (result)
        {
        };
        
        RcuRoomsRename.prototype.createDataTable = function (data)
        {
            var jFrame = this._jTarget.getFrame();
            jFrame.find("#rename_cnt").rcutable_grid({"action":$.rcu.conststr.action.chg, "name":this._rcuTagName, "data":data});
        };
        
        RcuRoomsRename._initialized = true;
    }
};
