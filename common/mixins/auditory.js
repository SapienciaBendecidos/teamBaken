'use strict';
var loopback = require('loopback');
var LoopBackContext = require('loopback-context');

module.exports = function(Model) {
		Model.observe('before save', function(ctx, next){
		var user = LoopBackContext.getCurrentContext();
		var currentUser = ctx && user.get('currentUser');
    	console.log('currentUser.username: ', currentUser.id); // voila!
    	next();
    });

}