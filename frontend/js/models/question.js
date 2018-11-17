'use strict';

// Factories
//	QuestionStore
//		Download
class QuestionStore {
	constructor() {}
	
	buildQuestion(data) {
		var questionType = QuestionStore.typeMap[data.type];
		var question = new questionType(data);
		console.log(data);
		return question;
	}
	
	_defaultGetSuccess() {
		console.log(data);
		alert("Successfully retrieved a question");
	}
	
	getQuestion(questionId, onSuccess, onFail) {
		
		var processData = (function(questionBuildFunc, callback) {
			return function(data) {
				var q = questionBuildFunc(data);
				callback(q);
			};
		})(this.buildQuestion, onSuccess ? onSuccess : this._defaultGetSuccess);
		$.ajax({
			url: "/api/questions/" + questionId,
			method: "GET"
		}).done(processData)
		.fail(onFail ? onFail : Common.defaultAjaxFailureHandler);
	}
	
	getQuestionsByUsername(username, onSuccess, onFail) {
		var onDone = (function(questionBuildFunc, callback) {
			return function(rawQuestions) {
				var rslt = [];
				for(var raw of rawQuestions) {
					rslt.push(questionBuildFunc(raw));
				}
				callback(rslt);
			};
		})(this.buildQuestion, onSuccess ? onSuccess : this._defaultGetSuccess);
		$.ajax({
			url: "/api/users/" + username + "/questions/",
			method: "GET"
		}).done(onDone)
		.fail(onFail ? onFail : Common.defaultAjaxFailureHandler);
	}
}; QuestionStore.typeMap = {};


/*
	General Question representation for FRONT-END
	
	Knows:
		question ids
		title
		description
		type
		owner
		raw question data
		How to upload data
		How to downlaod data
		
*/

// Abstract class for question
class QuestionBase extends ICRUD {
	constructor(rawData) {
		super();
		rawData = rawData ? rawData : {};
		this.title = rawData.title ? rawData.title : null;
		this.description = rawData.description ? rawData.description : null;
		this.type = rawData.type ? rawData.type : null;
		this.answer = rawData.answer ? rawData.answer : null;
		this.owner = rawData.owner ? rawData.owner : null;
	}

	validate() {throw new Error(SSR_ERRORS.UNIMPLEMENTED_METHOD);};
	
	checkAnswer(response) {throw new Error(SSR_ERRORS.UNIMPLEMENTED_METHOD);};
	
	upload(onSuccess, onFail) {
		console.log(this);
		$.ajax({
			url: "/api/questions",
			method: "POST",
			data: this
		}).done(onSuccess ? onSuccess : this._defaultUploadSuccess)
		.fail(onFail ? onFail : Common.defaultAjaxFailureHandler);
	};
}


class MultipleAnswerQuestion extends QuestionBase {
	constructor(rawData) {
		super(rawData);
	}
}; QuestionStore.typeMap.mult_answer = MultipleAnswerQuestion;

class MultipleChoiceQuestion extends MultipleAnswerQuestion {
	constructor(rawData) {
		rawData = rawData ? rawData : {};
		super(rawData);
		this.choices = rawData.choices ? rawData.choices : ["", ""];
		this.type = "mult_choice";
		if(rawData.data) {
			this.answer = rawData.data.answer;
			this.choices = rawData.data.choices;
			this.owner = rawData.data.owner;
		}
	}
	
	addChoice(index, content) {
		content = content ? content : "";
		index = index ? index : this.choices.length;
		this.choices.splice(index, 0, content);
	}
	
	removeChoice(index) {
			this.choices.splice(index, 1);
			var tmp = parseInt(this.answer);
			if(tmp == index) {
				this.answer = null;
			} else if(tmp > index) {
				this.answer = (tmp - 1).toString();
			}
	}
	
	validate() {
		var issues = {};
		if(!this.title || this.title.length < 8) {
			issues.title = "Question title is missing or title length if less than 8 characters";
		}
		if(!this.choices || this.choices.length < 2) {
			issues.choices = "There is not enough choices, minium of two choices are required"
		}
		if(!this.answer || parseInt(this.answer) < 0 || parseInt(this.answer) >= this.choices.length) {
			issues.answer = "Need to specify a correct answer from available choices";
		}
		return issues;
	}
	
	update() {};
	remove() {};
}; QuestionStore.typeMap.mult_choice = MultipleChoiceQuestion;