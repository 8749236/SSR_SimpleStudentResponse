Common = (function () {
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
	
	return {
		grabFormData: grabFormData,
		defaultAjaxFailureHandler: defaultAjaxFailureHandler
	};
}) ();