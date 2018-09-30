/*
 Title:获客注册页面
*/

var UserNewRegister = function() {
	this.getVcode = $("#app-message");
	this.URLParams = GHutils.parseUrlParam(window.location.href);
	this.inviteCode = '';
	this.channelid = ''
	this.tips1 = "#app_tips_reg";
	return this;
}

UserNewRegister.prototype = {
	init: function() {
		this.initDom();
		this.bindEvent();
	},
	initDom: function() {
		var _this = this;
		_this.inviteCode = _this.URLParams.inviteCode||"";
		_this.channelid = _this.URLParams.channelid || "H5";
		$("#invite_code").val(_this.inviteCode)
	},
	bindEvent: function() {
		var _this = this;
		
		//短信获取
		_this.getVcode.on("click", function() {
			if($(this).is('.app_btn_loading')){
				return
			}
			if (!GHutils.validate("app-phoneDiv")) {
				return
			}
			$(this).addClass('app_btn_loading')
			$(_this.tips1).html("&nbsp;")
			_this.getVericode();
			
		});
		
//		$('#app_aggrement').on('click',function(){
//			if(this.checked){
//				$(this).parent().addClass('app_icon_checked')
//				return
//			}
//			$(this).parent().removeClass('app_icon_checked')
//		})
		$("#app_person").on("click", function(){
			window.location.href = "registe-protocol.html?typeId="+$(this).attr('data-typeId')+"&title="+encodeURIComponent($(this).attr('data-title'))
		})
		
		$("#app-stepOneNext").on("click", function() {
			if($(this).is('.app_loading')){
				return
			}
			if (!GHutils.validate("app-regForm")) {
				return
			}
			if(!document.getElementById("app_aggrement").checked){
				$(_this.tips1).html('请同意《沪深理财平台服务协议》')
				return
			}
			$(this).addClass('app_loading')
			$(_this.tips1).html("&nbsp;")
			
			if(!_this.register()){
				$("#app-stepOneNext").removeClass('app_loading')
				return
			}
			
//			window.location.href="registerSuccess.html?channelid="+_this.channelid
			window.location.href="/mimosawx/html/account/account.html"			
		});
	},
	btnTime: function() {
		var _this = this;
		var t = 120;
		var btntime = setInterval(function() {
			if (t >= 0) {
				_this.getVcode.html("重新获取" + "(" + t + ")");
				t--;
			} else {
				_this.getVcode.removeClass("app_btn_loading");
				_this.getVcode.removeAttr("disabled");
				_this.getVcode.html("获取验证码");
				_this.getVcode.removeClass("app_c9")
				clearInterval(btntime);
				t = 120;
			}
		}, 1000)
	},
	getVericode: function() {
		var _this = this;
		//获取短信
		GHutils.load({
			url: GHutils.API.USER.sendverify,
			data: {
				phone:$('#app-phoneNo').val(),
				smsType:"regist",
				values:["",2],
			},
			type: "post",
			callback: function(result) {
				if (GHutils.checkErrorCode(result, _this.tips1)) {
					_this.getVcode.attr({
						"disabled": "disabled"
					});
					_this.getVcode.addClass("app_c9")
					_this.btnTime();
				} else {
					_this.getVcode.removeClass("app_btn_loading");
				}
			},
			errcallback: function(){
				_this.getVcode.removeClass("app_btn_loading");
			}
		});
	},
	//注册
	register: function(){
		var _this = this;
		var issuccess = true;
		GHutils.load({
			url: GHutils.API.USER.register,
			data: {
				userAcc: $('#app-phoneNo').val(),
				vericode: $("#app-vericode").val(),
				userPwd: $("#app-userPwd").val(),
				sceneId: $("#invite_code").val(),
				platform: "app",
				channelid: _this.channelid
			},
			type: "post",
			async: false,
			callback: function(result) {
				if (!GHutils.checkErrorCode(result, _this.tips1)) {
					issuccess = false;
				}
			},
			errcallback: function(){
				issuccess = false;
			}
		});
		return issuccess;
	}
}

$(function() {
	new UserNewRegister().init();
})