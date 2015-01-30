'use strict';

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
	$scope.saveRule=function(){
		var id=$("#_id").val();
		var form=$("#newRuleForm");
		if(id){
			ruleDB.find({"_id":id},function(err,res){
				if(!err&&res){
					ruleDB.update({"_id":id},{"$set":form.form2json()});
					$.showInfo("更新成功！","",2);
				}
			});
		}else{
			ruleDB.insert(form.form2json(),function(err,res){
				if(!err){
					$.showInfo("添加成功！","",2);
				}
			});
		}
		$('#addModel').modal('hide');
	};
	$scope.addRule=function(){
		$scope.initRule={};
		$('#addModel').modal('show');
	};
	$scope.editRule=function(id){
		ruleDB.find({"_id":id},function(err,res){
			if(!err&&res&&res.length>0){
				$scope.initRule=res[0];
				$('#addModel').modal('show');
			}else{
				$.showInfo("对不起，未找到数据！");
			}
		});
	};
	$scope.delRule=function(id){
		if(id){
			$.messager.confirm("", "确定要删除这条规则吗？", function() { 
				ruleDB.remove({"_id":id},function(err,res){
					$scope.rules=ruleDB.find();
					$.showInfo("删除成功！","",1);
				});
			});
		}
	};
	$scope.forbidRule=function(id){
		if(id){
			ruleDB.find({"_id":id},function(err,res){
				if(!err&&res.length>0){
					var rule=res[0];
					rule.forbid=rule.forbid==1?0:1;
					ruleDB.update({"_id":id},{"$set":rule});
					$scope.rules=ruleDB.find();
				}
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





