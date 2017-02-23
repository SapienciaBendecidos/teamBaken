'use strict';
var loopback = require('loopback');
var LoopBackContext = require('loopback-context');

module.exports = function(Model) {
		Model.observe('before save', function(ctx, next){
		var user = ctx.options.remoteCtx.accessToken.userId;
		next();
    });

}