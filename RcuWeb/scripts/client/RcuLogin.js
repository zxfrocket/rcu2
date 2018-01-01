RcuLogin.prototype = new RcuObject();
function RcuLogin(opt)
{
    RcuObject.call(this,opt);
    if (typeof RcuLogin._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = "login" ;
        this._userInfo = null ;
/**
 * public method
 */
        RcuLogin.prototype.init = function (opt) 
        {
            
        };
        
        RcuLogin.prototype.send = function (opt) 
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuLogin.php";
                    var processClass = "RcuLogin";
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
        
        RcuLogin.prototype.close = function (opt)
        {
            this._jTarget.close();
            this._jTarget = null ;
        };
        
        RcuLogin.prototype.open = function (opt)
        {
            if(!this._jTarget)
            {
                var title = opt.title ;
                if(this._rcuTagName == $.rcu.conststr.tag.login)
                {
                    this._jTarget = $.rcuwnd_login(
                    {
                        "action":$.rcu.conststr.action.init,
                        "param":
                        {
                            "tag":this._rcuTagName,
                            "title":title
                        }
                    });
                }
            }
        };
        
        RcuLogin.prototype.submit = function (event)
        {
            var jFrm = this._jTarget.getFrame();
            var username = jFrm.find("input[name='username']").val();
            var password = jFrm.find("input[name='password']").val();
            if(username == "" || password == "")
            {
                var jForm = jFrm.getForm();
                jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                    "param":{"inst":this._jTarget,"type":"error","info":"用户名和密码不能为空"}});
            }
            else
            {
                var opt = {"action":$.rcu.conststr.action.chg,"param":{"username":username,"password":password}};
                this.send(opt);
            }
        };
        
        RcuLogin.prototype.getUserName = function ()
        {
            return this._userInfo.userName ;
        };
        
        RcuLogin.prototype.getUserLevel = function ()
        {
            return parseInt(this._userInfo.userLevel) ;
        };
        
        RcuLogin.prototype.getUserLast = function ()
        {
            return this._userInfo.lastTime ;
        };
        
        RcuLogin.prototype.getUserCount = function ()
        {
            return this._userInfo.loginCount ;
        };
        
        RcuLogin.prototype.getPassword = function ()
        {
            return this._userInfo.password ;
        };
        
        RcuLogin.prototype.setPassword = function (password)
        {
            this._userInfo.password = password;
        };
        
/**
 * private method
 */
        RcuLogin.prototype._recvSucc = function (result)
        {
            var action = result.action ;
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    var flag = result.flag ;
                    if(flag)
                    {
                        var content = result.content ;
                        this.close();
                        this._userInfo = content.userInfo;
                        this.loadContent();
                    }
                    else
                    {
                        if(!!this._jTarget){
                            var jFrm = this._jTarget.getFrame();
                            var jForm = jFrm.getForm();
                            jForm.rcuwnd_form_error({"action":$.rcu.conststr.action.chg,
                                "param":{"inst":this._jTarget,"type":"error","info":"用户名和密码不匹配"}});
                        }
                    }
                    break;
            }
        };
        
        RcuLogin.prototype._recvFail = function (result)
        {
            alert("数据库返回失败!");
        };
        
        RcuLogin.prototype.loadContent = function ()
        {
            /**
             *TODO:在进行各个子类send ajax数据前，应该先用同步ajax的方式，
             *从server端读取一些必须的信息，这些信息如果没有，那么整个程序
             *将无法运行，这些信息包括：
             *用户信息，第一个楼层信息(不一定是第一层，可能是第7层为第一层)
             */
            var obj = new RcuCommon();
            obj.init();
            obj.send({"action":$.rcu.conststr.action.init});
            $.extend(true,$.rcu.obj,{"common":obj});
            
            /**
             * 创建Frame
             */
            var obj = new RcuFrame();
            obj.init();
            $.extend(true,$.rcu.obj,{"frame":obj});
            
            /**
             * 创建Container
             */
            var obj = new RcuContainer();
            obj.init();
            $.extend(true,$.rcu.obj,{"container":obj});
            
            /**
             * 创建后台的一些对象
             */
            var obj = new RcuBackInst();
            obj.init();
        };
        
        RcuLogin._initialized = true;
    }
};
