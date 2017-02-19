'use strict';
var app = require('../../server/server');

module.exports = function(Users) {
	Users.observe('after save', function(ctx, next){
		if(ctx.isNewInstance){
			console.log("after create");
			app.models.Role.findOne({
				name: ctx.instance.type
			}, function(err, role) {
				if (err) throw err;

				role.principals.create({
					principalType: app.models.RoleMapping.USER,
					principalId: ctx.instance.id
				}, function(err, principal) {
					if(err) throw err;
				});
			});
		}/*else if(ctx.instance.type !== undefined){
			console.log("after update");
			app.models.Role.findOne({
				name: ctx.instance.type
			}, function(err, role) {
				if (err) throw err;

				//console.log(role.principals);

				app.models.RoleMapping.findOne({principalType: "USER", principalId: ctx.instance.id}, function(err, mapping){
					if (err) throw err;
					console.log(ctx.instance, role, mapping);
					app.dataSources.mysqlDs.connector.execute("update SBO.RoleMapping set roleId = ? where id = ?", [role.id, mapping.id], function(err, doc){
						if (err) throw err;
					})
				})
			});
		}*/
		return next();
	})
};
