'use strict';
var loopback = require('loopback');

module.exports = function(Model) {
	Model.observe('before save', function(ctx, next){
		//var user = ctx.options.remoteCtx.accessToken.userId;
		//console.log(user);
		console.log(ctx.options.remoteCtx.req.loopbackContext.active.accessToken.userId);
		next();
	});

}