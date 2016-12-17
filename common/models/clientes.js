'use strict';

var app = require('../../server/server');

module.exports = function(Clientes, Tarjetas) {

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
                
                where c.primer_nombre like ?, c.segundo_nombre like ?, c.primer_apellido like ?, c.segundo_apellido like ?
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

        let sql_st = base_sql_st;
        let params = null;
        if(skip != null && limit != null){
            console.log();
            sql_st = pag_sql_st;
            params = [skip, limit];
        }
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

