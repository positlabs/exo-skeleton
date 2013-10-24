/***
 *
 * Use this if you plan on supporting IE8
 *
 */

// various fixes for IE8

// ie 8 event listeners
(function(){

	if (typeof window.addEventListener != "undefined") {
		return;
	}

	var proto = document.createEventObject().constructor.prototype;

	Object.defineProperty( proto, "bubbles", {
		get: function() {
			// not a complete list of DOM3 events; some of these IE8 doesn't support
			var bubbleEvents = [ "select", "scroll", "click", "dblclick",
					"mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "wheel", "textinput",
					"keydown", "keypress", "keyup"],
				type = this.type;

			for (var i = 0, l = bubbleEvents.length; i < l; i++) {
				if (type === bubbleEvents[i]) {
					return true;
				}
			}

			return false;
		}
	});

	Object.defineProperty( proto, "defaultPrevented", {
		get: function() {
			// if preventDefault() was never called, or returnValue not given a value
			// then returnValue is undefined
			var returnValue = this.returnValue,
				undef;

			return !(returnValue === undef || returnValue);
		}
	});


	Object.defineProperty( proto, "relatedTarget", {
		get: function() {
			var type = this.type;

			if (type === "mouseover" || type === "mouseout") {
				return (type === "mouseover") ? this.fromElement : this.toElement;
			}

			return null;
		}
	});

	Object.defineProperty( proto, "target", {
		get: function(){ return this.srcElement; }
	});

	proto.preventDefault = function() {
		this.returnValue = false;
	};

	proto.stopPropagation = function() {
		this.cancelBubble = true;
	};

	var implementsEventListener = function (obj) {
		return (typeof obj !== "function" && typeof obj["handleEvent"] === "function");
	};

	var customELKey = "__eventShim__";

	var addEventListenerFunc = function(type, handler, useCapture) {
		// useCapture isn't used; it's IE!

		var fn = handler;

		if (implementsEventListener(handler)) {

			if (typeof handler[customELKey] !== "function") {
				handler[customELKey] = function (e) {
					handler["handleEvent"](e);
				};
			}

			fn = handler[customELKey];
		}

		this.attachEvent("on" + type, fn);
	};

	var removeEventListenerFunc = function (type, handler, useCapture) {
		// useCapture isn't used; it's IE!

		var fn = handler;

		if (implementsEventListener(handler)) {
			fn = handler[customELKey];
		}

		this.detachEvent("on" + type, fn);
	};

	HTMLDocument.prototype.addEventListener = addEventListenerFunc;
	HTMLDocument.prototype.removeEventListener = removeEventListenerFunc;

	Element.prototype.addEventListener = addEventListenerFunc;
	Element.prototype.removeEventListener = removeEventListenerFunc;

	window.addEventListener = addEventListenerFunc;
	window.removeEventListener = removeEventListenerFunc;

}());

// fix for IE 8 indexOf bug
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
		for (var i = (start || 0), j = this.length; i < j; i++) {
			if (this[i] === obj) {
				return i;
			}
		}
		return -1;
	}
}

// ie console log bug prevention ( < 9 )
if (!(window.console && console.log)) {
	(function () {
		var noop = function () {
		};
		var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
		var length = methods.length;
		var console = window.console = {};
		while (length--) {
			console[methods[length]] = noop;
		}
	}());
}