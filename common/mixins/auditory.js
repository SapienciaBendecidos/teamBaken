'use strict';
var loopback = require('loopback');

module.exports = function(Model) {
	Model.observe('before save', function(ctx, next){
		//var user = ctx.options.remoteCtx.accessToken.userId;
		//console.log(user);
		/*try{
			console.log(ctx.options.remoteCtx.req.loopbackContext.active.accessToken.userId);
			if(ctx.isNewInstance){
				console.log(ctx.instance);
			}

		}catch(e){
			console.log(e);
		}*/
		//console.log(ctx.req);
		next();
	});

}