var UITree = function () {

    return {
        //main function to initiate the module
        init: function () {
            // handle collapse/expand for tree_1
            $('#tree_collapse').click(function () {
                $('.tree-toggle', $('#tree > li > ul')).addClass("closed");
                $('.branch', $('#tree > li > ul')).removeClass("in");
            });

            $('#tree_expand').click(function () {
                $('.tree-toggle', $('#tree > li > ul')).removeClass("closed");
                $('.branch', $('#tree > li > ul')).addClass("in");
            });
			
			$('#tree').find("input").on("click",function(event){
				event.stopPropagation();
			})
			
            $('#tree_checkall').click(function () {
                $('#tree').find("input").prop("checked",true).parent().addClass("checked");
            });
			
            $('#tree_checkout').click(function () {
                $('#tree').find("input").prop("checked",false).parent().removeClass("checked");
            });

        }

    };

}();