/*----------------------------------------------
| noka tree v1.0 www.97521.com                 |
| rebin 2014-01-10                             |
|---------------------------------------------*/
var ntree = Class.create({
    version: '1.0',
    //=================初始化方法===============================
    initialize : function(cfg) {
    	this.cfg = cfg;					//配置信息
    	this.icon = {							//图标
    			root				:cfg.rurl+'/nokatag/org/noka/tree/img/base.gif',
    			folder				:cfg.rurl+'/nokatag/org/noka/tree/img/folder.gif',
    			folderOpen			:cfg.rurl+'/nokatag/org/noka/tree/img/folderopen.gif',
    			node				:cfg.rurl+'/nokatag/org/noka/tree/img/page.gif',
    			empty				:cfg.rurl+'/nokatag/org/noka/tree/img/empty.gif',
    			line				:cfg.rurl+'/nokatag/org/noka/tree/img/line.gif',
    			join				:cfg.rurl+'/nokatag/org/noka/tree/img/join.gif',
    			joinBottom			:cfg.rurl+'/nokatag/org/noka/tree/img/joinbottom.gif',
    			plus				:cfg.rurl+'/nokatag/org/noka/tree/img/plus.gif',
    			plusBottom			:cfg.rurl+'/nokatag/org/noka/tree/img/plusbottom.gif',
    			minus				:cfg.rurl+'/nokatag/org/noka/tree/img/minus.gif',
    			minusBottom			:cfg.rurl+'/nokatag/org/noka/tree/img/minusbottom.gif',
    			nlPlus				:cfg.rurl+'/nokatag/org/noka/tree/img/nolines_plus.gif',
    			nlMinus				:cfg.rurl+'/nokatag/org/noka/tree/img/nolines_minus.gif',
    			pasteon				:cfg.rurl+'/nokatag/org/noka/tree/img/paste_on.gif'
    		};
    	this.rnodeid=-1;
    	this.ntext=cfg.level;
    	this.checktype=cfg.checktype;//级联选择关系 all:全部级联,next向下级联,previous向上，nomuch不级联
    	this.rbodyHtml=$(cfg.id+'_tdiv');
    	this.isSelect=false;//是否为下拉选项
    	this.bdy = $(cfg.id+'_bdiv');
    	this.readonly=('readonly'==cfg.readonly);
    	this.disabled = ('disabled'==cfg.disabled);
    	this.checkname = cfg.checkname;
    	this.allownull = cfg.allownull;
    	this.titleReplyCliek=cfg.titlecliek;//标题是否响应单击事件
    	this.hImg;
    	this.mImg;
    	this.slang = cfg.slang;
    	this.lower = cfg.lower;
    	this.movextop = 0;
    	this.ispid = cfg.spid;
    	this.nowHeight = cfg.height;//高度
    	this.titllev = (undefined!=cfg.titllev?cfg.titllev:0);//名称级别
    	this.updServerFunction = cfg.ServerFunction;//修改时调用的服务器方法
    	this.onupdsubmit = (cfg.onupdsubmit==undefined?function(a,b){return true;}:cfg.onupdsubmit);//修改前调用的js方法
    	this.onupdend = (cfg.onupdend==undefined?function(a,b,c){return true;}:cfg.onupdend) ;//修改后调用的js方法  self.onupdend(srcnode,tarnode,rupdate)
    	this.onrootinit = (undefined==cfg.onrootinit?function(a,b){return true;}:cfg.onrootinit);//初始化root节点时调用
    	this.dataurl = (undefined == cfg.dataurl?cfg.rurl+'/nokatag/ntree'+cfg.id+'.tre':cfg.dataurl);
    },
    //=================显示树形菜单=============================
    show : function(){
    	this.ajaxLoadData(this.cfg.spid,'1',true,0);//加载数据  上级id,1为取节点操作,2为取下级所有节点的id操作,true此处不启作用
    },
    //-----------------树形菜单初始化===========================
    TreeInit : function(rottnodes){
    	 var idx = 0;
         var html = [];
         var self = this;
         var rid = self.cfg.id;
         //------------配置初始化--------------------------
         html[idx++] = '<div id="'+rid+'_movediv" style="display: none;position:absolute; left:10px; top:30px;border:1px dashed #000;background:#FFFFFF;padding:5px;"></div>';//拖动时的div
         html[idx++] = '<div id="'+rid+'_sys_cfg" style="display: none;"></div>';
         html[idx++] = '<input type="text" style="display:none;" value="" id="'+rid+'" name="'+self.cfg.inputname+'"/>';//记录选中的数据
         html[idx++] = '</div>';
         //------------------------------------------------
         if(''==self.checktype && self.allownull){
        	 html[idx++] = '<div id="'+rid+'_select_divid" class="dTreeNode"><a class="node">'+self.slang+'</a></div>';
     	 }
         //------------nodes------------------------------
         html[idx++] ='<div id="'+rid+'_tree_body">';
         for(var i=0;i<rottnodes.length;i++){
        	 var rnod = rottnodes[i];
        	 //-------root node---------------------------
        	 html[idx++] = '<div id="'+rid+'_'+rnod.id+'_d" class="dTreeNode">';
        	 html[idx++] = '<img id="'+rid+"_"+rnod.id+'_i" src="'+self.icon.root+'" alt=""/>';
        	 html[idx++] = '<img id="'+rid+'_'+rnod.id+'_d_moveimg" src="'+self.icon.pasteon+'" alt="" style="display: none;cursor:move;" />';//拖动专用img
        	 html[idx++] = '<a id="'+rid+"_"+rnod.id+'_na" class="node" href="'+rnod.url+'"  title="'+rnod.title+'"  alt="'+rnod.title+'" target="'+rnod.target+'">'+rnod.name+'</a>';
        	 html[idx++] = self.checkbox(rnod.pid,rnod.id);
        	 html[idx++] = self.CustomAttribute(rnod);//node json
        	 html[idx++] = '<div style="display: none;">';
    		 html[idx++] = '<input type="hidden" value="" id="'+rid+'_'+rnod.id+'_nt"  name="'+rid+'_'+rnod.id+'_nt">';//线 1线 0空白
    		 html[idx++] = '<input type="hidden" value="'+rnod.pid+'" id="'+rid+'_'+rnod.id+'_pid"  name="'+rid+'_'+rnod.id+'_pid">';//上一级id
    		 html[idx++] = '<input type="hidden" value="" id="'+rid+'_'+rnod.id+'_pad"  name="'+rid+'_'+rnod.id+'_pad">';//上级所有id,用,分隔
    		 html[idx++] = '<input type="hidden" value="'+rnod.id+'" id="'+rid+'_'+rnod.id+'_id"  name="'+rid+'_'+rnod.id+'_id">';//本级id
    		 html[idx++] = '<input type="hidden" value="'+rnod.level+'" id="'+rid+'_'+rnod.id+'_le"  name="'+rid+'_'+rnod.id+'_le">';//level
    		 html[idx++] = '<input type="hidden" value="'+(i>=rottnodes.length-1)+'" id="'+rid+'_'+rnod.id+'_ed"  name="'+rid+'_'+rnod.id+'_ed">';//是否为最后一个节点,0为否,1为是
    		 html[idx++] = '</div>';
        	 html[idx++] = '</div>';
        	 html[idx++] = '<div id="'+rid+'_'+rnod.id+'_d_sd" class="clip" style="display: bloack;"></div>';
         }
         html[idx++]='</div>';
         self.rbodyHtml.innerHTML=html.join('');//显示内容
         if(''==self.checktype && self.allownull){
        	 $(rid+'_select_divid').observe('click',function(a){
        		 $(rid).value='';
        		 $(rid+'_sinput').value=self.slang;
        	 });
     	 }
         //--------------初始值----------------------------------------
         $(rid).value=self.cfg.value;
         if(self.isSelect)
			 self.ajaxLoadData(self.cfg.value, '6',true, 0);
         var vche = ','+self.cfg.value+',';
         for(i=0;i<rottnodes.length;i++){
        	 var rnod = rottnodes[i];
        	 if(vche.indexOf(','+rnod.id+',')!=-1)
        		 $(rid+'_'+rnod.id+'_ch').checked=true;
        	 else
        		 $(rid+'_'+rnod.id+'_ch').checked=false;
         }
         //-------添加设置值事件----------------------------------------
         $(rid).setValue=function(value){
        	 $(rid).value=value;
        	 var vs=$(rid).value.split(',');
        	 for(i=0;i<vs.length;i++){
        		 try{
        			 $(rid+'_'+vs[i]+'_ch').checked=true;
        		 }catch(e){}
        	 }
        	 try{
        		 if(self.isSelect)
        			 self.ajaxLoadData($(rid).value, '6',true, 0);//
        	 }catch(e){}
        	 try{$(self.cfg.id+'_img').hide();}catch(e){}
         };
         //-------加载root节点标题点击事件------------------------------
         for(i=0;i<rottnodes.length;i++){
        	 var rnod = rottnodes[i];
        	 //-----------------节点标题事件-----------------------------
        	 if(self.titleReplyCliek){
	        	 $(rid+'_'+rnod.id+'_na').observe('click',function(a){
			        try{
			        	var dnpid = this.id.substring(0,(this.id.length-'_na'.length));
			        	var cl_node = {id:$(dnpid+'_id').value,pid:$(dnpid+'_pid').value,name:$(dnpid+'_na').innerHTML,endnode:('true'==$(dnpid+'_ed').value),show:true};//节点对像
			        	var toutJson=$(dnpid+'_json').innerHTML.evalJSON();
			        	toutJson.selfid=self.cfg.id;
			        	self.cfg.titleonclick(toutJson);//外部事件
			        	try{
			        		if(self.isSelect)
			        			self.treeTitleClick(cl_node);
			        	}catch(e){}
			        }catch(e){}
		   		});
        	 }
        //-------------点击选框事件--------------------------------------------------------------
 	   	if(''!=self.checktype){//有级联
 		   	$(rid+'_'+rnod.id+'_ch').observe('click',function(a){
 			try{
 			   var dnpid = this.id.substring(0,(this.id.length-'_ch'.length));
 			   var spid  = dnpid.substring(rid.length+1,dnpid.length);
		       var cl_node = {id:$(dnpid+'_id').value,pid:$(dnpid+'_pid').value,name:$(dnpid+'_na').innerHTML,endnode:('true'==$(dnpid+'_ed').value),show:true,checked:$(dnpid+'_ch').checked};//节点对像
		       var outJson = $(dnpid+'_json').innerHTML.evalJSON();
		       outJson.selfid=self.cfg.id;
		       outJson.checked=$(dnpid+'_ch').checked;
		       if(self.cfg.checkboxonclick(outJson)){
 			       if('all'==self.checktype || 'next'==self.checktype){//全部或向下
 			    	   self.ajaxLoadData(spid, '3', true, 0);
 			       }else if('previous'==self.checktype){//向上
		        		var checked=$(dnpid+'_ch').checked;
		        		self.checkValue(spid, checked);
 			       }else{
 			    	  var checked=$(dnpid+'_ch').checked;
 			    	  self.checkValue(spid, checked);
 			       }
 			   }else{
 			       $(dnpid+'_ch').checked=!$(dnpid+'_ch').checked;
 			   }
 			 }catch(e){}
 		   });
 	   	}
        }//for end
         //-------刷新指定节点数据--------------------------------------
         $(rid).LoadData = function(value){
		        try{
		        	var vsn = value;//11节点id
		        	if(self.rnodeid==vsn){//root节点
		        		self.show();
		        	}else{//一般节点
		        		var nid = $(rid+'_'+vsn+'_id').value;//节点id
		        		var ed  = ('true'==$(rid+'_'+vsn+'_ed').value);//最后一个节点
		        		self.ajaxLoadData(nid, '2', ed,0);
		        	}
		        }catch(e){}
	   		};
         //-------加载一级节点------------------------------------------
         for(i=0;i<rottnodes.length;i++){
        	 var rnod = rottnodes[i];
        	 self.ajaxLoadData(rnod.id, '2', (i>=rottnodes.length-1),0);
         }
         //-------打开指节点-------------------------------------------
         $(rid).opennode = function(value){
		        try{
		        	var vsn = value;//要打开的节点id
		        	var nid = $(rid+'_'+vsn+'_pad').value.split(',');//所有上级节点id,不包含自己
		        	for(var n=0;n<nid.length;n++){//依次打开上级节点
		        		var dnpid=rid+'_'+nid[n];
		        		try{
		        		$(dnpid+'_d_sd').show();
		        		var endnode=('true'==$(dnpid+'_ed').value);//最后一个节点
			        	if(endnode){//最后一个节点
				        	$(dnpid+'_ni').src=self.icon.minusBottom;
			        	}else{//非最后一个节点
			        		$(dnpid+'_ni').src=self.icon.minus;
			        	}
			        	$(dnpid+'_ng').src=self.icon.folderOpen;
		        		}catch(e){}
		        	}
		        	//---------打开本级---------------------------
		        	if($(rid+'_'+vsn+'_ng').src==self.icon.node){//没有子节点，不响应展开，关闭事件
		        		return false;
		        	}else{
		        		$(rid+'_'+vsn+'_d_sd').show();
		        		var endnode=('true'==$(rid+'_'+vsn+'_ed').value);//最后一个节点
			        	if(endnode){//最后一个节点
				        	$(rid+'_'+vsn+'_ni').src=self.icon.minusBottom;
			        	}else{//非最后一个节点
			        		$(rid+'_'+vsn+'_ni').src=self.icon.minus;
			        	}
			        	$(rid+'_'+vsn+'_ng').src=self.icon.folderOpen;
		        	}
		        }catch(e){}
	   		};
	   	//-----------------获取所有父节点----------------------------
	   	 $(rid).getParentNodeJson = function(noid){
	   		return self.getParentNode(noid);
	   	 };
	   	 //----------------获取长名称-------------------------------
	   	 $(rid).getLongTitles = function(noid,lve,sep){
	   		return self.getLongTitle(noid,lve,sep); 
	   	 };
	   	 //--------------获取节点id-------------------------------
	   	 $(rid).getNodes = function(nodeids){
	   		 return self.getNodes(nodeids);
	   	 };
	   	 //--------------获取节点--------------------------------
	   	 $(rid).getNode = function(nodeid){
	   		return self.getNode(nodeid); 
	   	 };
         self.initObjCht();//----------加载验证
         if(self.updServerFunction !=undefined){
        	 self.nodeMoveEvent(rottnodes,'d');
         }
         //--------------------------------------------------
         if(undefined!=self.onrootinit){
        	 self.onrootinit($(self.cfg.id),rottnodes);
         }
        //----------------------------------
     	$(self.cfg.id).setDisabled = function(a){
     		try{
     			$(self.cfg.id+'_sinput').writeAttribute({disabled:a});
     			self.disabled=a;
     		}catch(e){}
     	};
     	$(self.cfg.id).setReadonly = function(a){
     		try{
     			$(self.cfg.id+'_sinput').writeAttribute({readonly:a});
     			self.readonly=a;
     		}catch(e){}
     	};
    },
    //=====================添加子节点=============================
    addsubNode : function(uid,nodes,load){//load加载次数
    	var self=this;
    	var rid = self.cfg.id;
    	var bodyHtml=$(uid+'_d_sd');
    	var idx = 0;
    	var html = [];
    	var upnte = $(uid+'_nt').value;
    	var ndtxy ='';
    	var sunodi='';
    	var isShowTx=(self.rnodeid==$(uid+'_pid').value);
    	var endnode=('true'==$(uid+'_ed').value?true:false);//是否为最后一个节点
    	var upd=$(uid+'_pad').value;//上一级的，上级所有id
    	var nupd=(''==upd?'':upd+',')+uid.substring(rid.length+1,uid.length);
    	//------------空数组处理-------------------------
    	if(nodes.length<1){//没有数据，将上级节点修改为没有子节点的图标
    		try{
    			bodyHtml.innerHTML='';
	    		$(uid+'_ng').src=self.icon.node;
	    		if(endnode)
	    			$(uid+'_ni').src=self.icon.joinBottom;
	    		else
	    			$(uid+'_ni').src=self.icon.join;
    		}catch(e){}
    		return;
    	}
    	//------------nodes------------------------------
    	for(var a=0;a<nodes.length;a++){
    	      var nd = nodes[a];
    	      var nicon = (nd.subnode?self.icon.plus:self.icon.join);
    	      var ficon = (nd.subnode?self.icon.folder:self.icon.node);
    	      sunodi+=','+nd.id;
    	      if(a>=nodes.length-1)
    	          	nicon = (nd.subnode?self.icon.plusBottom:self.icon.joinBottom);
    	      html[idx++] = '<div id="'+rid+'_'+nd.id+'_nd" class="dTreeNode">';
    	      //-------------补齐上 线、空白-----------------------------------
    	      if(upnte!=''){
    	    	  var uptxy = upnte.split(',');//上一级线，空白   线 1线 0空白 0,1
	    	      for(var c=0;c<uptxy.length;c++){
	    	    	  var atx = uptxy[c];//0  或 1
	    	    	  if('1'==atx)
	    	    		  html[idx++] = '<img src="'+self.icon.line+'" alt="" />';
	    	    	  else if('0'==atx)
	    	    		  html[idx++] = '<img src="'+self.icon.empty+'" alt="" />';
	    	      }
    	      }
    	      //-------------生成本级线---------------------------------
    	      if(!isShowTx){
	    	      if(!endnode){
	    	    	  html[idx++] = '<img src="'+self.icon.line+'" alt="" />';//
	    	    	  ndtxy=(upnte==''?'1':upnte+',1');
	    	      }else{
	    	    	  html[idx++] = '<img src="'+self.icon.empty+'" alt="" />';//
	    	    	  ndtxy=(upnte==''?'0':upnte+',0');
	    	      }
    	      }
    	      html[idx++] = '<a id="'+rid+'_'+nd.id+'_ia"><img id="'+rid+'_'+nd.id+'_ni" src="'+nicon+'" alt="" /></a>';
    	      html[idx++] = '<img id="'+rid+'_'+nd.id+'_ng" src="'+ficon+'" alt="" />';
    	      html[idx++] = '<img id="'+rid+'_'+nd.id+'_nd_moveimg" src="'+self.icon.pasteon+'" alt="" style="display: none;cursor:move;" />';//拖动专用img
    	      html[idx++] = '<a id="'+rid+'_'+nd.id+'_na" class="node" href="'+nd.url+'" title="'+nd.title+'" alt="'+nd.title+'" target="'+nd.target+'">'+nd.name+'</a>';
    	      html[idx++] = self.checkbox(nd.pid,nd.id);
    	      html[idx++] = self.CustomAttribute(nd);//node json
    	      html[idx++] = '<div style="display: none;clear:both;line-height:0;">';
     		  html[idx++] = '<input type="hidden" value="'+ndtxy+'" id="'+rid+'_'+nd.id+'_nt"  name="'+rid+'_'+nd.id+'_nt">';//线 1线 0空白
     		  html[idx++] = '<input type="hidden" value="'+nd.pid+'" id="'+rid+'_'+nd.id+'_pid"  name="'+rid+'_'+nd.id+'_pid">';//上一级id
     		  html[idx++] = '<input type="hidden" value="'+nupd+'" id="'+rid+'_'+nd.id+'_pad"  name="'+rid+'_'+nd.id+'_pad">';//上级所有id,用,分隔,不包含自己id
     		  html[idx++] = '<input type="hidden" value="'+nd.id+'" id="'+rid+'_'+nd.id+'_id"  name="'+rid+'_'+nd.id+'_id">';//本级id
     		  html[idx++] = '<input type="hidden" value="'+nd.level+'" id="'+rid+'_'+nd.id+'_le"  name="'+rid+'_'+nd.id+'_le">';//level
     		  html[idx++] = '<input type="hidden" value="'+nd.id+'" id="'+rid+'_'+nd.pid+'_npd_'+nd.id+'"  name="'+rid+'_'+nd.pid+'_npd_'+nd.id+'">';//本级id2
     		  html[idx++] = '<input type="hidden" value="'+(a>=nodes.length-1)+'" id="'+rid+'_'+nd.id+'_ed"  name="'+rid+'_'+nd.id+'_ed">';//是否为最后一个节点,0为否,1为是
     		  html[idx++] = '</div>';
    	      html[idx++] = '</div>';
    	      html[idx++] = '<div id="'+rid+'_'+nd.id+'_d_sd" class="clip" style="display: none;clear:both;line-height:0;"></div>';
    	 }
    	 html[idx++] = '</div>';
    	 bodyHtml.innerHTML=html.join('');
    	 self.nodeEvent(nodes);//加载节点点击事件
    	 if(self.updServerFunction !=undefined){
    		 self.nodeMoveEvent(nodes,'nd');
         }
    	//-------预加载节点级数------------------------------------------
    	 if(0==self.ntext){
    		 for(var i=0;i<nodes.length;i++){
 	        	var rnod = nodes[i];
 	        	self.ajaxLoadData(rnod.id, '2', (i>=nodes.length-1),0);
 	         }
    	 }else if(load<self.ntext){
    		 load+=1;
	         for(var i=0;i<nodes.length;i++){
	        	var rnod = nodes[i];
	        	self.ajaxLoadData(rnod.id, '2', (i>=nodes.length-1),load);
	         }
    	 }
    },
    //--------------------节点拖动--------------------------------------------
    nodeMoveEvent : function(nodes,ex){//ex=nd | d
    	var self = this;
    	var rid = self.cfg.id;
    	self.activeDraggable=false;
    	self.nowmovenode;//移动到的目标节点
    	self.nowsrcnode;//移动前的原节点
    	self.leftMous = 2;//鼠标左边差
    	self.topMous = 2;//鼠标上边差
    	var movdiv = $(rid+'_movediv');
    	if(self.updServerFunction==undefined){
    		return;
    	}
    		for(var a=0;a<nodes.length;a++){
	  	      var nd = nodes[a];
	  	      var node=$(rid+'_'+nd.id+'_'+ex);//'+rid+'_'+nd.id+'_nd
	  	      var moveimg = $(rid+'_'+nd.id+'_'+ex+'_moveimg');
	  	      //--------------------------------------------------------------------
	  	      node.observe('mouseover',function(event,a){//鼠标移入
	  	    	  try{
	  	    		  obj = event.srcElement ? event.srcElement : event.target;
	  	    		  if(obj!=undefined && obj.id!=undefined){
				  	    if(!self.activeDraggable){
					  	    	var srcnodeid = this.id.substring(0,this.id.lastIndexOf('_'));
					  	    	var issub = ($(srcnodeid+'_d_sd').innerHTML=='');//是否有子节点
					  	    	//if(issub){//只允许移动单节点
					  	    	$(this.id+'_moveimg').show();
					  	    	//}
				  	    }else{
				  	      if(obj.id.indexOf('_na')!=-1){
				  	    	if(self.nowmovenode==undefined){
					  	    	self.nowmovenode = obj;
					  	    	if(self.NodeForSub()){
					  	    		$(self.nowmovenode.id).setStyle({border:'1px dashed #000',background:'#B088FF'});
					  	    	}
				  	    	 }else{
				  	    		if(self.nowmovenode.id!=obj.id){
				  	    			$(self.nowmovenode.id).setStyle({border:'',background:''});
				  	    		}
					  	    	 self.nowmovenode = obj;
						  	     if(self.NodeForSub()){
						  	    	 $(self.nowmovenode.id).setStyle({border:'1px dashed #000',background:'#B088FF'});
						  	     }
				  	    		}
				  	    	 }
				  	      }
	  	    			}
	  	    	  }catch(e){
	  	    		self.nowmovenode=undefined;
	  	    	  }
	  	      });
	  	      node.observe('mouseout',function(event){//鼠标移出
	  	    	$(this.id+'_moveimg').hide();
		      });
	  	      //--------------------------------------------------------------------
	  	      moveimg.observe('mousedown',function(event){//鼠标按下
				Event.stop(event);
				self.activeDraggable=true;
				var left = Event.pointerX(event)+self.leftMous;
				var top = Event.pointerY(event)+self.topMous;
				var mtop = 0;
				self.xtop=0;
				try{
					mtop = $(this.id).positionedOffset().top;
					if(mtop>top){
						self.xtop=mtop-top;
					}
				}catch(e){}
				top=top+self.xtop;
				movdiv.setStyle({left:left+'px',top:top+'px'});
				var nid = this.id;
				nid = nid.substring(0,(nid.length- ('_moveimg').length));
				var dsd =nid.substring(0,(nid.length- ('_'+ex).length));// nid.//
				dsd+="_d_sd";
				movdiv.innerHTML=$(nid).innerHTML+$(dsd).innerHTML;
				movdiv.show();
				self.nowsrcnode = $(nid);
	  	      });
  	      	//-------------------------------------------------------------------
	  	    document.observe('mouseup',function(event){
				try{
					if(self.activeDraggable){
						Event.stop(event);
						self.activeDraggable=false;
						$(self.nowsrcnode.id+'_moveimg').hide();
						if(self.NodeForSub()){
							if(window.confirm(self.cfg.moveLang)){
								self.updateMove(self.nowsrcnode,self.nowmovenode);
				            }
						}
						$(self.nowmovenode.id).setStyle({border:'',background:''});
						movdiv.hide();
						movdiv.innerHTML='';
					}
				}catch(e){}
	        });
  	    	//----------------------------------------------------------------------
	  	  document.observe('mousemove',function(event){
				if(self.activeDraggable){
		  			try{
		  				Event.stop(event); 
						var left = Event.pointerX(event)+self.leftMous;
						var top =Event.pointerY(event)+self.leftMous;
						top=top+self.xtop;
		  				movdiv.setStyle({left:left+'px',top:top+'px'});
		  			}catch(e){}
				}else{
					movdiv.hide();
					movdiv.innerHTML='';
				}
	  	   });
	  	   //------------------------------------------------------------------------
    	}
    	
    },
    //-------------------a节点是否为b节点的父节点或现相节点---------------------------
    NodeForSub : function(){
    	var self = this;
    	
    	var srcnodeid = self.nowsrcnode.id.substring(0,self.nowsrcnode.id.lastIndexOf('_'));
    	var movenodeid = self.nowmovenode.id.substring(0,self.nowmovenode.id.lastIndexOf('_'));
    	
    	var le = $(movenodeid+'_le').value;//源节点lvie
    	var srcid=$(srcnodeid+'_id').value;//源节点id
    	var srcpid=$(srcnodeid+'_pid').value;//源节点pid
    	var moveid=$(movenodeid+'_id').value;//目标节点id
    	if(le.indexOf('_'+srcid)!=-1 || moveid==srcid || srcpid==moveid){//目标节点为源节点的下级节点时不作处理，当目标节点和源节点为同一节点时不作处理,源头节点pid==目标节点id时不作处理，说明源节点本来就在目标节点下
    		return false;
    	}
    	return true;
    },
    //--------------------更新节点--------------------------------------------
    updateMove : function(srcnode,movenode){//源节点,目标节点
    	var self = this;
    	var rid = self.cfg.id;
    	if(self.updServerFunction==undefined){
    		return;
    	}
    	var idx = 0;//
    	var parsv=[];
    	var srcnodeid = self.nowsrcnode.id.substring(0,self.nowsrcnode.id.lastIndexOf('_'));
    	var movenodeid = self.nowmovenode.id.substring(0,self.nowmovenode.id.lastIndexOf('_'));
    	
    	var le = $(movenodeid+'_le').value;//源节点lvie
    	var srcid=$(srcnodeid+'_id').value;//源节点id
    	var srcpid=$(srcnodeid+'_pid').value;//源节点pid
    	var moveid=$(movenodeid+'_id').value;//目标节点id
    	var srcnode=self.getNode(srcid);//源头节点
		var tarnode=self.getNode(moveid);//目标节点
		var leve = $(movenodeid+'_le').value+'_'+$(movenodeid+'_id').value;//lvie 父节点的lvie+父节点ID作为本级节点的lvie
    	if(le.indexOf('_'+srcid)!=-1 || moveid==srcid || srcpid==moveid){//目标节点为源节点的下级节点时不作处理，当目标节点和源节点为同一节点时不作处理,源头节点pid==目标节点id时不作处理，说明源节点本来就在目标节点下
    		return;
    	}
    	if(!self.onupdsubmit(srcnode,tarnode)){//外部方法返回true才继续执行
    			return;
    	}
    	var subNods = self.getSubNodes(srcid,moveid,leve);//-------------------------------------------------------
    	parsv[idx++]='do=5';//1为root节点,2为子节点 3为取下关联节点 4根据id获取节点数据  5修改节点的pid
    	parsv[idx++]='&nodes='+subNods.toJSON();//旧的lvie
    	if(self.updServerFunction!=undefined){
    		parsv[idx++]='&uf='+self.updServerFunction;//服务器调用方法
    	}
    	//---------------------提交修改---------------------------------------------------------------
    	new Ajax.Request(self.dataurl, {
    		method:'post',
            parameters: parsv.join(''),
            onSuccess: function(response) {
            	var rupdate = response.responseText.evalJSON();//json数据 {code:true,msg:''}
            	if(self.onupdend(srcnode,tarnode,rupdate)){//外部方法返回true才继续执行
            		$(rid).LoadData($(srcnodeid+'_pid').value);//刷新源节点
					$(rid).LoadData($(movenodeid+'_pid').value);//刷新目标节点
            	}
            }
    	});
    	
    },
    //====================check box========================================
    checkbox : function(spid,id){
    	var self = this;
    	var idx = 0;
    	var html = [];
    	var ends = (self.readonly?'disabled="disabled"':'');//只读
    	if(''!=self.checktype){//有级联
    		if('noradio'==self.checktype)
    			html[idx++] = '<input '+ends+' style="vertical-align:middle;width: 12px;height: 12px;" title="tl'+spid+'" class="tl'+spid+'" id="'+self.cfg.id+'_'+id+'_ch" type="radio" name="'+self.checkname+'" value="'+id+'">';
    		else
    			html[idx++] = '<input '+ends+' style="vertical-align:middle;width: 12px;height: 12px;" title="tl'+spid+'" class="tl'+spid+'" id="'+self.cfg.id+'_'+id+'_ch" type="checkbox" name="'+self.checkname+'" value="'+id+'">';
    	}else{
			html[idx++] = '<input '+ends+' style="display: none;" title="tl'+spid+'" class="tl'+spid+'" id="'+self.cfg.id+'_'+id+'_ch" type="checkbox" name="'+self.checkname+'" value="'+id+'">';
    	}
    	return html.join('');
    },
    //====================附加节点显示/隐藏方法=============================
    nodeEvent : function(nodes){
    	var self = this;
    	var rid = self.cfg.id;
    	for(var a=0;a<nodes.length;a++){
	   		var nd = nodes[a];
	   		//--------------初始化选框---------------------------------------------------------------
	   		self.checkValueinit(nd.id);
	   		//-------------点击选框事件--------------------------------------------------------------
	   		if(''!=self.checktype){//有级联
		   		$(rid+'_'+nd.id+'_ch').observe('click',function(a){
			        try{
			        	var dnpid = this.id.substring(0,(this.id.length-'_ch'.length));
			        	var spid  = dnpid.substring(rid.length+1,dnpid.length);
			        	var updsid = $(dnpid+'_pad').value.split(',');
			        	var cl_node = {id:$(dnpid+'_id').value,pid:$(dnpid+'_pid').value,name:$(dnpid+'_na').innerHTML,endnode:('true'==$(dnpid+'_ed').value),show:true,checked:$(dnpid+'_ch').checked};//节点对像
			        	var outJson = $(dnpid+'_json').innerHTML.evalJSON();
					       outJson.selfid=self.cfg.id;
					       outJson.checked=$(dnpid+'_ch').checked;
					       
			        	if(self.cfg.checkboxonclick(outJson)){
			        		//-------------向上级联--------------------------
			        		var checked=$(dnpid+'_ch').checked;
			        		if('previous'==self.checktype){
			        			if(checked){//加所上级id,自身id
					        		for(var c=0;c<updsid.length;c++){
					        			$(rid+'_'+updsid[c]+'_ch').checked=$(dnpid+'_ch').checked;
					        			self.checkValue($(rid+'_'+updsid[c]+'_ch').value, true);
					        		}
					        		self.checkValue(spid, true);
				        		}else{//去掉自身id
				        			self.checkValue(spid, false);
				        		}
			        			//-------------全部级联--------------------------
				        	}else if('all'==self.checktype || 'next'==self.checktype){
				        		self.ajaxLoadData(spid, '3', true, 0);
				        	}else{
				        		self.checkValue(spid, checked);
				        	}
			        	}else{
			        		$(dnpid+'_ch').checked=!$(dnpid+'_ch').checked;
			        	}
			        }catch(e){}
		   		});
	   		}
	   		//-------------点击标题--------------------------------------------------------------
	   		if(self.titleReplyCliek){
		   		$(rid+'_'+nd.id+'_na').observe('click',function(a){
			        try{
			        	var dnpid = this.id.substring(0,(this.id.length-'_na'.length));
			        	var cl_node = {id:$(dnpid+'_id').value,pid:$(dnpid+'_pid').value,name:$(dnpid+'_na').innerHTML,endnode:('true'==$(dnpid+'_ed').value),show:true};//节点对像
			        	var toutJson=$(dnpid+'_json').innerHTML.evalJSON();
			        	toutJson.selfid=self.cfg.id;
			        	self.cfg.titleonclick(toutJson);//外部事件
			        	try{
			        		if(self.isSelect)
			        			self.treeTitleClick(cl_node);
			        	}catch(e){}
			        }catch(e){}
		   		});
	   		}
	   		//------------展开，关闭节点----------------------------------------------------------
	   		$(rid+'_'+nd.id+'_ia').observe('click',function(a){
		        try{
		        	var dnpid = this.id.substring(0,(this.id.length-'_ia'.length));
		        	var svid = $(dnpid+'_d_sd');
		        	var endnode=('true'==$(dnpid+'_ed').value?true:false);//是否为最后一个节点
		        	//----------------------------------------------------------------------------
		        	if($(dnpid+'_ng').src==self.icon.node){//没有子节点，不响应展开，关闭事件
		        		return false;
		        	}
		        	var cl_node = {id:$(dnpid+'_id').value,pid:$(dnpid+'_pid').value,name:$(dnpid+'_na').innerHTML,endnode:('true'==$(dnpid+'_ed').value),show:false};//节点对像
		        	//--------------显示-------------------------------------
		        	if(!svid.visible()){
			        	$(dnpid+'_d_sd').show();
			        	if(endnode){//最后一个节点
				        	$(dnpid+'_ni').src=self.icon.minusBottom;
			        	}else{//非最后一个节点
			        		$(dnpid+'_ni').src=self.icon.minus;
			        	}
			        	$(dnpid+'_ng').src=self.icon.folderOpen;
			        	cl_node.show=true;
			        //-----------------隐藏--------------------------------
		        	}else{
		        		if($(dnpid+'_ng').src!=self.icon.node){
			        		svid.hide();
			        		if(endnode)//最后一个节点
					        	$(dnpid+'_ni').src=self.icon.plusBottom;
				        	else
				        		$(dnpid+'_ni').src=self.icon.plus;
			        		$(dnpid+'_ng').src=self.icon.folder;
		        		}
		        		cl_node.show=false;
		        	}
		        	var noutJson=$(dnpid+'_json').innerHTML.evalJSON();
		        	noutJson.selfid=self.cfg.id;
		        	self.cfg.nodeonclick(noutJson);//外部事件
		        	//-------------加载数据-------------------------------
		        	try{
		        		$$('input[id^="'+dnpid+'_npd_"]').each(function(alink,index) {
		        			var noid = alink.value;
		        			var body = $(rid+'_'+noid+'_d_sd');
		        			if(!body.visible())
		        				self.ajaxLoadData(noid,'2',true,0);//加载数据
		        		});
		        	}catch(e){}
		        	self.resetBodyHeight();
		        }catch(e){};
		  });
   	 	}
    },
    //------------------ajax加载数据--------------------------------------------
    ajaxLoadData : function(spid,d,endnode,load){
    	var self = this;
    	var rid = self.cfg.id;
    	var level='';
    	var idx = 0;//
    	var parsv=[];
    	self.isLoadEnd+=1;//加载级数加1
    	try{
    		if('3'==d)
    			level=$(rid+'_'+spid+'_le').value;
    		else if('4'==d)
    			level=$(rid).value;
    	}catch(e){}
    	parsv[idx++]='do='+d;//1为root节点,2为子节点 3为取下关联节点
    	parsv[idx++]=(''==spid?'':'&pid='+spid);//上级节点id,取下级关联节点时，该参数为本级节点id
    	if('3'==d)
    		parsv[idx++]=(''==level?'':'&le='+level+'_'+$(rid+'_'+spid+'_id').value);//上级节点id,取下级关联节点时，该参数为本级节点id
    	else
    		parsv[idx++]=(''==level?'':'&le='+level);//上级节点id,取下级关联节点时，该参数为本级节点id
    	parsv[idx++]='&sql='+self.cfg.sql;//sql查询语句
    	parsv[idx++]=(''==self.cfg.url?'':'&url='+self.cfg.url);//节点的url地址
    	parsv[idx++]=(''==self.cfg.target?'':'&tar='+self.cfg.target);//节点连接目标
    	parsv[idx++]=(''==self.cfg.formatcell?'':'&fc='+self.cfg.formatcell);//格式化列
    	parsv[idx++]=(''==self.cfg.pramevar?'':'&pr='+self.cfg.pramevar);//url参数
    	parsv[idx++]=('&titllev='+self.titllev);//深度
    	parsv[idx++]=(''==self.ispid?'':'&spid='+self.ispid);//spid
    	new Ajax.Request(self.dataurl, {
    		method:'post',
            parameters: parsv.join(''),
            onSuccess: function(response) {
            	var nodes = response.responseText.evalJSON();//json数据
            	//---------------节点数据--------------------------------------------------------
            	if('1'==d){//节点数据 
            		self.TreeInit(nodes);//展现子节点
            		self.rnodeid=nodes[0].pid;
            	}else if('2'==d){//--------------节点数据----------------------------------------
            		self.addsubNode(rid+'_'+spid,nodes,load);//加载数据 endnode 是否为最后一个节点
            	}else if('3'==d){//--------------获取下级关联节点的id--------------------------------
            		var updsid = $(rid+'_'+spid+'_pad').value.split(',');//所有上级id
            		var checked=$(rid+'_'+spid+'_ch').checked;
            		var ids=nodes.ids;
            		var istr=nodes.str;//所有的下级，包含平级
            		//-------------数据处理--------------------------
            		if('all'==self.checktype){
            			if(checked){//加所有上级id,自身id,下级id,不要平级id
            				try{
	            				for(var c=0;c<updsid.length;c++){
	            					self.checkValue($(rid+'_'+updsid[c]+'_ch').value, true);
	            					$(rid+'_'+updsid[c]+'_ch').checked=checked;
	            				}
            				}catch(e){}
            				self.checkValue(spid, true);
            				for(var c=0;c<ids.length;c++){
            					try{
    			        		if($(rid+'_'+ids[c]+'_le').value!=level){//踢出平级
    			        			self.checkValue(ids[c], true);
    			        			$(rid+'_'+ids[c]+'_ch').checked=checked;
    			        		}
            					}catch(e){}
    			        	}
            			}else{//去掉自身id,所有下级id,不要平级id
            				self.checkValue(spid, false);
            				for(c=0;c<ids.length;c++){
            					try{
    			        		if($(rid+'_'+ids[c]+'_le').value!=level){//踢出平级
    			        			self.checkValue(ids[c], false);
    			        			$(rid+'_'+ids[c]+'_ch').checked=checked;
    			        		}
            					}catch(e){}
    			        	}
            			}
            		}else if('next'==self.checktype){
            			//加自身id,所有下级id,不要平级id
            			self.checkValue(spid, checked);
            			for(c=0;c<ids.length;c++){
            				try{
    			        		if($(rid+'_'+ids[c]+'_le').value!=level){//踢出平级
    			        			self.checkValue(ids[c], checked);
    			        			$(rid+'_'+ids[c]+'_ch').checked=checked;
    			        		}
            				}catch(e){}
    			        }
            		}
            //--------------------------------------------------------------------------
            }else if('4'==d){//取所有节点的name nodes={nodes:[],nstr:'aaa,sss'}
            	try{
            		$(rid+'_sinput').value=nodes.nstr;
            		if(''==self.checktype && self.allownull && ''==$(rid+'_sinput').value){
            			$(rid+'_sinput').value=self.slang;
            		}
            	}catch(e){}
            }else if('6'==d){
            	self.setServerValue(nodes);
            }//----------------------------------------------------
           }
    	});
    },
    setServerValue : function(nodes){
    	var self = this;
    	var svr = '';
    	for(var i=0;i<nodes.length;i++){
    		svr+=','+nodes[i].nstr;
    	}
    	$(self.cfg.id+'_sinput').value = svr.substring(1,svr.length);
    	
    },
    //=============================选择操作===================================================
    checkValue : function(v,checked){
    	var self = this;
    	var rid = self.cfg.id;
    	var cstr=(''==$(rid).value?',':','+$(rid).value+',');//1,2,13,3,32->,1,2,13,3,32,
		if(checked){
			if(cstr.indexOf(','+v+',')==-1){
				cstr+=v+',';
			}
		}else{
			var vc=','+v+',';
			var reg=new RegExp(vc);
			cstr=cstr.replace(reg, ',');
		}
		$(rid).value=(','==cstr?'':cstr.substring(1,cstr.length-1));
		var sortValue = self.systemSort($(rid).value);
		if(undefined!=sortValue){
			$(rid).value=sortValue;
		}
		if(self.isSelect){
			//-----------下拉框-------------------
	    	try{
	    		if(self.lower!=undefined && self.lower!=''){
					$(self.lower).clearShowValue();
					$(self.lower).AjaxLoadData(v,-5);
				}
	    	}catch(e){}
			self.treeCheckClick();
		}
    },
    //===========================初始化选择==================================================
    checkValueinit : function(v){
    	var self = this;
    	var rid = self.cfg.id;
    	var cstr=','+$(rid).value+',';//1,2,13,3,32->,1,2,13,3,32,
    	if(cstr.indexOf(','+v+',')!=-1){
			$(rid+'_'+v+'_ch').checked=true;
		}else{
			$(rid+'_'+v+'_ch').checked=false;
		}
    },
    //------------转换nodes to json---------------------------------------------------------
    CustomAttribute : function(node){
    	var self = this;
    	var idx = 0;
        var html = [];
        var nodestr = '';
        try{nodestr=Object.toJSON(node.cnode);}catch(e){}
        html[idx++] = '<div id="'+self.cfg.id+'_'+node.id+'_json" class=\"'+self.cfg.id+'_nodes\" style="display: none;">'+nodestr+'</div>';
        return html.join('');
    },
    //------------获取节点对象-----------------------------------------------------
    getNodes : function(nodeids){
    	var self = this;
    	var nodes = [];
    	var idx = 0;
    	var ids = nodeids.split(',');
    	for(var i=0;i<ids.length;i++){
    		nodes[idx++]=self.getNode(ids[i]);
    	}
    	return nodes;
    },
    //--------------------获取节点信息------------------------------------------
    getNode : function(nodeid){
    	var self = this;
    	var rid = self.cfg.id;
    	var node = $(rid+'_'+nodeid+'_json');
    	if(undefined != node){
    		return node.innerHTML.evalJSON();
    	}
    	return node;
    },
    //--------------------获取所有子nodes---------------------------------------
    getSubNodes : function(nodeid,pid,leve){
    	var self = this;
    	var rid = self.cfg.id;
    	var node =  self.getNode(nodeid);//当前节点
    	self.subNods = [];
    	self.allNodes = [];//所有的nodes
    	node.pid = pid;
    	node.leve = leve;
    	self.subNods[self.subNods.length]=node;
    	$$('div[class~="'+rid+'_nodes"]').each(function(row,index) {
    		self.allNodes[self.allNodes.length]=row.innerHTML.evalJSON();
    	});
    	self.SubNodes(node.id,node.leve+'_'+node.id);
    	return self.subNods;//所有子节点
    },
    //------------------获取长名称----------------------------------------------------
    getLongTitle : function(nodeid,lve,sep){
    	var self = this;
    	var nodes = self.getParentNode(nodeid);
    	var title ='';
    	var max = ((undefined!=lve && lve>-1 && lve<nodes.length)?lve:nodes.length-1);
    	var sepf = (undefined!=sep?sep:'-');
    	if(nodes.length>0){
    		for(var i=max;i>-1;i--){
    			if(i>0){
    				title+=nodes[i].name+sepf;
    			}else{
    				title+=nodes[i].name;
    			}
    		}
    	}
    	return title;
    },
    //------------------获取父亲节点---------------------------------------------------
    getParentNode : function(nodeid){
    	var self = this;
    	self.parentNodes=[];
    	var pnodes = [];
    	try{
    		pnodes = self.getParentNodes(nodeid);
    	}catch(e){}
    	return pnodes;
    },
    getParentNodes : function(nodeid){//xiefangjian
    	var self = this;
    	var rid = self.cfg.id;
    	var node =  self.getNode(nodeid);//当前节点
    	self.parentNodes[self.parentNodes.length]=node;
    	if(undefined !=node){
	    	$$('div[class~="'+rid+'_nodes"]').each(function(row,index) {
	    		var pnode = row.innerHTML.evalJSON();
	    		if(pnode.id==node.pid){
	    			self.getParentNodes(pnode.id);
	    		}
	    	});
    	}
    	return self.parentNodes;
    },
    SubNodes : function(nodeid,leve){
    	var self = this;
    	for(var i=0;i<self.allNodes.length;i++){
    		var node = self.allNodes[i];
    		if(node.pid==nodeid){//找到子node
    			node.leve = leve;
    			self.subNods[self.subNods.length] = node;
    			self.SubNodes(node.id,node.leve+'_'+node.id);
    		}
    	}
    },
    resetBodyHeight : function(){
    	var self = this;
    	var tre=$(self.cfg.id+'_tdiv');
    	var sbd = $(self.cfg.id+'_tree_body');
    	var nheight = sbd.getHeight();
    	if(undefined!=self.nowHeight){
	    	if(nheight>=self.nowHeight){
	    		tre.setStyle({height:self.nowHeight+'px'});
	    	}else{
	    		tre.setStyle({height:nheight+'px'});
	    	}
    	}
    },
    selectShow : function(width){
    	var idx = 0;
        var html = [];
        var self = this;
        this.isSelect = true;
        var iwidth=self.cfg.width-18;
        var bodyHtml = $(self.cfg.id+'_sdiv');
        var miFlg = true;
        this.PreLoding();
        self.show();
        //------------配置初始化--------------------------
        html[idx++] = '<div id="'+self.cfg.id+'_sidiv" class="tree-dropdownchecklist  nk_input_lineheight nk_input_sdDiv" style="width:'+iwidth+'px;float:left;">';
        html[idx++] = '<input placeholder="'+self.cfg.placeholder+'" id="'+self.cfg.id+'_sinput" class="nk_input_lineheight nk_select_input_text" type="text" style="width:'+iwidth+'px;" readonly="readonly"  '+(self.disabled?'disabled="disabled"':'')+' value="">';
        html[idx++] = '</div>';
        if(!self.allownull){
        	html[idx++] = '<div style="float:left;color: red;" class="nk_input_imgheight">*</div>';
         	html[idx++] = '<div style="float:left;"><img style="display:none;vertical-align:middle" class="nk_input_imgheight" id="'+self.cfg.id+'_img" src="'+self.cfg.rurl+'/nokatag/formcheck/images/exclamation.gif"></img></div>';
        }
        bodyHtml.innerHTML=html.join('');
        var obj=$(self.cfg.id+'_sidiv');
        var tre=$(self.cfg.id+'_tdiv');
        obj.observe('click',function(a){
        	if(!self.readonly && !self.disabled){
	        	if(''==tre.innerHTML){
	        		self.show();
	        	}
	        	var atop = obj.positionedOffset().top+obj.offsetHeight;
	    		var aleft = obj.positionedOffset().left;
	        	tre.absolutize();
	        	tre.style.top=atop;
	        	tre.style.left=aleft;
	        	tre.setStyle({left:aleft+'px',top:atop+'px'});
	        	tre.show();
	        	self.resetBodyHeight();
        	}
        });
        obj.observe('mousemove',function(){
    		miFlg = true;
    		self.setSelectStyle(obj);
    	});
        
        obj.observe('mouseout',function(event){
        	miFlg = false;
        	var element = event.element();
        	setTimeout(function(){
                if (element.descendantOf(self.bdy) && !miFlg){
                	self.setNoSelectStyle(obj);
                	tre.hide();
                }
            }, 500);
        });
        
        tre.observe('mousemove',function(){
    		miFlg = true;
    		self.setSelectStyle(obj);
    	});
        tre.observe('mouseout',function(event){
        	miFlg = false;
        	var element = event.element();
        	setTimeout(function(){
                if (element.descendantOf(self.bdy) && !miFlg){
                	self.setNoSelectStyle(obj);
                	tre.hide();
                }
            }, 500);
        });
        document.observe('widget:noka_reinit',function(event){//失失焦点时验证其值
       		if(self.cfg.id.indexOf('_nkADinsert_')==-1){
    	    		var npfffs=event.memo.widgetNumber.clone();
    	    		for(var i=0;i<npfffs.length;i++){
    	    			var cfgid = Object.allclone(self.cfg);
    	    			var initem = npfffs[i];
    	    			cfgid.id = initem.id;
    	    			if(cfgid.id.indexOf('_'+self.cfg.id+'_')!=-1){
    	    				if(undefined !=cfgid.lower && cfgid.lower.trim().length>0){
    	    					var reg=new RegExp('_'+self.cfg.id+'_','g');
    	    					var ssf = cfgid.id.split(reg);
    	    					cfgid.lower = ssf[0]+'_'+cfgid.lower+'_'+ssf[1];
    	    				}
    	    				cfgid.onrootinit = function(a,b){
    	    					try{
           	    					var idx = a.id.substring(a.id.lastIndexOf('_')+1,a.id.length);
           	    					$(a.id).name=$(a.id).name.replace(/\[0\]/g,'['+idx+']');
           	    					if(undefined!=initem.value && $(cfgid.id).name==initem.name){
        	    						$(cfgid.id).setValue(initem.value);
        	    					}
           	    				}catch(e){}
    	    				};
    	    				(new ntree(cfgid)).selectShow();
    	    			}
    	    		}
       		 }
       	 });
    },
   //--------初始化验证-----------------
    initObjCht : function(){
    	var self = this;
    	if(self.isSelect){
	    	$(self.cfg.id).veri = function(){
	    	    if(($(self.cfg.id).value.trim().length<1) && !self.allownull){//不能为空
	    	    	$(self.cfg.id+'_img').show();
	    	    	return false;
	    	    }
	    	    try{$(self.cfg.id+'_img').hide();}catch(e){}
	    	    return true;
	    	};
    	}
    },
    //----------点击选框-----------------------
    treeCheckClick : function(){
    	var self = this;
    	var vs = $(self.cfg.id).value.split(',');
    	var vd ='';
    	for(var i=0;i<vs.length;i++){
    		try{vd+=','+$(self.cfg.id+'_'+vs[i]+'_na').innerHTML;}catch(e){}
    	}
    	if(vd.length>1)
    		vd=vd.substring(1, vd.length);
    	$(self.cfg.id+'_sinput').value=vd;
    	try{$(self.cfg.id+'_img').hide();}catch(e){}
    },
    //----------点击标题-----------------------
    treeTitleClick : function(node){
    	var self = this;
    	$(self.cfg.id).value=node.id;//设置值为id
    	var lotitle = node.name;
    	try{
    		lotitle = self.getLongTitle(node.id,self.titllev);
    	}catch(e){}
    	$(self.cfg.id+'_sinput').value=lotitle;
    	try{$(self.cfg.id+'_img').hide();}catch(e){}
    	//-----------下拉框-------------------
    	try{
    		if(self.lower!=undefined && self.lower!=''){
				$(self.lower).clearShowValue();
				var pares = [{pare:node.id,ftype:-5}];
				$(self.lower).AjaxLoadData(pares);
			}
    	}catch(e){}
    },
    //----------选种状态-----------------------
    setSelectStyle : function(obj){
    	var self = this;
    	obj.setStyle({borderColor:'#5794bf',backgroundImage:'url('+self.hImg.src+')'});
    },
    //-----------未选种状态-------------------
    setNoSelectStyle : function(obj){
    	var self = this;
    	obj.setStyle({borderColor:'#AFAFAF',backgroundImage:'url('+self.mImg.src+')'});
    },
    //------------排序-----------------------
    systemSort : function(values){
    	var vls = values.split(',');
    	return vls.sort(function(a, b) {
    		try{
    			return parseInt(a)-parseInt(b);
    		}catch(e){}
    	});
    },
    //-----------预加载图片-------------------
    PreLoding : function(){
    	var self = this;
    	self.hImg = new Image(); 
    	self.mImg = new Image();
    	self.hImg.src=self.cfg.rurl+'/nokatag/org/noka/select/dropdown_hover.png';
    	self.mImg.src=self.cfg.rurl+'/nokatag/org/noka/select/dropdown.png';
    	NBackgroundImageCache();
    }
    //====
});