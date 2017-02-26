'use strict';
var app = require('../../server/server');

module.exports = function(Users) {
	Users.observe('after save', function(ctx, next){
		if(ctx.isNewInstance && ctx.instance.type !== undefined){
			console.log("after create");
			app.models.Role.findOne({where:{name: ctx.instance.type}}, function(err, role) {
				if (err) throw err;

				role.principals.create({
					principalType: app.models.RoleMapping.USER,
					principalId: ctx.instance.id
				}, function(err, principal) {
					if(err) throw err;
					else{
						next();
					}
				});
			});
		}else if(ctx.instance.type !== undefined){
			console.log("after update");
			app.models.Role.findOne({ where: {name: ctx.instance.type}}, function(err, role) {
			if (err) throw err;

			console.log(role);

			app.models.RoleMapping.findOne({where: {principalType: "USER", principalId: ctx.instance.id}}, function(err, mapping){
				if (err) throw err;
				if(!mapping){
					role.principals.create({
						principalType: app.models.RoleMapping.USER,
						principalId: ctx.instance.id
					}, function(err, principal) {
						if(err) throw err;
						else next();
					});
				}else{
					console.log(ctx.instance, role, mapping);
					app.dataSources.mysqlDs.connector.execute("update SBO.RoleMapping set roleId = ? where id = ?", [role.id, mapping.id], function(err, doc){
						if (err) throw err;
						else next();
					})
				}
			})
		});
		}else{
			next();
		}
	});

	Users.beforeRemote( "login", function( ctx, _modelInstance_, next) {
		let email = ctx.args.credentials.email;
		Users.findOne({where: {email: email}}, function(err, user){
			if (!err && !user){
				ctx.res.status(404).json("User not found");
			}else if(!err){
				if(user.status != "active")
					ctx.res.status(401).json("User is not active");
				else
					return next();
			}else{
				ctx.res.status(500).json(err);
			}
		})

	});

	Users.activate = function(email, cb){
		Users.findOne({where: {email: email}}, function(err, user){
			if (!err && !user){
				cb(new Error("Cannot find user"), null)
			}else if(!err){
				user.status = "active";
				user.save();
				cb(null, "User is now active")
			}else{
				cb(err, null);
			}
		})
	};

	Users.remoteMethod('activate', {
		accepts:[
		{arg: 'email', type: 'string', required: true}
		],
		returns: {arg: 'State', type: 'String'},
		http: {path: '/activate', verb: 'post'}
	});

	Users.desactivate = function(email, cb){
		Users.findOne({where: {email: email}}, function(err, user){
			if (!err && !user){
				cb(new Error("Cannot find user"), null)
			}else if(!err){
				user.status = "desactive";
				user.save();
				cb(null, "User is now desactive")
			}else{
				cb(err, null);
			}
		})
	};

	Users.remoteMethod('desactivate', {
		accepts:[
		{arg: 'email', type: 'string', required: true}
		],
		returns: {arg: 'State', type: 'String'},
		http: {path: '/desactivate', verb: 'post'}
	});
};
