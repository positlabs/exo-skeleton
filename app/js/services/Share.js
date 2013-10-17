define(function(require, exports, module) {
		var _ = require("underscore");
		var $ = require("jquery");
		var Tracking = require('services/Tracking');

		var Share = {};

		Share.defaults = {
			url: "http://www.nissanusa.com/passiongenome/share",
			title: "Nissan Passion Genome",
			message: "Nissan Passion Genome",
			image: "",
			caption: '',
			label:"site",
			slug: ""
		};

		Share.toFacebook = function(props){
			props = _.extend({}, Share.defaults, props);
			props.url = props.url + "/FB";
			props.service = "Facebook";
			console.log("Share.toFacebook", props);

			// NOTE: might still be possible to use a popup, but we're already loading the FB SDK, so I'm using FB.ui
			// https://developers.facebook.com/docs/reference/dialogs/feed/

			FB.ui({
				method: 'feed',
				app_id: "XXXXXXXXXXXXXX",
				link: props.url,
				caption: props.caption,
				name: props.title,
//				picture: "http://static6.businessinsider.com/image/51c3212a6bb3f79c2000000f/this-space-picture-changes-our-understanding-of-how-black-holes-form.jpg",
				picture: props.image + "?cachebust="+ new Date().getTime(),
				description: props.message,
				display:'popup'
			}, function(response){
				console.log("response",response);
			});
		};
//		Share.toFacebook = function(props){
//			props = _.extend({}, Share.defaults, props);
//			// props.url = (props.slug) ? props.url + "?" + props.slug : props.url;
//			props.url = props.url + "/FB";
//			props.service = "Facebook";
//
//			console.log("Share.toFacebook", props);
//			var url = 'http://www.facebook.com/sharer.php?s=100&p[title]='+ encodeURIComponent(props.title) +
//			'&p[summary]=' + encodeURIComponent(props.message) +
//			'&p[url]=' + encodeURIComponent(props.url) +
//			'&p[images][0]=' + encodeURIComponent(props.image),
//				windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
//				width = 550,
//				height = 420,
//				left = ($window.width() >> 1) - (550 >> 1),
//				top = ($window.height() >> 1) - (420 >> 1);
//			window.open(
//				url,
//				"ShareToFacebook",
//				windowOptions + ',width=' + width + ',height=' + height + ',left=' + left + ',top=' + top
//			);
//
//			props.service = "Facebook";
////			Tracking.trackEvent('share_' + props.label, props.service);
//		};

		Share.toTwitter = function(props){
			props = _.extend({}, Share.defaults, props);
			// props.url = (props.slug) ? props.url + "?" + props.slug : props.url;
			props.url = props.url + "/TW";

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
			// props.url = (props.slug) ? props.url + "?" + props.slug : props.url;
			props.url = props.url + "/PIN";

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
			props.url = props.url + "/LI";

			console.log("Share.toLinkedIn", props);
			props = _.extend({}, Share.defaults, props);
			props.url = (props.slug) ? props.url + "?" + props.slug : props.url;
			props.url = props.url + "/s/LI";
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
			// props.url = (props.slug) ? props.url + "?" + props.slug : props.url;
			props.url = props.url + "/EM";

			console.log("Share.toEmail", props);
			var url = "mailto:?" +
				"&body=" + encodeURIComponent(props.message) +
				"%0A%0A" + encodeURIComponent(props.url) +
				"&subject" + encodeURIComponent(props.title) + " - " + encodeURIComponent(props.caption);
			window.location.href = url;
			props.service = "Email";
			Tracking.trackEvent('share_' + props.label, props.service);
		};

		return Share;
	}
);