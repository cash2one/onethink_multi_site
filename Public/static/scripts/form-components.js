var FormComponents = function () {

	// 日期选择
    var handleDatePicker = function () {

        $(".form_date").datepicker({
		    pickerPosition:"bottom-right",
			todayBtn:true,
			minView: "month", //选择日期后，不会再跳转去选择时分秒 
		　　	format: "yyyy-mm-dd", //选择日期后，文本框显示的日期格式 
		　　	language: 'zh-CN', //汉化 
		　　	autoclose:true //选择日期后自动关闭 
        });

        $('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
    }    
	
	// 时间选择
	var handleDatetimePicker = function () {

        $(".form_datetime").datetimepicker({
		    pickerPosition:"bottom-right",
			todayBtn:true,
			minView: "month", //选择日期后，不会再跳转去选择时分秒 
		　　	format: "yyyy-mm-dd hh:ii", //选择日期后，文本框显示的日期格式 
		　　	language: 'zh-CN', //汉化 
		　　	autoclose:true //选择日期后自动关闭 
        });

        $('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
    }

    return {
        init: function () {
        	handleDatePicker();
            handleDatetimePicker();
        }
    };

}();