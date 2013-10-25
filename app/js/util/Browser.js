define(function (require, exports, module) {

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
	browser.has = browser.is = function (stateList) {
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