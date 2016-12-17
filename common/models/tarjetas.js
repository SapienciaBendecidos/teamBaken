'use strict';

var app = require('../../server/server');

module.exports = function(Tarjetas) {

	Tarjetas.observe('after save', function(card, next){
		console.log("Tarjeta creada: ", card.instance.idCliente);
		app.models.Clientes.findOne({where: {idCliente: card.instance.idCliente}}, function(err, cliente){
			//cliente.saldo_total += card.instance.saldo;
			//cliente.save();
		})
		next();
	});

	function updateSaldo(idCliente, saldo, cb){
		app.models.Clientes.findOne({where: {idCliente: idCliente}}, function(err, cliente){
			if (err) cb(err, null);
			cliente.saldo_total += saldo;
			cliente.save();
		})
	}

	Tarjetas.addSaldo = function(idTarjeta, saldo, cb){
		Tarjetas.findOne({where: {idTarjeta: idTarjeta}}, function(err, card){
			if (err) cb(err, null);
			else {
				card.saldo += saldo;
				card.save(function(err){
					if (err) cb(err, null);
					else{
						//updateSaldo(card.idCliente, saldo);
						cb(null, "Saldo agregado");
					}
				});
			}
		})
	}


};
