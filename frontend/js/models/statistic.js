'use strict';

// Factories
//	StatisticStore
//		Download
class StatisticStore {
	constructor() {}
	
	buildStatistic(data) {
		var questionType = QuestionStore.typeMap[data.type];
		var question = new questionType(data);
		console.log(data);
		return question;
	}
	
	_defaultGetSuccess() {
		console.log(data);
		alert("Successfully retrieved a question");
	}

}; StatisticStore.typeMap = {};


/*
	General Statistic representation for FRONT-END
	
	Knows:
		id
		type
		how to produce data for highcharts
		data - for other purpose
		How to download statistic
		
*/

// Abstract class for statistic
class StatisticBase extends ICRUD {
	constructor(rawData) {
		super();
		rawData = rawData ? rawData : {};
		this.id = rawData.title ? rawData.title : null;
		this.type = rawData.type ? rawData.type : null;
		this.data = rawData.data ? rawData.data : null;
	}
}

// Abstract class for statistic of individual questions
class QuestionStatisticBase extends StatisticBase {
	
}


class MultipleAnswerStatistic extends QuestionBase {
	constructor(rawData) {
		super(rawData);
	}
}; StatisticStore.typeMap.mult_answer = MultipleAnswerQuestion;

class MultipleChoiceStatistic extends MultipleAnswerQuestion {
	constructor(rawData) {
		rawData = rawData ? rawData : {};
		super(rawData);
	}
}; StatisticStore.typeMap.mult_choice = MultipleChoiceQuestion;