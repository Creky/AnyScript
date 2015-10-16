'use strict';

var RULES_TABLE="rulesTable";
var ruleDB=storedb(RULES_TABLE);

var anyScript = angular.module('anyScript', ['ui.bootstrap']);

anyScript.controller('ruleListCtrl', ['$scope', '$http',anyScriptControl]);

function anyScriptControl($scope, $http){
	var vm = $scope.vm = {};
	vm.importLocalRules=function(){
		$http.get(chrome.extension.getURL('js/rules.json')).success(function(rulesData){
			$(rulesData).each(function(){
				var _this=this;
				ruleDB.insert(_this);
			});
		});
	};
	vm.saveRule=function(){
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
	vm.addRule=function(){
		vm.initRule={};
		vm.initRule.forbid=0;
		vm.initRule.type=1;
		vm.initRule.loadjq=1;
		$('#addModel').modal('show');
	};
	vm.editRule=function(id){
		ruleDB.find({"_id":id},function(err,res){
			if(!err&&res&&res.length>0){
				vm.initRule=res[0];
				$('#addModel').modal('show');
			}else{
				$.showInfo("对不起，未找到数据！");
			}
		});
	};
	vm.delRule=function(id){
		if(id){
			$.messager.confirm("", "确定要删除这条规则吗？", function() { 
				ruleDB.remove({"_id":id},function(err,res){
					vm.rules=ruleDB.find();
					$.showInfo("删除成功！","",1);
				});
			});
		}
	};
	vm.forbidRule=function(id){
		if(id){
			ruleDB.find({"_id":id},function(err,res){
				if(!err&&res.length>0){
					var rule=res[0];
					rule.forbid=rule.forbid==1?0:1;
					ruleDB.update({"_id":id},{"$set":rule});
					vm.rules=ruleDB.find();
				}
			});
		}
	};
	vm.search=function(item){
		if(!vm.query){
			return true;
		}
		var fields=[item.name,item.domain,item.url];
		for(var i=0;i<fields.length;i++){
			if(fields[i]&&fields[i].toLowerCase().indexOf(vm.query.toLowerCase())>-1){
				return true;
			}
		}
		return false;
	}

	storedb("configTable").find({"name":"init"},function(err,res){
		if(err||!res||!res[0]||res[0].value!=1){
			vm.importLocalRules();
			storedb("configTable").remove({"name":"init"},function(err,res){
				storedb("configTable").insert({"name":"init","value":1});
			});
		}
	});

	vm.rules=ruleDB.find();

	vm.page = {
		size: 20,
		index: 1
	};
}

anyScript.filter('size', function() {
  return function (items) {
    return !items?0:items.length || 0;
  }
});

anyScript.filter('paging', function() {
  return function (items, index, pageSize) {
    if (!items){
      return [];
    }
    var offset = (index - 1) * pageSize;
    return items.slice(offset, offset + pageSize);
  }
});

anyScript.config(function(paginationConfig, pagerConfig) {
  paginationConfig.firstText = "首页";
  paginationConfig.previousText = '上页';
  paginationConfig.nextText = '下页';
  paginationConfig.lastText = '尾页';

  pagerConfig.previousText = "« 上页";
  pagerConfig.nextText = "下页 »";
});





