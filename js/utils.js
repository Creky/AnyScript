$.fn.form2json = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [ o[this.name] ];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

$.showInfo=function(cont,title,autoHideTime){
	var _this=$("#modalInfo");
	if(title){
		$(".modal-header h4",_this).text(title);
		$(".modal-header",_this).show();
	}else{
		$(".modal-header",_this).hide();
	}
	$(".modal-body",_this).html(cont);
	if(autoHideTime&&autoHideTime>0){
		$(_this).on("shown.bs.modal",function(e){
			setTimeout(function(){
				$(_this).modal('hide');
			},autoHideTime*1000);
		});
	}
	$(_this).modal('show');
};

