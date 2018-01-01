RcuUserChgPass.prototype = new RcuWnd();
function RcuUserChgPass(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuUserChgPass._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.user_chgpass;
/**
 * public method
 */
        RcuUserChgPass.prototype.init = function (opt) 
        {
            
        };
        
        RcuUserChgPass.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuUserChgPass.php";
                    var processClass = "RcuUserChgPass";
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
        
        RcuUserChgPass.prototype.submit = function (event)
        {
            var jFrm = this._jTarget.getFrame();
            var oldPass = jFrm.find("input[name='oldpass']").val();
            var newPass1 = jFrm.find("input[name='newpass1']").val();
            var newPass2 = jFrm.find("input[name='newpass2']").val();
            if(oldPass != $.rcu.get("login").getPassword())
            {
                var jForm = jFrm.getForm();
                jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                    "param":{"inst":this._jTarget,"type":"error","info":"旧密码输入错误"}});
            }
            else if(newPass1 != newPass2)
            {
                var jForm = jFrm.getForm();
                jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                    "param":{"inst":this._jTarget,"type":"error","info":"新密码输入不一致"}});
            }
            else
            {
                var opt = {"action":$.rcu.conststr.action.chg,"param":{"username":$.rcu.get("login").getUserName(),
                          "oldpass":oldPass,"newpass":newPass1}};
                this.send(opt);
            }
        };
  
/**
 * protected method
 */        
        RcuUserChgPass.prototype._initState = function (opt)
        {
            var jFrm = this._jTarget.getFrame();
            var username = $.rcu.get("login").getUserName();
            jFrm.find("input[name='username']").val(username);
        };
/**
 * private method
 */
        RcuUserChgPass.prototype._recvSucc = function (result)
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
                            alert("修改密码成功");
                            $.rcu.get("login").setPassword(content.password);
                            $.rcuwnd_common({"action":$.rcu.conststr.action.notify,
                                "param":{"inst":this._jTarget,"type":"reset"}});
                        }
                        else
                        {
                            var jFrm = this._jTarget.getFrame();
                            var jForm = jFrm.getForm();
                            jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                                "param":{"inst":this._jTarget,"type":"error","info":"用户名和旧密码不匹配"}});
                        }
                    }
                    break;
            }
        };
        
        RcuUserChgPass.prototype._recvFail = function (result)
        {
        };
        
        RcuUserChgPass._initialized = true;
    }
};
