
// SET UP NeDB database

var DataStore = require('nedb');
var db = new DataStore({
	filename: 'giggleChat.db', // provide a path to the database file
	autoload: true, // automatically load the database 
	timestampData: true
});

var code;

db.loadDatabase();

var mockData = [{
	username : "test01",
	pwd : "test01",
	ip : "172.20.26.1",
	displayName : "I am number one"
},{
	username : "test02",
	pwd : "test02",
	ip : "172.20.26.2",
	displayName : "I am number two"
},{
	username : "test03",
	pwd : "test03",
	ip : "172.20.26.3",
	displayName : "I am number three"
},{
	username : "test04",
	pwd : "test04",
	ip : "172.20.26.4",
	displayName : "I am number four"
}];

// INSERT MOCK DATA
exports.mocking = function(){
	db.insert(mockData, function(err, newGoal){
		if(err) {console.log(err);}
		console.log(newGoal);
	});
};

var x = [];
db.find({ }, function (err, docs) {
	for(var i=0;i< docs.length; i++){
		x.push({ "ip" : docs[i].ip, "displayName" : docs[i].displayName });
		// console.log(x);
	}
});

// SEND ALL USER
exports.findAll = function(){
	// return x;
	console.log("GET REQUEST FROM CLIENT!!!")
	return "55555";
}

var msg;

function regis(user, thispwd, ipAddr, dname){
	db.count({username : user}, function(err, n) {
    if (err) { return console.error(err);  }
    	console.log("regis" + n);
		msg = n;
	    if(n == 0){
			db.insert({ username: user, pwd: thispwd, ip: ipAddr, displayName: dname}, function(err, newGoal){
				if(err) {console.log(err);}
				console.log('!!!!!!!!!!!!!!!!!!!!!!can insert ' + n);
			});
	    }else{
	    	console.log('CANNOT register WITH THIS username')
	    }
    });
}

exports.register = function(user, thispwd, ipAddr, dname){
	regis(user, thispwd, ipAddr, dname);
	setTimeout(function(){
		console.log("thisssssssss"+msg);
		if(parseInt(msg) == 0) {return "200"}
		else {return "404"}
	}, 1000);
}


var allExceptId = [];
exports.checkUser = function(user, pwd, ipAddr,callback){
	db.find( { $or: [{ username: user }, { password: pwd }] }, function(err, n) {
    if (err) { return console.error(err);  }
      console.log("55555555555555 + "+n.length);
      console.log("ssssssssssssssssssssssssssssssssssssssss" + JSON.stringify(n))

       if(n.length == 1){
		db.update({ username : user }, { $set: { ip: ipAddr } }, { multi: true }, function (err, numReplaced) {
			if(err) {console.log(err);}
			console.log("REPLACE IP IS : "+numReplaced);
			});
    	}
    })

	// console.log("555555555555555555555555")
	// update IP ADDRESS FROM USER
   
	db.find({}).sort({updateAt : -1}).exec(function (err, docs) {
		for(var i=0;i< docs.length; i++){
			allExceptId.push({ "ip" : docs[i].ip, "displayName" : docs[i].displayName });
		}

		// console.log("!!!!!!!!!!!!!!!!!!! "+allExceptId.length)
		// console.error("FUCKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK " +  findAllExceptId(allExceptId))

		console.log("5555555555555555      " + allExceptId.length)
	})

	setTimeout(function() {
		console.log(allExceptId);
		callback(allExceptId.length, allExceptId)
	}, 1000);

}


// SEND ALL USER
function findAllExceptId(all){
	return JSON.stringify(all);
}

// var users = [{
// 	"id" : 1,
// 	"username" : "test01",
// 	"pwd" : "test01",
// 	"ip" : "172.20.26.1"
// },{
// 	"id" : 2,
// 	"username" : "test02",
// 	"pwd" : "test02",
// 	"ip" : "172.20.26.2"
// },{
// 	"id" : 3,
// 	"username" : "test03",
// 	"pwd" : "test03",
// 	"ip" : "172.20.26.3"
// },{
// 	"id" : 4,
// 	"username" : "test04",
// 	"pwd" : "test04",
// 	"ip" : "172.20.26.4"
// }]

// exports.findAll = function() {
// 	return users;
// }