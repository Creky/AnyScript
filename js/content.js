//http://developer.chrome.com/extensions/getstarted.html

String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
};

jQuery.noConflict();

(function(){
	var $$=jQuery;
	var rules=anyScriptRules;
	console.log(rules);
	if(rules){
		for(var i=0;i<rules.length;i++){
			var reg=new RegExp(rules[i].url,"gi");
			if(reg.test(location.href)){
				console.log("run code:"+rules[i].code);
				var code=rules[i].code.replace(/\$\(/ig,"$$$$(").replace(/\$\./ig,"$$$$.");
				eval(code);
			}
		}
	}
})();
