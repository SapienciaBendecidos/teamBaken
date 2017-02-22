'use strict';
var loopback = require('loopback');
var LoopBackContext = require('loopback-context');

module.exports = function(Equiposservicio) {
	Equiposservicio.observe('before save', function(ctx, next){
		var ctx = LoopBackContext.getCurrentContext();
		var currentUser = ctx && ctx.get('currentUser');
    	console.log('currentUser.username: ', currentUser.id); // voila!
    	next();
    });
};
