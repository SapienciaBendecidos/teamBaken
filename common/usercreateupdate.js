var currentUser = require('loopback-current-user');
module.exports = function(Model, options) {
  // Model is the model class
  // options is an object containing the config properties from model definition
  Model.defineProperty('UserCreate', {type: Number, default: currentUser.get()});
  Model.defineProperty('UserUpdate', {type: Number, default: currentUser.get()});
}