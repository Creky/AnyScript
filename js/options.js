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
var RULES_TABLE="rulesTable";
var ruleDB=storedb(RULES_TABLE);

var anyScript = angular.module('anyScript', []);

anyScript.controller('ruleListCtrl', ['$scope', '$http',anyScriptControl]);

function anyScriptControl($scope, $http){
	$scope.importLocalRules=function(){
		$http.get(chrome.extension.getURL('js/rules.json')).success(function(rulesData){
			$(rulesData).each(function(){
				var _this=this;
				ruleDB.insert(_this);
			});
		});
	};
	$scope.addNewRule=function(){
		var id=$("#id").val();
		var form=$("#newRuleForm");
		if(id){
			ruleDB.find({"id":id},function(err,res){
				if(!err&&res){
					
					ruleDB.update({"id":id},{"$set":form.form2json()});
					form.reset();
					$.showInfo("更新成功！","",2);
				}
			});
		}else{
			ruleDB.insert(form.form2json(),function(err,res){
				if(!err){
					form.reset();
					$.showInfo("添加成功！","",2);
				}
			});
		}
	};
	$scope.delRule=function(id){
		if(id){
			ruleDB.remove({"_id":id},function(err,res){
				$.showInfo("移除成功！","",1);
			});
		}
	};

	storedb("configTable").find({"name":"init"},function(err,res){
		if(err||!res||!res[0]||res[0].value!=1){
			$scope.importLocalRules();
			storedb("configTable").remove({"name":"init"},function(err,res){
				storedb("configTable").insert({"name":"init","value":1});
			});
		}
	});

	$scope.rules=ruleDB.find();
}

