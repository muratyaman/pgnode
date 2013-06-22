
/**
 * Module dependencies.
 */

var express = require('express')
  , pg      = require('pg').native
  , routes  = require('./routes')
  , user    = require('./routes/user')
  //, test    = require('./routes/test')
  , http    = require('http')
  , path    = require('path')
;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//--
var dbUrl = "tcp://myuser:123456@localhost/mydb";

function disconnectAll() {
    pg.end();
}

function testDate(onDone) {
    pg.connect(dbUrl, function(err, client) {
        client.query("SELECT NOW() as when", function(err, result) {
            console.log("Row count: %d",result.rows.length); // 1
            console.log("Current year: %d", result.rows[0].when.getFullYear());

            onDone();
        });
    });
}

function testTable(onDone) {
    pg.connect(dbUrl, function(err, client) {
        client.query("CREATE TEMP TABLE reviews(id SERIAL, author VARCHAR(50), content TEXT)");
        client.query("INSERT INTO reviews(author, content) VALUES($1, $2)",
            ["mad_reviewer", "I'd buy this any day of the week!!11"]);
        client.query("INSERT INTO reviews(author, content) VALUES($1, $2)",
            ["calm_reviewer", "Yes, that was a pretty good product."]);
        client.query("SELECT * FROM reviews", function(err, result) {
            console.log("Row count: %d",result.rows.length); // 1
            for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows[i];
                console.log("id: " + row.id);
                console.log("author: " + row.author);
                console.log("content: " + row.content);
            }

            onDone();
        });
    });
}

//testDate(function() {
//    testTable(disconnectAll)
//});


function processReqResSql(req, res, sql){
    pg.connect(dbUrl, function(err, client) {
        client.query(sql, function(err, result) {
            var sr = new ServiceResult ('success');
            sr.output = result.rows;
            //for (i = 0; i < result.rows.length; i++) {
            //    sr.output[i] = JSON.parse(result.rows[i].data);
            //}
            res.send(sr);
        });
    });
}

function ServiceResult (status){
    this.ts = new Date();
    this.status = status;
    this.output = new Array();
}
//--

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/test', //test.list
  function(req, res) {
    var sql = 'select * from tbl_test';
    processReqResSql(req, res, sql);
  }
);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


