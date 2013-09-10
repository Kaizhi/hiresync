define(['jquery', 'backbone', 'underscore', 'app', 'firepad'], function ($, Backbone, _, App, Firepad) {
	var AppRouter = Backbone.Router.extend({
		routes: {
		    'test': 'loadApp',
		}
	});

	var initialize = function(){
		console.log('router');
	  	var appRouter = new AppRouter;
	  	appRouter.on('loadApp', function(){
	  		console.log('test');

	  	});

		Backbone.history.start();
	};
	
	return {
		initialize: initialize
	};
});