RcuUserChgLevel.prototype = new RcuWnd();
function RcuUserChgLevel(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuUserChgLevel._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.user_chglevel;
/**
 * public method
 */
        RcuUserChgLevel.prototype.init = function (opt) 
        {
            
        };
        
        RcuUserChgLevel.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuUserChgLevel.php";
                    var processClass = "RcuUserChgLevel";
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
        
        RcuUserChgLevel.prototype.open = function (opt)
        {
            //如果当前用户之下没有可供删除修改权限的用户
            var currentLevel = $.rcu.get("login").getUserLevel();
            var optArr = $.rcu.get("common").getLowerUserColl(currentLevel);
            if(0 == optArr.length)
            {
               alert("无可供修改权限的用户");
            }
            else
            {
                /**
                 * 调用父类send函数，发送ajax信息
                 */
                RcuUserChgLevel.prototype.baseOpen = RcuWnd.prototype.open ;
                this.baseOpen(opt);
            }
        };
        
        RcuUserChgLevel.prototype.submit = function (event)
        {
            var jFrm = this._jTarget.getFrame();
            var jSelUsername = jFrm.find("select[name='username']");
            var jCurOpt = $.rcu.get("common").getCurrentOption(jSelUsername);
            var username = jCurOpt.text();
            var oldlevel = jFrm.find("input[name='oldlevel']").attr("level");
            var jSelNewLevel = jFrm.find("select[name='newlevel']");
            var jCurOpt = $.rcu.get("common").getCurrentOption(jSelNewLevel);
            var newlevel = jCurOpt.val();
            if("" == username)
            {
                var jForm = jFrm.getForm();
                jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                    "param":{"inst":this._jTarget,"type":"error","info":"用户名不能为空"}});
            }
            else if(oldlevel == newlevel)
            {
                var jForm = jFrm.getForm();
                jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                    "param":{"inst":this._jTarget,"type":"error","info":"权限没有变化"}});
            }
            else
            {
                var opt = {"action":$.rcu.conststr.action.chg,"param":{"username":username,
                          "oldlevel":oldlevel,"newlevel":newlevel}};
                this.send(opt);
            }
        };
        
        RcuUserChgLevel.prototype.change = function (event)
        {
            var jSelElem = $(event.currentTarget);
            if("username" == jSelElem.attr("name"))
            {
                var jFrm = this._jTarget.getFrame();
                $.rcu.get($.rcu.conststr.tag.user_del)._mapUserNameToLevel(jSelElem, 
                        jFrm.find("input[name='oldlevel']"));
            }
            
        };
/**
 * protected method
 */        
        RcuUserChgLevel.prototype._initState = function (opt)
        {
            var jFrm = this._jTarget.getFrame();
            var jSelUsername = jFrm.find("select[name='username']");
            $.rcu.get($.rcu.conststr.tag.user_del)._mapUserNameToLevel(jSelUsername, 
                     jFrm.find("input[name='oldlevel']"));
        };        
/**
 * private method
 */
        RcuUserChgLevel.prototype._recvSucc = function (result)
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
                            var content = result.content ;
                            alert("修改权限成功");
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
                                "param":{"inst":this._jTarget,"type":"error","info":"用户名和旧权限不匹配"}});
                        }
                    }
                    break;
            }
        };
        
        RcuUserChgLevel.prototype._recvFail = function (result)
        {
        };
        
        RcuUserChgLevel._initialized = true;
    }
};
