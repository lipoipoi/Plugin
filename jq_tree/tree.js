(function(){
	$.fn.searchTree = function(setting,zNodes,callBack,el){
        //添加回掉方法
        setting.callback={onClick:tree.onClickTree};
        //初始化方法
        tree.init(this,setting,zNodes,callBack,el);
    }
    var tree = {
        init:function(that,setting,zNodes,callBack,el){
            //输入框元素 tree.obj
            tree.obj=that;
            //属性菜单本体
            tree.el=el;
            //tree的数据源
            tree.zNodes=zNodes;
            //为tree绑定事件
            tree.bindEvent(setting,callBack)
        },
            //绑定事件
        bindEvent:function(setting){
            //设置flag延迟填充时间
            var t= true;
            tree.obj.keyup(function(){
                if(t){
                setTimeout(function(){
                        tree.AutoMatch(setting,callBack)
                        t=true;
                },800)
                }
                t=false;

            })
            //空值时,点击出现下拉树
            tree.obj.on("click",function(){
                if(tree.obj.val().length==0){
                    tree.InitialZtree();
                    $.fn.zTree.init($("#"+tree.el), setting, tree.zNodes);
                    tree.showMenu();
                }
            })
        },
        //点击某个节点 然后将该节点的名称赋值值文本框
        onClickTree:function (e, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(tree.el);
            //获得选中的节点
            var nodes = zTree.getSelectedNodes(),
            v = "";
            //根据id排序
            nodes.sort(function compare(a, b) { return a.id - b.id; });
            for (var i = 0, l = nodes.length; i < l; i++) {
                v += nodes[i].name + ",";
            }
            //将选中节点的名称显示在文本框内
            if (v.length > 0) v = v.substring(0, v.length - 1);
            tree.obj.val(v);
            //隐藏zTree
            tree.hideMenu();
            return false;
        },
        //显示树
        showMenu:function () {
            var cityObj = tree.obj;
            var cityOffset = tree.obj.offset();
            $("#"+tree.el).parent().slideDown("fast");
        },
        //隐藏树
        hideMenu:function () {
            $("#"+tree.el).parent().fadeOut("fast");
            $("body").unbind("mousedown", tree.onBodyDown);
        },
        //注册关闭下拉树的事件
        onBodyDown:function (event) {
            if (!(event.target.id == "menuBtn" || event.target.id == "areaSel" ||  event.target.id == "menuContent" || $("#"+tree.el).parent().length>0)) {
                hideMenu();
            }
        },
        //还原zTree的初始数据
        InitialZtree:function () {
            $.fn.zTree.init($("#"+tree.el), setting, tree.zNodes);
        },
        ///根据文本框的关键词输入情况自动匹配树内节点 进行模糊查找
        AutoMatch:function (setting,callBack) {
            if (tree.obj.val().length > 0) {
                tree.InitialZtree();
                var zTree = $.fn.zTree.getZTreeObj(tree.el);
                var nodeList = zTree.getNodesByParamFuzzy("name", tree.obj.val());
                //回调
                if(nodeList.length==0){
                    tree.zNodes=callBack()
                    $.fn.zTree.init($("#"+tree.el), setting, tree.zNodes);
                    var zTree = $.fn.zTree.getZTreeObj(tree.el);
                    var nodeList = zTree.getNodesByParamFuzzy("name", tree.obj.val());
                }
                //将找到的nodelist节点更新至Ztree内
                $.fn.zTree.init($("#"+tree.el), setting, nodeList);
                tree.showMenu();
            } else {
                //隐藏树
                tree.hideMenu();
                tree.InitialZtree();                
            }              
        }
    }
})()