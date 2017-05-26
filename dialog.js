/**
 * Created by Administrator on 2016/8/24.
 * author:mccree
 * e-mail:692690360@qq.com
 */

(function($){
	/**
	 * 弹出框
	 */
    var diaLog = {
        init  : function(obj,args){
            return(function(){
                diaLog.fillStyle(obj,args);
                diaLog.bindEvent(obj,args);
            })()
        },
        fillStyle : function(obj,args){
            return (function(){
                var scrolltops =$(window.parent.document).scrollTop()+100;
                var str ='<div class="dialog" id="dialog">';
                str +='<div class="dialogBg"></div>'
                str += '<div class="dialogBox">';
                str += '<div class="dialogTitle">';
                str +=args.title;
                str +=' <span class="dialogCloseBtn">X</span>';
                str +=  ' </div>';
                str += ' <div class="dialogContainer">';
                if(args.url!=''){
                    str+="<iframe name='dialogFrame' src='"+args.url+"' width='100%' height='"+(parseInt(args.height)-80)+"' frameborder='0'></iframe>"
               }else{

                   str += args.container;

               }
                str +=  '   </div>';
                str +=  '   <div class="dialogBtns">';
                if(args.url!=''){
                    
               }else{
            	   //2016-11-17 19:04 lwk 修改点击确定事件将原来的<a href="javascript:void(0)" class="dialogButton">确定</a>改成<a href="#" class="dialogButton">确定</a>
                str +=  '  <a href="#" class="dialogButton">确定</a>'
                }
                str +=  '  </div>';
                str += '   </div>';
                obj.append(str);
                obj.find(".dialog").css({width: '100%',height:'100%',position: 'fixed',top:'0px',left: '0',zIndex:'100'});
                obj.find('.dialogBg').css({position:'absolute',zIndex:'101',width: '100%',height:'100%',top:'0px',left: '0',backgroundColor:'#000',opacity:'0.3'})
                obj.find(".dialogBox").css({opacity:'1',position:'absolute',width: args.width+"px",height:args.height+'px',overflow: "hidden",backgroundColor:"#fff",border:" 2px solid #53afff",top:(obj.height()-args.height)/2+'px',left:(obj.width()-args.width)/2+'px',zIndex:'999'});
                obj.find(".dialogTitle").css({fontSize:"18px",color: "#fff",fontWeight:"bold", padding:"0 20px 0 20px",height:"40px",lineHeight:"40px",backgroundColor: "#53afff", position: "relative"})
                obj.find(".dialogCloseBtn").css({display: "inline-block",height:"42px",textAlign:"center",width:"42px",lineHeight:"44px",backgroundColor:"#53afff",position:"absolute", right: "-2px",top: "-2px",cursor:" pointer"})
                obj.find(".dialogButton").css ({display: "inline-block",backgroundColor: "#53afff", height: "25px", width:"72px", lineHeight: "25px", color: "#fff",textAlign: "center", margin: "20px",float: "right" })
                obj.find(".dialogBtns").css({position: 'absolute',bottom: '0',right: '0'})
                obj.find(".dialogContainer").css({ padding:"20px",backgroundColor:'#fff'});
            })()
        },

        bindEvent  : function(obj,args){
            return function(){/*
                obj.off("click",".dialogCloseBtn");
                obj.off("click",".dialogButton");*/
                obj.on("click",".dialogCloseBtn",function(){
                    obj.find("#dialog").remove();
                });
                obj.on("click",".dialogButton",function(){
                	if(args.isClose)
                	{
	                	if (typeof (args.callBackFn) == 'function') {
	                        args.callBackFn();
	                    }
	                    obj.find("#dialog").remove();
                	}else{
                		if (typeof(args.callBackFn) == 'function') {
	                       args.callBackFn( obj);
	                    }
                	}
                });
                /*obj.parent().parent().on("scroll",function(){
                	obj.find(".dialog").css({top:obj.scrollTop()+'px'})
                })*/
            }()
        }
    }
    $.dialog =function(options){
        var args = $.extend({
        	 title:"dialog demo",              //左上角标题
             url:"",                          //url
             height:200,                  //高度
             container :"",              //内容
             isClose :true,  
             width:400 ,				//宽度
             callBackFn:function(){}  	//回调                
        },options);
        var obj =$(self.parent.document).find('body');
        diaLog.init(obj,args);
    }
 /**
 * comfrim对话框
 */
   var m={
        init:function(obj,args){
            return (function(){
                m.fillHtml(obj,args);
                m.bindEvent(obj,args);
            })()
        },
        fillHtml:function(obj,args){
           return (function(){
               var str="";
               str += "<div style='width: 100%;height: 100%;position: fixed;z-index: 9;top:0;left: 0; ' id='oAlert';>"
            	   str +="<div class='oAlertBg' style='position:absolute;z-index:11;width: 100%;height:100%;top:0;left:0;background-color:#000;'></div>"
	               str +="<div style='position:absolute;top:"+(obj.height()-200)/2+"px;left:"+(obj.width()-400)/2+"px;width: 400px;height: 200px;background-color: white;border: 1px solid #53afff;box-shadow: 2px 2px 2px #53afff;z-index:100' id='alertBox';>"
               str +="<p  style='padding: 5px 0;color:#fff;text-align: center;background-color:#53afff;font-weight: bold'>"+args.title+"</p>"
               str +="<div style='margin-top: 50px;height:50px;padding-left: 10px;font-size: 14px;text-align:center;'>"+args.container+"</div>"
               //2016-11-17 19:07 lwk 修改点击确定事件将原来的 href='javascript:void(0)'改成<a href="#">确定</a>
               
               
               str +="<div  style='text-align: center;position: absolute;bottom: 10px;width: 100%;'> "
            	  str+="<a href='#' id='alert_sure' class='btn btn-primary' style='display: inline-block;color: #fff;background-color: #53afff;width: 80px;height: 30px;text-align: center;line-height: 30px;margin: 10px;'>确认</a>";
//            	   str+="<button  id='alert_sure' class='btn btn-primary' style='display: inline-block;color: #fff;background-color: #53afff;width: 80px;height: 30px;text-align: center;line-height: 30px;margin: 10px;'>确认</button>";
            	   //2016-11-17 19:07 lwk 修改点击确定事件将原来的 href='javascript:void(0)'改成<a href="#">确定</a>
            	   str +="<a href='#'style='display: inline-block;color: #fff;background-color: #53afff;width: 80px;height: 30px;text-align: center;line-height: 30px;margin: 10px;'  id='alert_pass' class='btn btn-primary'>取消</a></div>"
               str +="</div></div>";
     			  obj.find("#oAlert").remove();
               obj.append(str);
               obj.find('.oAlertBg').css({opacity:'0.3'})
           })()
        },
        bindEvent:function(obj,args){
        	obj.off("click","#alert_sure");
        	obj.off("click","#alert_pass");
            return(function(){
                obj.on("click","#alert_sure",function(e){
                	
                    if (typeof(args.callBack) == 'function') {
                        args.callBack(true);
                    }
//                    alert(args.isCloseWindow);
                    if(args.isCloseWindow==false)//为解决弹出点击确定无法提交form表单而增加属性、在处理后用户自己销毁对话框
                    {
                    	var  divAP=$(this).parent().parent().parent(); 
                        divAP.hide();
                    }else{
                    	  obj.find("#oAlert").remove();
                    }
                });
                obj.on("click","#alert_pass",function(e){
                    if (typeof(args.callBack) == 'function') {
                        args.callBack(false);
                        obj.find("#oAlert").remove();
                    }
                });
            })()
        }
    }
    $.oAlert=function(options){
        var data= $.extend({
            title:'提示',
            container:'是否删除',
            isCloseWindow:true,
            callBack:function(){}
        },options)
        var obj =$(self.parent.document).find('body');
        m.init(obj,data)
    }

   var s={
		  init:function(obj,args){
            return (function(){
                s.fillHtml(obj,args);
            })()
        },
        fillHtml:function(obj,args){
        	return(function(){
            	var str="";
            	str += "<div id='dialogOut' class='dialogOut'>"
            	str += "<div class='dialogOutBg'></div>"
            	str +="<p class='dialogOutContainer'>"+args.container+"</p>"
            	str +="</div>"
        		obj.append(str);
            	obj.find(".dialogOut").css({display:'none',position:'fixed',top:'20px',left:'35%',zIndex:'191',width:'30%',height:'40px',borderRadius: '5px'})
           	    obj.find("#dialogOut").slideDown('500');
            	window.top.setTimeout(function(){
            		obj.find("#dialogOut").slideUp('500',function(){
                    obj.find("#dialogOut").remove();
                    args.callback();
            	});
            	},2000);
        	})()
        }
   }
   $.dialogOut = function(option){
	  var data =$.extend({
		  container:'系统错误，请返回重新操作！',
		  callback:function(){}
	  },option);
	  var obj =$(self.parent.document).find('body');
      s.init(obj,data)
   }
   /**
    * load图片
    */
   var load={
			init:function(obj,args){
				return (function(){
					load.loadImg(obj,args);
				})()
			},
			loadImg:function(obj,args){
				return (function(){
				obj.empty();
				obj.append('<tr style=""><td colspan='+args.col+' style="text-align: center;line-height:'+args.height+'px;background-color: #fff;border-bottom:none;padding:0"><img src='+args.imgSrc+' /></td></tr>')
				})()
			}
		}
		$.fn.loadImg=function(option){
			var args= $.extend({ //被添加的元素节点
				height:400,        //高度
				col:20,            //一行几列
				imgSrc:'../../images/4.gif' //图片路劲
			},option)
			load.init(this,args);
		};
})(jQuery)

