chrome.extension.onRequest.addListener(
	function(req, sender, sendResponse) {
		console.log(sender.tab);
		if (req.type == "queryRule") {
			queryRule(req, sendResponse);
		} else {
			sendResponse({
				"status": 0
			});
		}
	}
);

function queryRule(req, sendResponse) {
	var ruleDB = storedb("rulesTable");
	var rules = new Array();
	ruleDB.find({
		"domain": req.hostName
	}, function(err, res) {
		if (!err && res && res.length > 0) {
			for (var i = 0; i < res.length; i++) {
				if (parseInt(res[i].forbid)) {
					continue;
				}
				var reg = new RegExp(res[i].url, "gi");
				if (reg.test(req.url)) {
					rules.push(res[i]);
				}
			}
		}
		sendResponse({
			"status": 1,
			"rules": rules
		});
	});
}

chrome.webRequest.onHeadersReceived.addListener(function(details) {
	//details.responseHeaders.splice(-2,1);
	for (var i = 0; i < details.responseHeaders.length; i++) {
		if (details.responseHeaders[i].name === 'x-frame-options') {
			console.log("当前响应头：",details.responseHeaders[i].name,details.responseHeaders[i].value);
			details.responseHeaders.splice(i, 1);
			break;
		}
	}
	return {
		responseHeaders: details.responseHeaders
	};
}, {
	urls: ["<all_urls>"]
}, ["responseHeaders","blocking"]);