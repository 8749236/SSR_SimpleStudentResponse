

app.controller('LoginController', function($rootScope, $scope, $location) {
		
		var userTmp = null;
		$scope.onLogin = function(rawData) {
			console.log("Logging in user", rawData);

			// Create user model
			userTmp = new User(rawData);
			// Command the user model to validate itself
			var issues = userTmp.validate("login");
			// If problems
			if(Object.keys(issues).length > 0) {
				// Display error messages
				$scope.issues = issues;
			} else {
				// Command the user model to upload itself
				userTmp.login($scope.onLoginSuccess, $scope.onLoginFailed);
			}
		};
		
		$scope.onLoginSuccess = function(data) {
			console.log(data);
			
			$rootScope.activeUser = userTmp;
			localStorage.setItem("activeUser", JSON.stringify($rootScope.activeUser));
			
			// TODO: fancy message box
			alert("Successfully created login session");
			
			// Go to home page or pages that user should see to start their activities
			$scope.onGotoHomePage();
			
			// TODO: Once fancy message box is ready, gotoHomePage can be triggered
			//			by closing dialog box or a timer
			// This callback is fired from AJAX, alert Angular that things had changed
			$scope.$apply();
		}
		
		$scope.onLoginFailed = function(xhr, status, errorText) {
			Common.defaultAjaxFailureHandler(xhr, status, errorText);
		}
});