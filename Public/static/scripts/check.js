var CHECK = function(options){
	
	this.setting = $.extend({},this.setting,options);
	
	this.init();
}

CHECK.prototype = {
	
	setting:{
	},
	
	$input:null,
	
	$checkTable:null,
	
	fields:null,
	
	sumField:'',
	
	count:0,
	
	form:$('#form'),
	
	init:function(){
	
		var $input = this.$input = $(this.setting.$input);
		var $checkTable = this.$checkTable = $(this.setting.$checkTable);
		var data = $input.val() || null;
		
		this.fields = this.setting.fields;
		this.sumField = this.setting.sumField;
		
		$input.hide().after($checkTable);
		
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
			className = 'check'+this.count;
			pickClass = ' class="check'+this.count+'" ';
		
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
			this.$checkTable.find('tr[data-id='+id+']').after($log);
		}else{
			this.$checkTable.find('tbody').append($log);
		}
		
	},
	
	initLogHtml:function(fields,data,className){
		var html =$('<tr>'),
			tagName,
			$input,
			val,
			$td;
	
	
		$input = $('<span>');
		$input.html(this.count);
		html.append( $('<td>').append( $input ) );
		
		for( field in fields){
			tagName = fields[field];
			$input = $('<'+tagName+'>');
			val = data && data[field];
			 console.log(data)
			$input.addClass(className);

			
			if( tagName == 'select'){
				var options = (this.setting.selectData)[field];

				options['0'] = {'id':0,'department_id':'','title':'自动获取'};
				
				for(gid in options){
					if(val == gid){
						$input.append( $("<option selected value='"+gid+"'>"+options[gid]['department_id']+'-'+options[gid]['title']+"</option>") );
					}else{
						$input.append( $("<option value='"+gid+"'>"+options[gid]['department_id']+'-'+options[gid]['title']+"</option>") );
					}
				}
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
			this.$checkTable.find('tr[data-id='+id+']').remove();
		}
	},
	// 收集数据
	pickData:function(){
		var datas = {},
			_this = this;
		
		this.$checkTable.find('tbody tr').each(function(i){
			var count = $(this).attr('data-id'),
				$data_log = _this.$checkTable.find('.check'+count),
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
			$checkTable = this.$checkTable,
			$tr = null,
			id = 0;
			
		// 添加
		$checkTable.on('click','.addLog',function(event){
			$tr = $(event.target).parent().parent();
			id = $tr.attr('data-id');
			
			_this.addLog(id);
		})
		
		// 删除
		$checkTable.on('click','.deleteLog',function(){
			var trLen = _this.$checkTable.find('tbody').find('tr').length;
			
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
		$checkTable.on('click','.up',function(){
			$tr = $(event.target).parent().parent();
			$tr.prev().before($tr);
		})
		
		// 下移
		$checkTable.on('click','.down',function(){
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
		$checkTable.on('blur','input[data-event=amount]',function(){
			var amount = 0;
			$('input[data-event=amount]').each(function(){
				amount += parseFloat($(this).val());
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