'use strict';

/*
$(function(){
 $("#cont").blur(saveCont);
 storedb("mainCont").find({"name":"main"},function(err,result){
 	if(!err){
 		console.log(result);
 		$("#cont").val(result[0].val);
 	}
 });
});

function saveCont(){
	var val=$("#cont").val();
	console.log("val=="+val);
	storedb("mainCont").insert({"name":"main","val":val});
}
*/

var anyScript = angular.module('anyScript', []);

anyScript.controller('ruleListCtrl', ['$scope', '$http',
	function ($scope, $http){
		$http.get(chrome.extension.getURL('js/rules.json')).success(function(rulesData){
				$scope.rules=rulesData;
			});
	}
]);

