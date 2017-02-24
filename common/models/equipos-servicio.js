'use strict';
module.exports = function(Equiposservicio) {
	Equiposservicio.beforeRemote('create', function(ctx, next){
		console.log(ctx.req.headers);
		console.log("access token: ", ctx.req.query.access_token);
		for (var i = Object.keys(ctx.req).length - 1; i >= 0; i--) {
			console.log(Object.keys(ctx.req)[i]);
		}
	})
};
