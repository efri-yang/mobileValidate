(function (factory) {
	if (typeof define === 'function' && define.amd ) {
		define(['jquery'], function(jquery){
			// 返回构造函数
			factory(jquery); // 初始化插件	
		});
	}else if(typeof define === 'function' && define.cmd){
		define(['jquery'], function(require,exports,moudles){
			factory(
			require('jquery')); // 初始化插件
		})
	}else{
		factory(jQuery);
	}
})(function($){
	var type = ['input:not([type]),input[type="color"],input[type="date"],input[type="datetime"],input[type="datetime-local"],input[type="email"],input[type="file"],input[type="hidden"],input[type="month"],input[type="number"],input[type="password"],input[type="range"],input[type="search"],input[type="tel"],input[type="text"],input[type="time"],input[type="url"],input[type="week"],textarea', 'select', 'input[type="checkbox"],input[type="radio"]'],
		allTypes=type.join(","),
		extend={};
	var fieldValidTypeHand=function($field,status,options){
				if($field.prop("type")=="radio" || $field.prop("type")=="checkbox"){
					var $fields=options.$form.find('[name="'+$field.prop('name')+'"]');

					if($fields.filter(":checked").length > 0){
						$fields.removeClass('field-invalid')
					}else{
						$fields.addClass('field-invalid')
					}
				}else{
					if(status.required && status.pattern && status.conditional) {
						$field.removeClass('field-invalid');
					}else{
						$field.addClass('field-invalid');
					}
				}
	};
	var fieldTooltip=(function(){
			var instance=null;
				function show(text){
					if(!instance){
						var $container=$('<div class="field-tooltipWrap"><div class="field-tooltipInner"><div class="field-tooltip fieldTipBounceIn">'+text+'</div></div></div>');
		    			$container.appendTo($("body"));
		    			instance=true;
		    			setTimeout(function(){
							$container.remove();
							instance=false;
						},1500)
					}
				}
		   
			return {
				show:show
			}
	})();
	var validateField=function(event,options){
		var $field=$(this),
			status={
				required:true,
				conditional:true,
				pattern:true
			},
			log,//验证提示信息存储变量
			
			errorTipFormat=$.fn.mvalidate.errorTipFormat,//错误信息输出的格式化
			
			fieldValue =$.trim($field.val()) || "",

		    //*****获取当前字段的data-validate
			fieldValidate=$field.attr("data-validate"),
			validation=(fieldValidate != undefined) ? extend[fieldValidate]:{},
			//*****获取当前字段的data-required
			fieldRequired=$field.attr("data-required"),
			//*****获取当前字段的data-pattern
			fieldPattern = ($field.attr('data-pattern') || ($.type(validation.pattern) == 'regexp' ? validation.pattern : /(?:)/)),


			//*****获取当前字段的data-conditional
			fieldConditional=$field.attr("data-conditional") || validation.conditional,
			//*****获取当前字段的data-description
			fieldDescription=$field.attr("data-descriptions") || validation.descriptions,
			//*****获取当前字段的data-describedby
			fieldDescribedby=$field.attr("data-describedby") || validation.describedby;

			fieldDescription = $.isPlainObject(fieldDescription) ? fieldDescription : (options.descriptions[fieldDescription] || {});
			fieldRequired=fieldRequired !='' ? (fieldRequired || !!validation.required ) : true;
			if($.type(fieldPattern) != 'regexp') {
				fieldPattern=RegExp(fieldPattern);
			}

		//如果是必填验证,那么就要判断是什么类型的表单
		if(fieldRequired) {
			//如果是那种可以通过val()来判断的
			if($field.is(type[0] + ',' + type[1])) {
				if(!fieldValue.length > 0){
					status.required = false;
				}
			//如果是raido和checkbox,通过name和checked来判断
			}else if($field.is(type[2])){
				if($field.is('[name]')) {
					if(options.$form.find('[name="'+$field.prop('name')+'"]:checked').length==0){
						status.required = false;
					}
				}else{
					status.required = field.is(':checked');
				}
			}
		}
		/**如果是正则验证
		 * 只有那些类似type=text的文本框我们才能通过正则表达式去验证pattern,
		 * 而对于select,radio,checkbox pattern显然是无效的
		 */
		if($field.is(type[0])) {
			//如果不匹配
			if(!fieldPattern.test(fieldValue)){
				if(fieldRequired){
					status.pattern=false;
				}else{
					if(fieldValue.length > 0){
						status.pattern = false;
					}
				}
			}
		}

		//如果是data-conditional="name"函数验证,函数返回true或者是false
		if(fieldConditional !="undefined"){
			if($.isFunction(fieldConditional)){
				status.conditional=!!fieldConditional.call($field, fieldValue,options);
			}else{
				if(options.conditional.hasOwnProperty(fieldConditional) && !options.conditional[fieldConditional].call($field,fieldValue,options)){
					status.conditional=false;
				}
			}
		}

     
		//验证通过的信息所在对象
		
		log = errorTipFormat(fieldDescription.valid);
		if(!status.required) {
			log = errorTipFormat(fieldDescription.required);
			
		}else if(!status.pattern) {
			log = errorTipFormat(fieldDescription.pattern);
			
			
		} else if(!status.conditional) {
			log =errorTipFormat(fieldDescription.conditional);
		}

		var $describedShowElem=$('[id="' + fieldDescribedby +'"]');
		//如果找打提示的容器，是第二种类型的验证
		if($describedShowElem.length > 0 && options.type==2){
			//如果是change 或者是keyup 同时是第一次输入的时候就不要验证
			if((event.type=="keyup" || event.type=="change") && (!$describedShowElem.children().length || !$.trim($describedShowElem.text()))){

			}else{					
				$describedShowElem.html(log || '');
				fieldValidTypeHand($field,status,options)
			}
		}

		if(typeof(validation.each) == 'function') {
			validation.each.call($field, event, status, options);
		}
		options.eachField.call($field, event, status, options);

		if(status.required && status.pattern && status.conditional) {	
			
			if(typeof(validation.valid) == 'function') {//二外拓展的
				validation.valid.call($field, event, status, options);
			}
			options.eachValidField.call($field, event, status, options);
		}else{//验证未通过
			if(!options.firstInvalid && options.firstInvalidFocus){
				options.firstInvalid=true;
				$field.focus();
			}
			if(options.type==1){
				fieldTooltip.show(log)
			}
			if(typeof(validation.invalid) == 'function') {
				validation.invalid.call($field, event, status, options);
			}
			options.eachInvalidField.call($field, event, status, options);	
		}
		
	/**
	 * 如果是data-describedby="elemId"验证信息要显示的地方，类型3的验证:
		 * 		第一元素获取焦点，keyUp的时候要一直验证，如果正确那么错误信息就隐藏，如果不正确，那么错误
		 * 		提示信息要根据状态而改变,对于与验证通过，那么可以通过eachInvalid来让用户自定义，而无需要
		 * 		在插件中写它的操作方式
		 */
		return status;
	};
	$.extend($,{
		mvalidateExtend:function(options){
			return $.extend(extend, options);	
		},
		mvalidateTip:function(text){
			var txt=$.fn.mvalidate.errorTipFormat(text);
			fieldTooltip.show(txt)
		}
	});



	
	
	$.fn.mvalidate=function(options){
		var defaults={
			type:1,
			validateInSubmit:true,
			sendForm:true,
			onKeyup:false,
			onChange:true,
			firstInvalidFocus:true,//第一个未通过验证的表单是否获得交代呢
			conditional:{},
			descriptions:{},
			eachField : $.noop,
			eachValidField:$.noop,
			eachInvalidField : $.noop,
			valid:$.noop,
			invalid:$.noop,
			namespace:"mvalidate"
		},
		opts=$.extend(true,defaults,options),
		flag,
		namespace=opts.namespace;

		opts.type=Number(opts.type);
		opts.firstInvalid=false;
		flag=opts.type==1 ? false : true;
		return this.mvalidateDestroy().each(function(event) {
			
			var $form=$(this),
				$fields;//存放当前表单下的所有元素;
			if(!$form.is("form")) return;
			opts.$form=$form;
			$form.data(name,{"options":opts});
			$fields=$form.find(allTypes);
			
			//
			if(flag && opts.onKeyup){
				$fields.filter(type[0]).each(function() {

					$(this).on("keyup."+namespace,function(event){
						validateField.call(this,event,opts)
					})
				});
			}

			if(flag && opts.onChange){
				$fields.each(function() {
					var $this=$(this);
					if($this.is(type[1]+ ',' + type[2])){
						$(this).on('change.' + namespace, function(event) {
							validateField.call(this, event, opts);
						})
					}	
				})
			}

			//如果需要验证的时候,在提交表单的时候对所有的字段进行验证
			if(opts.validateInSubmit){
				$form.on("submit."+namespace,function(event){
					var formValid = true;
					opts.firstInvalid=false;
					$fields.each(function() {
						var status=validateField.call(this,event,opts);
						if(!status.pattern || !status.conditional || !status.required) {
							formValid = false;
						}
					});
					
					if(formValid){
						if(!opts.sendForm){
							event.preventDefault();
						}
						if($.isFunction(opts.valid)){
							opts.valid.call($form,event,opts);
						}
					//验证没有通过,禁用提交事件,以及绑定在这个elem上的其他事件	
					}else{
						event.preventDefault();
						event.stopImmediatePropagation();
						if($.isFunction(opts.invalid)) {
							opts.invalid.call($form,event,opts)
						}
					}
					
				})
			}
		})
	};
	$.fn.mvalidateDestroy=function(){
		var $form=$(this),$fields,
			dataValidate=$form.data(name);
		if($form.is('form') && $.isPlainObject(dataValidate) && typeof(dataValidate.options.nameSpace) == 'string') {
			$fields = $form.removeData(name).find(allTypes);
			$fields.off('.' + dataValidate.options.nameSpace);
		}	
		return $form;
	};
	$.fn.mvalidate.errorTipFormat=function(text){
		return '<div class="zvalid-resultformat">'+text+'</div>';
	}


})