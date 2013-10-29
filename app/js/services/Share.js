define(function(require, exports, module) {
		var _ = require("underscore");
		var $ = require("jquery");
		var Tracking = require('services/Tracking');

		var Share = {};

		Share.defaults = {
			url: "http://github.com/positlabs/exo-skeleton",
			title: "exo-skeleton",
			message: "Project scaffolding",
			image: "",
			caption: '',
			label:"site",
			slug: ""
		};

		Share.toFacebook = function(props){
			props = _.extend({}, Share.defaults, props);
			props.service = "Facebook";
			console.log("Share.toFacebook", props);

			// https://developers.facebook.com/docs/reference/dialogs/feed/
			FB.ui({
				method: 'feed',
				app_id: "XXXXXXXXXXXXXX",
				link: props.url,
				caption: props.caption,
				name: props.title,
				picture: props.image + "?cachebust="+ new Date().getTime(),
				description: props.message,
				display:'popup'
			}, function(response){
				console.log("response",response);
			});
		};

		Share.toTwitter = function(props){
			props = _.extend({}, Share.defaults, props);

			console.log("Share.toTwitter", props);
			var url = "https://twitter.com/intent/tweet?" + "url=" + encodeURIComponent(props.url) + "&text=" + encodeURIComponent(props.message) ,
				windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
				width = 550,
				height = 420,
				left = ($window.width() >> 1) - (550 >> 1),
				top = ($window.height() >> 1) - (420 >> 1);
			window.open(
				url,
				"ShareToTwitter",
				windowOptions + ',width=' + width + ',height=' + height + ',left=' + left + ',top=' + top
			);
			props.service = "Twitter";
//			Tracking.trackEvent('share_' + props.label, props.service);
		};

		Share.toPinterest = function(props){
			props = _.extend({}, Share.defaults, props);

			console.log("Share.toPinterest", props);
			var url = "http://www.pinterest.com/pin/create/bookmarklet/?media="+ props.image + "?cachebust="+ new Date().getTime() +"&url="+ (props.url) +"&description=" + encodeURIComponent(props.message),
				windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
				width = 550,
				height = 420,
				left = ($window.width() >> 1) - (550 >> 1),
				top = ($window.height() >> 1) - (420 >> 1);
			window.open(
				url,
				"ShareToPinterest",
				windowOptions + ',width=' + width + ',height=' + height + ',left=' + left + ',top=' + top
			);
			props.service = "Pinterest";

//			Tracking.trackEvent('share_' + props.label, props.service);
		};

		Share.toLinkedIn = function(props){
			props = _.extend({}, Share.defaults, props);
			props.url = (props.slug) ? props.url + "?" + props.slug : props.url;

			console.log("Share.toLinkedIn", props);
			props = _.extend({}, Share.defaults, props);
			props.url = (props.slug) ? props.url + "?" + props.slug : props.url;
			var url = "http://www.linkedin.com/shareArticle?mini=true" +
				"&summary=" + encodeURIComponent(props.message) +
				"&url=" + encodeURIComponent(props.url) +
				"&title=" + encodeURIComponent(props.title) +
				"&source=" + encodeURIComponent(props.caption),
				windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
				width = 550,
				height = 420,
				left = ($window.width() >> 1) - (550 >> 1),
				top = ($window.height() >> 1) - (420 >> 1);
			window.open(
				url,
				"ShareToLinkedIn",
				windowOptions + ',width=' + width + ',height=' + height + ',left=' + left + ',top=' + top
			);
			props.service = "LinkedIn";
			Tracking.trackEvent('share_' + props.label, props.service);
		};

		Share.toEmail = function(props){
			props = _.extend({}, Share.defaults, props);

			console.log("Share.toEmail", props);
			var url = "mailto:?" +
				"&body=" + encodeURIComponent(props.message) +
				"%0A%0A" + encodeURIComponent(props.url) +
				"&subject" + encodeURIComponent(props.title) + " - " + encodeURIComponent(props.caption);
			props.service = "Email";
			Tracking.trackEvent('share_' + props.label, props.service);
			window.location.href = url;
		};

		return Share;
	}
);