

const express = require('express');

// Initalizing express app
const app = express();

//Setup views

app.set('views',__dirname + '/views');

app.set('view engine','ejs');


//Setup Mongo

const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/todo';
const ObjectId = require('mongodb').ObjectId;

//Connecting to database
MongoClient.connect(mongoURL, function(err,database){

	if(err){
		console.log(err);
	}
	else{
		todos = database.collection('todos');
		console.log("Database connected successfully");
	}

});


//Setup body-parser middleware

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));





//Main Route

app.get("/", function(req,res){

	//Find all todos in db and pass it to template
	todos.find({}).toArray(function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			res.render('index',{ docs:docs});
		}
	});
});

app.get("/todos/add",function(req,res){

	res.render('add');
});

	


//Get specific todo

app.get("/todos/:id", function(req,res){

	var id = ObjectId(req.params.id);

	//Query to find specific doc by id

	todos.findOne({_id: id}, function(err,doc){
		if(err){
			console.log(err);
		}
		else{
			res.render('show',{doc:doc});
		}

	});

	
});


//Add new todo 

app.post("/todos/add", function(req,res){
	
	//Insert todo into database
	todos.insert(req.body,function(err,result){
		if(err){
			console.log(err);
		}
		else{
			res.redirect('/');
		}
	});
});

//Edit specific todo

app.get("/todos/edit/:id", function(req,res){

	//find specific todo by id and pass it to edit template

	todos.findOne({_id: ObjectId(req.params.id)},function(err,doc){
		if(err){
			console.log(err);
		}
		else{
			res.render('edit',{doc:doc});
		}
	});	

	
});

//Update specific todo

app.post("/todos/update/:id", function(req,res){
	
	//Update specific todo by id

	todos.updateOne({_id: ObjectId(req.params.id)},
		{$set:req.body},function(err,result){
			if(err){
				console.log(err);
			}
			else{
				res.redirect('/');
			}
		});



	
});

//Delete specific todo  

app.get("/todos/delete/:id", function(req,res){

	//Query to delete specific todo by id

	todos.deleteOne({_id: ObjectId(req.params.id)},function(err,result){
		if(err){
			console.log(err);
		}
		else{
			res.redirect('/');
		}
	});


	
});
//Serving app in port 3000
app.listen(3001, function(){
	console.log("App is running in http://localhost:3001");
});




