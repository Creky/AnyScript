//http://developer.chrome.com/extensions/getstarted.html

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

(function() {
	var req = {};
	req.type = 'queryRule';
	req.hostName = location.hostname;
	req.url = location.href;
	chrome.extension.sendRequest(req, function(resp) {
		console.log("Receive response:", resp);
		if (resp.status == 1) {
			executeRules(resp.rules);
		}
	});

	function executeRules(rules) {
		if (!rules) {
			return;
		}
		for (var i = 0; i < rules.length; i++) {
			if (!rules[i].type) {
				console.log("run code:", rules[i].code);
				eval(rules[i].code);
			} else {
				//Run with page script context
				var script = document.createElement("script");
				script.setAttribute("type","text/javascript");
				script.innerHTML = rules[i].code;
				document.body.appendChild(script);
			}
		}
	}
})();