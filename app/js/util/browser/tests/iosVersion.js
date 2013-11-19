define(function(){

	require("conditionizr");

	conditionizr.add('iosVersion', [], function () {
		if (/iP(hone|od|ad)/.test(navigator.userAgent)) {
			var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
			return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		}
	});

});