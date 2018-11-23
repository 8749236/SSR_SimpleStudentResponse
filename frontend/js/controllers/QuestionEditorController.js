app.controller('QuestionEditorController', function($scope, $location) {
		$scope.question = new MultipleChoiceQuestion();
		$scope.issues = [];
		var editorForm = document.getElementById("questionSubmissionForm");
		
		$scope.onReset = function() {
			$scope.issues = [];
			editorForm.classList.remove('was-validated');
		};
		
		$scope.onValidate = function() {
			editorForm.classList.add('was-validated');
			$scope.issues = $scope.question.validate();
			return $scope.issues;
		};
	
		$scope.onComposeQuestion = function() {
			var issues = $scope.onValidate();
			if(Object.keys(issues).length == 0) {
				//$scope.question.upload();
			}
		};
});