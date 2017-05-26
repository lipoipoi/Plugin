/**
@author 你猜猜看？
@function jquery 分页插件
@ 692690360@qq.com
@小胸弟别看了
@create 2016-5-13
**/
(function($){
	var ms = {
		init:function(obj,args){
			return (function(){
				args.pageCount = Math.ceil(args.totalMsg/args.pageSize);
				ms.fillHtml(obj,args);
				ms.bindEvent(obj,args);
			})();
		},
		//填充html
		fillHtml:function(obj,args){
			return (function(){	
				obj.empty();
				//上一页
				if(args.current > 1){
					obj.append('<a href="javascript:;" class="prevPage" id="btn_prevPage">上一页</a>');
				}else{
					obj.remove('.prevPage');
					obj.append('<span class="disabled">上一页</span>');
				}
				//中间页码
				if(args.current != 1 && args.current >= 4 && args.pageCount != 4){
					obj.append('<a href="javascript:;" class="tcdNumber">'+1+'</a>');
				}
				if(args.current-2 > 2 && args.current <= args.pageCount && args.pageCount > 5){
					obj.append('<span>...</span>');
				}
				var start = args.current -2,end = args.current+2;
				if((start > 1 && args.current < 4)||args.current == 1){
					end++;
				}
				if(args.current > args.pageCount-4 && args.current >= args.pageCount){
					start--;
				}
				for (;start <= end; start++) {
					if(start <= args.pageCount && start >= 1){
						if(start != args.current){
							obj.append('<a href="javascript:;" class="tcdNumber">'+ start +'</a>');
						}else{
							obj.append('<span class="current">'+ start +'</span>');
						}
					}
				}
				if(args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5){
					obj.append('<span>...</span>');
				}
				if(args.current != args.pageCount && args.current < args.pageCount -2  && args.pageCount != 4){
					obj.append('<a href="javascript:;" class="tcdNumber">'+args.pageCount+'</a>');
				}
				//下一页
				if(args.current < args.pageCount){
					obj.append('<a href="javascript:;" class="nextPage" id="btn_nextPage" >下一页</a>');
				}else{
					obj.remove('.nextPage');
					obj.append('<span class="disabled">下一页</span>');
				}
					obj.append('<span class="pageBox">每页显示<select id="onePages" class="onePages"><option value=10>10</option><option value=20>20</option><option value=30>30</option></select></span>');
					obj.append('<span class="goPageBox">跳转到<input type="text" class="goPage" id="goPInput"/> 页 </span>  <a href="javascript:;" id="goPage">跳转</a>')
				/*样式*/
				obj.css({padding:'20px 0 20px 0',textAlign: 'center',color: '#ccc;'})
				obj.find('a').css({display: 'inline-block',color:'#53afff',height:'25px',lineHeight: '25px',padding:'0 10px',border:'1px solid #ddd',	margin:'0 2px',verticalAlign:'middle'})
				obj.find('a').hover(function(){
					$(this).css({textDecoration: 'none',border:'1px solid #53afff'}).siblings('a').css({border:'1px solid #ddd'})
				},function(){
					$(this).css({border:'1px solid #53afff'})
				})	;
				obj.find('.current').css({display:'inline-block',height: '25px',lineHeight: '25px',padding: '0 10px',margin: '0 2px',color: '#fff',backgroundColor:'#53afff',border: '1px solid #53afff',verticalAlign: 'middle'});
				obj.find('.disabled').css({display:'inline-block',height: '25px',lineHeight: '25px',padding: '0 10px',margin: '0 2px',color: '#bfbfbf',backgroundColor: '#f2f2f2',border: '1px solid #bfbfbf',verticalAlign: 'middle'})
				obj.find('.pageBox').css({display:'inline-block',color:'#53afff',height: '25px',lineHeight: '25px',padding:'0 10px 0 10px',verticalAlign:'middle'});
				obj.find('.goPageBox').css({display:'inline-block',color:'#53afff',height: '25px',lineHeight: '25px',padding:'0 10px 0 0px',verticalAlign:'middle'})
				obj.find('.onePages').css({margin:'-3px 0px 0px 5px',color:'#53afff',width:'60px',lineHeight:'27px',height:'27px'});
				obj.find('.goPage').css({margin:'-3px 0 0 5px',color:'#53afff',width:'40px',height:'25px',lineHeight:'25px'});
				var options=$("#pages").find("option");
				for(var i = 0; i<options.length;i++){
					if(parseInt(options.eq(i).val())==args.pageSize){
						options.eq(i).get(0).selected=true;
					}
				}
			})();
		
		},
		//绑定事件
		bindEvent:function(obj,args){
			return (function(){
				obj.off("click","a.tcdNumber");
				obj.off("click","a.prevPage");
				obj.off("click","a.nextPage");
				obj.off("click","#goPage");
				obj.off("change","#onePages");
				obj.on("click","a.tcdNumber",function(e){
					var current = parseInt($(this).text());
					ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount});
					if(typeof(args.backFn)=="function"){
						args.backFn(current,args.pageSize);
					}
				});
				//上一页
				obj.on("click","a.prevPage",function(){
					var current = parseInt(obj.children("span.current").text());
					ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount});
					if(typeof(args.backFn)=="function"){
						args.backFn(current-1,args.pageSize);
					};
				});
				//下一页
				obj.on("click","a.nextPage",function(){
					var current = parseInt(obj.children("span.current").text());
					ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount});
					if(typeof(args.backFn)=="function"){
						args.backFn(current+1,args.pageSize);
					}
				});
				//跳转
				obj.on('click','#goPage',function(){
					var current=parseInt(obj.find("#goPInput").val());
					if(isNaN(current)){
						//alert('请输入正确的数字')
						skWarn('请输入正确的数字');
					}
					else if(current == ""){
						//alert('页码不能为空')
						skWarn('页码不能为空');
					}
					else if(current >args.pageCount){
						//alert('不能大于最后一页')
						skWarn('不能大于最后一页');
					}
					else{
						if(typeof(args.backFn)=="function"){
							args.backFn(current,args.pageSize);
						}
					}
				})
				//显示几条
				obj.on("change","#onePages",function(){
					var pageSize=$(this).val()
					if(typeof(args.backFn)=="function"){
						args.backFn(1,parseInt(pageSize));
					}
				})
			})();
		}
	}

	$.fn.createPage = function(options){
		var args = $.extend({
			totalMsg:10,
			current : 1,
			pageSize:10,
			backFn : function(){}
			/*prevback : prevback,
			nextback : nextback*/
		},options);
		ms.init(this,args);
	}	
})(jQuery);
