/*
 Title:注册协议
*/

var RegisterProtocol = function() {

	return this;
}

RegisterProtocol.prototype = {
	init: function() {
		this.initDom();
		this.bindEvent();
	},
	initDom: function() {
		var urlParam = GHutils.parseUrlParam(window.location.href);
		$('#app_title').html(decodeURIComponent(urlParam.title || ""))
		GHutils.load({
	        url: GHutils.API.USER.protocol+'?typeId='+urlParam.typeId,
	        data: {},
	        type: "post",
	        callback: function(result) {
	        	if(result.errorCode != 0){
	        	}
	        	$('#content').html(result.content)
	        }
	    });
	},
	bindEvent:function(){
		$('.mui-action-back').on('click',function(){
			history.back()
		})
	}
}

$(function() {
	new RegisterProtocol().init();
})