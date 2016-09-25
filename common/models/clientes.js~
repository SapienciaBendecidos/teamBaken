'use strict';

var app = require('../../server/server');

module.exports = function(Clientes, Tarjetas) {
    function createUser(primerNombre, segundoNombre, primerApellido, segundoApellido, cb) {
      Clientes.create([
        {primerNombre: primerNombre, segundoNombre: segundoNombre, primerApellido: primerApellido, segundoApellido: segundoApellido},
      ], cb);
    }
	function createCard(idCliente, _saldo, cb) {
	  app.models.Tarjetas.create([
	    {saldo: _saldo, estado: "active", idCliente: idCliente}
	  ], cb);
	}
    Clientes.createClient = function(primerNombre, segundoNombre, primerApellido, segundoApellido, saldo, cb) {
	createUser(primerNombre, segundoNombre, primerApellido, segundoNombre, function(err, data) {
            if (!err) {
                createCard(data[0].idCliente, saldo, function(error) {
                    if (error) cb(null, error);
                    else cb(null, "Created");
            	})
            }else{
                cb(null, "User not created, Error: " + err);
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
        returns: {arg: 'createClient', type: 'string'},
        http: {path: '/createClient', verb: 'post'}
        }
    );
};

