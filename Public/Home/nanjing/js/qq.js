var qq = ["631897379","340687191"];

var online = new Array();
var script_src = "http:\/\/webpresence.qq.com\/getonline?Type=1&"
for(var i=0; i<qq.length; i++){
	script_src += qq[i];
	script_src += ":";
}
var head = document.getElementsByTagName('head').item(0);
var script = document.createElement('script');
script.src = script_src;
script.type = 'text/javascript';
head.appendChild(script);

function randomSort(a, b) {
	return Math.random() > 0.5 ? -1 : 1;
}

function getKeFuHtml(){
	var kefuHtml = "";

	var online1 = Array();
	var online0 = Array();
	for(var i=0; i<qq.length; i++){
		if(online[i]==1){
			online1.push(qq[i]);
		}else{
			online0.push(qq[i]);
		}
	}
	online1.sort(randomSort);
	for(var i=0; i<online1.length; i++){
		kefuHtml += "<a href='tencent://message/?uin=" + online1[i]+"&Site=www.sdcms.cn&Menu=yes'>在线QQ：" + online1[i] + "</a></br>";
	}
	for(var i=0; i<online0.length; i++){
		kefuHtml += "<a href='tencent://message/?uin=" + online0[i]+"&Site=www.sdcms.cn&Menu=yes'>离线QQ：" + online0[i] + "</a></br>";
	}
	return kefuHtml;
}

var t = window.setInterval(function(){
	if(online.length > 0){
		window.clearInterval(t);
		var kefu = document.getElementById("kefu");
		kefu.innerHTML = getKeFuHtml();
	}
}, 1);