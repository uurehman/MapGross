// inscluding requires
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongojs = require('mongojs');


// making object of mongojs
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

// Making a server
var app = express();

// MIDDLEWARES

/*
// Logger - Middleware
var logger = function(req, res, next){
	console.log('Logging...');
	next();
}

// use the middleware
app.use(logger);
*/

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// express validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));

// set static path
app.use(express.static(path.join(__dirname, 'public')));
/*
// Playing with JSON
var people = [
	{
		name:'Ubaid',
		age: 30
	},
	{
		name:'Hamza',
		age: 21
	},
	{
		name:'Bill',
		age: 25
	}
]
var users = [
	{
		id: 1,
		first_name: "Ubaid",
		last_name: "ur Rehman",
		email: "uurehman@gmail.com"
	},
	{
		id: 2,
		first_name: "Abdul",
		last_name: "Moeed",
		email: "ababar@gmail.com"
	},
	{
		id: 3,
		first_name: "Musa",
		last_name: "Zahid",
		email: "mzahid@gmail.com"
	}
]*/

// Routes
// Home Route
var errors = [];
app.get('/', function(req, res){
	db.users.find(function (err, docs) {
		// docs is an array of all the documents in mycollection
		// console.log(docs);
		res.render('index', {
			title:'Customers',
			users: docs,
			errors: errors
		});
	})
	// res.json(people);
	// res.send('Hello World!');
});

// add customer route
app.post('/users/add', function(req, res){
	req.checkBody('first_name', 'First name is required.').notEmpty();
	req.checkBody('last_name', 'Last name is required.').notEmpty();
	req.checkBody('email', 'Email is required.').notEmpty();

	var errors = req.validationErrors();
	if(errors){
		res.render('index', {
			title:'Customers',
			users: users,
			errors: errors
		});
	}
	else{
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}
		// console.log(newUser);
		console.log('Adding new user...');
		db.users.insert(newUser, function(err, res){
			if(err){
				console.log(err);
			}
			// res.redirect('/');
		});
		console.log('SUCCESS');
	}
});

// delete customer route
app.delete('/users/delete/:id', function(req, res){
	// console.log(req.params.id);
	db.users.remove({_id:ObjectId(req.params.id)}, function(err, result) {
		if (err) {
			console.log(err);
		}
		// res.redirect('/');
	});
});


// Listen HTTP requests
app.listen(3000, function(){
	console.log('Server listening on port 3000');
});