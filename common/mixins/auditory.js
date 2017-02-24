'use strict';
var loopback = require('loopback');

module.exports = function(Model) {
	Model.observe('before save', function(ctx, next){
		//var user = ctx.options.remoteCtx.accessToken.userId;
		//console.log(user);
		//console.log(JSON.stringify(ctx, null, 2));
		//console.log(ctx.hookState);
		console.log(ctx.req);
		for (var i = 0; i < Object.keys(ctx.Model).length - 1; i++) {
			console.log(Object.keys(ctx.Model)[i]);	
		}
		/*try{
			console.log(ctx.options.remoteCtx.req.loopbackContext.active.accessToken.userId);
			if(ctx.isNewInstance){
				console.log(ctx.instance);
			}

		}catch(e){
			console.log(e);
		}*/
		//console.log(ctx.req);
		//console.log(ctx);
		next();
	});

}