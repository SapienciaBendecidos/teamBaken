'use strict';

var app = require('../../server/server');

module.exports = function(Tarjetas) {

	Tarjetas.getWithClient =function(cb){
		let sql_st = `
			Select c.primer_nombre, c.primer_apellido, t.id_tarjeta, t.saldo, t.estado from
				clientes c
			inner join tarjetas t
				on t.id_cliente = c.id_cliente;
		`;

		app.datasources.mysqlDs.connector.execute(sql_st, null, function(err, data){
            if(err) cb(err, null);
            else{
                //console.log(data);
                cb(null,data);
            }
        });
	}

	Tarjetas.remoteMethod('getWithClient', {
        returns: {arg: 'getWithClient', type: 'Object'},
        http: {path: '/getWithClient', verb: 'get'}
        }
    );


};
