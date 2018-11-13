app.controller("StatisticController", function($scope, $http, $location, $routeParams, SSEService) {
	var questionStore = new QuestionStore();
	var responseStore = new ResponseStore();
	var chart = null;
	$scope.statistic = {};
	$scope.questionId = $routeParams.question_id;
	
	SSEService.start($scope);
	
	$scope.onQuestionGetSuccess = function(question) {
		console.log("Acquired question: ", question);
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
		// Configure chart without data
		chart = Highcharts.chart('statistic_chart_question', {
			chart: {
				type: 'column'
			},
			series: [{
				data: []
			}]
		});
		
		console.log(chart);
		
		// Ask for questions
		questionStore.getQuestion($scope.questionId, $scope.onQuestionGetSuccess);
	
		// Ask for statistics
		$http.get("/api/questions/" + $scope.questionId + "/responses").then(
			function(e) {
				$scope.onResponsesGetSuccess(e.data);
			},
			function(err) {
				console.log("Error: ", err);
			}
		);
	});
	
	//$scope.$on("SSEService.questions." + $scope.questionId + ".statistics.init", function(e, data) {
	//	console.log("Initializing statistics", e, data);
	//});
	
	$scope.$on("SSEService.questions." + $scope.questionId + ".responses.update", function(e, data) {
		console.log("Incoming update for responses", e, data);
		$scope.statistic.data[data.answer] += 1;
		chart.series[0].setData($scope.statistic.data);
	});
		


	// the button action
	$('#button').click(function () {
			chart.series[0].setData($scope.statistic.data);
	});

	
});