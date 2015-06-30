var TableManaged = function () {

    return {

        //main function to initiate the module
        init: function () {
            
            if (!jQuery().dataTable) {
                return;
            }

            // begin first table
            $('#sample').dataTable({
                "aoColumns":null,
                // set the initial value
				"bPaginate":false,
                "iDisplayLength": -1,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
					"sLengthMenu": "每页显示 _MENU_条",
					"sZeroRecords": "没有找到符合条件的数据",
					"sProcessing": "&lt;img src='./loading.gif' /&gt;",
					"sInfo": "　共计 _TOTAL_ 条",
					"sInfoEmpty": "木有记录",
					"sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
					"sSearch": "搜索：",
					"oPaginate": {
						"sFirst": "首页",
						"sPrevious": "前一页",
						"sNext": "后一页",
						"sLast": "尾页"
					}
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
                });
                jQuery.uniform.update(set);
            });

            jQuery('#sample_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
            jQuery('#sample_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown


        }

    };

}();