app.controller('QuestionListController', function($scope, $rootScope, $location) {
	var questionStore = new QuestionStore();
	$scope.questions = [0, 0, 1, 2, 3];
	
	questionStore.getQuestionsByUsername($rootScope.activeUser.username,
		function(questions) {
			console.log("Question list retrieved for: " + $rootScope.activeUser.username, questions);
			$scope.questions = questions;
			$scope.$apply();
		}
	);
});