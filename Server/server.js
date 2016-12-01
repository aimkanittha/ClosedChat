// var users = require('./users');


var DataStore = require('nedb');
var db = new DataStore({
	filename: 'giggleChat.db', // provide a path to the database file
	autoload: true, // automatically load the database 
	timestampData: true
});


// SERVER UTINILY FROM NODE.JS

var express = require('express'),
	app = express(),
	port = Number(process.env.PORT || 7777);

db.loadDatabase();

var mockData = [{
	_id : 1,
	username : "test01",
	pwd : "test01",
	ip : "172.20.26.1",
	displayName : "I am number one"
},{
	_id : 2,
	username : "test02",
	pwd : "test02",
	ip : "172.20.26.2",
	displayName : "I am number two"
},{
	_id : 3,
	username : "test03",
	pwd : "test03",
	ip : "172.20.26.3",
	displayName : "I am number three"
},{
	_id : 4,
	username : "test04",
	pwd : "test04",
	ip : "172.20.26.4",
	displayName : "I am number four"
}];

// ROUTES

app.get('/',function(req,res){
	res.send('First route is working ...');
});

app.post('/insertMock', function(req, res){
	var msg = "";
	db.insert(mockData, function(err, newGoal){
		if(err) {msg = ""; console.log(err);}
		console.log(newGoal);
	});
	res.send(msg == "" ? "" : "Success to insert mock data")
});

app.get('/login/:id&&:password&&:ipAddr&&:dname', function(req, res){
		var allExceptId = [];
		var user = req.params.id;
		var pwd = req.params.password;
		var ipAddr = req.params.ipAddr;
		var dname = req.params.dname ;  
		console.log(user + " ----- " + pwd + " ------ "+ipAddr);

		db.find( { username: user } , function(err, n) {
	    if (err) { return console.error(err);  }
	      console.log("55555555555555 + "+n.length);
	      console.log("ssssssssssssssssssssssssssssssssssssssss" + JSON.stringify(n))

	      if(n.length == 1){

		      	if(n[0].pwd != pwd) {
		      		console.log(n[0].pwd)
		      		console.log("PWD IS WRONG")
					res.json(4004);
					return;
				}


				db.update({ username : user }, { $set: { ip: ipAddr } }, { multi: true }, function (err, numReplaced) {
							if(err) {console.log(err);}
							console.log("REPLACE IP IS : "+numReplaced);
							});

		    	if(dname != 'NULL')
		    		db.update({ username : user }, { $set: { displayName: dname } }, { multi: true }, function (err, numReplaced) {
							if(err) {console.log(err);}
							console.log("REPLACE IP IS : "+numReplaced);
							});
				
				db.find({ username : {$ne : user}}).sort({updateAt : -1}).exec(function (err, docs) {
					for(var i=0;i< docs.length; i++){
						allExceptId.push({ "user" : docs[i].username , "ip" : docs[i].ip, "displayName" : docs[i].displayName });
					}

					// console.log("!!!!!!!!!!!!!!!!!!! "+allExceptId.length)
					// console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! " +  findAllExceptId(allExceptId))

					console.log("5555555555555555      " + allExceptId.length)
				})

				setTimeout(function() {
					console.log("I FOUND IT");
					console.log("=================================================");
					res.json(allExceptId); 
					return;
				}, 1000);
			}else{
				res.json(4004); 
				console.log("NO USERNAME")
				return;
			}
	    });

		// update IP ADDRESS FROM USER
	   
});


app.get('/register/:id&&:password&&:ipAddr&&:dname', function(req, res){
	var msg;
	var user = req.params.id;
	var thispwd = req.params.password;
	var ipAddr = req.params.ipAddr;
	var dname = req.params.dname;
	console.log(user + " ----- " + thispwd + " ------ "+ipAddr + " ----- "+dname);
			db.count({username : user}, function(err, n) {
		    if (err) { return console.error(err);  }
		    	console.log("regis" + n);
				msg = n;
			    if(n == 0){
					db.insert({ username: user, pwd: thispwd, ip: ipAddr, displayName: dname}, function(err, newGoal){
						if(err) {console.log(err);}
						console.log('!!!!!!!!!!!!!!!!!!!!!! can insert ');
					});
			    }else{
			    	console.log('CANNOT register WITH THIS username')
			    }
		    });


		setTimeout(function() {
			console.log("thisssssssss   "+msg);
			if(parseInt(msg) == 0) {msg = 2000}
			else {msg = 4004}

			console.log("MSG = "+msg);
	
			res.send(msg)}
		,2000);
});


app.get('/getAll', function(req, res){
	// var x = [];
	db.find({ }, function (err, docs) {
		// for(var i=0;i< docs.length; i++){
		// 	x.push({ "ip" : docs[i].ip, "displayName" : docs[i].displayName });
		// 	// console.log(x);
		// }
		setTimeout(function(){
			// res.send(x);	
			console.log('WELCOME MY CLIENT')
			res.send(docs);	
		},2000);
	});

});


app.get('/findFriend/:user', function(req, res){
	res.send(
		function(){
		// return x;
		console.log("GET REQUEST FROM CLIENT!!!");
		return "55555";
	});
});


// START THE SERVER

app.listen(port, function(){
	console.log('Listening on port' + port);
});