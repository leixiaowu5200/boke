var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var proxy = require("http-proxy-middleware");
var session = require("express-session");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use("/herolist.json", proxy({
	target: "http://host810267499.s360.pppf.com.cn",
	changeOrigin: true
}))
//target委托代理到的服务器  后边的地址 现在等于localhost:3000  所以我们访问这个数据可以直接这么访问
//localhost:3000/herolist.json这么直接访问。
//changeOrigin:true  允许我们当前的网络资源的跨域访问
app.use(session({
	secret: 'recommend 128 bytes random string',
	cookie: {
		maxAge:20*60*1000
	},
	resave: true,
	saveUninitialized: true
}))



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
