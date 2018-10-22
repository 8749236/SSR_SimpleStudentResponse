module.exports = {
	createResponseFromForm: function(form) {
		var response = new ResponseBase(form.questionId);
		var tmp = Object.assign({}, form);
		delete tmp.questionId;
		response.setData(tmp);
		return response;
	}, 
	createResponseFromDBEntry: function(dbEntry) {
		var response = new ResponseBase(dbEntry.questionId);
		response.setData(dbEntry.data);
		response.setOwner(dbEntry.owner);
		return response;
	},
}

class ResponseBase {
	// It does not make sense to talk about response
	// without context, i.e. question
	// So each response shall store its associated question id
	// and response does not care the content it holds
	// Shifting the concerns to other components that cares about 
	// the meaning of the response, this object only stores the data
	// and support manipulation of responses in general
	constructor(parentQuestionId) {
		this.questionId = parentQuestionId;
		this.data = null;
		this.owner = null;
	}
	
	setQuestionId(title) {
		this.title = title;
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