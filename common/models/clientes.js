'use strict';
var async = require('async');

module.exports = function(Clientes, Tarjetas) {

    Clientes.createClient = function(primerNombre, segundoNombre, primerApellido, segundoApellido, saldo, cb) {

    	var cliente = createUser(primerNombre, segundoNombre, primerApellido, segundoNombre, function(err) {
    		if (!err) {
    			createUser(cliente.idCliente, saldo, function() {
    			return "Bad Request";
    		})
    		}
    	});
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
      Clientes.create([
        {primerNombre: primerNombre, segundoNombre: segundoNombre, primerApellido: primerApellido, segundoApellido: segundoApellido},
      ], cb);
	}

	function createCard(saldo, cb) {
	  Tarjetas.create([
	    {saldo: saldo, status: "active"}
	  ], cb);
	}
};
