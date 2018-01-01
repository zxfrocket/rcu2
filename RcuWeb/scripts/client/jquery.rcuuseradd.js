(function($){
    $.fn.rcuuseradd = function(opt)
    {
        if(!!opt)
        {
            var action = opt.action ;
            var param = opt.param ;
            
            switch (action)
            {
                case $.rcu.conststr.action.init:
                    var desc = param.desc ;
                    var path = param.path ;
                    var wnd = $.window(
                    {
                        icon: path,
                        title: desc,
                        content: "",
                        showFooter: false,
                        resizable: false,
                        maximizable: false,
                        scrollable: false,
                        showModal: true,
                        modalOpacity: 0.7,
                        showRoundCorner: true,
                        width:400,
                        height:300
                    });
                    this.append(wnd);
                    break;
            }
        }
        return this;
    };
    
})(jQuery);
