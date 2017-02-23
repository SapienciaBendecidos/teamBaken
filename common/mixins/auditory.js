'use strict';
var loopback = require('loopback');
var LoopBackContext = require('loopback-context');

module.exports = function(Model, options) {
		Model.observe('before save', function(ctx, next){
		var ctx = LoopBackContext.getCurrentContext();
		var currentUser = ctx && ctx.get('currentUser');
	  	Model.defineProperty('UserCreate', {type: Number, default: currentUser.id});
	  	Model.defineProperty('UserUpdate', {type: Number, default: currentUser.id});
    	next();
    });

}