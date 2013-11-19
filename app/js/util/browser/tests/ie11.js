define(function () {

	require("conditionizr");

	//TODO: test this

	/*!
	 * Conditionizr test: IE11
	 */
	conditionizr.add('ie11', [''], function () {
		var version = false;
		/*@cc_on
		 if (/^11/.test(@_jscript_version) && /MSIE 11\.0(?!.*IEMobile)/i.test(navigator.userAgent))
		 version = true
		 @*/
		return version;
	});
});
