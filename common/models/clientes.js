'use strict';
var async = require('async');

module.exports = function(app) {

	var _clientes = app.models.clientes;
  	var _tarjetas = app.models.tarjetas;

    Clientes.createClient = function(primerNombre, segundoNombre, primerApellido, segundoApellido, saldo, cb) {

    	var cliente = createUser(primerNombre, segundoNombre, primerApellido, segundoNombre);
    	if (cliente) {
    		createUser(cliente.idCliente, saldo, function() {
    			return "Bad Request";
    		})
    	}
    }

    Clientes.remoteMethod('createClient', {
	    accepts:[
  	        {arg: 'primerNombre', type: 'string'},
	        {arg: 'segundoNombre', type: 'string'},
	        {arg: 'primerApellido', type: 'string'},
	        {arg: 'segundoApellido', type: 'string'},
	        {arg: 'saldo', type: 'number'},
			],
	    returns: {arg: 'response', type: 'string'},
	    http: {path: '/createClient', verb: 'post'}
        }
    );

	function createUser(primerNombre, segundoNombre, primerApellido, segundoApellido, cb) {
		if (err) return cb(err);
      _clientes.create([
        {primerNombre: primerNombre, segundoNombre: segundoNombre, primerApellido: primerApellido, segundoApellido: segundoApellido},
      ], cb);
	}

	function createCard(saldo, cb) {
		if (err) return cb(err);
	  _tarjetas.create([
	    {saldo: saldo, status: "active"}
	  ], cb);
	}
};
