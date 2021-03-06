module.exports = {
	createResponseFromForm: function(form) {
		var response = new ResponseBase(form.questionId);
		var tmp = Object.assign({}, form);
		response.setOwner(form.owner);
		response.setType(form.type);
		response.setAnswer(form.answer);
		response.timeCreated = form.timeCreated;
		
		// Store rest of the attributes as extra data
		// Instead of discarding
		delete tmp.id;
		delete tmp.questionId;
		delete tmp.type;
		delete tmp.answer;
		delete tmp.owner;
		delete tmp.timeCreated;
		delete tmp.timeModified;
		response.setData(tmp);
		return response;
	}, 
	createResponseFromDBEntry: function(dbEntry) {
		var response = new ResponseBase(dbEntry.questionId);
		response.setType(dbEntry.type);
		response.setAnswer(dbEntry.answer);
		response.setData(dbEntry.data);
		response.setOwner(dbEntry.owner);
		response.timeCreated = dbEntry.timeCreated;
		response.timeModified = dbEntry.timeModified;
		return response;
	},
}

class ResponseBase {
	// It does not make sense to talk about response
	// without context, say a question
	// So each response shall store its associated question id
	// and response does not care the content it holds
	// Shifting the concerns to other components that cares about 
	// the meaning of the response, this object only stores the data
	// and support manipulation of responses in general
	constructor(parentQuestionId) {
		this.questionId = parentQuestionId;
		this.type = null;
		this.answer = null;
		this.data = null;
		this.owner = null;
	}
	
	setQuestionId(questionId) {
		this.questionId = questionId;
	}
	
	// TODO: Need to implement size restriction on data
	// Data can be arbitrary size, what if data is 100 GB?
	setType(type) {
		this.type = type;
	}
	
	setAnswer(answer) {
		this.answer = answer;
	}
	
	setData(data) {
		this.data = data;
	}
	
	setOwner(username) {
		this.owner = username;
	}
}