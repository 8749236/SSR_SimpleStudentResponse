// Constants
const COLLECTION_USERS_NAME = "users";
const COLLECTION_QUESTIONS_NAME = "questions";
const COLLECTION_RESPONSES_NAME = "responses";
const PORT = process.env.PORT || 3000;
var mongoURL = process.env.MONGODB_URI || "mongodb://localhost:27017/test";
var DEBUG = false;

console.log("mongoURL = ", mongoURL);

// Loop through process.argv
console.log(process.argv);
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
	if(val.toLowerCase() == "-debug") {
		debug = true;
	}
});

// Uses express
var express = require('express');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var path = require('path');

var app = express();
//app.set('trust proxy', 1) // trust first proxy
 
//if (app.get('env') === 'production') {
//  app.set('trust proxy', 1); // trust first proxy
//  sess.cookie.secure = true; // serve secure cookies
//}

var sessionStore = new MongoDBStore({
  uri: mongoURL,
  collection: 'SSRSessions'
});

// Catch errors in sessionStore
sessionStore.on('error', function(error) {
  console.log(error);
  throw new Error("Session store has encountered an error, see preceding logs for more details");
});

var sess = {
	name: 'b4.ssr.sid',
  secret: 's0m3th1ng_n0t_s0_sp3c!al',
  cookie: { secure: !true },
	resave: false,
	saveUninitialized: false,
	
};

// 3rd party includes
const bodyParser = require('body-parser');
var app = express();
var multer = require('multer');
var upload = multer();

var MongoClient = require('mongodb');
var db = null;
var collections = {};

//var usersDB = new Datastore({ filename: 'db/users.db', autoload: true});
//usersDB.ensureIndex({ fieldName: 'username', unique: true, timestampData: true });
//var questionsDB = new Datastore({ filename: 'db/questions.db', autoload: true, timestampData: true});
//var responsesDB = new Datastore({ filename: 'db/responses.db', autoload: true, timestampData: true});
//responsesDB.ensureIndex({ fieldName: 'question_id', timestampData: true });

// Local includes
var userManager = require('./UserManager.js');
var questionManager = require('./QuestionManager.js');
var responseManager = require('./ResponseManager.js');
var sse = require("./SSEUtil.js");


app.use(express.static('frontend'));

app.use(session(sess));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

function checkAuth(req, res, next) {
  if (!req.session.user) {
		return res.status(401).json("You have not logged in or your session had expired");
	}
	return next();
}


// Milestone 1 - Basic user account system
// 	Check
// Milestone 2 - Basic questions and answers submission system
// Milestone 3 - Basic online quiz system
//	Clarification: able to create a collection of questions
//								with a specified time period that those questions can be answered
// Milestone 4 - Support for rich text questions
// Milestone 5 - Support for discussions

// USER Create, Read, Update and Delete
// POST is not idempotent!
app.post('/api/users', upload.fields([]), function(req, res, next) {
	var formData = req.body;
	
	// Check against malformed request
	// Perhaps use validator module?
	
	formData.timeCreated = new Date();
	formData.timeModified = new Date();
	var userNew = userManager.createUserFromForm(formData);
	collections.users.insertOne(userNew, function(err, newDoc) {
		if(err) {
			if(err.errorType == "uniqueViolated") {
				res.status(409).json("Username already exists, please use a different username");
			} else {
				res.status(500).json(err);
			}
		} else {
			// 201 - CREATED..
			res.status(201).json(newDoc.ops[0].username);
		}
		return next();
	});
});

// Idea:
// 		Replacement for GET /api/sessions
//		Front end checks login status by trying to retrieve user information
app.get('/api/users/:username', upload.fields([]), checkAuth, function(req, res, next) {
	if(req.session.user && req.session.user.username == req.params.username) {
		res.status(200).json(req.session.user);
	} else {
		res.status(401).json("You have not logged in or your session had expired");
	}
	return next();
});

// User session create
// Idea:
//		Wheneever a session is created
//		Random string is generated and passed on to store inside a cookie
//		It should also be stored in the database
//		Timeout is optional
// Actually:
//		use express-session instead!..
app.post('/api/sessions', upload.fields([]), function(req, res, next) {
	//req.params
	var key = req.body.username;
	var formData = req.body;
	if(!key) {	
		// 400 Bad request
		res.status(400).json("Please specify a username");
		return next();
	}
	
	var userLogin = userManager.createUserFromForm(formData);	
	collections.users.findOne({ username: key }, function(err, doc) {
		if(err) {
			res.status(500).json(err);
		} else if(doc) {
			var userFound = userManager.createUserFromDBEntry(doc);
			// Authentication
			if(userFound.authenticate(formData)) {
				console.log("Successfully authenticated user: " + userFound.username);
				req.session.user = userFound;
				res.json(userFound);
			} else {
				console.log("Failed to authenticate user: " + userFound.username);
				req.session.user = null;
				res.status(401).json("Your username or password is incorrect");
			}
		} else {
			res.status(401).json("Your username or password is incorrect");
		}
		return next();
	});
});

// User session get/retrieve
// Idea:
//		User look at cookie for session id
//		Use that session id to retrieve still-active session
//		Also retrieves necessary user information
//		Sensitive informations are removed say salts, salted hash
// Actual:
//		Replaced with "GET /api/user/:username"
//		Agent tries to retrieve user data, if success then it is logged in


// Questions, CRUD
// Idea:
//		Support multiple types of question
//		Have single store of questions and answers
//		Presentation and answer should be independent from server implementation
//		Server merely stores presentation, answer and description of correct answer
//			Server does not interpret 
// 		Correct answers and statistics are calculated at client-side
// Alternative URI:
//		- GET /api/users/:username/questions

// Question Create
app.post('/api/questions', upload.fields([]), checkAuth, function(req, res, next) {	
	var formData = req.body;
	formData.timeCreated = new Date();
	formData.timeModified = new Date();
	formData.owner = req.session.user.username; // Fill owner with username stored in session
	var questionNew = questionManager.createQuestionFromForm(formData);
	collections.questions.insertOne(questionNew, function(err, newDoc) { 
		if(err) {
			res.status(500).json(err);
		} else {
			// 201 - CREATED..
			res.status(201).json(newDoc.insertedId.toString());
		}
		return next();
	});
});

// Question GET by id
// Does not support get entire collection
app.get('/api/questions/:question_id', upload.fields([]), checkAuth, function(req, res, next) {	
	var key = req.params.question_id;
	var o_id = new MongoClient.ObjectID(key);
	collections.questions.findOne({ _id: o_id }, function(err, doc) {
		if(err) {
			res.status(500).json(err);
		} else if(doc) {
			res.status(200).json(doc);
		} else {
			res.status(404).json("Attempted to find question with specified id but it does not exist");
		}
		return next();
	});
});

// Questions GET by username
// TODO: Support ranges, sorting
//		Select first 50, for example
//		Sort by date created
app.get('/api/users/:username/questions/', upload.fields([]), checkAuth, function(req, res, next) {	
	var username = req.params.username;
	collections.questions.find({ owner: username }).toArray(function(err, docs) {
		if(err) {
			res.status(500).json(err);
		} else {
			res.status(200).json(docs);
		}
		return next();
	});
});

// Response, CRUD
// Idea:
//		Response itself does not care what question it is associated to
//			It still checks for existence for such question though
//				Question id will be stored as part of its data, but must not be empty
//		Response also does not know what the data it holds really means
//			It has to be interpreted at front end along with question data
// Alternative URI
//		- GET /api/questions/:question_id/responses/
//		- GET /api/users/:username/responses
//		- GET /api/users/:username/questions/:question_id/responses

// Response Create
app.post('/api/responses', upload.fields([]), checkAuth, function(req, res, next) {	
	var formData = req.body;
	if(!formData.questionId) {
		return res.status(400).json("Response was not associated with a question, please specify it via property question_id");
	}
	formData.timeCreated = new Date();
	formData.owner = req.session.user.username; // Fill owner with username stored in session
	var responseNew = responseManager.createResponseFromForm(formData);
	collections.responses.insertOne(responseNew, function(err, rslt) { 
		if(err) {
			res.status(500).json(err);
		} else {
			// 201 - CREATED..
			res.status(201).json(rslt.insertedId.toString());
			
			// Notify all listening browser
			sse.sendAll("questions." + formData.questionId + ".responses.update", rslt.ops[0]);
		}
		return next();
	});
});

// Response Read, GET by id
app.get('/api/responses/:response_id', upload.fields([]), checkAuth, function(req, res, next) {	
	var key = req.params.response_id;
	var o_id = new MongoClient.ObjectID(key);
	collections.responses.findOne({ _id: o_id }, function(err, doc) {
		if(err) {
			res.status(500).json(err);
		} else if(doc) {
			res.status(200).json(doc);
		} else {
			res.status(404).json("Attempted to find response with specified id but it does not exist");
		}
		return next();
	});
});

// Response Update is not supported, create new response instead
// Response Delete, should only allowed by question owner for specific questions

// TODO: create a SSE manager that allow connections being opened
// 		for every question
//		Current design will route all responses to all user
//		Which is an enormous privacy-security issue
app.get('/api/questions/:question_id/responses/', checkAuth, function(req, res, next) {
	var questionId = req.params.question_id;
	
	collections.responses.find({ "questionId": questionId }).toArray(function(err, docs) {
		if(err) {
			// Error, what to do here? other than dump error
			console.log(err);
			res.status(500).json(err);
		} else {
			//rslt = sse.sendToUsers([req.session.user.username], "questions." + questionId + ".responses.init", docs);
			//if(rslt.length == 0) {
			//	res.status(200).json("Statistics has been sent through SSE");
			res.status(200).json(docs);
			//} else {
			//	console.log("SSE connection has not been established for users: ", rslt);
			//	res.status(400).json("SSE connection has not been established");
			//}
		}
	});
});

app.get('/api/events', checkAuth, sse.setup, function(req, res, next) {
	// Do nothing, sse.setup() does all the work
});

app.get('*', function(req, res, next) {
	// Skip specific file requests
	if(req.url.search(/\..*/) >= 0) {
		return next();
	}
	res.sendFile(path.resolve('frontend/index.html'));
});

// Wait for database
MongoClient.connect(mongoURL, {useNewUrlParser: true }, function(err, client) {
	if(err) {
    console.log(err);
    process.exit(1);
	}
	db = client.db();
	
	collections.users = db.collection(COLLECTION_USERS_NAME);
	collections.users.createIndex("username", { unique: true });
	collections.questions = db.collection(COLLECTION_QUESTIONS_NAME);
	collections.questions.createIndex("owner");
	collections.responses = db.collection(COLLECTION_RESPONSES_NAME);
	collections.responses.createIndex("question_id");
	
	console.log("Database connection established");
	// Starts listening	
	app.listen(PORT, function () {
		console.log('App listening on port ' + PORT)
	});
});