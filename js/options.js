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

var ruleControllers = angular.module('ruleControllers', []);

ruleControllers.controller('ruleListCtrl', ['$scope', 'Phone',
	function($scope, Phone) {
	$scope.phones = Phone.query();
	$scope.orderProp = 'age';
}]);