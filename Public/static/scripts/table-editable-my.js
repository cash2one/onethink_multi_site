var TableEdit = function (options) {
	
	this.setting = $.extend({},this.setting,options)
	
	this.init(options);
	
	this.eventReady();
};

TableEdit.prototype = {
	
	setting:{
	},
	
	$table:null,
	
	init:function(){
		this.$table = $(this.setting.table);
		console.log(this.$table)
	},
	
	eventReady:function(){
		var $table = this.$table,
			editCell = this.setting.editCell,
			cell,
			val,
			name,
			tag,
			type,
			$input;
		
		$table.on({
			'dblclick':function(event){
				cell = $(event.target);
				val = cell.html();
				name = cell.attr('data-name');
				tag = cell.attr('data-tag') || 'input';
				type = cell.attr('data-type');
				$input = $('<' +type+ '>');
				
				if( name ){
					
					if( type == 'date'){
					}
					cell.append($input)
				}
				
				
				
			}
		},$(editCell))
		
	}
	
}