'use strict';

var loopback = require('loopback');
var LoopBackContext = require('loopback-context');
var boot = require('loopback-boot');


var app = module.exports = loopback();

app.use(LoopBackContext.perRequest());
app.use(loopback.token());
app.use(function setCurrentUser(req, res, next) {
  if (!req.accessToken) {
    return next();
  }
  app.models.Users.findById(req.accessToken.userId, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('No user with this access token was found.'));
    }
    var loopbackContext = LoopBackContext.getCurrentContext();
    if (loopbackContext) {
      loopbackContext.set('currentUser', user);
    }
    next();
  });
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};
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
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
