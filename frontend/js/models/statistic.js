'use strict';

// Factories
//	StatisticStore
//		Download
class StatisticStore {
	constructor() {}
	
	buildStatistic(data) {
		var statisticType = StatisticStore.typeMap[data.type];
		var statistic = new statisticType(data);
		console.log(data);
		return statistic;
	}
	
	_defaultGetSuccess() {
		console.log(data);
		alert("Successfully retrieved a statistic");
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
		this.type = rawData.type;
		this.rawData = rawData ? rawData : {};
		this.processors = {};
	}
	
	getProcessedData() {
		var rslt = {};
		for(var key in this.processors) {
			rslt[key] = this.processors[key](this.rawData);
		}
		return rslt;
	}
	
	addProcessor(key, processorFunc) {
		this.processors[key] = processorFunc;
	}
	
	removeProcessor(key) {
		delete this.processors[key];
	}
	
}

// Abstract class for statistic of individual questions
class QuestionStatisticBase extends StatisticBase {
	constructor(rawData) {
		super(rawData)
		this.respByAttempts = this._partitionDataByAttempts(this.rawData);
	}
	
	_partitionDataByAttempts(rawData) {
		console.log(rawData);
		var rslt = null;
		var respByUser = rawData.reduce((acc, resp) => (acc[resp.owner] = [], acc), {});
		var highestAttempt = 0;
		// store responses by username
		rawData.reduce((acc, resp) => (acc[resp.owner].push(resp), acc), respByUser);
		// Get highest attempt and prepare final result holder
		for(var username in respByUser) {
			if(respByUser[username].length > highestAttempt) {
				highestAttempt = respByUser[username].length;
			}
		}
		// new Array with preset length has to be filled for ".forEach" to work
		rslt = new Array(highestAttempt).fill(null);
		rslt.forEach((v, i, arr) => arr[i] = new Array());
		
		// Sort responses under each user in ascending order base on time created
		// Ideally problem size is greatly reduced (divided by number of user)
		// it should be cheap to sort
		for(var username in respByUser) {
			respByUser[username].sort((r1, r2) => (r1 == r2 ? 0 : (r1>r2?1:-1)));
			// With an array of sorted responses, index will be their attempt number
			for(var attempt in respByUser[username]) {
				rslt[attempt].push(respByUser[username][attempt]);
			}
		}
		return rslt;
	}
}


class MultipleAnswerStatistic extends QuestionStatisticBase {
	constructor(rawData) {
		super(rawData);
		this.addProcessor("respCountByChoice");
	}
	
	_respCountByChoice(rawData) {
		var accumulator = rawData.reduce((acc, resp)=>(acc[resp.answer]=0, acc), []);
		var respReducer = (acc, resp) => (acc[resp.answer]+= 1, acc);
		return rawData.reduce(respReducer, accumulator);
	}
	
}; StatisticStore.typeMap.mult_answer = MultipleAnswerStatistic;

class MultipleChoiceStatistic extends MultipleAnswerStatistic {
	constructor(rawData) {
		rawData = rawData ? rawData : {};
		super(rawData);
	}
}; StatisticStore.typeMap.mult_choice = MultipleChoiceStatistic;