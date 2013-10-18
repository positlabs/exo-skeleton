define(function(){

	var BB = require("backbone");
	var app = require('app');

	var ExoView = BB.View.extend({
		parent:"#main"
	});

	return ExoView;

});
