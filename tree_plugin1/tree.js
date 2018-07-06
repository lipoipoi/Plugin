(function($){
    //让bind函数支持IE8
    if (!Function.prototype.bind) { 
        Function.prototype.bind = function (oThis) { 
        if (typeof this !== "function") { 
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); 
        } 
        var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {}, 
        fBound = function () { 
        return fToBind.apply(this instanceof fNOP && oThis 
        ? this
        : oThis, 
        aArgs.concat(Array.prototype.slice.call(arguments))); 
        }; 
        fNOP.prototype = this.prototype; 
        fBound.prototype = new fNOP(); 
        return fBound; 
        }; 
    }
   var dTree = function(el,setting,zNodes,callBack){
        this.el = el;                                 //节点
        this.orginData = zNodes || [];                      //数据
        this.data= []                               //原始数据
        this.html = ''                                //代码片段容器
        this.listData = []                          //数据容器    
        this.dragFlag = false                            //拖拽状态
        this.dragNode = ''                            //拖拽节点       
        this.dropNode = ''                            //投放区节点
        this.drag = ''                                //本身节点
        this.dragHtml = ''                            //拖拽悬浮节点
        this.sameDrop = true                         //判断是否为同个位置，或者其他区域
        this.setting = $.extend(true,{},{                   //配置
            node:{
                icon:'check'                               //节点图标
            },
            callBack:{
                beforeCollapse:function(){},                //展开前的回调
                onCollapse:function(){},                    //展开后的回调
                beforeClick:function(){},                   //点击前的回调
                onClick:function(){},                       //点击后的回调
                beforeDblClick:function(){},                //双击前的回调
                onDblClick:function(){},                     //双击后的回调
                beforeDrag:function(){},                     //拖拽前的回调
                afterDrag:function(){}                      //拖拽后的回调
            },
            preFetch:{
                preNum:'1',
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
            },
            drag:{
                dragable:true,

            }
        },setting)
        this.init = function(){
            var _this  = this;
            if(_this.el === '' || _this.el === undefined){
                _this.failed('实例化节点不能为空');
            }
            //保存原始数据
            _this.data= $.extend(true,_this.data,_this.orginData);
            // 注册填充树的方法
            this.fillTree = functions.fillTree.bind(this);  
            //填充页面
            this.fillHtml()
            // 绑定事件
            this.bindEvent()
            // 开启预加载
            this.startPreFetch($("#"+this.el).find('span[enddata = "true"]'))
        }
        this.fillHtml = function(){
            var _this = this
            // 格式化数据
            _.each(_this.data,_this.getNewData)
            // 填充初始元素
            this.html +='<ul class="Dtree">'
            _.each(_this.data,_this.fillTree)
            this.html +='</ul>'
            // 填充进挂载元素
            $("#"+_this.el).empty().append(this.html)
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
            for (var i = _this.data.length-1;i >= 0 ;i--) {
                if (_this.data[i].pId == item .id) {
                    item.children.push(_this.data[i]);
                    _this.data.splice(i,1);        
                }
            }
            if(item.children.length>1){
                _.each(item.children,_this.getNewData)
            }
        }.bind(this)
        // 预加载
        this.startPreFetch = function(nodes){
            var _this = this
            var  endList =_.toArray(nodes)
            _.each(endList,function(item,index){
                functions.getAjax.apply(_this,[_this.setting.preFetch.preFetchAjax,$(item)])
            })
        }
        // 刷新整颗树
        this.refresh = function(newData){
            this.orginData= $.extend(true,this.orginData,newData);
            this.data=newData;
            this.html = '';
            this.fillHtml();
        }
        // 打开树里某一个node节点
        this.open = function(id){
            functions.openNode.apply(this,[id])
            _.find(this.orginData,function(item){return item.id === id}).open = true
        }
        // 关闭树里某一个node节点
        this.close = function(id){
            functions.closeNode.apply(this,[id])
            _.find(this.orginData,function(item){return item.id === id}).open = false
        }
        // 错误提示方法
        this.failed = function (exp){
            // console.log(exp)
            console.error('error:'+exp)
        }
        this.bindEvent = function(){
            var _this = this
            // 图标展开事件
            $("#"+_this.el).on('click','.iCon',function(e){
                e.stopPropagation();
                var id = $(this).attr("data-id")
                _this.setting.callBack.beforeCollapse(id, new _this.dNode(id,_this));
                if($(this).hasClass('bottom_open')){
                    $(this).next('a').children('.button').addClass('ico_close').removeClass('ico_open')
                    $(this).addClass('center_close').removeClass('bottom_open').siblings('ul').toggle()
                    functions.getNodeData.apply(_this,[_this.orginData,id])
                }else{
                    if($(this).attr('preFected')!== 'true'){
                        console.log($(this).siblings('ul').find('li span[enddata="true"]'))
                        _this.startPreFetch($(this).siblings('ul').children('li').children('span[enddata="true"]'))
                    }
                    $(this).attr('preFected','true')
                    $(this).next('a').children('.button').addClass('ico_open').removeClass('ico_close')
                    $(this).addClass('bottom_open').removeClass('center_close').siblings('ul').toggle()
                    functions.getNodeData.apply(_this,[_this.orginData,id])
                }
                _this.setting.callBack.onCollapse(id, new _this.dNode(id,_this));
            })
            // 禁用文本复制事件            
            $(document).bind("selectstart",function(){return false;})
            //拖拽事件
            var _thisNode = ''
            var _thisDropNode = ''
            $("#"+_this.el).on("mousedown",'.node_name',function(e){
                e.stopPropagation();
                var id= $(this).parent('a').parent("li").children('span').attr('data-id')
                _this.setting.callBack.beforeClick(id,new _this.dNode(id,_this))
                $("#"+_this.el).find('a').removeClass('curSelectedNode')
                $(this).parent('a').addClass('curSelectedNode')
                _this.setting.callBack.onClick(id,new _this.dNode(id,_this))
                if(_this.setting.drag.dragable){
                    _thisNode = $(this).parent('a');
                    e = e || window.event;
                    __xx = e.pageX || e.clientX + document.body.scroolLeft;
                    __yy = e.pageY || e.clientY + document.body.scrollTop;
                    _this.setting.callBack.beforeDrag()
                    _this.dragFlag = true;
                    _thisDropNode = $(this).parent('a');
                    _this.dragNode = _thisDropNode.parent('li')
                    _this.drag  ="<li>"+_this.dragNode.html()+"</li>"
                    _this.dragHtml = $("<ul class='zTreeDragUL Dtree'>"+_this.drag+"</ul>").css({
                        'position':'absolute',
                        'left':__xx+'px',
                        'top':__yy+'px'
                    }).appendTo($('body'))
                }else{
                    return false;
                }
            })
            // 鼠标移动事件
            $(document).on("mousemove","#"+_this.el,function(e){
                e = e || window.event;
                __xx = e.pageX || e.clientX + document.body.scroolLeft;
                __yy = e.pageY || e.clientY + document.body.scrollTop;
                if(_this.dragFlag ==true){
                    _this.dragHtml.css({
                        'position':'absolute',
                        'left':__xx+'px',
                        'top':__yy+'px'
                    })
                }
                })
            // 鼠标移动出tree时候
            // $(document).on("mouseout","#"+_this.el,function(e){
            //     e.stopPropagation();
            //     console.log(111)
            //     _this.dragFlag = false;
            //     $('.zTreeDragUL').remove()
            //     return false;
            // })
            // 节点放入放出事件
            $("#"+_this.el).on('mouseover','a',function(){
                if(_this.dragFlag == true){
                    $(this).addClass('dragIn')
                    var selfId= $(this).prev('span').attr('data-id');
                    functions.getAllData.apply(_this,[_thisNode.prev('span').attr('data-id'),_this.orginData])
                    console.log(_this.listData)
                    if(_.find(_this.listData,function(item){return item.id === selfId})){
                        _this.sameDrop = true;
                    }else{
                        _this.sameDrop = false;
                        _thisDropNode = $(this);
                    }
                }
            }).on("mouseout",'a',function(){
                $(this).removeClass('dragIn')
            })
            // 鼠标弹起事件
            $(document).on("mouseup",'.node_name',function(e){
                    console.log(_this.sameDrop)
                try{
                    if(_this.sameDrop){
                        _this.dragFlag = false;
                        $('.zTreeDragUL').remove()
                        return false;
                    }else{
                        var dragId = _thisNode.prev('span').attr('data-id')
                        var dropId = _thisDropNode.prev('span').attr('data-id')
                        var daragData = _.find(_this.orginData,function(item){return item.id == dragId})
                        _this.setting.callBack.afterDrag(dragId,dropId,daragData)
                        _this.sameDrop = true;
                        _this.dragFlag = false;
                        $('.zTreeDragUL').remove()
                        _thisDropNode.next('ul').append(_this.drag);
                        if(dragId !== dropId){
                            _this.dragNode.remove()
                        }
                        _this.dragHtml = '';
                    }
                }catch(e){console.log(e)}
            }) 
            // 其他区域弹起事件
            $(document).on("mouseup",function(){
                _this.dragFlag = false;
                $('.zTreeDragUL').remove()
                return false;
            })
            // 双击label事件
            $("#"+_this.el).on("dblclick",'a',function(e){
                e.stopPropagation();
                var id= $(this).parents("li:first").children('span').attr('data-id')
                _this.setting.callBack.beforeDblClick(id,new _this.dNode(id,_this))
                _this.setting.callBack.onDblClick(id,new _this.dNode(id,_this))
            }) 
        }
        // 获取某一个节点
        this.getNodesById = function(id){
            var isExist=_.find(this.orginData,function(item){return item.id === id})
            if(isExist === undefined || isExist ===null){
                this.failed('没有相关ID')
            }else{
                var nodes = new this.dNode(id,this)
                nodes.init()
                return nodes
            }
        }
        // 手动删除某节点
        this.del = function(node,callBack){
            var _this = this
            _this.listData = []
            functions.getAllChildren.apply(this,[this.orginData,node.id])
            _.each(_this.listData,function(item){
                functions.handleDelte.apply(_this,[item.id])
            })
            functions.handleDelte.apply(_this,[node.id])
            if(typeof callBack == 'function'){
                callBack()
            }
        }
   }
   dTree.prototype.dNode = function(id,that){
      this.parentObj = that
      this.id = id;
      this.el = that.el;
      this.nodeEl = $('.Dtree').find("li span[data-id='"+id+"']");
      this.html ='';
      this.listData = []                            //截取父子节点关系容器  
      this.node = $('.Dtree').find("li span[data-id='"+id+"']").next('a')
      this.init = function(){
        this.fillTree = functions.fillTree.bind(this);  
        this.bindEvent()
      }     
    // 错误提示方法
    this.failed = function (exp){
        // console.log(exp)
        console.error('error:'+exp)
    }
    // 获取子节点  
      this.children = function(){
         this.listData = []
         functions.getChildList.apply(this,[this.id])
         return this.listData
      }
    // 获取父节点
      this.parent = function () {
       return functions.getparent.apply(this,[this.id]);
      }   
    // 手动添加本节点
       this.add = function(data,callBack){
        functions.handleAdd.apply(this,[this.id,data])
          if(typeof callBack == 'function'){
            callBack(this.id,this.node)
          }
       }
    // 手动修改本节点
       this.update = function(name,callBack){
        functions.handleUpdate.apply(this,[this.id,name])

           if(typeof callBack == 'function'){
             callBack(this.id,this.node)
           }
       }
    //    复制节点
       this.clone = function(obj){
          return functions.clone.apply(this,[obj])
       }
    //  手动刷新本节点
       this.refreshNode = function(callBack){
        var _this = this
        _this.listData = []
        functions.getAllChildren.apply(_this,[_this.parentObj.orginData,_this.id])
        _.each(_this.listData,_this.getNewData)
        _this.html = '';
        _.each(_this.listData,_this.fillTree)
        _this.node.next('ul').html(_this.html)
        if(typeof callBack == 'function'){
            callBack(this.id,this.node)
          } 
       }
    // 获取节点数据
        this.getData = function(){
            return functions.getNodeData.apply(this,[this.id,this.parentObj.orginData])
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
        for (var i = _this.listData.length-1;i >= 0 ;i--) {
            if (_this.listData[i].pId == item .id) {
                item.children.push(_this.listData[i]);
                _this.listData.splice(i,1);        
            }
        }
        if(item.children.length>1){
            _.each(item.children,_this.getNewData)
        }
    }.bind(this)
    this.bindEvent = function(){
        var _this = this
        // 点击check事件事件
        $("#"+_this.el).on("click",'.chk',function(e){
            e.stopPropagation();
            if($(this).hasClass('checkbox_false_full')){
                $(this).addClass('checkbox_true_full').removeClass('checkbox_false_full')
            }else{
                $(this).addClass('checkbox_false_full').removeClass('checkbox_true_full')
            }
        }) 
    }
    this.check = function(){
        var _this = this;
        functions.getAllData.apply(_this,[_this.id,_this.parentObj.orginData])
        _.each(_this.listData,function(item){
            $('.Dtree').find("li span[data-id='"+item.id+"']").next('a').children('.childIco').addClass('checkbox_true_full').removeClass('checkbox_false_full')
        })    
    }
   }
   var functions = {
         // 填充树菜单
    'fillTree' : function(item,index){
        var _this = this.orginData ? this : this.parentObj;
        switch(_this.setting.node.icon){
            case 'button':
            var iconClass = ''
                break;
            case 'check':
            var iconClass='chk checkbox_false_full'
                break;
            default:
            var iconClass = 'none'
            break
        }
        var IconState = item.open === true ? "bottom_open":"center_close",
            IcoState = item.open === true ? "ico_open":"ico_close",
            endData = ''
            if(item.children == undefined || item.children.length == 0){
                endData = 'endData=true'
                // _this.getAjax(_this.options.preFetch.preFetchAjax,$(this))
            }
        this.html +='<li>'
        this.html +='<span '+endData+' data-id="'+item.id+'" class="iCon button level'+item.pId+' switch '+IconState+'" treenode_switch></span>'
        this.html +='<a treenode_a><span class="childIco button '+IcoState+' '+iconClass+'"   treenode_ico ></span><span class="node_name">'+item.name+'</span></a>'
        if(item.children !== undefined && item.children.length>0){
            var isShow = item.open === true? "display:block":"display:none"
            this.html +='<ul style="'+isShow+'">'
            _.each(item.children,_this.fillTree)   
            this.html +='</ul>'
        }
        this.html +='</li>'
    },
    'getAjax':function(ajax,node){
        var _this = this.orginData ? this : this.parentObj;
        $.ajax({
            contentType:ajax.contentType,
            type: ajax.type,        //请求方式默认为get
            dataType: ajax.dataType, //返回数据格式为json
            url:ajax.url,
            async:ajax.async,
            data:ajax.contentType.indexOf('application/json') > -1 ?JSON.stringify({id:node.attr('data-id')}) : {id:node.attr('data-id')},
            success:function(data){
                if(data.code === 0){
                    _this.orginData =  _this.orginData.concat(data.data)
                    var returnData = ajax.success(data)
                    _this.html = '';
                    if(node.hasClass('center_close')){
                        _this.html += '<ul style ="display:none">'
                    }else{
                        _this.html +='<ul>'
                    }
                    _.each(returnData,_this.fillTree)
                    _this.html +='</ul>'   
                    node.parent("li").append(_this.html)
                    node.removeAttr('enddata')
                    // debugger;
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
        var _this = this.orginData ? this : this.parentObj;
        var  node = $("#"+_this.el).find('span[data-id="'+id+'"]').next('a')
        return node;
    },
    // 通过id 节点获取焦点；
    'focusById' : function(id){
        var _this = this.orginData ? this : this.parentObj;
        var node = $("#"+_this.el).find('span[data-id="'+id+'"]').next('a')
        node.trigger('click')
        node.parents('ul').siblings("span").addClass('bottom_open').removeClass('center_close')
        node.next('a').children('.button').addClass('ico_open').removeClass('ico_close')
        node.parents('ul').show()       
    },
    // 通过id打开某个节点
    'openNode' : function (id){
        var _this = this.orginData ? this : this.parentObj;
        var node = $("#"+_this.el).find('span[data-id="'+id+'"]')
        node.addClass('bottom_open').removeClass('center_close')
        node.next('a').children('.button').addClass('ico_open').removeClass('ico_close')
        node.siblings('ul').show()  
    },
    // 通过id关闭某个节点
    'closeNode': function(id){
        var _this = this.orginData ? this : this.parentObj;
        var node = $("#"+_this.el).find('span[data-id="'+id+'"]')
        node.addClass('center_close').removeClass('bottom_open')
        node.next('a').children('.button').addClass('ico_close').removeClass('ico_open')
        node.siblings('ul').hide()  
    },
    // 手动修改tree节点
   'handleUpdate' : function(id,name){
    var _this = this.orginData ? this : this.parentObj;
        var  node = $("#"+_this.el).find('span[data-id="'+id+'"]').next('a')
        _.map(_this.orginData,function(item,index){if(item.id === id){_this.orginData[index].name = name}})
        node.children('.node_name').text(name)
    },
    // 手动删除tree节点
    'handleDelte' : function(id){ 
        var _this = this.orginData ? this : this.parentObj;
        var  node = $("#"+_this.el).find('span[data-id="'+id+'"]').next('a')
        var data = _.find(_this.orginData,function(item){return item.id === id})
        _this.orginData = _.without(_this.orginData,data);
        node.parents('li:first').remove();
    },
    // 手动添加tree节点
    'handleAdd' : function(id,data){
        var _this = this.orginData ? this : this.parentObj;
        var isExist = functions.getNodeData(id,_this.orginData);
        if(isExist === undefined){
            _this.failed('没有找到相应id的节点')
            return false;
        }else{
            var  node = $("#"+_this.el).find('span[data-id="'+id+'"]').next('a').parents('li:first')
            _this.orginData = _this.orginData.concat(data)
            _this.html = '';
            if(node.children('ul').length == 0 || node.children('ul') == undefined){
                _this.html +='<ul>'
            }
            _.each(data,_this.fillTree)
            if(node.children('ul').length == 0 || node.children('ul') == undefined){
                _this.html +='</ul>' 
                node.append(_this.html)
            }else{
                node.children('ul').append(_this.html)
            }
        }
    },
    // 向上获取所有祖先节点
    'getAllParent':function(data,pId){
        var _this = this
        var parent = functions.getNodeData.apply(_this,[pId,data])
        if(parent  == undefined || parent.length <=0){
            return _this.listData
            return false;
        }else{
                _this.listData  = _this.listData.concat(parent)
               functions.getAllParent.apply(_this,[data,parent.pId]);
        }
    },
    // 向上获取父节点
    'getparent' : function(id){
        var _this = this.orginData ? this : this.parentObj;
        var data = functions.getNodeData(id,_this.orginData);
        // console.log(data)
        if(data === undefined){
            this.failed('找不到相关id的节点')
            return false
        }else{
            var parentData = _.find(_this.orginData,function(item){return item.id === data.pId})
            if(parentData === undefined){
                return false;
            }else{
               return new _this.dNode(parentData.id,_this);
            }
        }
    },
    // 向下获取所有子节点
    'getAllChildren' : function(data,id){
        var _this = this
        var childList = _.filter(data,function(item){return id === item.pId})
        if(childList  == undefined || childList.length <=0){
            return false;
        }else{
            _.each(childList,function(item){
                _this.listData  = _this.listData.concat(item)
               functions.getAllChildren.apply(_this,[data,item.id]);
            })
        }
    },
    // 获取子节点
    'getChildList' : function(id){
        var _this = this
        var data = functions.getNodeData(id,_this.parentObj.orginData);
        if(data === undefined){
            return false
            this.failed('找不到相关id的节点')
        }else{
            var childData = _.filter(this.parentObj.orginData,function(item){return item.pId === data.id})
            if(childData === undefined || childData.length <=0){
                return false
            }else{
                _.each(childData,function(item){
                    _this.listData = _this.listData.concat(new _this.parentObj.dNode(item.id,_this));
                })
            }
        }
        return this.listData
    },
    // 复制节点
    'clone': function (obj) {
        if (obj === null) return null;
        var o = functions.isArray(obj) ? [] : {};
        for (var i in obj) {
            o[i] = typeof obj[i]  === 'object' ? functions.clone(obj[i]):obj[i]
        }
        return o;
    },
    // 判断是否数组
    'isArray': function (arr) {
        return Object.prototype.toString.apply(arr) === "[object Array]";
    },
    // 获取原始数据
    'getNodeData' : function(id,data){
        return _.find(data,function(item){return item.id ===id})
    },
    // 获取所有关联数据
    'getAllData' : function(id,data){
        var _this = this;
        var selfData =functions.getNodeData.apply(_this,[id,data])
        var pId = selfData.pId
        _this.listData = [].concat(selfData);
        functions.getAllParent.apply(_this,[data,pId])
        functions.getAllChildren.apply(_this,[data,id])
    }
    
  } 
   $.fn.dTree = function(el,setting,zNodes){
   var dTreeObj =  new dTree(el,setting,zNodes)
   dTreeObj.init();
   return dTreeObj;
}
})(jQuery)
