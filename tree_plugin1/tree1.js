(function($,w){
    w.tree = function(option,treeNode){
        this.options = _.extend({
            el:'tree',
            type:'base',
            data:[],
            preFetch:{
                preNum:1,
                preFetchAjax:{
                    url:'',                          //路径
                    async:true,                      //是否异步，默认为true  
                    contentType:'application/json',  //contentType 默认为content/json
                    type:"get",                      //ajax类型
                    dataType:'json',                 //设置dataType 默认为false
                    data:{},                         //参数
                    success:function(data){          //回调函数
                      console.log(data)
                    }
                }
            }
        },option)
        this.treeNode = _.extend({
            handleFind : this.exports.handleFind,
        },treeNode)
        this.html = ''                                //代码片段容器
        this.resizeData= []                           //原始数据
        this.listData = []                            //截取父子节点关系容器
        this.init = function(){
            var _this  = this;
            if(_this.options.el === '' || _this.options.el === undefined){
                _this.failed('实例化节点不能为空');
            }
            //保存原始数据
            _this.resizeData= $.extend(true,_this.resizeData,_this.options.data);  
            //填充页面
            this.fillHtml()
            // 通过type获取暴露不同的方法
            switch(_this.options.type){
                case 'base' :
                    _this.base()
                    break;
            }
            // 绑定事件
            this.bindEvent()
        }
        this.fillHtml = function(){
            var _this = this
            // 格式化数据
            _.each(_this.options.data,_this.getNewData)
            // 填充初始元素
            this.html +='<ul class="Dtree">'
            _.each(_this.options.data,_this.fillTree)
            this.html +='</ul>'
            // 填充进挂载元素
            $("#"+_this.options.el).empty().append(this.html)
        }
        // 数据格式化
        this.getNewData = function(item,index){
            if(item  === undefined){
                return;
            }
            item.children=[]
            // console.log(item,index,this)
            var _this = this;
            // debugger
            for (var i = _this.options.data.length-1;i >= 0 ;i--) {
                if (_this.options.data[i].pId == item .id) {
                    item.children.push(_this.options.data[i]);
                    _this.options.data.splice(i,1);        
                }
            }
            if(item.children.length>1){
                _.each(item.children,_this.getNewData)
            }
        }.bind(this)
        // 填充树菜单
        this.fillTree = function(item,index){
            var _this = this
            var IconState = item.open === true ? "bottom_open":"center_close",
                IcoState = item.open === true ? "ico_open":"ico_close",
                endData = ''
                if(item.children == undefined || item.children.length == 0){
                    endData = 'endData=true'
                    // _this.getAjax(_this.options.preFetch.preFetchAjax,$(this))
                }
            this.html +='<li>'
            this.html +='<span '+endData+' data-id="'+item.id+'" class="iCon button level'+item.pId+' switch '+IconState+'" treenode_switch></span>'
            this.html +='<a treenode_a><span class="childIco button '+IcoState+'" style="width:0px;height:0px;" treenode_ico ></span><span class="node_name">'+item.name+'</span></a>'
            if(item.children !== undefined && item.children.length>0){
                var isShow = item.open === true? "display:block":"display:none"
                this.html +='<ul style="'+isShow+'">'
                _.each(item.children,_this.fillTree)   
                this.html +='</ul>'
            }
            this.html +='</li>'
        }.bind(this)
        // 错误提示方法
        this.failed = function (exp){
            // console.log(exp)
            console.error('error:'+exp)
        }
        // 绑定tree
        this.bindEvent = function(){
            var _this = this
            // 图标展开关闭事件
            $("#"+_this.options.el).on('click','.iCon',function(e){
                e.stopPropagation();
                if($(this).attr("endData") == "true"){
                    $(this).addClass('ico_loading')
                    _this.getAjax(_this.options.preFetch.preFetchAjax,$(this))
                }
                if($(this).hasClass('bottom_open')){
                    $(this).addClass('center_close').removeClass('bottom_open').siblings('ul').toggle()
                }else{
                    $(this).addClass('bottom_open').removeClass('center_close').siblings('ul').toggle()
                }
            })
            // 点击label事件
            $("#"+_this.options.el).on("click",'a',function(e){
                e.stopPropagation();
                $("#"+_this.options.el).find('a').removeClass('curSelectedNode')
                $(this).addClass('curSelectedNode')
                var id= $(this).parents("li:first").children('span').attr('data-id'),
                    node = $(this),
                    data = _.find(_this.resizeData,function(item){return item.id === id})
                    _this.options.onClick(data,id,node)
            })
        }
        // Node节点
        this.getNode = function(){
            new Node()
        }
        this.Node = {
         z   
        }
        // 树的模式
        this.base = function(){
            this.getAjax = this.exports.getAjax;
            this.focusById = this.exports.focusById;
            this.handleUpdate = this.exports.handleUpdate;
            this.handleDelte = this.exports.handleDelte;
            this.handleAdd = this.exports.handleAdd;
            this.getparent = this.exports.getparent;
            this.getChildList = this.exports.getChildList;
        }
        // 树的所有方法
        this.exports = {
            'getAjax':function(ajax,node){
                var _this = this;
                $.ajax({
                    contentType:ajax.contentType,
                    type: ajax.type,//请求方式为get
                    dataType: ajax.dataType, //返回数据格式为json
                    url:ajax.url,
                    async:ajax.async,
                    data:ajax.data,
                    success:function(data){
                        if(data.code === 0){
                            _this.resizeData =  _this.resizeData.concat(data.data)
                            _this.html = '';
                            _this.html +='<ul>'
                            _.each(data.data,_this.fillTree)
                            _this.html +='</ul>'   
                            node.parents("li:first").append(_this.html)
                            node.removeAttr('endData').removeClass('ico_loading')
                            ajax.success(data)
                        }else{
                            _this.failed(data.msg)
                        }
                    },
                    error:function(err){
                        _this.failed(err)
                    }
                })
            },
            // 手动查找tree节点，返回当前节点a标签;
            'handleFind' : function(id){
                var _this = this;
                var  node = $("#"+_this.options.el).find('span[data-id="'+id+'"]').next('a')
                return node;
            },
            // 通过id 节点获取焦点；
            'focusById' : function(id){
                var _this = this;
                var node = $("#"+_this.options.el).find('span[data-id="'+id+'"]').next('a')
                node.trigger('click')
                node.parents('ul').siblings("span").addClass('bottom_open').removeClass('center_close')
                node.parents('ul').show()
                
            },
            // 手动修改tree节点
           'handleUpdate' : function(id,name){
            var _this = this;
                var  node = $("#"+_this.options.el).find('span[data-id="'+id+'"]').next('a')
                _.map(_this.resizeData,function(item,index){if(item.id === id){_this.resizeData[index].name = name}})
                node.children('.node_name').text(name)
            },
            // 手动删除tree节点
            'handleDelte' : function(id){ 
                var _this = this;
                var  node = $("#"+_this.options.el).find('span[data-id="'+id+'"]').next('a')
                var data = _.find(_this.resizeData,function(item){return item.id === id})
                _this.resizeData = _.without(_this.resizeData,data);
                node.parents('li:first').remove()
            },
            // 手动添加tree节点
            'handleAdd' : function(id,data){
                var _this = this;
                var  node = $("#"+_this.options.el).find('span[data-id="'+id+'"]').next('a').parents('li:first')
                _this.resizeData =  _this.resizeData.concat(data)
                _this.html = '';
                _this.html +='<ul>'
                _.each(data,_this.fillTree)
                _this.html +='</ul>' 
                node.append(_this.html)
            },
            // 向上获取父节点
            'getparent' : function(id){
                var data = _.find(this.resizeData,function(item){return item.id  === id});
                // console.log(data)
                if(data === undefined){
                    this.failed('找不到相关id的节点')
                    return false
                }else{
                    var parentData = _.find(this.resizeData,function(item){return item.id === data.pId})
                    if(parentData === undefined){
                        return false;
                    }else{
                       return parentData;
                    }
                }
            },
            // 获取所有子节点
            'getChildList' : function(id){
                var _this  = this;
                var data = _.find(this.resizeData,function(item){return item.id  === id});
                if(data === undefined){
                    return false
                    this.failed('找不到相关id的节点')
                }else{
                    var childData = _.filter(this.resizeData,function(item){return item.pId === data.id})
                    if(childData === undefined || childData.length <=0){
                        return false
                    }else{
                        _.each(childData,function(item){
                            _this.listData = _this.listData.concat(item);
                        })
                    }
                }
                return this.listData
            }
        }
    }
})(jQuery,window)
