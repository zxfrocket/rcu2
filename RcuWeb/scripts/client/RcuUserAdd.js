RcuUserAdd.prototype = new RcuWnd();
function RcuUserAdd(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuUserAdd._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.user_add;
/**
 * public method
 */
        RcuUserAdd.prototype.init = function (opt) 
        {
            
        };
        
        RcuUserAdd.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuUserAdd.php";
                    var processClass = "RcuUserAdd";
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
        
        RcuUserAdd.prototype.submit = function (event)
        {
            var jFrm = this._jTarget.getFrame();
            var username = jFrm.find("input[name='username']").val();
            var password1 = jFrm.find("input[name='password1']").val();
            var password2 = jFrm.find("input[name='password2']").val();
            var jSelLevel = jFrm.find("select[name='level']");
            var jCurOpt = $.rcu.get("common").getCurrentOption(jSelLevel);
            var level = jCurOpt.val();
            if("" == username)
            {
                var jForm = jFrm.getForm();
                jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                    "param":{"inst":this._jTarget,"type":"error","info":"用户名不能为空"}});
            }
            else if("" == password1)
            {
                var jForm = jFrm.getForm();
                jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                    "param":{"inst":this._jTarget,"type":"error","info":"密码不能为空"}});
            }
            else if(password1 != password2)
            {
                var jForm = jFrm.getForm();
                jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                    "param":{"inst":this._jTarget,"type":"error","info":"两次密码不一致"}});
            }
            else
            {
                var opt = {"action":$.rcu.conststr.action.chg,"param":{"username":username,"password":password1,
                           "level":level}};
                this.send(opt);
            }
        };
        
        RcuUserAdd.prototype.open = function (opt)
        {
            //如果当前用户是最低权限的用户，那么他无权利增加新用户
            var lowestLevel = $.rcu.get("common").getLowestLevel();
            var currentLevel = $.rcu.get("login").getUserLevel();
            if(currentLevel >= lowestLevel)
            {
               alert("当前用户无权限");
            }
            else
            {
                /**
                 * 调用父类send函数，发送ajax信息
                 */
                RcuUserAdd.prototype.baseOpen = RcuWnd.prototype.open ;
                this.baseOpen(opt);
            }
        };
        
/**
 * private method
 */
        RcuUserAdd.prototype._recvSucc = function (result)
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
                            alert("添加用户成功");
                            $.rcuwnd_common({"action":$.rcu.conststr.action.notify,
                                "param":{"inst":this._jTarget,"type":"reset"}});
                        }
                        else
                        {
                            var jFrm = this._jTarget.getFrame();
                            var jForm = jFrm.getForm();
                            jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                                "param":{"inst":this._jTarget,"type":"error","info":"用户名已存在"}});
                        }
                    }
                    break;
            }
        };
        
        RcuUserAdd.prototype._recvFail = function (result)
        {
        };
        
        RcuUserAdd._initialized = true;
    }
};
