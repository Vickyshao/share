/*
 Title:邀请页面
*/

var urlParam = GHutils.parseUrlParam(window.location.href);
var InvitePage = function() {

	return this;
}

InvitePage.prototype = {
	init: function() {
		this.initDom();
		this.bindEvent();
		
	},
	initDom: function() {
		$('#share_user').html(urlParam.telnum||"")
		
	},
	bindEvent: function() {
		$('#share').on('click',function(){
			window.location.href = "register.html?inviteCode="+urlParam.inviteCode+'&telnum'+urlParam.telnum+'&channelid='+urlParam.channelid
		})
	}
}

$(function() {
	new InvitePage().init();
})