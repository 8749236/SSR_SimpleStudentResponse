app.controller('QuestionListController', function($scope, $rootScope, $location, ModalDataService) {
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
		ModalDataService.setData("modalQuestionDisplay", {question: question});
		console.log("View question: ", question);
	}
	
	$scope.onMonitorQuestion = function(question) {
		console.log("Monitor question: ", question);
		$scope.onGotoStatistic(question.id);
	};
	
	$scope.onShareQuestion = function(question) {
		var absLinkPrefix = "/questions/"
		var questionLink = window.location.origin + absLinkPrefix + question.id;
		console.log("Share question: ", question);
		ModalDataService.setData("modalQuestionShare", {link: questionLink});
		$("#questionLinkQR").empty();
		$("#questionLinkQR").qrcode(questionLink);
	};
});