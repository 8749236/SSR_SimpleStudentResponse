app.controller('QuestionDisplayController', function($scope, $location, $routeParams) {
	var questionStore = new QuestionStore();
	$scope.questionId = $routeParams.question_id
	$scope.responseStore = new ResponseStore();
	$scope.question = {};
	$scope.response = {};
	$scope.responseSubmitted = false;
	
	$scope.onQuestionGetSuccess = function(question) {
		$scope.question = question;
		console.log($scope.question);
		
		// Model is independent from AngularJS and uses jQuery ajax
		// Needs to manually trigger digest cycle
		$scope.$apply();
	};
	
	$scope.onResponseUploadSuccess = function(data) {
		$scope.responseSubmitted = true;
		$scope.$apply();
	}
	
	$scope.onSubmitResponse = function(userAnswer) {
		console.log(userAnswer);
		
		$scope.responseSubmitted = false;
		var issues = $scope.response.validate();
		if(Object.keys(issues).length > 0) {
			$scope.issues = issues;
		} else {
			$scope.response.upload($scope.onResponseUploadSuccess);
		}
	};
	
	questionStore.getQuestion($scope.questionId, $scope.onQuestionGetSuccess);
});