var BILL = function(options){
	
	this.setting = $.extend({},this.setting,options);
	
	this.init();
}

BILL.prototype = {
	
	setting:{
		sumFields:'',
		inputSize:10
	},
	
	$input:null,
	
	$billTable:null,
	
	fields:null,
	
	sumField:'',
	
	count:0,
	
	form:$('#form'),
	
	init:function(){
	
		var $input = this.$input = $(this.setting.$input);
		var $billTable = this.$billTable = $(this.setting.$billTable);
		var data = $input.val() || null;
		
		BILL.storage.push({
			'table':$billTable,
			'input':$input,
			'picked':false
		})
		
		this.fields = this.setting.fields;
		this.sumField = this.setting.sumField;
		
		$input.hide().after($billTable);
		
		this.form.attr('data-pickData','true');
		
		this.parseData(data);
		
		this.enventReady();
		
	},
	
	parseData:function(data){
		var $input = this.$input, 
			fields = this.fields;
		
		if(data){
			data = eval('('+$input.val()+')')
			for( p in data ){
				var d = data[p];
				var dataLog = {};
				var i = 0;
				
				for(field in fields){
					dataLog[field] = d[i];
					i++;
				}
				
				this.addLog(this.count-1,dataLog);
			}
		}else{
			this.addLog(-1);
		}
	},
	
	addLog:function(id,data){
		var html,
			$log,
			className = 'bill'+this.count;
			pickClass = ' class="bill'+this.count+'" ';
		
		/*
		if(!data){
			html += '<tr>'; 
			html += '<td><textarea'+pickClass+'></textarea></td>';
			html += '<td><textarea'+pickClass+'></textarea></td>';
			html += '<td><input'+pickClass+' data-event="amount"><span>元</span></td>';
			html += '<td><a href="#" class="addLog">添加</a>&nbsp;'+
						'<a href="#" class="deleteLog">删除</a>&nbsp;'+
						'<a href="#" class="up">上移</a>&nbsp'+
						'<a href="#" class="down">下移</a></td>';
			html += '</tr>';
		}else{
			html += '<tr>'; 
			html += '<td><textarea'+pickClass+'>'+data.itme+'</textarea></td>';
			html += '<td><textarea'+pickClass+'>'+data.real+'</textarea></td>';
			html += '<td><input'+pickClass+' value="'+data.money+'" data-event="amount"><span>元</span></td>';
			html += '<td><a href="#" class="addLog">添加</a>&nbsp;'+
						'<a href="#" class="deleteLog">删除</a>&nbsp;'+
						'<a href="#" class="up">上移</a>&nbsp'+
						'<a href="#" class="down">下移</a></td>';
			html += '</tr>';
		}
		*/
		
		html = this.initLogHtml(this.fields, data, className);
		
		$log = $(html);
		$log.attr('data-id',this.count);
		this.count++;
		
		if(id>0){
			this.$billTable.find('tr[data-id='+id+']').after($log);
		}else{
			this.$billTable.find('tbody').append($log);
		}
		
	},
	
	initLogHtml:function(fields,data,className){
		var html =$('<tr>'),
			tagName,
			$input,
			val,
			$td;
	
		for( field in fields){
			tagName = fields[field];
			$input = $('<'+tagName+'>');
			val = data && data[field];
			 
			$input.addClass(className);
			
			if( this.setting.sumFields.indexOf(field) != -1 ){
				$input.attr('data-event','amount');
			}
			
			if( tagName == 'select'){
				var options = (this.setting.selectData)[field];

				if( options instanceof Array ){
					options.forEach(function(option){
						$input.append( $("<option value='"+option+"'>"+option+"</option>") )
					})

				}else{
					for( p in options){
						var option = options[p];
						$input.append( $("<option value='"+option.id+"'>"+option.title+"</option>") )
					}
				}
			}
			
			if( tagName == 'input'){
				$input.attr('size',this.setting.inputSize);
			}
			
			if(  /date/.test(field) ){
				//$input.addClass('form_date');
				this.datePick($input);
			}
			
			if( val ){
				$input.val( val );
			}
			
			html.append( $('<td>').append( $input ) );
		}
		
		html.append( '<td><a href="#" class="addLog">添加</a>&nbsp;'+
						'<a href="#" class="deleteLog">删除</a>&nbsp;'+
						'<a href="#" class="up">上移</a>&nbsp'+
						'<a href="#" class="down">下移</a></td>');
		
		return html;
	},
	
	deleteLog:function(id){
		if(id){
			this.$billTable.find('tr[data-id='+id+']').remove();
		}
	},
	// 收集数据
	pickData:function(){
		var datas = {},
			_this = this;
		
		this.$billTable.find('tbody tr').each(function(i){
			var count = $(this).attr('data-id'),
				$data_log = _this.$billTable.find('.bill'+count),
				data = [];
			
			$data_log.each(function(i){
				data[i] = $(this).val();
			})
			
			datas[i] = data;
		})
		return window.JSON.stringify(datas);
		
	},
	
	datePick:function(input){
				
		$(input).datepicker({
			pickerPosition:"bottom-right",
			todayBtn:true,
			minView: "month", //选择日期后，不会再跳转去选择时分秒 
		　　	format: "yyyy-mm-dd", //选择日期后，文本框显示的日期格式 
		　　	language: 'zh-CN', //汉化 
		　　	autoclose:true //选择日期后自动关闭 
		});

		$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
				
	},
	
	enventReady:function(){
		var _this = this,
			$billTable = this.$billTable,
			$tr = null,
			id = 0;
			
		// 添加
		$billTable.on('click','.addLog',function(event){
			$tr = $(event.target).parent().parent();
			id = $tr.attr('data-id');
			
			_this.addLog(id);
		})
		
		// 删除
		$billTable.on('click','.deleteLog',function(){
			var trLen = _this.$billTable.find('tbody').find('tr').length;
			
			if(trLen == 1){
				updateAlert('不能删除最后一列数据！');
				setTimeout(function(){
					$('#top-alert').find('button').click();
				},1500);
				return false;
			}
			
			$tr = $(event.target).parent().parent();
			id = $tr.attr('data-id');
			
			_this.deleteLog(id);
		})
		
		// 上移
		$billTable.on('click','.up',function(){
			$tr = $(event.target).parent().parent();
			$tr.prev().before($tr);
		})
		
		// 下移
		$billTable.on('click','.down',function(){
			$tr = $(event.target).parent().parent();
			$tr.next().after($tr);
		})
		
		/*
		// 单位
		$(document).on('change','tr select',function(){
			var unit = _this.units[$(this).val()];
			
			$(this).parent().parent().find('.js_unit').html(unit);
		})
		*/
		
		// 计算总金额
		$billTable.on('blur','input[data-event=amount]',function(){
			var amount = 0;
			$('input[data-event=amount]').each(function(){
				amount += parseFloat($(this).val()||0);
			})
			
			amount = isNaN(amount) ? '':amount;
			
			$('input[name=amount]').val(amount);
		})
		
		// 数据获取
		$(document).on('pickData',this.form,function(){
			var datas = _this.pickData();
			
			_this.$input.val(datas)
		})
		
	}
	
}

BILL.storage = [];

BILL.pickData = function(){

}

BILL.format = function(str){
	var float = [],
		mark = [],
		len1,
		tmp = '',
		num1 = '零壹贰叁肆伍陆柒捌玖ⓧ',
		num2 = '仟佰拾万仟佰拾元角分',
		r = '',
		char_val;
	
	str = parseFloat(str).toFixed(2);
	
	if(  99999999.99 < str || str < 0.01 ){
		console.log('输入数字大小不合适');
		return false;
	}
	
	float = str.toString().split('.');
	
	len1 = float[0].length;
	
	//格式化小写金额
	if(len1 < 8){
		
		for(var i=0,len = 8-len1; i<len; i++){
			tmp += '@';
		}
		
		mark[0] ='￥' + float[0]+float[1];
		mark[1] = tmp + float[0]+float[1];
		
	}else{
		mark[0] = mark[1] = float[0]+float[1];
	}
	
	
	str = float.join('');
	
	// 格式化大写金额
	for(var i=0; i<10; i++ ){
		char_val = mark[1][i];
		r += (char_val=='@' ? num1[10]:num1[char_val] )+ num2[i];
	}
	
	return {'num1':mark[0],'num2':r}
	
};

BILL.scan = function(arr){
	arr.forEach(function(name){
		var $input = $('input[name='+name+']'),
			$textarea = $('textarea[name='+name+']'),
			$select = $('select[name='+name+']'),

			$target = $('td[data-name='+name+']'),

			val = $input.val() || $textarea.val() || $select.val() || false ;
			
		
		if( val ){
			
			if(name == 'uid'){
				var $select_uid = $input.parent().find('select').eq(0);
				
				val = $select_uid.find('option[value='+val+']').eq(0).html();
			}
			
			if(name == 'user_id'){
				var $select_uid = $input.parent().find('select').eq(0);
				
				val = $select_uid.find('option[value='+val+']').eq(0).html();
			}
			
			if(name == 'department_id'){
				var $select_uid = $input.parent().find('select').eq(0);
				
				val  = $select_uid.find('option[value='+val+']').eq(0).html();
			}
			
			if(name == 'receipt2'){
				$input.each(function(){
					if($(this).attr('checked')){
						val = $(this).parent().parent().next().html();
					}
				})

			}

			if(name == 'create_time'){
				var t = new Date(val);
				
				val = t.getYear() + 1900 + ' 年 ' + (t.getMonth() + 1) + ' 月 ' + t.getDate() + ' 日';
			}
			
			if( name == 'payment1' || name == 'payment2' || name == 'payment3' || name == 'amount' || name == 'unpaid'  || name == 'payee_amount' ){
				val = parseFloat(val).toFixed(2);
			}

			if( name == 'payee_bank' ){
				
				val  = $select.find('option[value='+val+']').eq(0).html();
			}
			
			$target.html(val);
		
		}
	})
};