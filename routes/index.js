var express = require('express');
var router = express.Router();
var url = require('url');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){
	_routing(passport)	
	// route middleware that will happen on every request
	router.use(_dataListener);
	return router;
}

function _routing(passport){
	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true		
	}));

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });		
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});	
	
	/* Handle Registration POST */
	//router.post('/upload', _dataListener(req,res));
}

 // this middleware will be executed for every request to the app
var _dataListener = function (req, res) {
	var pathname = url.parse(req.url).pathname,
	postData = '';
	
	req.setEncoding('utf8');
	//Check it to upload video in realtime  
	req.addListener('data', function(postDataChunk) {
		postData += postDataChunk;
	});
	
	req.addListener('end', function() {
		var extension = pathname.split('.').pop();	
		var staticFiles = {
			js: 'js',
			gif: 'gif',
			css: 'css',
			webm: 'webm',
			mp4: 'mp4',
			wav: 'wav',
			ogg: 'ogg'
		};
		
		if ('function' === typeof handle[pathname]) {
			handle[pathname](res, postData);
		} else if (staticFiles[extension]) {
			handle._static(res, pathname, postData);
		} else {
			respondWithHTTPCode(res, 404);
		}
	});
};

var handlers = require('../webRecorder.js');
var handle = { };
handle["/"] = handlers.home;
handle["/home"] = handlers.home;
handle["/upload"] = handlers.upload;
handle._static = handlers.serveStatic;


//var cloudConfig = require('./cloudConfig.js');
