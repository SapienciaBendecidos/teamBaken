
module.exports = function(app) {

  function inject(ctx, next) {
    var options = hasOptions(ctx.method.accepts) && (ctx.args.options || {});
    if(options) {
      options.remoteCtx = ctx;
      ctx.args.options = options;
    }
    next();
  }

  app.remotes().before('*.*', inject);

  app.remotes().before('*.prototype.*', function(ctx, instance, next) {
    inject(ctx, next);
  });

  // unfortunately this requires us to add the options object
  // to the remote method definition
  app.remotes().methods().forEach(function(method) {
    if(!hasOptions(method.accepts)) {
      method.accepts.push({
        arg: 'options',
        type: 'object',
        injectCtx: true
      });
    }
  });

  function hasOptions(accepts) {
    for (var i = 0; i < accepts.length; i++) {
      var argDesc = accepts[i];
      if (argDesc.arg === 'options' && argDesc.injectCtx) {
        return true;
      }
    }
  }
  ///*
  if(process.env.seed == 1 )
  {
  /*app.dataSources.mysqlDs.automigrate('Users', function(err){
    if(err) throw err;
  });=
  app.dataSources.mysqlDs.automigrate('Rutas', function(err){
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
  });/*
  app.dataSources.mysqlDs.automigrate('ACL', function(err){
    if(err) throw err;
  });*/

  app.dataSources.mysqlDs.automigrate('RoleMapping', function(err){
    if(err) throw err;
  });

  app.dataSources.mysqlDs.automigrate('AccessToken', function(err){
    if(err) throw err;
  });
}
  //*/
};