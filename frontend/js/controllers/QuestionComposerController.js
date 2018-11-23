app.controller('QuestionComposersController', function($scope, $location) {
	// Goto Multiple Choice Question composer automatically
	// Since it is the only question type that is available
	$scope.onGotoComposer('mult_choice');
});