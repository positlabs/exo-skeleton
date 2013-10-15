define(function(require, exports, module) {

	var Backbone = require("backbone");
	var app = require('app');
	var UI = require('modules/ui/UI');
	var PhotoPicker = require('modules/ui/PhotoPicker');
	var Media = require('modules/media/Media');
	var Video = require('modules/media/Video');
	var User = require('modules/User');
	var GenomePlayer = require('modules/art/GenomePlayer');
	var PortraitDrawer = require('modules/art/PortraitDrawer');
	var NameDrawer = require('modules/art/NameDrawer');
	var PassionDetail = require('modules/detail/PassionDetail');
	var PassionDetailItem = require('modules/detail/PassionDetailItem');
	var LandingPage = require('modules/LandingPage');
	var Deferred = require('utils/Deferred');
	var Tracking = require('commands/Tracking');
	var DevConsole = require('modules/ui/DevConsole');
	require('modernizr');

	// Defining the application router, you can attach sub routers here.
	var Router = Backbone.Router.extend({
		registeredStates: [
			"passion-list-active",
			"menu-open"
		],
		init: function() {
			this.skipNameDrawer = false;
			app.ui.setViews({
				"#ui-holder": new UI.View()
			}).render();
		},
		routes: {
			"": "intro",
			"intro": "intro",
			"landing": "landing",
			"photoPicker": "photoPicker",
			"nameDrawer": "nameDrawer",
			"portrait(/:id)": "portrait",
			"portrait/:id/:passion_id": "portraitDetail",
			"portrait/:id/:passion_id/:itemid": "portraitItem",
			"genome": "genome",
			"genome/:passion_id": "genomeDetail",
			"genome/:passion_id/:itemid": "genomeItem",
			"console": "devConsole",
			"skipNameDrawer":"skipNameDrawerFn",
			'*path':  'intro'
		},
		devConsole: function(){
			var devConsole = new DevConsole.View();
			app.ui.insertViews({
				"": devConsole
			});
			devConsole.render();
		},
		unknown: function(){
			console.log("Didn't find the route ", Backbone.history.fragment , ". Going to the intro.");
			app.router.navigate("intro", {
				trigger: true
			});
		},
		skipNameDrawerFn:function(){
			this.skipNameDrawer = true;
			this.intro();
		},

		/*********************************************************/
		// Site Entry 
		/*********************************************************/

		intro: function() {

			Tracking.trackPageview("intro");

			// Don't make users go through the intro video more than once.
			if (this.introComplete){
				return app.router.landing();
			}
			this.introComplete = true;
			Klang.triggerEvent('transition_t1_start');

			app.mediaController.get('videos').get('intro').on('almost_done', function(){
				Klang.triggerEvent('transition_t1_finish');
				
			});

			var transitionVideo = new Video.View({
				model: app.mediaController.get('videos').get('intro')
			});
			// transitionVideo.setElement(transitionVideo.model.get('$el')[0]);
			// transitionVideo.$el.css(app.dimensions.fill);

			app.ui.setViews({
				"#transition-video-holder": transitionVideo
			});

			transitionVideo.render();


			var deferred = new Deferred([
				{
					target: transitionVideo.model,
					done: "complete"
				}
			]).then(function() {
				$body.removeClass('state-video-transition');
				app.router.landing();
				transitionVideo.transitionOut();
				app.router.sectionTransitionComplete();
			});
			


			//show intro video
			$body.removeClass('state-deeplink');
			$body.addClass('state-video-transition');
			// app.mediaController.playSound('music-bed');
			app.mediaController.playVideo('intro', 0);
			// app.mediaController.set('volume', 0);
			this.triggerSectionChange("intro");
		},
		landing: function(){
			Tracking.trackPageview("landing");
			app.isDeepLink = false;
			$body.removeClass('state-deeplink');

			$body.removeClass("section-genome");
			$body.removeClass("section-portrait");
			$body.removeClass("state-photo-picker");
			$body.removeClass('state-video-transition');
			if (this.genomePlayerObj){
				this.genomePlayerObj.dispose().remove();
				this.genomePlayerObj = null;
			}
			
			var loopVideo = new Video.View({
				model: app.mediaController.get('videos').get('introLoop')
			});
			// loopVideo.setElement(loopVideo.model.get('$el')[0]);
			loopVideo.$el.addClass('cover');

			var landingPage = new LandingPage.View();
			app.ui.setViews({
				"#video-loop-holder": loopVideo,
				"#landing-page-holder": landingPage
			});

			app.mediaController.playVideo('introLoop',0);
			loopVideo.render();
			loopVideo.transitionIn();
			landingPage.render();
			landingPage.transitionIn();
			Klang.triggerEvent('landing_start');


			this.sectionTransitionComplete();
			this.triggerSectionChange("landing-page");
		},

		/*********************************************************/
		// Portrait Flow 
		/*********************************************************/

		photoPicker: function(){

			if (!app.user){
				var sec = (this.introComplete) ? "landing" : "intro";
				this.navigate(sec, {trigger: true});
				return;
			}

			if (this.portraitDrawer){
				this.portraitDrawer.off().dispose().remove();
				this.portraitDrawer = null;
			}
			$body.removeClass("section-genome");
			$body.removeClass("section-portrait");
			$body.removeClass('state-video-transition');
			$body.removeClass('state-portrait-drawer');
			$body.removeClass("section-portrait");
			$body.removeClass('state-landing-page');
			Tracking.trackPageview("profilePhoto");

			var photoPicker = new PhotoPicker.View({
				model: new PhotoPicker.Model()
			});


			var loopVideo = new Video.View({
				model: app.mediaController.get('videos').get('introLoop')
			});
			// loopVideo.setElement(loopVideo.model.get('$el')[0]);
			// loopVideo.$el.addClass('cover');
			// loopVideo.$el.css(app.dimensions.fill);

			app.ui.setViews({
				"#video-loop-holder": loopVideo,
				"#photo-picker-holder": photoPicker
			});

			app.mediaController.playVideo('introLoop');
			photoPicker.render();
			this.sectionTransitionComplete();
			this.triggerSectionChange("photo-picker");
		},
		nameDrawer: function(){
			if (!app.user){
				var sec = (this.introComplete) ? "landing" : "intro";
				this.navigate(sec, {trigger: true});
				return;
			}
			if (this.genomePlayerObj){
				this.genomePlayerObj.dispose().remove();
				this.genomePlayerObj = null;
			}

			Tracking.trackPageview("loading");

			$body.addClass("section-portrait");
			$body.removeClass("section-genome");

			//start portrait
			if (this.portraitDrawer){
				this.portraitDrawer.dispose();
				this.portraitDrawer.off();
				this.portraitDrawer.remove();
				this.portraitDrawer = null;
			}

			var transitionVideoId, soundId,soundEndId;
			if ($body.hasClass('section-genome')){
				transitionVideoId = "toPortrait";
				soundId = 'transition_t4_start';
				soundEndId = 'transition_t4_finish';
			} else {
				transitionVideoId = "toName";
				soundId = 'transition_t2a_start';
				soundEndId = 'transition_t2a_finish';
			}

			var portraitDrawer = this.portraitDrawer = new PortraitDrawer.View({
				model: app.user
			});


			if (($.browser.mobile === true) || ($.browser.msie && parseInt($.browser.version, 10) < 10)){
				this.skipNameDrawer = true;
			}


			if (!this.skipNameDrawer){

				if (!app.isDeepLink){
					this.skipNameDrawer = true;
				}

				var newDrawer = new NameDrawer.View({
					model: app.user
				});

				portraitDrawer.on('change:calculating_passion', function(data){
					// console.logAlert('calculating_passion', data.passion_id);
					newDrawer.onCalculatingPassion(data);

				});

				portraitDrawer.on('calculating_complete', function(){
					// console.logAlert('calculating_complete');
					newDrawer.onCalculatingComplete();
				});

				//portrait drawer starts calculating when user image loads


				//transition video
				var transitionVideo = new Video.View({
					model: app.mediaController.get('videos').get(transitionVideoId)
				});
				transitionVideo.transitionIn();


				app.mediaController.get('videos').get(transitionVideoId).on('almost_done', function(){
					Klang.triggerEvent(soundEndId);
					
				});
				// // transitionVideo.setElement(transitionVideo.model.get('$el')[0]);
				// transitionVideo.$el.addClass('cover');
				// transitionVideo.$el.css(app.dimensions.fill);

				//loop video
				var loopVideo = new Video.View({
					model: app.mediaController.get('videos').get('nameLoop')
				});
				// loopVideo.setElement(loopVideo.model.get('$el')[0]);
				// loopVideo.$el.addClass('cover');
				// loopVideo.$el.css(app.dimensions.fill);


				app.ui.setViews({
					"#transition-video-holder": transitionVideo,
					"#video-loop-holder": loopVideo,
					"#name-drawer-holder": newDrawer,
					"#portrait-drawer-holder": portraitDrawer
				});

				//wait for all events to occur before showing the genome player

				var transitionEvents = [
					{
						target: portraitDrawer,
						done: "afterRender"
					},
					{
						target: newDrawer,
						done: "afterRender"
					},
					{
						target: transitionVideo.model,
						done: "complete"
					}
				];
				var transition = new Deferred(transitionEvents).then(function() {
					$body.removeClass('state-video-transition');
					app.mediaController.playVideo('nameLoop',0);
					newDrawer.transitionIn();
					loopVideo.transitionIn();
					transitionVideo.transitionOut();
					app.router.sectionTransitionComplete();
					// console.log(portraitDrawer);
					//todo This is can cause a bug in portrait drawer if points are not here
					//handled by polling for points in portraitdrawer.startCalculating() if they don't exist
					portraitDrawer.startCalculating();
				});


				//setup and play the transition video
				//TODO: Discern from where the transition is coming
				//should the video be triggered on transitionOut instead?

				$body.addClass('state-video-transition');
				app.mediaController.playVideo(transitionVideoId,0);
				Klang.triggerEvent(soundId);

				newDrawer.render();
				portraitDrawer.render();
				// transitionVideo.render();
				// loopVideo.render();

				this.triggerSectionChange("name-drawer");
			} else {
				app.ui.setViews({
					"#portrait-drawer-holder": portraitDrawer
				});
				var transitionEvents = [
					{
						target: portraitDrawer,
						done: "afterRender"
					}
				];
				var transition = new Deferred(transitionEvents).then(function() {
					$body.removeClass('state-video-transition');
					app.mediaController.playVideo('nameLoop',0);
					app.router.sectionTransitionComplete();

					portraitDrawer.on('change:calculating_passion', function(data){
						// console.logAlert('calculating_passion', data.passion_id);
						// newDrawer.onCalculatingPassion(data);

					});

					portraitDrawer.on('calculating_complete', function(){
						// console.logAlert('calculating_complete');
						// newDrawer.onCalculatingComplete();
						app.router.navigate("portrait/"+ app.user.get('id'), {trigger: true});
					});
					//todo This is can cause a bug in portrait drawer if points are not here
					//handled by polling for points in portraitdrawer.startCalculating() if they don't exist
					portraitDrawer.startCalculating();
				});
				portraitDrawer.render();
				//if it's mobile go straight to portrait
			}
		},
		portrait: function(id) {
			if ((!app.user && !id) || (app.user && !app.user.get('passions'))){
				// console.logFail("Missing app.user");
				var sec = (this.introComplete) ? "landing" : "intro";
				this.navigate(sec, {trigger: true});
				return;
			} else if (!app.user){
				// it's a deep link!!
				this.deepLink(id);
				return;
			} else if (!id){
				if (app.isDeepLink){
					//deeplink with no id means we're going to make a new portrait
					app.user = null;
					this.navigate("intro", {trigger: true});
					return;
				}
				//go back to the name drawer where you should have come from
				this.nameDrawer();
				return;
			}else if (!this.portraitDrawer){
				this.nameDrawer();
			} else if (this.section === "portrait-drawer"){
				// this.portraitDrawer.onResize();
				return;
			} 




			$body.addClass("section-portrait");
			$body.removeClass("section-genome");




			Tracking.trackPageview("portrait");

			var transitionVideoId, soundId,soundEndId;
			if ($body.hasClass('state-name-drawer') || app.isDeepLink){
				transitionVideoId = "fromName";
				soundId = 'transition_t2b_start';
				soundEndId = 'transition_t2b_finish';
			} else {
				transitionVideoId = "toPortrait";
				soundId = 'transition_t4_start';
				soundEndId = 'transition_t4_finish';
			}

			/*var newDrawer = new PortraitDrawer.View({
				model: app.user
			});*/

			var newDrawer = this.portraitDrawer;

			//transition video
			var transitionVideo = new Video.View({
				model: app.mediaController.get('videos').get(transitionVideoId)
			});
			app.mediaController.get('videos').get(transitionVideoId).on('almost_done', function(){
				Klang.triggerEvent(soundEndId);
				
			});
			// transitionVideo.$el.css(app.dimensions.fill);

			//loop video
			var loopVideo = new Video.View({
				model: app.mediaController.get('videos').get('portraitLoop')
			});
			// loopVideo.$el.css(app.dimensions.fill);

			app.ui.setViews({
				"#transition-video-holder": transitionVideo,
				"#video-loop-holder": loopVideo
			});


			if (this.section === 'passion-detail' || (!this.section && !app.isDeepLink)){
				//zooming out so don't play transition video
				Klang.triggerEvent('passion_out');
				transitionEvents = [
					{
						target: newDrawer,
						done: "transitionInComplete"
					}
				];
				transition = new Deferred(transitionEvents).then(function() {
					app.router.sectionTransitionComplete();
					app.mediaController.playVideo('portraitLoop',0);
					loopVideo.transitionIn();
					Klang.triggerEvent('portrait_start');
				});
				// loopVideo.render();
				newDrawer.transitionIn();
				this.triggerSectionChange("portrait-drawer");

			} else {
				//transition in through video
				//wait for all events to occur before showing the genome player
				var transitionEvents = [
					{
						target: transitionVideo.model,
						done: "complete"
					}
				];
				var transition = new Deferred(transitionEvents).then(function() {
					$body.removeClass('state-video-transition');
					newDrawer.once('transitionInComplete', function(){
						newDrawer.mechanism.reDraw();
					});
					newDrawer.transitionIn();
					loopVideo.transitionIn();


					transitionVideo.transitionOut();
					app.mediaController.playVideo('portraitLoop',0);
					app.router.sectionTransitionComplete();
					Klang.triggerEvent('portrait_start');
				});

				$body.addClass('state-video-transition');

				//setup and play the transition video
				//TODO: Discern from where the transition is coming
				//should the video be triggered on transitionOut instead?
				app.mediaController.playVideo(transitionVideoId,0);
				Klang.triggerEvent(soundId);
				transitionVideo.transitionIn();


				this.triggerSectionChange("portrait-drawer");
				// newDrawer.render();
			}
		},

		/*********************************************************/
		// Genome Flow 
		/*********************************************************/

		genome: function() {
			if (this.genomePlayerObj) return; // you're already here
			if (this.portraitDrawer){
				this.portraitDrawer.off().dispose().remove();
				this.portraitDrawer = null;
			}

			app.isDeepLink = false;
			$body.removeClass('state-deeplink');
			$body.removeClass("state-photo-picker");
			$body.removeClass('state-landing-page');
			$body.removeClass("section-portrait");
			$body.addClass("section-genome");
			
			Tracking.trackPageview("genome");

			var newDrawer = this.genomePlayerObj = new GenomePlayer.View({
				model: new GenomePlayer.Model()
			});


			//transition video
			var transitionVideo = new Video.View({
				model: app.mediaController.get('videos').get('toGenome')
			});

			app.mediaController.get('videos').get('toGenome').on('almost_done', function(){
				Klang.triggerEvent("transition_t3_finish");
				
			});
			// transitionVideo.setElement(transitionVideo.model.get('$el')[0]);
			// transitionVideo.$el.addClass('cover');
			// transitionVideo.$el.css(app.dimensions.fill);

			//loop video
			var loopVideo = new Video.View({
				model: app.mediaController.get('videos').get('genomeLoop')
			});
			// loopVideo.$el.css(app.dimensions.fill);

			app.ui.setViews({
				"#transition-video-holder": transitionVideo,
				"#video-loop-holder": loopVideo,
				"#genome-player-holder": newDrawer
			});

			var transitionEvents, transition;

			if (this.section === 'passion-detail' || !this.section){
					Klang.triggerEvent('passion_out');
				//zooming out so don't play transition video
				transitionEvents = [
					{
						target: newDrawer,
						done: "renderComplete"
					}
				];
				transition = new Deferred(transitionEvents).then(function() {
					app.router.sectionTransitionComplete();
					app.mediaController.playVideo('genomeLoop',0);
					newDrawer.transitionIn();
					loopVideo.transitionIn();
					Klang.triggerEvent('genome_zoom_0');
				});
				this.triggerSectionChange("genome-player");
				newDrawer.render();
				loopVideo.render();

			} else {
				//transition in through video
				//wait for all events to occur before showing the genome player
				transitionEvents = [
					{
						target: newDrawer,
						done: "renderComplete"
					},
					{
						target: transitionVideo.model,
						done: "complete"
					}
				];
				transition = new Deferred(transitionEvents).then(function() {
					app.router.sectionTransitionComplete();
					app.mediaController.playVideo('genomeLoop',0);
					$body.removeClass('state-video-transition');
					newDrawer.transitionIn();
					Klang.triggerEvent('genome_zoom_0');
				});

				transitionVideo.render();
				loopVideo.render();

				//begin transition
				$body.addClass('state-video-transition');
				app.mediaController.playVideo('toGenome',0);
				Klang.triggerEvent('transition_t3_start');

				this.triggerSectionChange("genome-player");
				newDrawer.render();
			}
		},

		/*********************************************************/
		// Zoom Level 1
		/*********************************************************/

		portraitDetail: function(username, passion_id){
			// console.log("Router."+"portraitDetail()", arguments);

			if (!app.user && !username){
				this.navigate("intro", {trigger: true});
				return;
			} else if (!app.user){
				// it's a deep link!!
				this.deepLink(username);
				return;
			}
			Klang.triggerEvent('passion_in');
			$body.addClass("section-portrait");
			$body.removeClass("section-genome");

			//if coming from genome play toPortrait video
			this.passionDetail("portrait", username, passion_id);
			Klang.triggerEvent('portrait_zoom_1');
		},
		genomeDetail: function(passion_id){
			$body.removeClass("section-portrait");
			$body.addClass("section-genome");
			// console.log("Router."+"genomeDetail()", arguments);

			//if coming from portrait play toGenome video
			this.passionDetail("genome", null, passion_id);
			Klang.triggerEvent('genome_zoom_1');
		},
		passionDetail: function(section, username, passion_id){
			// console.log("Router."+"passionDetail()", arguments);

			Tracking.trackPageview(section + "/zoom1/" + passion_id);


			try{
				featureLayerSrc = $('#drawer .feature-layer')[0].toDataURL();
			}catch (e){
				featureLayerSrc = "";
			}

			//create passion detail viewer
			var passion = _.find(app.constants.passions, function(passion, i){ return i == passion_id; });
			var passionDetail = this.passionDetailObj = new PassionDetail.View({
				model: new PassionDetail.Model({
					section: section,
					username: username,
					color: passion.color,
					passion_id: passion_id,
					featureLayerSrc: featureLayerSrc,
				})
			});
			app.ui.setViews({
				"#passion-detail-holder": passionDetail
			})
			if (!passionDetail.rendered){
				passionDetail.render();
			}

			var transitionBeginEvents = [
				{
					target: passionDetail,
					done: "collection_reset"
				}
			];
			if (this.genomePlayerObj){
				transitionBeginEvents.push({
					target: this.genomePlayerObj,
					done: "transitionOutComplete"
				})
				this.genomePlayerObj = null;
			}
			if (this.passionItemObj){

			}
			var transitionBegin = new Deferred(transitionBeginEvents).then(function(){
				passionDetail.onResize();
				passionDetail.transitionIn();
				this.genomePlayerObj = null;
			});
			var transitionCompleteEvents = [{
				target: passionDetail,
				done: "transitionInComplete"
			}];
			var transitionComplete = new Deferred(transitionCompleteEvents).then(function(){
				$body.removeClass('state-transition');
				if (this.prevSection !== "passion-detail"){
					app.router.sectionTransitionComplete();
				}
			});
			

			$body.addClass('state-transition');
			this.triggerSectionChange("passion-detail");
		},

		/*********************************************************/
		// Zoom Level 2
		/*********************************************************/

		portraitItem: function(username, passion_id, item_id){
			$body.addClass("section-portrait");
			$body.removeClass("section-genome");
			// console.log("Router."+"portraitItem()", arguments);


			if (!app.user && !username){
				this.navigate("intro", {trigger: true});
				return;
			} else if (!app.user){
				// it's a deep link!!
				this.deepLink(username);
				return;
			}

			//if coming from genome play toPortrait video
			this.passionItem("portrait", username, passion_id, item_id);
			Klang.triggerEvent('portrait_zoom_2');
		},
		genomeItem: function(passion_id, item_id){
			$body.removeClass("section-portrait");
			$body.addClass("section-genome");
			//if coming from portrait play toGenome video
			this.passionItem("genome", null, passion_id, item_id);
			Klang.triggerEvent('genome_zoom_2');
		},
		passionItem: function(section, username, passion_id, item_id){
			console.log("Router."+"passionItem()", arguments);

//			Tracking.trackPageview(section + "/zoom2/" + passion_id + "/" + item_id);

			var passion = _.find(app.constants.passions, function(passion, i){ return i == passion_id; });
			//create passion detail viewer
			var passionItem = this.passionItemObj = new PassionDetailItem.View({
				model: new PassionDetailItem.Model({
					section: section,
					username: username,
					color: passion.color,
					passion_id: passion_id,
					item_id: item_id
				})
			});

			// if (this.section !== "passion-detail-item"){
				app.ui.setViews({
					"#passion-detail-item-holder": passionItem
				});
				if (!passionItem.rendered){
					passionItem.render();
				}
	
				var transitionBeginEvents = [
					{
						target: passionItem,
						done: "collection_reset"
					}
				];
				if (this.passionDetailObj){
					transitionBeginEvents.push({
						target: this.passionDetailObj,
						done: "transitionOutComplete"
					});
					this.passionDetailObj = null;
				}
				var transitionBegin = new Deferred(transitionBeginEvents).then(function(){
					// console.log("\n\n\npassionItem TRANSITION IN BEGIN\n\n")
					passionItem.onResize();
					passionItem.transitionIn();
				});
				var transitionCompleteEvents = [{
					target: passionItem,
					done: "transitionInComplete"
				}];
				var transitionComplete = new Deferred(transitionCompleteEvents).then(function(){
					$body.removeClass('state-transition');
					if (this.prevSection !== "passion-detail-item"){
						app.router.sectionTransitionComplete();
					}
				});
				this.triggerSectionChange("passion-detail-item");
			/*} else {
				var existingView = app.ui.getView("#passion-detail-item-holder")
				var transitionEvents = [
					{
						target: existingView,
						done: "transitionOutnComplete"
					}
				];
				$('body').addClass('state-transition');
				var transition = new Deferred(transitionEvents).then(function(){
					$('body').removeClass('state-transition');
					app.ui.setViews({
						"#passion-detail-item-holder": passionItem
					});
					passionItem.render();
				});
			}*/
		},

		/*********************************************************/
		// Special Routing Cases 
		/*********************************************************/

		deepLink: function(id){
			// get the user from the server
			var user = new User({id:id});
			var _this = this;
			user.fetchRemote().promise().done(function(data){
				if (data.users.length){
					// if the model data is found on the server, make the portrait
					// console.log('==== Got the user data from the server.');
					app.user = user;
					app.isDeepLink = true;
					// app.router.portrait(id);
					app.router.navigate('nameDrawer', {trigger:true});
					//start the drawer
					return;
				} else {
					// console.log('==== User data not found on the server.');
					//user not found, go to the intro
					app.router.navigate("intro", {trigger: true});
				}
			});

			// this.triggerSectionChange('deeplink');
			$body.addClass("state-deeplink");
		},

		/*********************************************************/
		// helpers 
		/*********************************************************/

		triggerSectionChange: function(sectionName){
			if (this.registeredStates.indexOf(sectionName) === -1){
				this.registeredStates.push(sectionName);
			}
			this.clearStates();
			//set new state
			$("body").addClass("state-" + sectionName);
			this.prevSection = this.section;
			this.section = sectionName;
			this.trigger('router:change_section', {
				section: sectionName,
				prevSection: this.prevSection
			});
		},
		clearStates: function(){
			var states = "state-" + this.registeredStates.join(' state-');
			$('body').removeClass(states);
		},
		sectionTransitionComplete: function(){
			if (this.section !== this.prevSection){
				// console.log("-->> Router:: sectionTransitionComplete()", this.prevSection);
				$body.removeClass("state-" + this.prevSection);
			}
		},
		requireData: function(arr){

		}
	});

	return Router;

}); 
