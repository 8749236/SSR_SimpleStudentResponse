class User {
	constructor(rawData) {
		this.username = rawData.username;
		this.password = rawData.password;
		this.data = rawData.data ? rawData.data : {};
	}
	
	
	login(onSuccess, onFail) {
		var defaultLoginSuccess = function(data) {
			console.log(data);
			alert("Successfully created login session");
		};
		$.ajax({
			url: "/api/sessions",
			method: "POST",
			data: this,
		}).done(onSuccess ? onSuccess : defaultLoginSuccess)
		.fail(onFail ? onFail : Common.defaultAjaxFailureHandler);
	}
	
	register(onSuccess, onFail) {
		var defaultRegisterSuccess = function(data) {
			console.log(data);
			alert("Account created");
		};
		$.ajax({
			url: "/api/users",
			method: "POST",
			data: this,
		}).done(onSuccess ? onSuccess : defaultRegisterSuccess)
		.fail(onFail ? onFail : Common.defaultAjaxFailureHandler);
	}
	
	// Returns a mapping of properties and associated error message
	// Note:
	// Validate method is not supposed to safe guard against bad input
	// This is just a quick way to check if anything is wrong
	// Safe guards should be implemented on server side
	// If this method does not find anything wrong, it does not imply the data is safe nor valid
	validate(purpose) {
		purpose = purpose ? purpose : "login";
		var issues = {};
		
		if(!this.username || this.username.length < 4) {
			issues.username = "Username is too short (minimum 4 characters or it is missing";
		}
		
		if(!this.password || this.password.length < 4) {
			issues.password = "Password is too short (minimum 4 character) or it is missing";
		}
		
		return issues;
	}
	
	toJSON() {
		let {username, data} = this;
		return {username, data};
	}
}