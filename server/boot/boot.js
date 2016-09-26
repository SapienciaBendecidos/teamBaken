
module.exports = function(app) {
  ///*
  if(process.env.seed == 0 )
  {
  app.dataSources.mysqlDs.automigrate('Users', function(err){
    if(err) throw err;
  });
  app.dataSources.mysqlDs.automigrate('Roles', function(err){
    if(err) throw err;
  });
  app.dataSources.mysqlDs.automigrate('Tarjetas', function(err){
    if(err) throw err;
  });
  app.dataSources.mysqlDs.automigrate('Clientes', function(err){
    if(err) throw err;
  });
}
  //*/
};