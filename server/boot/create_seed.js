module.exports = function(app) {
    console.log('seed: ', process.env.seed)
    if (process.env.seed == 2 )
    {
        app.models.Roles.create([
            { id: 1, name: 'Admin'},
            ], function(err, models) {
               
                if (err) throw err;
 
                console.log('Models created: \n', models);
            }
        );

        app.models.Users.create([
            { id: 1, firstName: 'Brandon', firstSurname: 'Napkin', idRol: 1, password: "mipassword", email: "nasky@hotmail.com"},
            { id: 2, firstName: 'Josue', firstSurname: 'Enamorado', idRol: 1, password: "mipassword", email: "joshua@hotmail.com"},
            { id: 3, firstName: 'Chungo', firstSurname: 'Murillo', idRol: 1, password: "mipassword", email: "nasky@hotmail.com"},
            ], function(err, models) {
               
                if (err) throw err;
 
                console.log('Models created: \n', models);
            }
        );
 
        app.models.Clientes.create([
            { idCliente: 1, primerNombre:"Pedro", primerApellido: "Pablo"},
            { idCliente: 2, primerNombre:"Estefania", primerApellido: "Martinez"},
            { idCliente: 3, primerNombre:"Gerardo", primerApellido: "Jose"},
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