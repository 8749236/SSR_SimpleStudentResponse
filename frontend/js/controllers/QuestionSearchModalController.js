app.controller('QuestionSearchModalController', function($scope, $rootScope, $location) {	
	var qrScanner = new Instascan.Scanner({ video: document.getElementById('videoForQRScan') });
	$scope.scanSuccess = false;
	$scope.onStartQRScan = function() {
		console.log("Started QR scanning");
		qrScanner.addListener('scan', function (content) {
			console.log("Acquired QR code, content:", content);
			// Test if QR code contains link for this site
			if(content.search(window.location.origin) == 0) {
				var qrPath = content.slice(window.location.origin.length);
				console.log("target path: ", qrPath);
				var splitedPath = qrPath.substr(1).split("/");
				if(splitedPath[0] == "questions") {
					$scope.questionId = splitedPath[1];
					$scope.$apply();
				}
			}
		});
		Instascan.Camera.getCameras().then(function (cameras) {
			if (cameras.length > 0) {
				qrScanner.start(cameras[0]);
			} else {
				console.error('No cameras found.');
			}
		}).catch(function (e) {
			console.error(e);
		});
	};
	
	$scope.onStopQRScan = function() {
		console.log("Stopped QR scanning");
		qrScanner.stop();
	};
	
	$('#modalQuestionIdSearch').on('hidden.bs.modal', function (e) {
		$scope.onStopQRScan();
	})
});