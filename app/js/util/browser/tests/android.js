define(function(){

	require("conditionizr");

	conditionizr.add('android', [], function () {
		return navigator.userAgent.toLowerCase().indexOf("android") > -1;
	});

});