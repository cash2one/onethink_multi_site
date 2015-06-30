var TableAdvanced = function () {

    var initTable1 = function() {

        /*
         * Insert a 'details' column to the table
         */
        var nCloneTh = document.createElement( 'th' );
        var nCloneTd = document.createElement( 'td' );
        nCloneTh.innerHTML = '详情/报价';
        nCloneTd.innerHTML = '<span class="row-details row-details-close"></span>';
         
        $('#sample_1 > thead > tr').each( function () {
            this.insertBefore( nCloneTh, this.childNodes[0] );
        } );
         
        $('#sample_1 > tbody > tr').each( function () {
            this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
        } );
         
        /*
         * Initialize DataTables, with no sorting on the 'details' column
         */
        var oTable = $('#sample_1').dataTable({
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

        jQuery('#sample_1_wrapper .dataTables_filter input').addClass("form-control input-small"); // modify table search input
        jQuery('#sample_1_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown
        jQuery('#sample_1_wrapper .dataTables_length select').select2(); // initialize select2 dropdown
         
        /* Add event listener for opening and closing details
         * Note that the indicator for showing which row is open is not controlled by DataTables,
         * rather it is done here
         */
        $('#sample_1').on('click', ' tbody td .row-details', function () {
            var nTr = $(this).parents('tr')[0];
			var html;
            if ( oTable.fnIsOpen(nTr) )
            {
                /* This row is already open - close it */
                $(this).addClass("row-details-close").removeClass("row-details-open");
                oTable.fnClose( nTr );
            }
            else
            {
                /* Open this row */                
                $(this).addClass("row-details-open").removeClass("row-details-close");
				html = $(this).parent().parent().find('td[data-class=data]').html();
				
                oTable.fnOpen( nTr, html, 'details' );
            }
        });
    }
	
    return {

        //main function to initiate the module
        init: function () {
            
            if (!jQuery().dataTable) {
                return;
            }

            initTable1();
        }

    };

}();