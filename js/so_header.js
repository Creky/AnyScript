(function(){
	document.getElementById("so").addEventListener("click",function(){
		search(document.getElementById('q').value);
	},false);
	document.getElementById("q").addEventListener("keydown",function(event){
		if(event.keyCode==13){
			search(document.getElementById('q').value);
		}
	},false);
	var query=location.search;
	if(query){
		var so=query.substring(1).split("&");
		var params={};
		for(var i=0;i<so.length;i++){
			var item=so[i].split("=");
			if(item.length==2){
				params[item[0]]=item[1];
			}
		}
		var qu=params.q;
		if(!qu){
			return;
		}
		document.getElementById("q").value=decodeURIComponent(qu).replace(/\+/ig," ");
		search(qu);
	}
})();
function search(qu){
	if(!qu){
		return;
	}
	//qu=encodeURIComponent(qu);
	var bdurl="http://www.baidu.com/s?ie=UTF-8&wd="+qu;
	var ggurl="http://cn.bing.com/search?q="+qu;
	parent.so(bdurl,ggurl);
}