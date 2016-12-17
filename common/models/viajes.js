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
			    
			    where v.fecha REGEXP ? or v.id_ruta REGEXP ? or v.bus_conductor REGEXP ? or v.tipo_movimiento REGEXP ?;
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
				    
		    where v.fecha REGEXP ? or v.id_ruta REGEXP ? or v.bus_conductor REGEXP ? or v.tipo_movimiento REGEXP ?
		                limit ?,?;
		        `;

        let sql_st = base_sql_st;
        let params = null;
        if(skip != null && limit != null){
            sql_st = pag_sql_st;
            params = [skip, limit];
            if(filter != null){
                sql_st = filter_pag_sql_st;
                params = [filter.or[0].fecha, filter.or[1].id_ruta, filter.or[2].bus_conductor, filter.or[3].tipo_movimiento, skip, limit];
            }
        }else if(filter != null){
            sql_st = filter_sql_st;
            params = [filter.or[0].fecha, filter.or[1].id_ruta, filter.or[2].bus_conductor, filter.or[3].tipo_movimiento];
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

};
