KindEditor.plugin('productlink', function(K) {
    var editor = this, name = 'productlink';
    // 点击图标时执行
    editor.clickToolbar(name, function() {
        var productName = editor.selectedHtml();

        K.ajax('./index.php?s=/Public/search', function(data) {
            var html = '';

            if(data.status == 2){
                alert(data.info);
            }else if(data.status == 1){
                html += "<a href='./index.php?s=/Index/search/id/"+data.id+"' target='_blank'>"+productName+"</a>";
                editor.insertHtml(html)
            }


        }, 'POST', {'title':productName});
    });
});