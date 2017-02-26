'use strict';
var loopback = require('loopback');
var app = require('../../server/server');

module.exports = function(Model) {

	Model.setCreatedBy = function(args, token, cb){
		args.creado_por = 1;
	};

	Model.beforeRemote("replaceOrCreate", function(ctx, notUsed, next){
		console.log("replace or create");
		let properties = Model.definition.properties;
		let idProperty = "";
		for (var i = Object.keys(properties).length - 1; i >= 0; i--) {
			let current = properties[Object.keys(properties)[i].toString()];
			if(current.id == true){
				idProperty = Object.keys(properties)[i].toString();
			}
		}

		console.log(idProperty);
		let stringify = '{"' + idProperty + '":' + ctx.args.data[idProperty] + "}";
		let obj = JSON.parse(stringify);
		Model.findOne({where: obj}, function(err, data){
			if(err) throw err;
			else if(!data){ 
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
					console.log("creado por: ", tok.userId);
					ctx.args.data.creado_por = tok.userId;
					ctx.args.data.actualizado_por = null;
					next();
				})
			}else{
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
					console.log("updateOrCreate: ", tok.userId, data.creado_por);
					ctx.args.data.actualizado_por = tok.userId;
					ctx.args.data.creado_por = data.creado_por;
					next();
				})
			}
		});
	});

	Model.beforeRemote('create', function(ctx, notUsed, next){
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
				console.log("creado por setted: ", tok.userId);
				ctx.args.data.creado_por = tok.userId;
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

			if(token != ""){

				app.models.AccessToken.findById(token, function(err, tok){
					if(err){
						console.log("Access token not found");
						next();
					}else{
						console.log("actualizado por setted: ", tok.userId);
						ctx.args.data.actualizado_por = tok.userId;
						next();
					}
				})
			}

		}catch(e){
			console.log("error while setting auditory data");
			next();
		}
	});

}