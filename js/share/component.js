var GHutils = {}

// var HOST = GHutils.parseUrlParam(window.location.href).host;
var HOST =　"";

GHutils.API = {
	//用户相关
	USER: {
		sendverify:        HOST + '/mimosa/client/sms/sendvc',			//注册、忘记密码发送验证码
		register:          HOST + '/mimosa/client/investor/baseaccount/regist',			//注册
		checktelnum:       HOST + '/mimosa/client/investor/baseaccount/isregist', //手机号是否注册
		protocol:          HOST + '/cms/app/getProtocolInfo',                //平台协议
		getEventInfo: HOST + '/mimosa/client/tulip/getEventInfo', //首页弹窗页面获取体验金金额及
	}	
}
	//ajax请求
GHutils.load = function(op) {
		if (!op || !op.url) {
			return;
		}

		if (op.params) {
			op.url = op.url + "?" + decodeURIComponent($.param(op.params));
		}

		var set = {
			type: op.type || "get",
			url: op.url,
			async: op.async == false ? false : true,
			data: JSON.stringify(op.data) || "",
			contentType: "application/json",
			dataType: "json",
			success: function() {
				if (op.callback && typeof(op.callback) == 'function') {
					op.callback.apply(null, arguments);
				}
			},
			timeout: 10000,
			error: function(xhr, type, errorThrown) {							
				if (op.errcallback) {
					op.errcallback();
				}
			}
		};
		$.ajax(set);
	}


//获取浏览器URL参数
GHutils.parseUrlParam = function(url) {
		var urlParam = {};
		if (url.indexOf("?") < 0) {
			return urlParam;
		}
		var params = url.substring(url.indexOf("?") + 1).split("&");
		for (var i = 0; i < params.length; i++) {
			var k = params[i].substring(0, params[i].indexOf("="));
			var v = params[i].substring(params[i].indexOf("=") + 1);
			if (v.indexOf("#") > 0) {
				v = v.substring(0, v.indexOf("#"));
			}
			urlParam[k] = v;
		}
		return urlParam;
	}


GHutils.checkErrorCode = function(result, tips) {
	var that = this;
	var tips = tips || false;
	var icon = '<span class=""></span>';
	//that.log(result);
	if (result.errorCode == 0) {
		return true;
	} else {
		if (tips) {
			$(tips).html(icon + result.errorMessage.split("(")[0]);
		} else {
			that.warn(result.errorMessage.split("(")[0]);
		}
		return false;
	}
}


//悬浮提示
GHutils.warn = function(content) {
	$.tips({
		content: content,
		stayTime: 2000,
		type: "warn"
	})
}

GHutils.showError = function(content, tips) {
	if (tips) {
		var icon = '<span class=""></span>';
		$(tips).html(icon + content);
		return
	}
	if (content) {
		GHutils.warn(content);
	}
}

//表单输入验证
GHutils.checkInput = function(obj, regnum) {
		var regTel = /^[0-9]{0,11}$/g; //电话号码(0)
		var regPwd = /^([\x21-\x7e]|[a-zA-Z0-9]){0,16}$/g; //密码(1)
		var regYzm = /^\d{0,6}$/g; //纯数字验证码(2)
		var regNum = /^\d+$/g; //纯数字(3)
		var value = obj.value;
		
		var regs = [regTel, regPwd, regYzm, regNum];
		var _val = value.match(regs[regnum]);
		var Start = obj.selectionStart;

		if (_val || value == '') {
			value == '' ? _val = value : _val = _val[0];
			obj.setAttribute("app_backvalue", _val);
		} else {
			_val = obj.getAttribute("app_backvalue");
		}
		obj.value = _val;
		//设置光标位置
		obj.selectionStart = obj.selectionEnd = Start;
	}




//获取图形码
GHutils.changeVCode1 = function(obj){
	$(obj).attr('src',HOST + '/mimosa/client/captcha/getimgvc?t='+new Date().getTime());
}
//表单提交验证
GHutils.validate = function(scope) {
		//var validTypes=["required","minLength","maxLength","equals","between","mobilePhone","identityCard","debitCard","positiveInteger","positiveNumber"];
		var result = true;
		$(scope ? "#" + scope + " input,select" : "input,select").forEach(function(d, i) {
			var dom = $(d);
			var valid = dom.attr("valid");
			if (valid && result) {
				var ops = JSON.parse(valid);

				var tips = ops.tipsbox || false;
				if (ops.required || dom.val()) {
					if (!dom.val()) {
						GHutils.showError(ops.msg, tips);
						result = false;
						return;
					}
					if (ops.subvalid) {
						for (var i = 0; i < ops.subvalid.length; i++) {
							var e = ops.subvalid[i];
							if (e.minLength) {
								if (dom.val().length < e.minLength) {
									GHutils.showError(e.msg, tips);
									result = false;
									return;
								}
							}
							if (e.maxLength) {
								if (dom.val().length > e.maxLength) {
									GHutils.showError(e.msg, tips);
									result = false;
									return;
								}
							}
							if (e.between) {
								if (dom.val().length < e.between[0] || dom.val().length > e.between[1]) {
									GHutils.showError(e.msg, tips);
									result = false;
									return;
								}
							}
							if (e.finalLength) {
								if (dom.val().length != e.finalLength) {
									GHutils.showError(e.msg, tips);
									result = false;
									return;
								}
							}
							
							if (e.mobilePhone) {
								if (!dom.val().match("^1[3|4|5|7|8][0-9]{9}$")) {
									GHutils.showError(e.msg, tips);
									result = false;
								}
							} else if (e.passWord) {
								if (!dom.val().match("^([\x21-\x7e]|[a-zA-Z0-9]){0,16}$")) {
									GHutils.showError(e.msg, tips);
									result = false;
								}
							} else if (e.positiveInteger) {
								if (!dom.val().match("^[0-9]+\\d*$")) {
									GHutils.showError(e.msg, tips);
									result = false;
								}
							}
						};
					}
				}
			}
		});
		return result;
	}
