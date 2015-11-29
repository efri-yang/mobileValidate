# mobileValidate
mobileValidate是一款针对移动端的表单验证控件，充分考虑到移动端屏幕和空间大小的情况下,它提供了两种表单的验证提示方式，基本满足日常表单的验证需求！<a href="http://wnworld.com/mobilevalidate" target="_blank">查看demo<a/>

##      	目录

*	[特性](#特性)
*	[调用方式](#调用方式)
*	[参数](#参数)
*	[拓展方法](#拓展方法)

##	特性

1.	通过 data-* 的方式来来决定表单是否需要验证,验证类型
2.	通过 mvalidateExtend 方法提供自定义拓展验证方式
3.	不同于其他的表单验证,该控件在用户初次输入的时候(keyup事件)是不进行验证的，这样的方式更符合用户的使用习惯

##	调用方式
<pre>
$(form).mvalidate({
    type:1,
    validateInSubmit:true
})
</pre>

##	参数
参数 | 类型 | 描述 | 默认值
------------ | ------------- | ------------ | ------------
type | Number | 验证类型,类型1：弹出提示信息，类型2：未通过验证的表单下面显示提示文字 | 1
validateInSubmit | Boolean | 点击"提交"按钮的时候是否要对表单进行验证 | true
sendForm | Boolean | 表单通过验证的时候，是否需要提交表单 | true
onKeyup | Boolean | 输入放开键盘的时候,是否需要验证 | false
firstInvalidFocus | Boolean | 未通过验证的第一个表单元素，是否要获取焦点 | true
conditional | Object | 输入域通过data-conditional="name"对应到conditional中属性等于name的函数 | {}
descriptions | Object | 输入域通过data-descriptions="name"对应到descriptions中属性名等于name的函数 | {}
eachField | Function | 输入域在执行验证之前触发该函数| {}
eachInvalidField | Function | 所有未通过验证的表单输入域触发该函数 | $.noop
eachValidField | Function | 所有的通过验证的表单输入域触发该函数 | $.noop
valid | Function | 点击“提交”按钮的时候，若表单通过验证，就触发该函数！ | $.noop
invalid | Function | 点击“提交”按钮的时候，若表单未通过验证，就触发该函数！ | $.noop

##	拓展方法
方法| 描述 
------------ | -------------
$.mvalidateExtend | 该方法用来拓展一些输入域的验证,例如:data-validate="phone"
<pre>
$.mvalidateExtend({
    phone:{
        required : true,   
        pattern : /^0?1[3|4|5|8][0-9]\d{8}$/,
        each:function(){
           
        },
        descriptions:{
            required : '必填字段',
            pattern : '请您输入正确的格式'
        }
    }
});
</pre>






