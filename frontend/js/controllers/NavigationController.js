
app.controller('NavigationController', function($scope, $location, SSEService) {
	$scope.onGotoHomePage = function() {
		console.log("Goto homepage");
		$location.path("/");
	};
	$scope.onGotoLogin = function() {
		console.log("Goto login");
		$location.path("/login");
	};
	$scope.onGotoRegister = function() {
		console.log("Goto register");
		$location.path("/register");
	};
	$scope.onGotoQuestions = function() {
		console.log("Goto question list");
		$location.path("/questions");
	};
	$scope.onGotoQuestion = function(questionId) {
		console.log("Goto question: " + questionId);
		$location.path("/questions/" + questionId);
	};
	$scope.onGotoComposer = function(questionType) {
		console.log("Goto composer: " + questionType);
		$location.path("/composers" + (questionType ? "/" + questionType : ""));
	};
	$scope.onGotoStatistic = function(questionId) {
		console.log("Goto statistic: " + questionId);
		$location.path(questionId ? "/questions/" + questionId + "/statistics" : "/statistics");
	}
});