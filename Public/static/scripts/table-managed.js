var TableManaged = function () {

    return {

        //main function to initiate the module
        init: function () {
            
            if (!jQuery().dataTable) {
                return;
            }

            // begin first table
            $('#sample').dataTable({
				"bProcessing" : false,
				"bPaginate": false,  //开关，是否显示分页器
				"bInfo": false, //开关，是否显示表格的一些信息
				"bFilter": false, //开关，是否启用客户端过滤器  
				"bLengthChange": false, //开关，是否显示每页大小的下拉框  
				"bStateSave": false, //开关，是否打开客户端状态记录功能。这个数据是记录在cookies中的， 打开了这个记录后，即使刷新一次页面，或重新打开浏览器，之前的状态都是保存下来的- ------当值为true时aoColumnDefs不能隐藏列  
				"aoColumnDefs": [{ "bVisible": false, "aTargets": [0]}],//隐藏列  
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sPaginationType": "bootstrap",
                "oLanguage": {                          //汉化  
					"sSearch":"搜索:",
					"sLengthMenu": "每页显示 _MENU_ 条记录",  
					"sZeroRecords": "没有检索到数据",  
					"sInfo": "当前数据为从第 _START_ 到第 _END_ 条数据；总共有 _TOTAL_ 条记录",  
					"sInfoEmtpy": "没有数据",  
					"sProcessing": "正在加载数据...",  
					"oPaginate": {  
						"sFirst": "首页",  
						"sPrevious": "前页",  
						"sNext": "后页",  
						"sLast": "尾页"  
					},
				},
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });

            jQuery('#sample .group-checkable').change(function () {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                    $(this).parents('tr').toggleClass("active");
                });
                jQuery.uniform.update(set);

            });

            jQuery('#sample tbody tr .checkboxes').change(function(){
                 $(this).parents('tr').toggleClass("active");
            });

            jQuery('#sample_wrapper .dataTables_filter input').addClass("form-control input-medium"); // modify table search input
            jQuery('#sample_wrapper .dataTables_length select').addClass("form-control input-xsmall"); // modify table per page dropdown
            //jQuery('#sample_wrapper .dataTables_length select').select2(); // initialize select2 dropdown
			
			i = 1;
			while( i<10 ){

				if($("#sample_"+i)){
					
					// begin first table
					$('#sample_'+i).dataTable({
						"bProcessing" : false,
						"bPaginate": false,  //开关，是否显示分页器
						"bInfo": false, //开关，是否显示表格的一些信息
						"bFilter": false, //开关，是否启用客户端过滤器  
						"bLengthChange": false, //开关，是否显示每页大小的下拉框  
						"bStateSave": false, //开关，是否打开客户端状态记录功能。这个数据是记录在cookies中的， 打开了这个记录后，即使刷新一次页面，或重新打开浏览器，之前的状态都是保存下来的- ------当值为true时aoColumnDefs不能隐藏列  
						"aoColumnDefs": [{ "bVisible": false, "aTargets": [0]}],//隐藏列  
						"aLengthMenu": [
							[5, 15, 20, -1],
							[5, 15, 20, "All"] // change per page values here
						],
						// set the initial value
						"iDisplayLength": 5,
						"sPaginationType": "bootstrap",
						"oLanguage": {                          //汉化  
							"sSearch":"搜索:",
							"sLengthMenu": "每页显示 _MENU_ 条记录",  
							"sZeroRecords": "没有检索到数据",  
							"sInfo": "当前数据为从第 _START_ 到第 _END_ 条数据；总共有 _TOTAL_ 条记录",  
							"sInfoEmtpy": "没有数据",  
							"sProcessing": "正在加载数据...",  
							"oPaginate": {  
								"sFirst": "首页",  
								"sPrevious": "前页",  
								"sNext": "后页",  
								"sLast": "尾页"  
							},
						},
						"aoColumnDefs": [{
								'bSortable': false,
								'aTargets': [0]
							}
						]
					});
		
					jQuery('#sample_' +i+' .group-checkable').change(function () {
						var set = jQuery(this).attr("data-set");
						var checked = jQuery(this).is(":checked");
						jQuery(set).each(function () {
							if (checked) {
								$(this).attr("checked", true);
							} else {
								$(this).attr("checked", false);
							}
							$(this).parents('tr').toggleClass("active");
						});
						jQuery.uniform.update(set);
		
					});
		
					jQuery('#sample_' +i+ ' tbody tr .checkboxes').change(function(){
						 $(this).parents('tr').toggleClass("active");
					});
		
					jQuery('#sample__'+i+' wrapper .dataTables_filter input').addClass("form-control input-medium"); // modify table search input
					jQuery('#sample__'+i+' wrapper .dataTables_length select').addClass("form-control input-xsmall"); // modify table per page dropdown
				}

				i++;
			}
			
        }

    };

}();