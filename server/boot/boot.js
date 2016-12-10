
module.exports = function(app) {
  ///*
  if(process.env.seed == 1 )
  {
  /*app.dataSources.mysqlDs.automigrate('Users', function(err){
    if(err) throw err;
  });
  app.dataSources.mysqlDs.automigrate('Role', function(err){
    if(err) throw err;
  });
  app.dataSources.mysqlDs.automigrate('Tarjetas', function(err){
    if(err) throw err;
  });
  app.dataSources.mysqlDs.automigrate('Clientes', function(err){
    if(err) throw err;
  });*/
  app.dataSources.mysqlDs.automigrate('Role', function(err){
    if(err) throw err;
  });

  app.dataSources.mysqlDs.automigrate('ACL', function(err){
    if(err) throw err;
  });

  app.dataSources.mysqlDs.automigrate('RoleMapping', function(err){
    if(err) throw err;
  });

  app.dataSources.mysqlDs.automigrate('AccessToken', function(err){
    if(err) throw err;
  });
}
  //*/
};