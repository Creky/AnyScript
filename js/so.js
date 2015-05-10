window.onload=function(){
	var query=location.search;
	if(!query){
		return;
	}
	headerFrame.location="so_header.html"+query;
}
window.so=function(bdurl,ggurl){
	if(!bdurl||!ggurl){
		return;
	}
	bdframe.location=bdurl;
	ggframe.location=ggurl;
}
