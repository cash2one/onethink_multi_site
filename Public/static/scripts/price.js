var PRICE = function(options){
	this.init(options);
}

PRICE.prototype = {
	
	$input:null,
	
	$priceTable:null,
	
	units:null,
	
	count:0,
	
	form:$('#form'),
	
	init:function(options){
	
		var $input = this.$input = $(options.$input);
		var $priceTable = this.$priceTable = $(options.$priceTable);
		var data = $input.val() || null;
		
		this.units = options.units;
		
		$input.hide().after($priceTable);
		
		this.form.attr('data-pickData','true');
		
		this.parseData(data);
		
		this.enventReady();
		
	},
	
	parseData:function(data){
		var $input = this.$input;
		if(data){
			data = eval('('+$input.val()+')')
			for( p in data ){
				var d = data[p];
				var dataLog = {
					'unit':d[0],
					'start':d[1],
					'end':d[2],
					'price':d[3]
				}
				this.addLog(this.count-1,dataLog);
			}
		}else{
			data = {
				'unit':0,
				'start':0,
				'end':'',
				'price':'',
			}
			
			this.addLog(-1);
		}
	},
	
	addLog:function(id,data){
		var html = '',
			$log,
			pickClass = ' class="price'+this.count+'" ',
			selectHtml = '',
			$select,
			unit,
			selected = ''
			newUnit='';
		
		selectHtml += '<select'+pickClass+'>';
		for( p in this.units ){
			unit = this.units[p];
			selected = (data&&p==data.unit?'selected':'');
			
			selectHtml += '<option '+selected+' value="'+p+'">'+unit+'</option>';
		}
		selectHtml += '</select>';
		
		if(!data){
			html += '<tr>'; 
			html += '<td>'+selectHtml+'</td>';
			html += '<td><input'+pickClass+'><span class="js_unit">单位</span></td>';
			html += '<td><input'+pickClass+'><span class="js_unit">单位</span></td>';
			html += '<td><input'+pickClass+'><span>元/</span><span class="js_unit">单位</span></td>';
			html += '<td><a href="#" class="addLog">添加</a>&nbsp;'+
						'<a href="#" class="deleteLog">删除</a>&nbsp;'+
						'<a href="#" class="up">上移</a>&nbsp'+
						'<a href="#" class="down">下移</a></td>';
			html += '</tr>';
		}else{
			newUnit = this.units[data.unit];
			html += '<tr>'; 
			html += '<td>'+selectHtml+'</td>';
			html += '<td><input'+pickClass+' value="'+data.start+'"><span class="js_unit">'+newUnit+'</span></td>';
			html += '<td><input'+pickClass+' value="'+data.end+'"><span class="js_unit">'+newUnit+'</span></td>';
			html += '<td><input'+pickClass+' value="'+data.price+'"><span>元/</span><span class="js_unit">'+newUnit+'</span></td>';
			html += '<td><a href="#" class="addLog">添加</a>&nbsp;'+
						'<a href="#" class="deleteLog">删除</a>&nbsp;'+
						'<a href="#" class="up">上移</a>&nbsp'+
						'<a href="#" class="down">下移</a></td>';
			html += '</tr>';
		}
		
		$log = $(html);
		$log.attr('data-id',this.count);
		this.count++;

		if(id>0){
			this.$priceTable.find('tr[data-id='+id+']').after($log);
		}else{
			this.$priceTable.find('tbody').append($log);
		}
		
	},
	
	deleteLog:function(id){
		if(id){
			this.$priceTable.find('tr[data-id='+id+']').remove();
		}
	},
	// 收集数据
	pickData:function(){
		var datas = {};
		
		this.$priceTable.find('tbody tr').each(function(i){
			var count = $(this).attr('data-id'),
				$data_log = $('.price'+count),
				data = [];
			
			data[0] = $data_log.eq(0).val();
			data[1] = $data_log.eq(1).val();
			data[2] = $data_log.eq(2).val();
			data[3] = $data_log.eq(3).val();
			
			datas[i] = data;
		})
		return window.JSON.stringify(datas);
		
	},
	enventReady:function(){
		var _this = this,
			$tr = null,
			id = 0;
			
		// 添加
		$(document).on('click','.addLog',function(){
			$tr = $(this).parent().parent();
			id = $tr.attr('data-id');
			
			_this.addLog(id);
		})
		
		// 删除
		$(document).on('click','.deleteLog',function(){
			var trLen = _this.form.find('tbody').find('tr').length;
			console.log(trLen)
			if(trLen == 1){
				updateAlert('不能删除最后一列数据！');
				setTimeout(function(){
					$('#top-alert').find('button').click();
				},1500);
				return false;
			}
			
			$tr = $(this).parent().parent();
			id = $tr.attr('data-id');
			
			_this.deleteLog(id);
		})
		
		// 上移
		$(document).on('click','.up',function(){
			$tr = $(this).parent().parent();
			$tr.prev().before($tr);
		})
		
		// 下移
		$(document).on('click','.down',function(){
			$tr = $(this).parent().parent();
			$tr.next().after($tr);
		})
		
		// 单位
		$(document).on('change','tr select',function(){
			var unit = _this.units[$(this).val()];
			
			$(this).parent().parent().find('.js_unit').html(unit);
		})
		
		// 数据获取
		$(document).on('pickData',this.form,function(){
			var data = _this.pickData();
			
			_this.$input.val(data);
		})
		
	}
	
}