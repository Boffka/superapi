'use strict';
require('ts-node/register');
const loopback = require('loopback');
const boot = require('loopback-boot');
const cookieParser = require('cookie-parser');

const app = module.exports = loopback();

app.use(cookieParser());
app.use(loopback.token());

app.use(function updateToken(req, res, next){
  let token = req.accessToken;
  if(!token) return next();
  let now = new Date();
  if(token.created.getTime() + (token.ttl * 1000) < now.getTime()) return next();
  if(now.getTime() - token.created.getTime() < 5000) return next();
  token.updateAttribute('created', now, next);
});

app.start = function(){
  // start the web server
  let server = app.listen(function(){
    app.emit('started', server);
    let baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    /*if(app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }*/
  });
  return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err){
  if(err) throw err;
  // start the server if `$ node server.js`
  if(require.main === module)
    app.start();
});
