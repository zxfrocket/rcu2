RcuIndex.prototype = new RcuObject();
function RcuIndex(opt)
{
    RcuObject.call(this,opt);
    if (typeof RcuIndex._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
/**
 * public method
 */
        RcuIndex.prototype.init = function (opt) 
        {
            this._jTarget = this._opt.target;
            this._jTarget.rcuindex({"action":$.rcu.conststr.action.init});
            this._idTreeYes = null;
            this._idTreeNo = null;
            this._suiteTreeYes = null;
            this._suiteTreeNo = null;
            this._mapRoomToId = null ;
            this._mapIdToRoom = null ;
        };
        
        RcuIndex.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            url = "./scripts/server/rcu.php" ;
            var requireFile = "RcuIndex.php";
            var processClass = "RcuIndex";
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
                
                /**
                 * 调用父类send函数，发送ajax信息
                 */
                var tmpopt = {"url":url, "data":data, "type":type};
                RcuIndex.prototype.baseSend = RcuObject.prototype.send ;
                this.baseSend(tmpopt);
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
        
        RcuIndex.prototype.getChkTree = function (elem,isChk)
        {
            var jInst = $(elem);
            var arr = [];
            var jAllFloors = null;
            if(isChk)
            {
                jAllFloors = jInst.find("input[type='checkbox'][flag!='0'][class='rcu-tree-floor']");
            }
            else
            {
                jAllFloors = jInst.find("input[type='checkbox'][flag='0'][class='rcu-tree-floor']");
            }
            for(var i = 0; i < jAllFloors.length ; ++i)
            {
                var floor = $(jAllFloors[i]).parent("span").parent("li").val();
                var cell = {"floor":floor, "rooms":[]} ;
                var jAllRooms = null;
                if(isChk)
                {
                    jAllRooms = $(jAllFloors[i]).parent("span").next("ul").find("input[type='checkbox'][flag='2'][class='rcu-tree-room']");
                }
                else
                {
                    jAllRooms = $(jAllFloors[i]).parent("span").next("ul").find("input[type='checkbox'][flag='0'][class='rcu-tree-room']");
                }
                for(var j = 0; j < jAllRooms.length ; ++j)
                {
                    var jCurRoom = $(jAllRooms[j]).parent("span").parent("li");
                    var roomname = jCurRoom.attr("name");
                    var id = jCurRoom.attr("id").replace("rcu-tree-room-","");
                  //TODO TEMP room name 唯一性限制或者让js也如同php代码一样，得到rooms->ids的关系
                    cell.rooms.push({"name": roomname, "ids": [id]});
                }
                arr.push(cell);
            }
            
            return arr ;
        };
        
/**
 * private method
 */
        RcuIndex.prototype._recvSucc = function (result)
        {
            var content = result.content;
            if(!!content)
            {
                switch(result.action)
                {
                    case $.rcu.conststr.action.init:
                        var idTreeYes = content.idTreeYes ;
                        var idTreeNo = content.idTreeNo ;
                        if(!!idTreeYes && !!idTreeNo )
                        {
                            this._idTreeYes = idTreeYes ;
                            this._idTreeNo = idTreeNo ;
                            //进行room和id的映射
                            var mapAll = mapRoomAndId(this._idTreeYes);
                            this._mapRoomToId = mapAll[0];
                            this._mapIdToRoom = mapAll[1];
                            this.getCurAccSel()[1].rcutree(idTreeYes,{"flag":{"check":false,"menu":true}});
                        }
                        break;
                    case $.rcu.conststr.action.chg:
                        var suiteTreeYes = content.suiteTreeYes ;
                        var suiteTreeNo = content.suiteTreeNo ;
                        if(!!suiteTreeYes && !!suiteTreeNo)
                        {
                            this._suiteTreeYes = suiteTreeYes ;
                            this._suiteTreeNo = suiteTreeNo ;
                        }
                        break;
                }
            }
            
            function mapRoomAndId(idTree)
            {
                var map1 = {};
                var map2 = {};
                for(var i = 0; i < idTree.length; ++i)
                {
                    var rooms = idTree[i]['rooms'];
                    for(var j = 0; j < rooms.length; ++j)
                    {
                        //Room To Id
                        var name = rooms[j]['name'] ;
                        var ids = rooms[j]['ids'] ;
                        var str = "{'" + name + "':null}";
                        var pair = eval("(" + str + ")");
                        pair[name] = ids;
                        $.extend(true,map1,pair);
                        
                        //Id To Room
                        for(var k = 0; k < ids.length ; ++k)
                        {
                            var id = ids[k];
                            str = "{'" + id + "':null}";
                            pair = eval("(" + str + ")");
                            pair[id] = name;
                            $.extend(true,map2,pair);
                        }
                    }
                }
                return [map1, map2] ;
            }
        };
        
        RcuIndex.prototype.getRoomNameFromId = function(id)
        {
            var roomName = !!this._mapIdToRoom[id] ? this._mapIdToRoom[id] : "";
            return roomName ;
        };
        
        RcuIndex.prototype._recvFail = function (result)
        {
            this._jTarget.append("加载房间索引失败!");
        };
        
        RcuIndex.prototype.getCurAccSel = function()
        {
            var jAccWrp = this._jTarget.children("div").first();
            var curIndex = jAccWrp.accordion(  "option", "active" );
            var jCurHead = jAccWrp.children("h3:eq(" + curIndex + ")");
            var jCurPanel = jAccWrp.children("div:eq(" + curIndex + ")");
            return [jCurHead,jCurPanel,curIndex] ;
        };
        
        RcuIndex.prototype.getIdTreeYes = function()
        {
            return this._idTreeYes ;
        };
        
        RcuIndex.prototype.getIdTreeNo = function()
        {
            return this._idTreeNo ;
        };
        
        RcuIndex.prototype.getSuiteTree = function()
        {
            this.send({"action":$.rcu.conststr.action.chg,"param":{"name":"suit"}});
            if(!!this._suiteTreeYes && !!this._suiteTreeNo )
            {
                return [this._suiteTreeYes, this._suiteTreeNo] ;
            }
            return [[],[]] ;
        };
        
        RcuIndex.prototype.getSelIDs = function(jInst)
        {
            var jColl = jInst.find("input[class='rcu-tree-room'][flag='2']");
            var arr = [];
            for(var i = 0; i < jColl.length ; ++i)
            {
                var name = $(jColl[i]).attr("name");
                var ids = this._mapRoomToId[name];
                for(var j = 0; j < ids.length ; ++j)
                {
                    arr.push(ids[j]);
                }
            }
            
            return arr ;
            
        };
        
        RcuIndex._initialized = true;
    }
};
