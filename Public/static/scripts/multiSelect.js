function multiProductSelect(selecter,data,callback){
	var selectMulti = $('<select class="form-control select2" ></select>');
	var $select = $(selecter);
	var html = null;
	var id = $select.val() || 0;
	
	html += '<option value="0">选择产品</option>';
	
	for( cate in data ){
		var cateData = data[cate];
		var cateTitle  = cateData.title;
		var productData = cateData.data;
		
		html += '<optgroup label="'+cateTitle+'">';
		
		for( p in productData ){
			var product = productData[p];
			var pId = product.id;
			var pCas = product.cas;
			var pTitle = product.title;
			
			if(id == pId){
				html += '<option selected value="'+pId+'">'+pTitle+'【'+pCas+'】'+'</option>'
			}else{
				html += '<option value="'+pId+'">'+pTitle+'【'+pCas+'】'+'</option>'
			}
	
		}
		html += '</optgroup>';
		
	}
	
	$select.hide().after(selectMulti);
	
	selectMulti
	.html(html)
	.select2({
		allowClear: true
	})
	.change(function(){
		var id = $(this).val();
		$select.val(id);

		if(callback){
			callback.call({},selectMulti);
		}
	});
}

function multiProductListSelect(selecter,data){
	var selectMulti = $('<select class="form-control select2" multiple></select>');
	var $select = $(selecter);
	var html = null;
	var id = $select.val().split(',') || [];
	
	html += '<option value="0">选择产品</option>';
	
	for( cate in data ){
		var cateData = data[cate];
		var cateTitle  = cateData.title;
		var productData = cateData.data;
		
		html += '<optgroup label="'+cateTitle+'">';
		
		for( p in productData ){
			var product = productData[p];
			var pId = product.id;
			var pCas = product.cas;
			var pTitle = product.title;
			
			if(inArray(pId,id)){
				html += '<option selected value="'+pId+'">'+pTitle+'【'+pCas+'】'+'</option>'
			}else{
				html += '<option value="'+pId+'">'+pTitle+'【'+pCas+'】'+'</option>'
			}


	
		}
		html += '</optgroup>';
		
	}
	
	$select.hide().after(selectMulti);
	
	selectMulti
	.html(html)
	.select2({
		allowClear: true
	})
	.change(function(){
		var id = $(this).val();
		$select.val(id);
	});
}

function multiCustomSelect(selecter,data){
	var selectMulti = $('<select class="form-control select2" ></select>');
	var $select = $(selecter);
	var html = null;
	var id = $select.val() || 0;
	
	html += '<option value="0">选择客户</option>';
	
	for( custom in data ){
		var customData = data[custom];
		var cId  = customData.id;
		var cNickname  = customData.nickname;
		var cCompany  = customData.company;
		
		if(id == cId){
			html += '<option selected value="'+cId+'">'+cNickname+'【'+cCompany+'】'+'</option>'
		}else{
			html += '<option value="'+cId+'">'+cNickname+'【'+cCompany+'】'+'</option>'
		}

	}
	
	$select.hide().after(selectMulti);
	
	selectMulti
	.html(html)
	.select2({
		allowClear: true
	})
	.change(function(){
		var id = $(this).val();
		$select.val(id);
	});
}

// 选择供应商，返回值为nickname
function multiSupplierSelect(selecter,data,callback){
	var selectMulti = $('<select class="form-control select2" ></select>');
	var $select = $(selecter);
	var html = null;
	var id = $select.val() || 0;
	
	html += '<option value="0">选择供应商</option>';
	
	for( supplier in data ){
		var supplierData = data[supplier];
		var sId  = supplierData.id;
		var sNickname  = supplierData.nickname;
		var sCompany  = supplierData.company;
		var sBank = supplierData.bank;
		var sAccount  = supplierData.account;
		
		if(id == sCompany){
			html += '<option selected value="'+sId+'">'+sCompany+'</option>'
		}else{
			html += '<option value="'+sId+'">'+sCompany+'</option>'
		}

	}
	
	$select.hide().after(selectMulti);
	
	selectMulti
	.html(html)
	.select2({
		allowClear: true
	})
	.change(function(){
		var id = $(this).val();
		var supplierData = data[id];

		$select.val(supplierData.company);

		if(callback){
			callback.call({},selectMulti);
		}
	});
}

// 选择供应商，返回值为id
function multiSupplierIdSelect(selecter,data){
	var selectMulti = $('<select class="form-control select2" ></select>');
	var $select = $(selecter);
	var html = null;
	var id = $select.val() || 0;
	
	html += '<option value="0">选择供应商</option>';
	
	for( supplier in data ){
		var supplierData = data[supplier];
		var sId  = supplierData.id;
		var sNickname  = supplierData.nickname;
		var sCompany  = supplierData.company;
		var sBank = supplierData.bank;
		var sAccount  = supplierData.account;
		
		if(id == sId){
			html += '<option selected value="'+sId+'">'+sCompany+'</option>'
		}else{
			html += '<option value="'+sId+'">'+sCompany+'</option>'
		}

	}
	
	$select.hide().after(selectMulti);
	
	selectMulti
	.html(html)
	.select2({
		allowClear: true
	})
	.change(function(){
		var id = $(this).val();
		$select.val(id);
	});
}

function multiUserSelect(selecter,data){
	var selectMulti = $('<select class="form-control select2" ></select>');
	var $select = $(selecter);
	var html = null;
	var id = $select.val() || 0;
	
	html += '<option value="0">选择销售员</option>';
	
	for( uId in data ){
		var uNickname  = data[uId];
		
		if(id == uId){
			html += '<option selected value="'+uId+'">'+uNickname+'</option>'
		}else{
			html += '<option value="'+uId+'">'+uNickname+'</option>'
		}

	}
	
	$select.hide().after(selectMulti);
	
	selectMulti
	.html(html)
	.select2({
		allowClear: true
	})
	.change(function(){
		var id = $(this).val();
		$select.val(id);
	});
}
function multiUserListSelect(selecter,data){
	var selectMulti = $('<select class="form-control select2" multiple ></select>');
	var $select = $(selecter);
	var html = null;
	var id = $select.val().split(',') || [];
	
	html += '<option value="0">选择销售员</option>';
	
	for( uId in data ){
		var uNickname  = data[uId];
		
		if(inArray(uId,id)){
			html += '<option selected value="'+uId+'">'+uNickname+'</option>'
		}else{
			html += '<option value="'+uId+'">'+uNickname+'</option>'
		}

	}
	
	$select.hide().after(selectMulti);
	
	selectMulti
	.html(html)
	.select2({
		allowClear: true
	})
	.change(function(){
		var id = $(this).val();
		$select.val(id);
	});
}

function multiDepartmentSelect(selecter,data){
	var selectMulti = $('<select class="form-control select2" ></select>');
	var $select = $(selecter);
	var html = null;
	var id = $select.val() || 0;
	
	html += '<option value="0">选择部门</option>';
	
	for( dId in data ){
		var dTitle  = data[dId];
		
		if(id == dId){
			html += '<option selected value="'+dId+'">'+dTitle+'</option>'
		}else{
			html += '<option value="'+dId+'">'+dTitle+'</option>'
		}

	}
	
	$select.hide().after(selectMulti);
	
	selectMulti
	.html(html)
	.select2({
		allowClear: true
	})
	.change(function(){
		var id = $(this).val();
		$select.val(id);
	});
}

function multiProductSearch(selecter,direct ,data){
	var selectMulti = $('<select class="form-control input-xlarge select2" ></select>');
	var $select = $(selecter);
	var $direct = $(direct);
	var html = null;
	var v = $select.val() || '';
	
	html += '<option value="0">'+v+'</option>';
	
	for( p in data ){
		var product = data[p];
		var pId = product.id;
		var pCas = product.cas;
		var pTitle = product.title;
		
		if(v == pCas){
			html += '<option selected value="'+pId+'">'+pTitle+'【'+pCas+'】'+'</option>'
		}else{
			html += '<option value="'+pId+'">'+pTitle+'【'+pCas+'】'+'</option>'
		}

	}
	
	$select.hide().after(selectMulti);
	
	selectMulti
	.html(html)
	.select2({
		allowClear: true,
	})
	.on({
		'change':function(e){
			var id = $(this).val();
			var name = data[id]['cas'];
			$select.val(name);
			$direct.val(id);
			$('#form').submit();
		}
	});
	
	$('.select2-input').on({
		'keydown':function(){
			var _this = $(this),
				value;
				
			setTimeout(function(){
				value = _this.val();
				$select.val(value);
				$('.select2-chosen').html(value);
			},30)
		}
	})
}


function inArray(val,arr){
	var rs = false;
	arr.forEach(function(v){
		if(v == val){
			rs = true;
		}
	})
	console.log(rs)
	return rs;
}