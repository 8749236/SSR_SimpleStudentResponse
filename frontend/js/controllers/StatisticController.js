app.controller("StatisticController", function($scope, $http, $location, $routeParams, SSEService, ModalDataService) {
	var questionStore = new QuestionStore();
	var responseStore = new ResponseStore();
	var statisticStore = new StatisticStore();
	var chart = null;
	var absLinkPrefix = "/questions/"
	$scope.statistic = {};
	$scope.question = {};
	$scope.questionId = $routeParams.question_id;
	$scope.live = true;
	
	SSEService.start($scope);
	
	//$scope.onPreviewQuestion = function() {
	//	ModalDataService.setData("modalQuestionDisplay", {question: $scope.question});
	//}
	
	$scope.onToggleMonitoring = function() {
		$scope.live = !$scope.live;
		$scope.statusText = $scope.live ? "Live" : "Paused";
		console.log("Monitoring Status:", $scope.live);
	}
	
	$scope.onAnalyzeData = function() {
		//var data = $scope.statistic.getProcessedData();
		var data = [
			{
			name: "Total selection count",
			data: [5, 8, 22, 13]
			},
			{
			name: "Attempts 1",
			data: [4, 2, 3, 7],
			stacking: "normal"
			},
			{
			name: "Attempts 2",
			data: [0, 5, 5, 6],
			stacking: "normal"
			},
			{
			name: "Attempts 3",
			data: [1, 1, 14, 0],
			stacking: "normal"
			},
		];
		for(var i in data) {
			if(chart.series[i]) {
				chart.series[i].update(data[i]);
			} else {
				chart.addSeries(data[i]);
			}
		}
	}
	
	$scope.onQuestionGetSuccess = function(question) {
		//console.log("Acquired question: ", question);
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
		
		// Ask for responses
		responseStore.getResponseByQuestionId($scope.questionId, $scope.onResponsesGetSuccess);
		$scope.$apply();
	};
	
	$scope.onResponsesGetSuccess = function(responses) {
		//console.log("Acquired responses: ", responses);
		
		$scope.statistic.data = [];
		for(var i = 1; i <= $scope.statistic.choiceCount; ++i) {
			$scope.statistic.data.push(0);
		}
		// Remove duplicated response
		// Keep move recent responses
		// Compute counts per choice
		for(var k in responses) {
			var resp = responses[k];
			if(Number.isInteger($scope.statistic.data[resp.answer])) {
				$scope.statistic.data[resp.answer] += 1;
			}
		}
		// Update (initialize) highcharts
		chart.series[0].setData($scope.statistic.data.slice());
		
		// Build a statistic object
		responses.type = $scope.question.type;
		var tmp = statisticStore.buildStatistic(responses);
		console.log(tmp);
	}
	
	$scope.$on('$viewContentLoaded', function() {
	});
	
	//$scope.$on("SSEService.questions." + $scope.questionId + ".statistics.init", function(e, data) {
	//	console.log("Initializing statistics", e, data);
	//});
	
	$scope.$on("SSEService.questions." + $scope.questionId + ".responses.update", function(e, data) {
		//console.log("Incoming update for responses", e, data);
		$scope.statistic.data[data.answer] += 1;
		// Add new data to the statistic object
		//$scope.statistic.addData(data);
		
		// If still showing live statistic, update chart
		if($scope.live) {
			chart.series[0].setData($scope.statistic.data);
		}
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

	// the button action
	$('#button').click(function () {
			chart.series[0].setData($scope.statistic.data);
	});

	
});