var currentUser = require('loopback-current-user');
module.exports = function(Model, options) {
  // Model is the model class
  // options is an object containing the config properties from model definition
  'use strict';
  Model.observe("before save", function(ctx, next){
  	console.log(currentUser.get());
  });
  Model.defineProperty('UserCreate', {type: Number, default: currentUser.get()});
  Model.defineProperty('UserUpdate', {type: Number, default: currentUser.get()});
}