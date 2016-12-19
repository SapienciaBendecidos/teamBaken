'use strict';

var app = require('../../server/server');

module.exports = function(Viajes) {

	Viajes.getReport = function(filter, skip, limit, cb){
        let base_sql_st =  `
        	select r.*, v.*, s.cantidad
			from SBO.Rutas r
			inner join SBO.Viajes v
				on v.id_ruta = r.idRuta
				inner join (select COUNT(*) as cantidad, t.id_viaje
							from SBO.Transacciones t
				group by t.id_viaje) s
				on s.id_viaje = v.id_viaje
			    
        `;

        let filter_sql_st = `
            select r.*, v.*, s.cantidad
			from SBO.Rutas r
			inner join SBO.Viajes v
				on v.id_ruta = r.idRuta
				inner join (select COUNT(*) as cantidad, t.id_viaje
							from SBO.Transacciones t
				group by t.id_viaje) s
				on s.id_viaje = v.id_viaje
			    
			    where (v.fecha between ? and ?) or r.nombre REGEXP ? or v.bus_conductor REGEXP ? 
                or v.tipo_movimiento REGEXP ? or v.bus_placa REGEXP ?;
        `;

        let pag_sql_st = `
            select r.*, v.*, s.cantidad
			from SBO.Rutas r
			inner join SBO.Viajes v
				on v.id_ruta = r.idRuta
				inner join (select COUNT(*) as cantidad, t.id_viaje
							from SBO.Transacciones t
				group by t.id_viaje) s
				on s.id_viaje = v.id_viaje
			    limit ?,?
                ;
        `;

        let filter_pag_sql_st = `
            select r.*, v.*, s.cantidad
				from SBO.Rutas r
				inner join SBO.Viajes v
					on v.id_ruta = r.idRuta
				inner join (select COUNT(*) as cantidad, t.id_viaje
								from SBO.Transacciones t
					group by t.id_viaje) s
					on s.id_viaje = v.id_viaje
				    
		    where (v.fecha between ? and ?) or r.nombre REGEXP ? or v.bus_conductor REGEXP ? 
            or v.tipo_movimiento REGEXP ? or v.bus_placa REGEXP ?
		                limit ?,?;
		        `;

        let sql_st = base_sql_st;
        let params = null;
        if(skip != null && limit != null){
            sql_st = pag_sql_st;
            params = [skip, limit];
            if(filter != null){
                sql_st = filter_pag_sql_st;
                if(filter.and == undefined){
                    params = [filter.or[0].fecha_inicial, filter.or[1].fecha_limite, filter.or[2].nombre, filter.or[3].bus_conductor, filter.or[4].tipo_movimiento, filter.or[5].bus_placa, skip, limit];
                }
                else{
                    sql_st = sql_st.replace(/ or/g, " and")
                    params = [filter.and[0].fecha_inicial, filter.and[1].fecha_limite, filter.and[2].nombre, filter.and[3].bus_conductor, filter.and[4].tipo_movimiento, filter.and[5].bus_placa, skip, limit];
                }
            }
        }else if(filter != null){
            sql_st = filter_sql_st;
            if(filter.and == undefined){
                params = [filter.or[0].fecha_inicial, filter.or[1].fecha_limite, filter.or[2].nombre, filter.or[3].bus_conductor, filter.or[4].tipo_movimiento, filter.or[5].bus_placa];
            }
            else{
                sql_st = sql_st.replace(/ or/g, " and")
                params = [filter.and[0].fecha_inicial, filter.and[1].fecha_limite, filter.and[2].nombre, filter.and[3].bus_conductor, filter.and[4].tipo_movimiento, filter.and[5].bus_placa];
            }
        }

        console.log(params);
        console.log(sql_st);

        app.datasources.mysqlDs.connector.execute(sql_st, params, function(err, data){
            if(err) cb(err, null);
            else{
                //console.log(data);
                cb(null,data);
            }
        });
    }

    Viajes.remoteMethod('getReport', {
        accepts:[
            {arg: 'filter', type: 'Object', required: false},
            {arg: 'skip', type: 'number', required: false},
            {arg: 'limit', type: 'number', required: false}
            ],
        returns: {arg: 'getReport', type: 'Object'},
        http: {path: '/getReport', verb: 'get'}
        }
    );

    Viajes.getReportCount = function(filter, skip, limit, cb){
        let base_sql_st =  `
            select count(*)
            from
            (select r.*, v.*, s.cantidad
            from SBO.Rutas r
            inner join SBO.Viajes v
                on v.id_ruta = r.idRuta
                inner join (select COUNT(*) as cantidad, t.id_viaje
                            from SBO.Transacciones t
                group by t.id_viaje) s
                on s.id_viaje = v.id_viaje) tabla
                
        `;

        let filter_sql_st = `
            select count(*)
            from
            (select r.*, v.*, s.cantidad
            from SBO.Rutas r
            inner join SBO.Viajes v
                on v.id_ruta = r.idRuta
                inner join (select COUNT(*) as cantidad, t.id_viaje
                            from SBO.Transacciones t
                group by t.id_viaje) s
                on s.id_viaje = v.id_viaje
                
                where (v.fecha between ? and ?) or r.nombre REGEXP ? 
                or v.bus_conductor REGEXP ? or v.tipo_movimiento REGEXP ? or v.bus_placa REGEXP ?) tabla;
        `;

        let pag_sql_st = `
            select count(*)
            from
            (select r.*, v.*, s.cantidad
            from SBO.Rutas r
            inner join SBO.Viajes v
                on v.id_ruta = r.idRuta
                inner join (select COUNT(*) as cantidad, t.id_viaje
                            from SBO.Transacciones t
                group by t.id_viaje) s
                on s.id_viaje = v.id_viaje
                limit ?,?) tabla
                ;
        `;

        let filter_pag_sql_st = `
            select count(*)
            from
            (select r.*, v.*, s.cantidad
                from SBO.Rutas r
                inner join SBO.Viajes v
                    on v.id_ruta = r.idRuta
                inner join (select COUNT(*) as cantidad, t.id_viaje
                                from SBO.Transacciones t
                    group by t.id_viaje) s
                    on s.id_viaje = v.id_viaje
                    
            where (v.fecha between ? and ?) or r.nombre REGEXP ? or v.bus_conductor REGEXP ?
            or v.tipo_movimiento REGEXP ? or v.bus_placa REGEXP ? limit ?,?) tabla;
                `;

        let sql_st = base_sql_st;
        let params = null;
        if(skip != null && limit != null){
            sql_st = pag_sql_st;
            params = [skip, limit];
            if(filter != null){
                sql_st = filter_pag_sql_st;
                if(filter.and == undefined){
                    params = [filter.or[0].fecha_inicial, filter.or[1].fecha_limite, filter.or[2].nombre, filter.or[3].bus_conductor, filter.or[4].tipo_movimiento, filter.or[5].bus_placa, skip, limit];
                }
                else{
                    sql_st = sql_st.replace(/ or/g, " and")
                    params = [filter.and[0].fecha_inicial, filter.and[1].fecha_limite, filter.and[2].nombre, filter.and[3].bus_conductor, filter.and[4].tipo_movimiento, filter.and[5].bus_placa, skip, limit];
                }
            }
        }else if(filter != null){
            sql_st = filter_sql_st;
            if(filter.and == undefined){
                params = [filter.or[0].fecha_inicial, filter.or[1].fecha_limite, filter.or[2].nombre, filter.or[3].bus_conductor, filter.or[4].tipo_movimiento, filter.or[5].bus_placa];
            }
            else{
                sql_st = sql_st.replace(/ or/g, " and")
                params = [filter.and[0].fecha_inicial, filter.and[1].fecha_limite, filter.and[2].nombre, filter.and[3].bus_conductor, filter.and[4].tipo_movimiento, filter.and[5].bus_placa];
            }
        }

        console.log(params);
        console.log(sql_st);

        app.datasources.mysqlDs.connector.execute(sql_st, params, function(err, data){
            if(err) cb(err, null);
            else{
                //console.log(data);
                cb(null,data);
            }
        });
    }

    Viajes.remoteMethod('getReportCount', {
        accepts:[
            {arg: 'filter', type: 'Object', required: false},
            {arg: 'skip', type: 'number', required: false},
            {arg: 'limit', type: 'number', required: false}
            ],
        returns: {arg: 'getReportCount', type: 'Object'},
        http: {path: '/getReport/Count', verb: 'get'}
        });

    Viajes.postVariousTransactions = function(idRuta, fecha, busPlaca, busConductor, tipoMovimiento, transacciones, cb){
        app.models.Viajes.create([
            { busConductor : busConductor, busPlaca : busPlaca, fecha : fecha, idRuta : idRuta, tipoMovimiento : tipoMovimiento},
            ], function(err, models) {
 
                if (err) throw err;
        });
        let sql_st =  `SELECT v.id_viaje FROM sbo.viajes v ORDER BY id_viaje DESC LIMIT 0, 1;`;
        let params = null;
        app.datasources.mysqlDs.connector.execute(sql_st, params, function(err, data){
            if(err) cb(err, null);
            else{
                for (let tarjeta of transacciones) {
                    app.models.Transacciones.create([
                    { idTarjeta : tarjeta, idViaje : data[0].id_viaje},
                    ], function(err, models) {
 
                       if (err) throw err;

                       console.log('Models created: \n', models);
                    });
                }
            }
        });
        cb(null, "Success");
    }

    Viajes.remoteMethod('postVariousTransactions', {
        accepts:[
            {arg: 'idRuta', type: 'number', required: true},
            {arg: 'fecha', type: 'Date', required: true},
            {arg: 'busPlaca', type: 'String', required: true},
            {arg: 'busConductor', type: 'String', required: false},
            {arg: 'tipoMovimiento', type: 'String', required: true},
            {arg: 'transacciones', type: '[number]', required: true},
        ],
        http:{path: '/postVariousTransactions', verb: 'post'},
        returns: {arg: 'Success', type: 'String'}
    });

    /*Viajes.postVariousTransactionsTwo = function(data, cb){
        app.models.Viajes.create([
            { busConductor : data.busConductor, busPlaca : data.busPlaca, fecha : data.fecha, idRuta : data.idRuta, tipoMovimiento : data.tipoMovimiento},
            ], function(err, models) {
 
                if (err) throw err;
        });
        let sql_st =  `SELECT v.id_viaje FROM sbo.viajes v ORDER BY id_viaje DESC LIMIT 0, 1;`;
        let params = null;
        app.datasources.mysqlDs.connector.execute(sql_st, params, function(err, data2){
            if(err) cb(err, null);
            else{
                for (let tarjeta of data.transacciones) {
                    app.models.Transacciones.create([
                    { idTarjeta : tarjeta, idViaje : data2[0].id_viaje},
                    ], function(err, models) {
 
                       if (err) throw err;

                       console.log('Models created: \n', models);
                    });
                }
            }
        });
        cb(null, "Success");
    }

    Viajes.remoteMethod('postVariousTransactionsTwo', {
        accepts:[
            {arg: 'data', type: 'Object', required: true, http: { source: 'body' }},
        ],
        http:{path: '/postVariousTransactions', verb: 'post'},
        returns: {arg: 'Success', type: 'String'}
    });*/

};