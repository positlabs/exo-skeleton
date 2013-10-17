define(function(require, exports, module) {
	var _ = require("underscore");
	var $ = require("jquery");
	var Backbone = require("backbone");
	var Tracking = require('services/Tracking');

	//TODO - make generic user module
	var User = require('js/models/User');

	var Facebook = _.extend({
		triggered: false,
		connect: function() {
			var _this = this;
			this.triggered = true;
			FB.getLoginStatus(function(response) {
				console.log("Facebook login status: ", response);
				Facebook.status = response.status;
				if(response.status !== "connected"){
					_this.onConnectFail();
				} else if (response.status === "connected"){
					_this.onConnectSuccess();
				}
			});
		},
		onConnectSuccess: function() {
			Facebook.trigger('facebook:connected');
			this.getUser();
		},
		onConnectFail: function() {
//			console.log("Facebook."+"onConnectFail()", arguments);
			var _this = this;
			if (this.triggered){
				FB.login(function(response) {
						if (response.authResponse) {
								FB.api('/me', function(response) {
												user = response;
												// showLoggedIn();
								});
						} else {
//							console.warn("fb login failed!!!")
							_this.trigger("facebook:cancel");
						}
					},
					{
						scope: "email,user_likes,friends_likes, friends_interests, user_interests, user_photos"
					}
				);
			}
		},
		getUser: function(){
			FB.api('/me', this.getUserSuccess);
		},
		getUserSuccess: function(response){
			console.log("Facebook.getUserSuccess: ", response);
			Facebook.trigger('facebook:user', response);
			app.user = new User(response);
		},
		postPhoto: function(options, callback) {
			var _this = this;
			FB.api('/me/photos', 'post', {
				message: options.message,
				url: options.image
			}, function(response) {
				if (!response || response.error) {
					// console.log("response",response);
				} else {
					_this.getPhotoURL(response.id, callback);
				}
			});
		},
		getPhotoURL: function(id, callback){
			FB.api(id, 'get', {},
				function(response) {
					if (!response || response.error) {
						return response;
					} else {
						callback(response);
					}
				}
			);
		}
	}, Backbone.Events);

	///////////////////////////////////////////////////////
	// INIT Facebook SDK
	///////////////////////////////////////////////////////

	(function(d){
		var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
		js = d.createElement('script'); js.id = id; js.async = true;
		js.src = "//connect.facebook.net/en_US/all.js";
		d.getElementsByTagName('head')[0].appendChild(js);
   }(document));

	window.fbAsyncInit = function(){
		// alert("FB Loaded")
		FB.init({
			appId: 'xxxxxxxxxxxxx',
			channelUrl: 'http://www.stage.nissanusa.com/passiongenome/channel.php',
			cookie:true,
			status:true,
			xfbml:true
		});
		FB.Event.subscribe('edge.create',
			function (href, widget) {
//				Tracking.trackEvent("facebook_like");
			}
		);

		FB.Event.subscribe('auth.authResponseChange', function(response) {
			// console.log("response",response);

			// Here we specify what we do with the response anytime this event occurs. 
			if (response.status === 'connected') {
				// The response object is returned with a status field that lets the app know the current
				// login status of the person. In this case, we're handling the situation where they 
				// have logged in to the app.
				Facebook.onConnectSuccess();
				// console.log("connected:", response);

			} else if (response.status === 'not_authorized') {
				// In this case, the person is logged into Facebook, but not into the app, so we call
				// FB.login() to prompt them to do so. 
				// In real-life usage, you wouldn't want to immediately prompt someone to login 
				// like this, for two reasons:
				// (1) JavaScript created popup windows are blocked by most browsers unless they 
				// result from direct interaction from people using the app (such as a mouse click)
				// (2) it is a bad experience to be continually prompted to login upon page load.
				//FB.login();
				Facebook.onConnectFail();
				// console.log("not_authorized:", response);
			} else {
				// In this case, the person is not logged into Facebook, so we call the login() 
				// function to prompt them to do so. Note that at this stage there is no indication
				// of whether they are logged into the app. If they aren't then they'll see the Login
				// dialog right after they log in to Facebook. 
				// The same caveats as above apply to the FB.login() call here.
				// FB.login();
				Facebook.onConnectFail();
				// console.log("not logged in:", response);

			}
			Facebook.triggered = false;
		});
	};

	return Facebook;
});