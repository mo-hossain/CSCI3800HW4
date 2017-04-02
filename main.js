// set variables for environment
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
//var Usergrid = require('usergrid');
var app = express();
var jsonParser = bodyParser.json();

/* Trying to initialize the usergrid client

var client = new usergrid.client({
	URI: 'https://apibaas-trial.apigee.net/',
	orgName: 'Mohossain',
	appName: 'sandbox',
	logging : true,
});

*/

// Base GET method route
app.get('/', function (req, res) {
	res.send('Welcome to HW4, to use the DB please add in /movies/{Yourtitle} to your GET,PUT,POST,DELETE requests.');
});

// Base POST method route
app.post('/', function (req, res) {
	res.status(403).send('HTTP Method not supported.');	
});

// Base PUT method route

app.put('/', function (req, res){
	res.status(403).send('HTTP Method not supported.');	
});

// Base DELETE method route
app.delete('/', function (req, res) {
	res.status(403).send('HTTP Method not supported.');	
});


/*
/
/ /movies paths!
/
*/


// Get /movies with no specific queries
app.get('/movies', function (req, res) {

	request({
		
		url: 'https://apibaas-trial.apigee.net/Mohossain/sandbox/movies',
		method: 'GET',
		json: true 
		},
		function(error, response, body){
			if(error) 
			{
				console.log(error);
    		} 
			else{
					if(body.error)
					{
						res.status(400).json(body)
					}
					else{
						for (var x = 0 ; x < body.entities.length ; x++){
						delete body.entities[x].uuid;
						delete body.entities[x].type;
						delete body.entities[x].metadata;
						delete body.entities[x].created;
						delete body.entities[x].modified;
						}
					}	
	
				var newBody = {};
				newBody.status = "200";
				newBody.description = "Successful GET Request";
				newBody.movies = body.entities;
				res.json(newBody);
		}
			
		});
	
});

// Trying to Put method to /movies
app.put('/movies', function (req, res) {
	res.status(403).send('HTTP Method not supported.');	
});

// Add a movie to /movies with no queries
app.post('/movies', jsonParser, function (req, res) {
	if (req.body.name == undefined || req.body.releasedate == undefined || req.body.actor  == undefined)
	{
		res.status(400).send("Not enough information needed to add the movie. Needs movie title, releasedate, and actors all together.");
	} 
	else 
	{
		request({
		
		url: 'https://apibaas-trial.apigee.net/Mohossain/sandbox/movies',
		method: 'POST',
		json: true,
		body: {
				"name" : req.body.name,
				"releasedate" : req.body.releasedate,
				"actor": req.body.actor
			  }
		},
		function(error, response, body){
			if(error) 
			{
				console.log(error);
    		} 
			else{
					if(body.error){
						res.status(400).json("Movie is in the DB")
					}
					else{
						var newBody = {};
			        	newBody.status = "200";
			        	newBody.description = "Successful POST Request";
	    	    		newBody.name = body.entities[0].name;
	        			newBody.releasedate = body.entities[0].releasedate;
	        			newBody.actor = body.entities[0].actor;
	        			res.json(newBody);
					}
				}	

			
		});
		
	}
	
});

// Remove all movie from /movies
app.delete('/movies', function (req, res) {
	res.status(403).send('HTTP Method not supported.');	
});

/*
/
/ /movie paths with a title passed in!
/
*/

// Getting /movies with queries passed in
app.get('/movies/:name', function (req, res) {
	request({
		
		url: 'https://apibaas-trial.apigee.net/Mohossain/sandbox/movies/' + req.params.name,
		method: 'GET',
		json: true 
		},
		function(error, response, body){
			if(error) 
			{
				console.log(error);
    		} 
			else{
					if(body.error)
					{
						res.status(400).json("Movie is not in the DB");
					}
					else{
						var newBody = {};
						newBody.status = "200";
						newBody.description = "GET successful!";
						newBody.name = body.entities[0].name;
						newBody.releasedate = body.entities[0].releasedate;
						newBody.actor = body.entities[0].actor;
						res.json(newBody);
						}
				}	
			
		});
	
});

// creating or updating a movie to /movies with queries passed in
app.put('/movies/:name', jsonParser, function (req, res) {
request({
		
		url: 'https://apibaas-trial.apigee.net/Mohossain/sandbox/movies/' + req.params.name,
		method: 'PUT',
		json: true,
		body: {
				"name" : req.body.name,
				"releasedate" : req.body.releasedate,
				"actor": req.body.actor
			  }
		},
		function(error, response, body){
			if(error) 
			{
				console.log(error);
    		} 
			else{
					if(body.error)
					{
						res.status(400).json("Movie is in the DB")
					}
					else{
							res.json("PUT successful");
						}
				}	
			
		});
});

// creating a movie to /movies with a query passed in
app.post('/movies/:name', function (req, res) {
	res.status(403).send('HTTP Method not supported.');	
});

// deleting a specific movie to /movies with queries passed in
app.delete('/movies/:name', function (req, res) {
	request({
		
		url: 'https://apibaas-trial.apigee.net/Mohossain/sandbox/movies/' + req.params.name,
		method: 'DELETE',
		json: true 
		},
		function(error, response, body){
			if(error) 
			{
				console.log(error);
    		} 
			else{
					if(body.error)
					{
						res.status(400).json("Movie is not in the DB");
					}
					else{
						var newBody = {};
						newBody.status = "200";
						newBody.description = "DELETE successful!";
						newBody.name = body.entities[0].name;
						newBody.releasedate = body.entities[0].releasedate;
						newBody.actor = body.entities[0].actor;
						res.json(newBody);
						}
				}	
			
		});
	
});


//Run js code locally
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});