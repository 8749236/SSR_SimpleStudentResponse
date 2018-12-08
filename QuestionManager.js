module.exports = {
	createQuestionFromForm: function(form) {
		var question = new QuestionBase(form.title);
		var tmp = Object.assign({}, form);
		question.setOwner(form.owner);
		question.setDescription(form.description);
		question.setType(form.type);
		question.timeCreated = form.timeCreated;
		question.timeModified = form.timeModified;
		delete tmp.id;
		delete tmp.title;
		delete tmp.description;
		delete tmp.type;
		delete tmp.owner;
		delete tmp.timeCreated;
		delete tmp.timeModified;
		question.setData(tmp);
		return question;
	}, 
	createQuestionFromDBEntry: function(dbEntry) {
		var question = new QuestionBase(dbEntry.title);
		question.setDescription(dbEntry.description);
		question.setType(dbEntry.type);
		question.setData(dbEntry.data);
		question.setOwner(dbEntry.owner);
		question.timeCreated = dbEntry.timeCreated;
		question.timeModified = dbEntry.timeModified;
		return question;
	},
}

class QuestionBase {
	// Question only knows the data regarding presentation of
	// the question and available choices
	// as well as description of correct answer
	// It does not know how to interpret it
	// It only stores it.
	// Result will be evaluated at client-side
	constructor(title) {
		this.title = title;
		this.description = "";
		this.type = "";
		this.data = null;
		this.owner = null;
	}
	
	setTitle(title) {
		this.title = title;
	}
	
	setDescription(desc) {
		this.description = desc;
	}
	
	setType(type) {
		this.type = type;
	}
	
	// TODO: Need to implement size restriction on data
	// Data can be arbitrary size, what if data is 100 GB?
	setData(data) {
		this.data = data;
	}
	
	setOwner(username) {
		this.owner = username;
	}
}