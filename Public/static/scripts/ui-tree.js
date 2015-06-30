var UITree = function () {
	
    return {
		
		departData:[],
		
		positionData:[],
		
		departShow:true,
		
		positionShow:true,
		
		getSubById:function(id){
			var subs = [],
				_this = this;
			
			if(this.positionShow == 'show' ){
				this.positionData.forEach(function(value){
					
					if(_this.departShow == 'show' ){
						if( id == value['department_id'] ){
							subs.push({ name: value['title'], type: 'item', additionalParameters: { id: value['id'] } })
						}
					}else{							
						if( id == value['pid'] ){
							subs.push({ name: value['title'], type: 'folder', additionalParameters: { id: value['id'] } })
						}
					}
					
				})
			}
			
			if(this.departShow == 'show' ){
				this.departData.forEach(function(value){
				
					if( id == value['pid'] ){
						subs.push({ name: value['title'], type: 'folder', additionalParameters: { id: value['id'] } })
					}
					
				})
			}
			
			return subs;
		},
        //main function to initiate the module
        init: function (settings) {

            var DataSourceTree = function (options) {
					this._data  = options.data;
					this._delay = options.delay;
					this.index = 0;
				},
				_this=this;
			
			this.departData = settings.departData;
			this.positionData = settings.positionData;
			this.departShow = settings.departShow;
			this.positionShow = settings.positionShow;

            DataSourceTree.prototype = {
				
                data: function (options, callback) {
                    var self = this,
						id = options.additionalParameters ? options.additionalParameters.id : 0;
					
                    setTimeout(function () {
						// 获取下级数据
                        var data = _this.getSubById(id);

                        callback({ data: data });

                    }, this._delay)
					
                }
				
            };
            
            // INITIALIZING TREE
            var treeDataSource = new DataSourceTree({
                delay: 0
            });

            $('#MyTree').tree({
                dataSource: treeDataSource
            });
			
        },
		
		clear:function(){
			
			$('#MyTree').children().each(function(){
				var dispaly = $(this).css('display');
				console.log($(this).css('display'))
				if(dispaly == 'block'){
					$(this).remove();
				}
			});
		},
		
		render:function(){
			$('#MyTree').tree('render')
		}
		
    };

}();