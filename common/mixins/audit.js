'use strict';
var loopback = require('loopback');
var app = require('../../server/server');

module.exports = function(Model) {
	Model.beforeRemote('create', function(ctx, notUsed, next){
		console.log(ctx.isNewInstance);
		try{
			let token = "";
			if(ctx.req.headers.access_token != undefined){
				token = ctx.req.headers.access_token;
			}else if(ctx.req.query.access_token != undefined){
				token = ctx.req.query.access_token;
			}else{
				console.log("Auditory not setted");
				next();
			}

			app.models.AccessToken.findById(token, function(err, tok){
				if(err){
					console.log("Access token not found");
					next();
				}
				ctx.args.data.creado_por = tok.userId;
				console.log(ctx.args);
				next();
			})

		}catch(e){
			console.log("error while setting auditory data");
		}
	});

	Model.beforeRemote('prototype.updateAttributes', function(ctx, notUsed, next){
		try{
			let token = "";
			if(ctx.req.headers.access_token != undefined){
				token = ctx.req.headers.access_token;
			}else if(ctx.req.query.access_token != undefined){
				token = ctx.req.query.access_token;
			}else{
				console.log("Auditory not setted");
				next();
			}

			app.models.AccessToken.findById(token, function(err, tok){
				if(err){
					console.log("Access token not found");
					next();
				}
				ctx.args.data.actualizado_por = tok.userId;
				console.log(ctx.args);
				next();
			})

		}catch(e){
			console.log("error while setting auditory data");
			next();
		}
	});
}