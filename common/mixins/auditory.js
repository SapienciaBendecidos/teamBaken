var currentUser = require('loopback-current-user');
module.exports = function(Model, options) {
  // Model is the model class
  // options is an object containing the config properties from model definition
  'use strict';
  Model.observe("before save", function(ctx, next){
  	try{
  		let token = ctx.options && ctx.options.accessToken;
  		let userId = token && token.userId;
  		console.log(userId);
  		console.log(ctx);
  	}catch(e){
  		console.log(e);
  	}
  	console.log();
  	next();
  });
  Model.defineProperty('UserCreate', {type: Number, default: 0});
  Model.defineProperty('UserUpdate', {type: Number, default: currentUser.get()});
}