define(function (require, exports, module) {

	require("modernizr");
	require(["conditionizr"], function(){
		require("conditionizr.chrome");
		require("conditionizr.firefox");
		require("conditionizr.safari");
		require("conditionizr.ios");
		require("conditionizr.retina");
		require("conditionizr.mac");
		require("conditionizr.windows");
		require("conditionizr.linux");
		require("util/browser/tests/android");
		require("util/browser/tests/iosVersion");

		var config = {tests:{}},
			classes = [
				'firefox',
				'chrome',
				'safari',
				'android',
				'ios',
				'retina',
				'mac',
				'windows',
				'linux'
			];

		for (var i = 0, maxi = classes.length; i < maxi; i++) {
			config.tests[classes[i]] = ['class'];
		}

		conditionizr.config(config);
	});


	var browser = {};

	// get vendor prefixes
	browser.vendor = (function () {
		var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice
				.call(styles)
				.join('')
				.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
				)[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		return {
			dom: dom,
			lowercase: pre,
			css: '-' + pre + '-',
			js: pre[0].toUpperCase() + pre.substr(1)
		};
	})();

	/**
	 *
	 *  check states on the html element (from modernizr, conditionizr, and whatever else adds classes to the html el)
	 *  @arg stateList: space-delimited list of states to check. i.e. 'ipad retina'
	 *
	 * */
	browser.test = function (stateList) {
		var $html = $("html");
		var states = stateList.split(" ");
		for (var i = 0, maxi = states.length; i < maxi; i++) {
			if ($html.hasClass(states[i]) == false) {
				return false;
			}
		}
		return true;
	};

	return browser;
});