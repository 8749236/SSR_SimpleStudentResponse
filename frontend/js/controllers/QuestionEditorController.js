app.controller('QuestionEditorController', function($scope, $location) {
		$scope.question = new MultipleChoiceQuestion();
	
		$scope.onComposeQuestion = function() {
			var issues = $scope.question.validate();
			if(Object.keys(issues).length > 0) {
				$scope.issues = issues;
			} else {
				$scope.question.upload();
			}
		}
});