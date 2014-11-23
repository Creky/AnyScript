var chromeSender = chrome.extension.sendMessage;
if (typeof chromeSender != 'function') {
    chromeSender = chrome.extension.sendRequest;
}  

$(function(){
	$(".item").hover(function(){
		$(this).toggleClass("gray");
	});
	$("#pic").click(function(){
		chromeSender({"cmd": "GET_CURRENT_TAB_IMAGE"});
	});
	$("#qq").click(function() {
		chromeSender({"cmd": "GET_CURRENT_QZONE_IMAGE"});
	});
});