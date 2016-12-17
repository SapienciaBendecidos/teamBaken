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

    function getClientWithSaldo(idCliente, cb){
        app.models.Clientes.findOne({where: {idCliente: idCliente}}, function(err, client){
            if(err) cb("Client not Found", null);
            else{
                app.models.Tarjetas.find({where: {idCliente: idCliente}}, function(err, cards){
                    if(err) cb(err, null);
                    else{
                        //console.log(cards);
                        let saldo = 0;
                        for (let i = 0; i < cards.length; i++){
                            //console.log(cards[i]);
                            saldo += cards[i].saldo;
                        }
                        client.saldo = saldo;
                        cb(null, client);
                    }
                })
            }
        })
    }

    Clientes.getWithSaldo = function(filter, skip, limit, cb){
        let base_sql_st =  `Select
                            c.*, s.total
                        from clientes c
                        inner join (Select sum(t.saldo) as total, t.id_cliente
                            from tarjetas t
                            group by t.id_cliente) s
                            
                            on s.id_cliente = c.id_cliente;
        `;

        let filter_sql_st = `
            Select
                c.*, s.total
            from clientes c
            inner join (Select sum(t.saldo) as total, t.id_cliente
                from tarjetas t
                group by t.id_cliente) s
                
                on s.id_cliente = c.id_cliente
                
                where c.primer_nombre like ? and c.segundo_nombre like ? and c.primer_apellido like ? and c.segundo_apellido like ?
                and c.telefono like ?
                ;
        `;

        let pag_sql_st = `
            Select
                c.*, s.total
            from clientes c
            inner join (Select sum(t.saldo) as total, t.id_cliente
                from tarjetas t
                group by t.id_cliente) s
                
                on s.id_cliente = c.id_cliente
                limit ?,?
                ;
        `;

        let filter_pag_sql_st = `
            Select
                c.*, s.total
            from clientes c
            inner join (Select sum(t.saldo) as total, t.id_cliente
                from tarjetas t
                group by t.id_cliente) s
                
                on s.id_cliente = c.id_cliente
                
                where c.primer_nombre like ? and c.segundo_nombre like ? and c.primer_apellido like ? and c.segundo_apellido like ?
                and c.telefono like ?
                limit ?,?
                ;
        `;

        let sql_st = base_sql_st;
        let params = null;
        if(skip != null && limit != null){
            sql_st = pag_sql_st;
            params = [skip, limit];
            if(filter != null){
                sql_st = filter_pag_sql_st;
                params = [filter.or[0].primerNombre, filter.or[1].segundoNombre, filter.or[2].primerApellido, filter.or[3].segundoApellido, filter.or[4].telefono, skip, limit];
            }
        }else if(filter != null){
            sql_st = filter_sql_st;
            params = [filter.or[0].primerNombre, filter.or[1].segundoNombre, filter.or[2].primerApellido, filter.or[3].segundoApellido, filter.or[4].telefono];
        }

        console.log(params);

        app.datasources.mysqlDs.connector.execute(sql_st, params, function(err, data){
            if(err) cb(err, null);
            else{
                //console.log(data);
                cb(null,data);
            }
        });
    }

    Clientes.remoteMethod('getWithSaldo', {
        accepts:[
            {arg: 'filter', type: 'Object', required: false},
            {arg: 'skip', type: 'number', required: false},
            {arg: 'limit', type: 'number', required: false}
            ],
        returns: {arg: 'getWithSaldo', type: 'Object'},
        http: {path: '/getWithSaldo', verb: 'get'}
        }
    );
};