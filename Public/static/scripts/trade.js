var TRADE = function(options){
	this.init(options);
}

TRADE.prototype = {
	
	unit:0,
	
	units: null,
	
	$quantity:null,
	
	$sale:null,
	
	$cost:null,
	
	$salePrice:null,
	
	$costPrice:null,
	
	$profit:null,
	
	data:{
		quantity:0,
		sale:0,
		cost:0
	},
	
	init:function(options){
		var selectHtml ='';
			
		this.unit = options.unit || 0;
		this.$quantity = $(options.quantity);
		this.data.quantity = this.$quantity.val();
		
		this.$sale = $(options.sale);
		this.data.sale = this.$sale.val();
		
		this.$cost = $(options.cost);
		this.data.cost = this.$cost.val();
		
		this.$salePrice = $(options.salePrice);
		this.$costPrice = $(options.costPrice);
		this.$profit = $(options.profit);
		this.units = options.units;
		
		selectHtml += '<select name="unit">';
		for( p in this.units ){
			unit = this.units[p];
			selected = (this.unit&&p==this.unit?'selected':'');
			
			selectHtml += '<option '+selected+' value="'+p+'">'+unit+'</option>';
		}
		selectHtml += '</select>';
		
		this.$quantity.prev().find('span').html(selectHtml);
		
		this.$salePrice.attr('readonly','readonly');
		this.$costPrice.attr('readonly','readonly');
		this.eventReady(options);
		this.dataFormat();
	},
	
	changeUnit:function(unit){
		var saleUnit = this.$salePrice.prev().find('span');
		var costUnit = this.$costPrice.prev().find('span');
		var unitHtml = '（单位：元/'+unit+'）';
		
		saleUnit.html(unitHtml);
		costUnit.html(unitHtml);
	},
	
	dataFormat:function(){
		var quantity      =this.data.quantity,
			sale          =this.data.sale,
			cost          =this.data.cost,
			salePrice,
			costPrice,
			profit;
		
		if( sale >=0 && cost>=0 ){
			profit = sale - cost;
			
			this.$profit.val(profit);
		}
		
		if(quantity >0 ){
			if(sale >0){
				salePrice = parseFloat( sale / quantity );
				this.$salePrice.val(salePrice);
			}
			if( cost>0 ){
				costPrice = parseFloat( cost / quantity );
			
				this.$costPrice.val(costPrice);
			}
		}
		
	},
	
	eventReady:function(options){
		var _this = this;
		
		// 单位
		$(document).on('change','select[name=unit]',function(){
			var unit = _this.units[$(this).val()];
			_this.changeUnit(unit);
		})
		
		// 数量
		$(document).on('change',options.quantity,function(){
			console.log('quantity change')
			var val = $(this).val();
			
			_this.data.quantity = val;
			
			_this.dataFormat();
		})
		
		// 售价
		$(document).on('change',options.sale,function(){
			console.log('sale change')
			var val = $(this).val();
			
			_this.data.sale = val;
			
			_this.dataFormat();
		})
		
		// 成本
		$(document).on('change',options.cost,function(){
			console.log('cost change')
			var val = $(this).val();
			
			_this.data.cost = val;
			
			_this.dataFormat();
		})
		
		
	}
	
}