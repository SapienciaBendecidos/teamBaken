'use strict';

var app = require('../../server/server');

module.exports = function(Clientes, Tarjetas) {
    function createUser(primerNombre, segundoNombre, primerApellido, segundoApellido, telefono, cb) {
      Clientes.create([
        {primerNombre: primerNombre, segundoNombre: segundoNombre, primerApellido: primerApellido, segundoApellido: segundoApellido, telefono: telefono},
      ], cb);
    }
	function createCard(idCliente, _saldo, cb) {
	  app.models.Tarjetas.create([
	    {saldo: _saldo, estado: "active", idCliente: idCliente}
	  ], cb);
	}
    function getClientsWithSaldo(idCliente, cb){
        app.models.Clientes.findOne({where: {idCliente: idCliente}}, function(err, client){
            if(err) cb("Client not Found", null);
            else{
                app.models.Tarjetas.find({where: {idCliente: idCliente}}, function(err, cards){
                    if(err) cb(err, null);
                    else{
                        console.log(cards);
                        var saldo = 0;
                        for (var i = 0; i < cards.length; i++){
                            console.log(cards[i]);
                            saldo += cards[i].saldo;
                        }
                        client.saldo = saldo;
                        cb(null, client);
                    }
                })
            }
        })
    }

    Clientes.getWithSaldo = function(idCliente, cb){
        getClientsWithSaldo(idCliente, function(err, ret){
            if(err) cb(err, null);
            else cb(null, ret);
        });
    }

    Clientes.createClient = function(primerNombre, segundoNombre, primerApellido, segundoApellido, telefono, saldo, cb) {
	createUser(primerNombre, segundoNombre, primerApellido, segundoApellido, telefono, function(err, data) {
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
            {arg: 'telefono', type: 'string'},
            {arg: 'saldo', type: 'number'},
            ],
        returns: {arg: 'createClient', type: 'string'},
        http: {path: '/createClient', verb: 'post'}
        }
    );

    Clientes.remoteMethod('getWithSaldo', {
        accepts:[
            {arg: 'idCliente', type: 'number', required: true}
            ],
        returns: {arg: 'getWithSaldo', type: 'Object'},
        http: {path: '/:id/WithSaldo', verb: 'get'}
        }
    );
};

