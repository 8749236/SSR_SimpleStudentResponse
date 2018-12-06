app.controller("StatisticController", function($scope, $http, $location, $routeParams, SSEService) {
	var questionStore = new QuestionStore();
	var responseStore = new ResponseStore();
	var chart = null;
	var absLinkPrefix = "/questions/"
	$scope.statistic = {};
	$scope.question = {};
	$scope.questionId = $routeParams.question_id;
	
	SSEService.start($scope);
	
	$scope.onQuestionGetSuccess = function(question) {
		console.log("Acquired question: ", question);
		$scope.question = question;
		$scope.link = window.location.origin + absLinkPrefix + question.id;
		$scope.statistic.question = question;
		$scope.statistic.choiceCount = question.choices.length;
		var category = [];
		for(var i = 1; i <= $scope.statistic.choiceCount; ++i) {
			category.push("Choice " + i);
		}
		chart.xAxis[0].setExtremes(0, $scope.statistic.choiceCount - 1);
		chart.xAxis[0].setCategories(category, true);
	};
	
	$scope.onResponsesGetSuccess = function(statistics) {
		console.log("Acquired statistic: ", statistics);
		
		$scope.statistic.data = [];
		for(var i = 1; i <= $scope.statistic.choiceCount; ++i) {
			$scope.statistic.data.push(0);
		}
		// Remove duplicated response
		// Keep move recent responses
		// Compute counts per choice
		for(var k in statistics) {
			var resp = statistics[k];
			if(Number.isInteger($scope.statistic.data[resp.answer])) {
				$scope.statistic.data[resp.answer] += 1;
			}
		}
		// Update (initialize) highcharts
		chart.series[0].setData($scope.statistic.data.slice());
	}
	
	$scope.$on('$viewContentLoaded', function() {
	});
	
	//$scope.$on("SSEService.questions." + $scope.questionId + ".statistics.init", function(e, data) {
	//	console.log("Initializing statistics", e, data);
	//});
	
	$scope.$on("SSEService.questions." + $scope.questionId + ".responses.update", function(e, data) {
		console.log("Incoming update for responses", e, data);
		$scope.statistic.data[data.answer] += 1;
		chart.series[0].setData($scope.statistic.data);
	});
		
	// Initialization
	// Configure chart without data
	chart = Highcharts.chart('statistic_chart_question', {
		title: {
			text: 'Real time statistic'
		},
		chart: {
			type: 'column',
		},
		legend: {
			enabled: false
		},
		xAxis: {
			title: {
				text: "Available choices"
			}
		},
		yAxis: {
			title: {
				text: "Number of response"
			}
		},
		series: [{
			data: []
		}]
	});
	
	// Ask for questions
	questionStore.getQuestion($scope.questionId, $scope.onQuestionGetSuccess);

	// Ask for statistics
	responseStore.getResponseByQuestionId($scope.questionId, $scope.onResponsesGetSuccess);

	// the button action
	$('#button').click(function () {
			chart.series[0].setData($scope.statistic.data);
	});

	
});