chrome.extension.onRequest.addListener(
	function(req, sender, sendResponse) {
		console.log(sender.tab);
		if (req.type == "queryRule") {
			queryRule(req,sendResponse);
		} else {
			sendResponse({
				"status": 0
			});
		}
	}
);

function queryRule(req,sendResponse){
	var ruleDB=storedb("rulesTable");
	var rules=new Array();
	ruleDB.find({"domain":req.hostName},function(err,res){
		if(!err&&res&&res.length>0){
			for(var i=0;i<res.length;i++){
				if(res[i].forbid){
					continue;
				}
				var reg=new RegExp(res[i].url,"gi");
				if(reg.test(req.url)){
					rules.push(res[i]);
				}
			}
		}
		sendResponse({"status":1,"rules":rules});
	});
}