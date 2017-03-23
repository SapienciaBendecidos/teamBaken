var cardsSeed = require('./tarjetas_seed');
var clientsSeed = require('./client_seed');
var rutasSeed = require('./rutas_seed');
var viajesSeed = require('./viajes_seed');
var equipos_servicios = require('./equipos_servicios_seed');
var transaccionesSeed = require('./transacciones_seed');
var rutasSeedProduccion = require('./rutas_seed_produccion');
var viajesSeedProduccion = require('./viajes_seed_produccion');

module.exports = function(app) {
    console.log('seed: ', process.env.seed)
    if (process.env.seed == 2 )
    {

        app.models.EquiposServicio.create(equipos_servicios
            , function(err, models) {

                app.models.Rutas.create(rutasSeed
                    , function(err, models) {
               
                        if (err) throw err;

                        app.models.Viajes.create(viajesSeed
                            , function(err, models) {

                                app.models.Clientes.create(clientsSeed
                                , function(err, models) {
                     
                                    if (err) throw err;

                                    app.models.Tarjetas.create(cardsSeed
                                        , function(err, models) {
                           
                                        if (err) throw err;

                                        app.models.Transacciones.create(transaccionesSeed
                                        , function(err, models) {
                           
                                            if (err) throw err;
                     
                                            console.log('Models created: \n', models);
                                        });
                     
                                        console.log('Models created: \n', models);
                                });
                     
                                    console.log('Models created: \n', models);
                            });
               
                            if (err) throw err;
         
                            console.log('Models created: \n', models);
                    });
         
                        console.log('Models created: \n', models);
                });
       
                if (err) throw err;
 
                console.log('Models created: \n', models);
        });

        app.models.Users.create([{ username: "nasty", firstName: 'Brandon', firstSurname: 'Napkin', password: "mipassword", email: "nasky@hotmail.com", status: "active"},{ username: "joshua", firstName: 'Josue', firstSurname: 'Enamorado', password: "mipassword", email: "joshua@hotmail.com", status: "active"},{ username: "chus", firstName: 'Chungo', firstSurname: 'Murillo', password: "mipassword", email: "chungo@hotmail.com", status: "active"}], function(err, users) {
            if (err) throw err;
            else if(!err && users){
                console.log(users);
                app.models.Role.create({name: 'admin'}, function(err, role) {
                  if (err) throw err;
                  else{
                    role.principals.create({principalType: app.models.RoleMapping.USER, principalId: users[0].id}, function(err, principal) {
                        if(err) throw err;
                        else console.log("Admin creado: " + users[0].id);
                    });
                }
            });

                app.models.Role.create({name: 'cajero'}, function(err, role) {
                  if (err) throw err;
                  else{
                      role.principals.create({principalType: app.models.RoleMapping.USER,principalId: users[1].id}, function(err, principal) {
                        if (err) throw err;
                    });
                  }
              });

                app.models.Role.create({name: 'movil'}, function(err, role) {
                  if (err) throw err;
                  else{
                      role.principals.create({principalType: app.models.RoleMapping.USER,principalId: users[2].id}, function(err, principal) {
                        if (err) throw err;
                    });
                  }
              });
            }
        }
        );
        }

        if (process.env.seed == 3 )
    {
        app.models.EquiposServicio.create(equipos_servicios
            , function(err, models) {

                app.models.Rutas.create(rutasSeedProduccion
                    , function(err, models) {
               
                        if (err) throw err;

                        app.models.Viajes.create(viajesSeedProduccion
                            , function(err, models) {

                                app.models.Clientes.create(clientsSeed
                                , function(err, models) {
                     
                                    if (err) throw err;

                                    app.models.Tarjetas.create(cardsSeed
                                        , function(err, models) {
                           
                                        if (err) throw err;

                                        app.models.Transacciones.create(transaccionesSeed
                                        , function(err, models) {
                           
                                            if (err) throw err;
                     
                                            console.log('Models created: \n', models);
                                        });
                     
                                        console.log('Models created: \n', models);
                                });
                     
                                    console.log('Models created: \n', models);
                            });
               
                            if (err) throw err;
         
                            console.log('Models created: \n', models);
                    });
         
                        console.log('Models created: \n', models);
                });
       
                if (err) throw err;
 
                console.log('Models created: \n', models);
        });

        app.models.Users.create([{ username: "administrador", firstName: 'Admin', firstSurname: 'Admin', password: "mipassword", email: "admin@hotmail.com", status: "active"}], function(err, users) {
            if (err) throw err;
            else if(!err && users){
                console.log(users);
                app.models.Role.create({name: 'admin'}, function(err, role) {
                  if (err) throw err;
                  else{
                    role.principals.create({principalType: app.models.RoleMapping.USER, principalId: users[0].id}, function(err, principal) {
                        if(err) throw err;
                        else console.log("Admin creado: " + users[0].id);
                    });
                }
            });

                app.models.Role.create({name: 'cajero'}, function(err, role){if (err) throw err;});

                app.models.Role.create({name: 'movil'}, function(err, role){if (err) throw err;});
            }
        }
        );
        }
    };