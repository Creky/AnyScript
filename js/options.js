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