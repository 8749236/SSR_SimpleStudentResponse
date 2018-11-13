Common = (function () {
	function defaultAjaxSuccessHandlerGenerator(msg) {
		return function(data) {
			console.log(data);
			alert(msg);
		}
	}
	
	function defaultAjaxFailureHandler(xhr, status, errorText) {
		alert(errorText + ": " + xhr.responseText);
	}
	
	function grabFormData(formElement) {
		var tmp = {}
		var fd = new FormData(formElement);
		fd.forEach(function(value, key){
			tmp[key] = value;
		});
		return tmp;
	}
	
	function isEmptyString(str) {
		return !str || str.length <= 0;
	}
	
	return {
		grabFormData: grabFormData,
		defaultAjaxFailureHandler: defaultAjaxFailureHandler,
		defaultAjaxSuccessHandlerGenerator: defaultAjaxSuccessHandlerGenerator,
		isEmptyString: isEmptyString
	};
}) ();