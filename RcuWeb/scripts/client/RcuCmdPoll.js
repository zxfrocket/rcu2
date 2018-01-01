RcuCmdPoll.prototype = new RcuWnd();
function RcuCmdPoll(opt)
{
    RcuWnd.call(this,opt);
    if (typeof RcuCmdPoll._initialized == "undefined") 
    {
/**
 * private member
 */
        this._opt = opt ;
        this._jTarget = null ;
        this._rcuTagName = $.rcu.conststr.tag.cmd_poll;
/**
 * public method
 */
        RcuCmdPoll.prototype.init = function (opt) 
        {
            
        };
        
        RcuCmdPoll.prototype.send = function (opt) 
        {
            this._sendCmd(this,opt);
        };
        
        RcuCmdPoll.prototype.submit = function (event)
        {
            var opt = this._getCmdOpt(this._jTarget ,this._rcuTagName);
            this.send(opt);
        };
/**
 * protected method
 */        
        RcuCmdPoll.prototype._initState = function (opt)
        {
            this._createIdTrees(this._jTarget);
        };
        
        RcuCmdPoll.prototype._createIdTrees = function (jInst)
        {
            var idTree = $.rcu.get("index").getIdTreeYes();
            if(!!idTree)
            {
                /**
                 * 之所以把rcutree的创建放在这，而不是房子rcuwnd_window
                 * 的content中，是因为如果放在content中，那么相当于在window窗口
                 * 创建出之前就已经创建出了rcutree，这样一来，rcutree中的所有响应
                 * 事件(e.g. click),都必须用live绑定，并且在触发响应时，调用jquery.treeview
                 * 中的函数，因为jquery.treeview是第三方控件，没办法很自如的操作，所有采用后绑定的
                 * 形式：即先生成window，然后在生成rcutree。
                 * window中的btn_ok和select都采用的live形式的前绑定，以为这些都是我自己写的，不是采用
                 * 的第三方控件，操作起来方便，当然可以那么写哟。
                 */
                var jFrm = jInst.getFrame();
                var jDivWrp = jFrm.getIndex();
                jDivWrp.rcutree(idTree,{"flag":{"check":true,"menu":false}});
                var jSubmit = jFrm.getSubmit();
                jSubmit.hide();
                jDivWrp.bind("chkchg",function(event,hasCheck){
                    if(hasCheck)
                    {
                        jSubmit.show();
                    }
                    else
                    {
                        jSubmit.hide();
                    }
                });
            }
        };
        
        RcuCmdPoll.prototype._getCmdOpt = function (jInst,cmd)
        {
            var jFrm = jInst.getFrame();
            var jIndex = jFrm.getIndex();
            var rooms = $.rcu.get("index").getSelIDs(jIndex);
            var cmdItemPairs = getCmdItemPairs(jInst);
            var opt = {"action":$.rcu.conststr.action.chg,"param":{"cmd":cmd,"id":rooms,"data":cmdItemPairs}};
            return opt ;
            
            function getCmdItemPairs(jInst)
            {
                var jFrm = jInst.getFrame();
                var jForm = jFrm.getForm();
                var jSelElem = jForm.find("select");;
                var pairs = [];
                var len = jSelElem.length;
                for(var i = 0; i < len ; ++i)
                {
                    var lightIndex = jSelElem[i].selectedIndex;
                    var opts = jSelElem[i].options;
                    var jCurOpt = $(opts[lightIndex]);
                    var val = jCurOpt.attr("value");
                    var cmditem = $(jSelElem[i]).attr("name");
                    var pair = {"name":cmditem, "value":val};
                    pairs.push(pair);
                }
                
                return pairs;
            };
        };
        
        RcuCmdPoll.prototype._workSucc = function (name)
        {
            var cinfo = $.rcu.get("common").getCmdInfo(name) ;
            alert('"' + cinfo.desc + '"命令,' + "写入工单表成功!");
        };
        
        RcuCmdPoll.prototype._sendCmd = function (jSelf,opt)
        {
            var url = null ;
            var type = "json" ;
            var data = null ;
            
            var action = opt.action ;
            var username = $.rcu.get("login").getUserName();
            $.extend(true,opt.param,{"username":username});
            switch(action)
            {
                case $.rcu.conststr.action.chg:
                    url = "./scripts/server/rcu.php" ;
                    var requireFile = "RcuCmd.php";
                    var processClass = "RcuCmd";
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
                var instance = jSelf;
                
                $.post(url,data,function(result, status, jqXHR){
                    instance.recv(result, status, jqXHR);
                },type);
            }
        };
        
/**
 * private method
 */
        RcuCmdPoll.prototype._recvSucc = function (result)
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
                            this._workSucc(this._rcuTagName);
                        }
                    }
                    break;
            }
        };
        
        RcuCmdPoll.prototype._recvFail = function (result)
        {
        };
        
        RcuCmdPoll._initialized = true;
    }
};
