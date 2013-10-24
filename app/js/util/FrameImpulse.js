define(function (require, exports, module) {

	require("util/extensions/requestAnimationFrame");

	var FrameImpulse = function(callback){
		console.log("FrameImpulse."+"FrameImpulse()", arguments);

		var id;
		function fire(){
			id = window.requestAnimationFrame(function(e){
				callback(e);
				fire();
			});
		}

		this.cancel = function(){
			window.cancelAnimationFrame(id);
		};

		fire();

	};

	return FrameImpulse;

});
