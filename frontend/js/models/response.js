
class ResponseStore {
	constructor() {}
	
	buildResponse(data) {
		var responseType = ResponseStore.typeMap[data.type];
		var response = new responseType(data);
		console.log(data);
		return response;
	}
	
	_defaultGetSuccess() {
		console.log(data);
		alert("Successfully retrieved a response");
	}
	
	getResponse(responseId, onSuccess, onFail) {
		
		var processData = (function(responseBuildFunc, callback) {
			return function(data) {
				var r = responseBuildFunc(data);
				callback(r);
			};
		})(this.buildResponse, onSuccess ? onSuccess : this._defaultGetSuccess);
		$.ajax({
			url: "/api/responses/" + responseId,
			method: "GET"
		}).done(processData)
		.fail(onFail ? onFail : Common.defaultAjaxFailureHandler);
	}
	
	getResponseByQuestionId(questionId, onSuccess, onFail) {
		var processData = (function(responseBuildFunc, callback) {
			return function(rawResponses) {
				callback(rawResponses.map(raw => responseBuildFunc(raw)));
			}
		})(this.buildResponse, onSuccess ? onSuccess : this._defaultGetSuccess);
		
		// Ask for responses from this particular question
		$.ajax({
			url: "/api/questions/" + questionId + "/responses",
			method: "GET"
		}).done(processData)
		.fail(onFail ? onFail : Common.defaultAjaxFailureHandler);
	}
}; ResponseStore.typeMap = {};


class ResponseBase extends ICRUD {
	constructor(rawData) {
		super();
		rawData = rawData ? rawData : {};
		this.id = rawData._id ? rawData._id : null;
		this.questionId = rawData.questionId ? rawData.questionId : null;
		this.type = rawData.type ? rawData.type : null;
		this.answer = rawData.answer ? rawData.answer : null;
		this.owner = rawData.owner ? rawData.owner : null;
		this.timeCreated = rawData.timeCreated ? new Date(rawData.timeCreated) : null;
	}

	validate() {throw new Error(SSR_ERRORS.UNIMPLEMENTED_METHOD);};
	
	get isCorrect() {throw new Error(SSR_ERRORS.UNIMPLEMENTED_METHOD);};
	
	// Basic functions
	// Corresponds to CRUD of RESTful API
	upload(onSuccess, onFail) {
		console.log(this);
		$.ajax({
			url: "/api/responses",
			method: "POST",
			data: this
		}).done(onSuccess ? onSuccess : this._defaultUploadSuccess)
		.fail(onFail ? onFail : Common.defaultAjaxFailureHandler);
	};
}


class MultipleAnswerResponse extends ResponseBase {
	constructor(rawData) {
		super(rawData);
	}
	
	validate() {
		var issues = {};
		if(!this.answer || parseInt(this.answer) == undefined) {
			issues.title = "You have not selected an answer";
		}
		return issues;
	}
	
}; ResponseStore.typeMap.mult_answer = MultipleAnswerResponse;

class MultipleChoiceResponse extends MultipleAnswerResponse {
	constructor(rawData) {
		super(rawData);
	}
}; ResponseStore.typeMap.mult_choice = MultipleChoiceResponse;