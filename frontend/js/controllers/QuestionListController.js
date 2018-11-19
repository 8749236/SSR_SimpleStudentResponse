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
	
	$scope.onViewQuestion = function(question) {
		console.log("View question: ", question);
	}
	
	$scope.onMonitorQuestion = function(question) {
		console.log("Monitor question: ", question);
		$scope.onGotoStatistic(question.id);
	};
	
	$scope.onShareQuestion = function(question) {
		var absLinkPrefix = "/questions/"
		console.log("Share question: ", question);
		$("#questionLinkQR").empty();
		$("#questionLinkQR").qrcode(window.location.origin + absLinkPrefix + question.id);
	};
});