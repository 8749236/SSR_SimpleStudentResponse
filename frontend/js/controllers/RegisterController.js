

app.controller('RegisterController', function($scope, $location) {
		
		$scope.onRegister = function(rawData) {
			console.log("Registering account", rawData);

			// Create user model
			var user = new User(rawData);
			// Command the user model to validate itself
			var issues = user.validate("register");
			// If problems
			if(Object.keys(issues).length > 0) {
				// Display error messages
				$scope.issues = issues;
			} else {
				// Command the user model to upload itself
				user.register($scope.onRegisterSuccess, $scope.onRegisterFailed);
			}
		};
		
		$scope.onRegisterSuccess = function(data) {
			console.log(data);
			
			// TODO: fancy message box
			alert("Account created");
			
			// Go to home page or pages that user should see to start their activities
			$scope.onGotoHomePage();
			
			// TODO: Once fancy message box is ready, gotoHomePage can be triggered
			//			by closing dialog box or a timer
			// This callback is fired from AJAX, alert Angular that things had changed
			$scope.$apply();
		}
		
		$scope.onRegisterFailed = function(xhr, status, errorText) {
			Common.defaultAjaxFailureHandler(xhr, status, errorText);
		}
});