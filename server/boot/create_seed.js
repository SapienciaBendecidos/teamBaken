module.exports = function(app) {
    console.log('seed: ', process.env.seed)
    if (process.env.seed == 2 )
    {
        /*app.models.Roles.create([
            { name: 'Admin'},
            ], function(err, models) {
               
                if (err) throw err;
 
                console.log('Models created: \n', models);
            }
        );*/

        app.models.Users.create([
            { username: "nasty", firstName: 'Brandon', firstSurname: 'Napkin', password: "mipassword", email: "nasky@hotmail.com"},
            { username: "joshua", firstName: 'Josue', firstSurname: 'Enamorado', password: "mipassword", email: "joshua@hotmail.com"},
            { username: "chus", firstName: 'Chungo', firstSurname: 'Murillo', password: "mipassword", email: "chungo@hotmail.com"},
            ], function(err, users) {
               
                if (err) throw err;
                
                app.models.Role.create({
                  name: 'admin'
                }, function(err, role) {
                  if (err) throw err;
             
                  role.principals.create({
                    principalType: app.models.RoleMapping.USER,
                    principalId: users[0].id
                  }, function(err, principal) {
                    if(err) throw err;
                    else console.log("Admin creado: " + users[0].id);
                  });
                });

                app.models.Role.create({
                  name: 'cajero'
                }, function(err, role) {
                  if (err) throw err;
             
                  role.principals.create({
                    principalType: app.models.RoleMapping.USER,
                    principalId: users[1].id
                  }, function(err, principal) {
                    if (err) throw err;
                  });
                });
            }
        );
 
        app.models.Clientes.create([
            { primerNombre:"Pedro", primerApellido: "Pablo"},
            { primerNombre:"Estefania", primerApellido: "Martinez"},
            { primerNombre:"Gerardo", primerApellido: "Jose"},
            ], function(err, models) {
 
                if (err) throw err;
 
                console.log('Models created: \n', models);
        });

 
        app.models.Tarjetas.create([
            {estado:"Activo", idCliente: 1, idTarjeta:1, saldo:50},
            {estado:"Activo", idCliente: 2, idTarjeta:2, saldo:150},
            {estado:"Activo", idCliente: 3, idTarjeta:3, saldo:250},
            ], function(err, models) {
       
                if (err) throw err;
 
                console.log('Models created: \n', models);
        });
    }
};