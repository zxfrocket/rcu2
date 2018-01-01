RcuRoomsMerge.prototype = new RcuWnd();
function RcuRoomsMerge(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuRoomsMerge._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.rooms_merge;
/**
 * public method
 */
        RcuRoomsMerge.prototype.init = function (opt) 
        {
            
        };
        
        RcuRoomsMerge.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuRoomsMerge.php";
                    var processClass = "RcuRoomsMerge";
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
        
        RcuRoomsMerge.prototype.submit = function (event)
        {
            var jFrame = this._jTarget.getFrame();
            var jInstYes = jFrame.find("td.rcu-wnd-index-yes").find("ul.rcu-tree-root");
            var jInstNo = jFrame.find("td.rcu-wnd-index-no").find("ul.rcu-tree-root");
            var arrYes = $.rcu.get("index").getChkTree(jInstYes,false) ;
            var arrNo = $.rcu.get("index").getChkTree(jInstNo,false) ;
            var newArrYes = getRoomIdArray(arrYes) ;
            var newArrNo = getRoomIdArray(arrNo) ;
            var opt = {"action":$.rcu.conststr.action.chg,
                       "param":{"username": $.rcu.get("login").getUserName(),
                       "yes": newArrYes, "no": newArrNo}};
            this.send(opt);
            
            function getRoomIdArray(arr)//101,102,103
            {
                var ids = [];
                for(var i = 0; i < arr.length ; ++i)
                {
                    var rooms = arr[i].rooms ;
                    for(var j = 0; j < rooms.length ; ++j)
                    {
                        //TODO TEMP room name 唯一性限制或者让js也如同php代码一样，得到rooms->ids的关系
                        ids.push(rooms[j]['ids'][0]);
                    }
                }
                return ids ;
            }
        };
        
        RcuRoomsMerge.prototype.open = function (opt)
        {
            /**
             * 调用父类send函数，发送ajax信息
             */
            RcuRoomsMerge.prototype.baseOpen = RcuWnd.prototype.open ;
            this.baseOpen(opt);
        };
        
        RcuRoomsMerge.prototype.change = function (event)
        {
        };
        
        RcuRoomsMerge.prototype._initState = function (opt)
        {
            var suitTree = $.rcu.get("index").getSuiteTree();
            var idTreeYes = suitTree[0];
            var idTreeNo = suitTree[1];
            if(!!idTreeYes && !!idTreeNo)
            {
                var jDivWrpYes = this._jTarget.getFrame().find(".rcu-wnd-index-yes").children("div");
                jDivWrpYes.rcutree(idTreeYes,{"flag":{"check":true,"menu":false}});
                var jDivWrpNo = this._jTarget.getFrame().find(".rcu-wnd-index-no").children("div");
                jDivWrpNo.rcutree(idTreeNo,{"flag":{"check":true,"menu":false}});
                jDivWrpYes.bind("chkchg",function(event,hasCheck){
                    deleteRooms(jDivWrpYes, hasCheck);
                    return false ;
                });
                jDivWrpNo.bind("chkchg",function(event,hasCheck){
                    recoverRooms(jDivWrpNo, hasCheck);
                    return false ;
                });
            }
            
            function deleteRooms(jInst, hasCheck)
            {
                if(hasCheck)
                {
                    var jOtherInst = jInst.parent("td").next("td").children("div").first();
                    var arr = $.rcu.get("index").getChkTree(jInst,true) ;
                    jOtherInst.rcutree_add(arr,{"flag":{"check":true,"menu":false}});
                    jInst.rcutree_remove();
                }
            }
            
            function recoverRooms(jInst, hasCheck)
            {
                if(hasCheck)
                {
                    var jOtherInst = jInst.parent("td").prev("td").children("div").first();
                    var arr = $.rcu.get("index").getChkTree(jInst,true) ;
                    jOtherInst.rcutree_add(arr,{"flag":{"check":true,"menu":false}});
                    jInst.rcutree_remove();
                }
            }
        };
        
/**
 * private method
 */
        RcuRoomsMerge.prototype._recvSucc = function (result)
        {
            var action = result.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    var flag = result.flag ;
                    if(!!this._jTarget)
                    {
                        if(flag)
                        {
                            alert("房间连通变更命令写入工单!");
                        }
                    }
                    break;
            }
        };
        
        RcuRoomsMerge.prototype._recvFail = function (result)
        {
        };
        
        RcuRoomsMerge._initialized = true;
    }
};
