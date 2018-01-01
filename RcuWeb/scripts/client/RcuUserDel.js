RcuUserDel.prototype = new RcuWnd();
function RcuUserDel(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuUserDel._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.user_del;
/**
 * public method
 */
        RcuUserDel.prototype.init = function (opt) 
        {
            
        };
        
        RcuUserDel.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuUserDel.php";
                    var processClass = "RcuUserDel";
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
        
        RcuUserDel.prototype.open = function (opt)
        {
            //如果当前用户之下没有可供删除的用户
            var currentLevel = $.rcu.get("login").getUserLevel();
            var optArr = $.rcu.get("common").getLowerUserColl(currentLevel);
            if(0 == optArr.length)
            {
               alert("无可供删除的用户");
            }
            else
            {
                /**
                 * 调用父类send函数，发送ajax信息
                 */
                RcuUserDel.prototype.baseOpen = RcuWnd.prototype.open ;
                this.baseOpen(opt);
            }
        };
        
        RcuUserDel.prototype.submit = function (event)
        {
            var jFrm = this._jTarget.getFrame();
            var jSelUsername = jFrm.find("select[name='username']");
            var jCurOpt = $.rcu.get("common").getCurrentOption(jSelUsername);
            var username = jCurOpt.text();
            if("" == username)
            {
                var jForm = jFrm.getForm();
                jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                    "param":{"inst":this._jTarget,"type":"error","info":"用户名不能为空"}});
            }
            else
            {
                var opt = {"action":$.rcu.conststr.action.chg,"param":{"username":username}};
                this.send(opt);
            }
        };
        
        RcuUserDel.prototype.change = function (event)
        {
            var jSelElem = $(event.currentTarget);
            if("username" == jSelElem.attr("name"))
            {
                var jFrm = this._jTarget.getFrame();
                this._mapUserNameToLevel(jSelElem, jFrm.find("input[name='level']"));
            }
            
        };
        
/**
 * protected method
 */        
        RcuUserDel.prototype._initState = function (opt)
        {
            var jFrm = this._jTarget.getFrame();
            var jSelUsername = jFrm.find("select[name='username']");
            this._mapUserNameToLevel(jSelUsername, jFrm.find("input[name='level']"));
        };
        
        RcuUserDel.prototype._mapUserNameToLevel = function (jUser,jLevel)
        {
            var jCurOpt = $.rcu.get("common").getCurrentOption(jUser);
            var level = jCurOpt.val();
            var desc = $.rcu.get("common").getLevelDesc(level);
            jLevel.val(desc);
            jLevel.attr("level",level);
        };
/**
 * private method
 */
        RcuUserDel.prototype._recvSucc = function (result)
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
                            alert("删除用户成功");
                            var jFrm = this._jTarget.getFrame();
                            jFrm.find("select[name='username']").html("");
                            jFrm.find("select[name='username']").rcuselect_usercoll({"action":$.rcu.conststr.action.init,
                                "param":{"level":$.rcu.get("login").getUserLevel()}});
                            this._initState();
                        }
                        else
                        {
                            var jFrm = this._jTarget.getFrame();
                            var jForm = jFrm.getForm();
                            jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                                "param":{"inst":this._jTarget,"type":"error","info":"该用户已被删除"}});
                        }
                    }
                    break;
            }
        };
        
        RcuUserDel.prototype._recvFail = function (result)
        {
        };
        
        RcuUserDel._initialized = true;
    }
};
