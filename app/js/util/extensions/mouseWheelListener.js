// Code from https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/wheel
// Creates a global "addwheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function (window, document) {

	var prefix = "", _addEventListener, _removeEventListener, support;

	if (window.addEventListener) {
		_addEventListener = "addEventListener";
		_removeEventListener = "removeEventListener";
	} else {
		_addEventListener = "attachEvent";
		_removeEventListener = "detachEvent";
		prefix = "on";
	}


	if (document.onmousewheel !== undefined) {
		support = "mousewheel"
	}

	try {
		WheelEvent("wheel");
		support = "wheel";
	} catch (e) {
	}

	if (!support) {
		support = "DOMMouseScroll";
	}

	window.addWheelListener = function (elem, callback, useCapture) {
		var func = support == "wheel" ? callback : callbackProxy(callback);
		elem[ _addEventListener ](prefix + support, func, useCapture || false);
		if (support == "DOMMouseScroll") elem[ _addEventListener ]("MozMousePixelScroll", func, useCapture || false);
		return func;
	};

	window.removeWheelListener = function (elem, callback) {
		elem[ _removeEventListener ](prefix + support, callback);
		if (support == "DOMMouseScroll") elem[ _removeEventListener ]("MozMousePixelScroll", callback);
	};

	var callbackProxy = function (callback) {
		return function (originalEvent) {
			!originalEvent && ( originalEvent = window.event );

			var event = {
				originalEvent: originalEvent,
				target: originalEvent.target || originalEvent.srcElement,
				type: "wheel",
				deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
				deltaX: 0,
				deltaY: 0,
				preventDefault: function () {
					originalEvent.preventDefault ?
						originalEvent.preventDefault() :
						originalEvent.returnValue = false;
				}
			};

			if (support == "mousewheel") {
				event.deltaY = -originalEvent.wheelDelta / 10;
				originalEvent.wheelDeltaX && ( event.deltaX = -originalEvent.wheelDeltaX / 10 );
			} else {
				event.deltaY = originalEvent.detail;
			}

			event.deltaX = event.deltaX | 0;
			event.deltaY = event.deltaY | 0;

			return callback(event);
		}
	}


})
	(window, document);
