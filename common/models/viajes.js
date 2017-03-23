'use strict';
var json2xls = require('json2xls');
var app = require('../../server/server');
var fs = require('fs');
module.exports = function(Viajes) {

	Viajes.getReport = function(filter, skip, limit, cb){
        let base_sql_st =  `
        select * from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        order by v.fecha asc
        ) details
        UNION
        select null, null, null, null, null, null, null, null, sum(tabla.cantidad), sum(tabla.total) from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        order by v.fecha asc ) tabla;
        `;

        let filter_sql_st = `
        select * from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        where (v.fecha between ? and ?) or r.nombre REGEXP ?
        or v.tipo_movimiento REGEXP ? or v.bus_placa REGEXP ? ORDER by v.fecha asc
        ) details
        UNION
        select null, null, null, null, null, null, null, null, sum(tabla.cantidad), sum(tabla.total) from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        where (v.fecha between ? and ?) or r.nombre REGEXP ?
        or v.tipo_movimiento REGEXP ? or v.bus_placa REGEXP ? ORDER by v.fecha asc) tabla;
        `;

        let pag_sql_st = `
        select * from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        order by v.fecha asc
        limit ?,?
        ) details
        UNION
        select null, null, null, null, null, null, null, null, sum(tabla.cantidad), sum(tabla.total) from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        order by v.fecha asc
        limit ?,? ) tabla;
        `;

        let filter_pag_sql_st = `
        select * from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        where (v.fecha between ? and ?) or r.nombre REGEXP ?
        or v.tipo_movimiento REGEXP ? or v.bus_placa REGEXP ? ORDER by v.fecha asc
        limit ?,?
        ) details
        UNION
        select null, null, null, null, null, null, null, null, sum(tabla.cantidad), sum(tabla.total) from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        where (v.fecha between ? and ?) or r.nombre REGEXP ?
        or v.tipo_movimiento REGEXP ? or v.bus_placa REGEXP ? ORDER by v.fecha asc
        limit ?,? ) tabla;
        `;

        let sql_st = base_sql_st;
        let params = null;
        if(skip != null && limit != null){
            sql_st = pag_sql_st;
            params = [skip, limit, skip, limit];
            if(filter != null){
                sql_st = filter_pag_sql_st;
                if(filter.and == undefined){
                    params = [filter.or[0].fecha_inicial, filter.or[1].fecha_limite, filter.or[2].nombre, filter.or[3].tipo_movimiento, filter.or[4].bus_placa, skip, limit,
                    filter.or[0].fecha_inicial, filter.or[1].fecha_limite, filter.or[2].nombre, filter.or[3].tipo_movimiento, filter.or[4].bus_placa, skip, limit];
                }
                else{
                    sql_st = sql_st.replace(/ or/g, " and")
                    params = [filter.and[0].fecha_inicial, filter.and[1].fecha_limite, filter.and[2].nombre,  filter.and[3].tipo_movimiento, filter.and[4].bus_placa, skip, limit,
                    filter.and[0].fecha_inicial, filter.and[1].fecha_limite, filter.and[2].nombre,  filter.and[3].tipo_movimiento, filter.and[4].bus_placa, skip, limit];
                }
            }
        }else if(filter != null){
            sql_st = filter_sql_st;
            if(filter.and == undefined){
                params = [filter.or[0].fecha_inicial, filter.or[1].fecha_limite, filter.or[2].nombre,  filter.or[3].tipo_movimiento, filter.or[4].bus_placa,
                filter.or[0].fecha_inicial, filter.or[1].fecha_limite, filter.or[2].nombre,  filter.or[3].tipo_movimiento, filter.or[4].bus_placa];
            }
            else{
                sql_st = sql_st.replace(/ or/g, " and")
                params = [filter.and[0].fecha_inicial, filter.and[1].fecha_limite, filter.and[2].nombre, filter.and[3].tipo_movimiento, filter.and[4].bus_placa,
                filter.and[0].fecha_inicial, filter.and[1].fecha_limite, filter.and[2].nombre, filter.and[3].tipo_movimiento, filter.and[4].bus_placa];
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
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        order by v.fecha asc) tabla
        `;

        let filter_sql_st = `
        select count(*)
        from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        where (v.fecha between ? and ?) or r.nombre REGEXP ?
        or v.tipo_movimiento REGEXP ? or v.bus_placa REGEXP ? ORDER by v.fecha asc) tabla
        `;

        let pag_sql_st = `
        select count(*)
        from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        order by v.fecha asc
        limit ?,?) tabla
        ;
        `;

        let filter_pag_sql_st = `
        select count(*)
        from
        (select r.idRuta, r.nombre, r.descripcion, r.costo, v.id_viaje, v.bus_placa, v.fecha, v.tipo_movimiento, s.cantidad, s.cantidad * v.precio as total
        from SBO.Rutas r
        inner join SBO.Viajes v
        on v.id_ruta = r.idRuta
        inner join (select COUNT(*) as cantidad, t.id_viaje
        from SBO.Transacciones t
        group by t.id_viaje) s
        on s.id_viaje = v.id_viaje
        where (v.fecha between ? and ?) or r.nombre REGEXP ?
        or v.tipo_movimiento REGEXP ? or v.bus_placa REGEXP ? ORDER by v.fecha asc
        limit ?,?) tabla;
        `;

        let sql_st = base_sql_st;
        let params = null;
        if(skip != null && limit != null){
            sql_st = pag_sql_st;
            params = [skip, limit, skip, limit];
            if(filter != null){
                sql_st = filter_pag_sql_st;
                if(filter.and == undefined){
                    params = [filter.or[0].fecha_inicial, filter.or[1].fecha_limite, filter.or[2].nombre,  filter.or[3].tipo_movimiento, filter.or[4].bus_placa, skip, limit];
                }
                else{
                    sql_st = sql_st.replace(/ or/g, " and")
                    params = [filter.and[0].fecha_inicial, filter.and[1].fecha_limite, filter.and[2].nombre, filter.and[3].tipo_movimiento, filter.and[4].bus_placa, skip, limit];
                }
            }
        }else if(filter != null){
            sql_st = filter_sql_st;
            if(filter.and == undefined){
                params = [filter.or[0].fecha_inicial, filter.or[1].fecha_limite, filter.or[2].nombre, filter.or[3].tipo_movimiento, filter.or[4].bus_placa];
            }
            else{
                sql_st = sql_st.replace(/ or/g, " and")
                params = [filter.and[0].fecha_inicial, filter.and[1].fecha_limite, filter.and[2].nombre, filter.and[3].tipo_movimiento, filter.and[4].bus_placa];
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

    Viajes.postVariousTransactions = function(idRuta, fecha, busPlaca, tipoMovimiento, transacciones, cb){
        console.log("adding transactions");
        app.models.Rutas.findOne({where: {idRuta: idRuta}}, function(err, ruta){
            if(err) throw err;
            else if(!ruta){
                cb("Ruta not found", null);
            }else{
            console.log("costo: ",ruta.costo);
        app.models.Viajes.create(
            { busPlaca : busPlaca, fecha : fecha, idRuta : idRuta, tipoMovimiento : tipoMovimiento, precio: ruta.costo}
            , function(err, models) {

                if (err) throw err;
                else{
                    console.log(models.idViaje);
                    for (let x =0; x < transacciones.length; x++) {
                        let tarjeta = transacciones[x];
                        console.log(tarjeta);
                        app.models.Transacciones.create([
                            { idTarjeta : tarjeta, idViaje : models.idViaje},
                            ], function(err, models) {

                             if (err) throw err;
                             else{
                                if (x == transacciones.length -1)
                                    cb(null, "Success");
                            }

                            console.log('Models created: \n', models);
                        });
                    }
                }
            });
                
            }
        });
    }

    Viajes.remoteMethod('postVariousTransactions', {
        accepts:[
        {arg: 'idRuta', type: 'number', required: true},
        {arg: 'fecha', type: 'Date', required: true},
        {arg: 'busPlaca', type: 'String', required: true},
        {arg: 'tipoMovimiento', type: 'String', required: true},
        {arg: 'transacciones', type: '[number]', required: true},
        ],
        http:{path: '/postVariousTransactions', verb: 'post'},
        returns: {arg: 'Success', type: 'String'}
    });

    Viajes.addViajesAndTransactions = function(idRuta, fecha, busPlaca, tipoMovimiento, transacciones, cb){
        console.log("adding transactions");
        app.models.Viajes.create(
            { busPlaca : busPlaca, fecha : fecha, idRuta : idRuta, tipoMovimiento : tipoMovimiento}
            , function(err, models) {

                if (err) throw err;
                else{
                    console.log(models.idViaje);
                    for (let x =0; x < transacciones.length; x++) {
                        let tarjeta = transacciones[x];
                        console.log(tarjeta);
                        app.models.Transacciones.create([
                            { idTarjeta : tarjeta, idViaje : models.idViaje},
                            ], function(err, models) {

                             if (err) throw err;
                             else{
                                if (x == transacciones.length -1)
                                    cb(null, "Success");
                            }

                            console.log('Models created: \n', models);
                        });
                    }
                }
            });
    }

    Viajes.remoteMethod('addViajesAndTransactions', {
        accepts:[
        {arg: 'idRuta', type: 'number', required: true},
        {arg: 'fecha', type: 'Date', required: true},
        {arg: 'busPlaca', type: 'String', required: true},
        {arg: 'tipoMovimiento', type: 'String', required: true},
        {arg: 'transacciones', type: '[String]', required: true},
        ],
        http:{path: '/addViajesAndTransactions', verb: 'post'},
        returns: {arg: 'Success', type: 'String'}
    });

    Viajes.GenerateExcelReport = function(filter, skip, limit, res, cb){

        Viajes.getReport(filter, skip, limit, function(err, data){
            if(err)
                cb(err, null);
            else{

                var xls = json2xls(data);
                fs.writeFileSync('./data.xlsx', xls, 'binary');
                res.download('./data.xlsx');
            }
        });
    }
    Viajes.remoteMethod('GenerateExcelReport', {
        accepts:[
        {arg: 'filter', type: 'Object', required: false},
        {arg: 'skip', type: 'number', required: false},
        {arg: 'limit', type: 'number', required: false},
        {arg: 'res', type:'object', 'http': {source: 'res'}}
        ],
        returns: {},
        http: {path: '/GenerateExcelReport', verb: 'get'}
    }
    );

};