/**
@author wetrther
@function jquery校验表单插件
@ 692690360@qq.com
@create 2018-05-05
内置验证规则
**/
(function($){
	var vl = {
        //初始化校验
		init:function(obj){
			return (function(){
                for(var i=0;i<obj.length;i++){
                    if(obj.eq(i).attr('isvalidated')=="true"){
                        continue;
                    }
                    vl.checkValidate(obj.eq(i));
                }
                vl.checkState(obj)
			})();
        },
        // 返回校验状态
        result:false,
        //校验所有状态是否成功
        checkState:function(obj){
            for(var i=0;i<obj.length;i++){
                if(obj.eq(i).attr('isvalidated')=="true"){
                    vl.result=false;
                    break;
                }else{
                    vl.result=true;
                }
            }
        },
        //获取校验并自动校验
        checkValidate:function(obj){
            //获取验证方式
            //让data属性从字符串强制转换对象
            var rules=eval('(' +obj.attr("dgg-rule")+')');
            //获取验证方式
            var vlObj_mode=rules.mode;
            //获取自定验证方式的规则
            var vlObj_rule=rules.rule;
            //获取提示信息
            var vlObj_warring=rules.warring;
            //判断验证方式
            switch(vlObj_mode){
                //自定义验证
                case "custom":
                    vl.testVl(obj,vlObj_warring,vlObj_rule);
                    break;
                //内置验证
                case "inlay":
                    switch(vlObj_rule){
                        //非空验证
                        case "nonEmpty":
                            if(obj.val()==""||obj.val().length==0){
                                obj.attr('isValidated',true)
                                vl.tips(obj,vlObj_warring);
                            }
                            break;
                        //只为数字
                        case "number":
                            rule=/^[0-9][0-9]*$/;
                            vl.testVl(obj,vlObj_warring,rule);
                            break;
                        //验证有两位小数的正实数
                        case "price":
                            var rule=/^[0-9]+(.[0-9]{2})?$/;
                            vl.testVl(obj,vlObj_warring,rule);
                            break;
                        //验证由26个英文字母组成的字符串
                        case "en":
                            var rule=/^[A-Za-z]+$/;
                            vl.testVl(obj,vlObj_warring,rule);
                            break;
                        //长度在6-18之间，只能包含字符、数字和下划线。常用于密码
                        case "password":
                            var rule=/^[a-zA-Z\w]{5,17}$/;
                            vl.testVl(obj,vlObj_warring,rule);
                            break;
                        //验证Email地址
                        case "email":
                            var rule=/^\w+([\.\-]\w+)*\@\w+([\.\-]\w+)*\.\w+$/
                            vl.testVl(obj,vlObj_warring,rule);
                            break;
                        //验证身份证号
                        case "idCard":
                            var rule=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                            vl.testVl(obj,vlObj_warring,rule);
                            break;
                        //验证电话号码
                        case "phone":
                            var rule=/^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
                            vl.testVl(obj,vlObj_warring,rule);
                            break;
                        default:
                            console.error("请输入正确的验证方式及参数");
                            break;
                    }
                    break;
                default:
                    console.error("参数错误");
                    break;

            }
            obj.on("focus",function(){vl.removeTips(obj)})
        },
        //验证正则
        testVl:function(obj,vlObj_warring,rule){
            if(!rule.test(obj.val())){
                obj.attr('isValidated',true)
                vl.tips(obj,vlObj_warring);
            }
        },
        //错误信息提示
        tips:function(obj,text){
            vl.result = false;
            //计算提示信息位置
            var h =obj.height(),
                l =obj.offset().left,
                t =obj.offset().top,
                w =obj.width()
            var triangle_bootm="<span class='triangle_bottom' style='left:-6px;top:"+(h/2-3)+"px'></span>"
            var triangle_top="<span class='triangle_top' style='left:-6px;top:"+(h/2-2)+"px'></span>"
            //填充提示信息元素
            obj.after("<span class='warring' style='position:absolute;left:"+(l+w+10)+"px;top:"+(t)+"px;height:"+h+"px;line-height:"+h+"px;'>"
            +triangle_bootm+text+triangle_top+"</span>");
            
        },
        //移除错误信息提示
        removeTips:function(obj){
            if(obj.attr("isvalidated")=="true"){
                obj.next().remove();
                obj.attr("isValidated","false")
            }
        }
	}
	$.fn.Validate = function(){
        vl.init(this);
        return vl.result;
	}	
})(jQuery);