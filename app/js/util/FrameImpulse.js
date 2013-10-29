define(function (require, exports, module) {

	require("util/extensions/requestAnimationFrame");

	var FrameImpulse = function(callback){

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

		this.resume = fire;

		fire();

	};

	return FrameImpulse;

});
