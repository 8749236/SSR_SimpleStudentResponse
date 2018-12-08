const crypto = require('crypto');

module.exports = {
	createUserFromForm : function(form) {
		var user = new UserBase(form.username);
		var tmp = Object.assign({}, form);
		user.setPassword(form.password);
		user.timeCreated = form.timeCreated;
		user.timeModified = form.timeModified;
		delete tmp.id;
		delete tmp.username;
		delete tmp.password;
		delete tmp.timeCreated;
		delete tmp.timeModified;
		user.data = tmp;
		return user
	},
	createUserFromDBEntry : function(dbEntry) {
		var user = new UserBase(dbEntry.username);
		user.username = dbEntry.username;
		user._salt = dbEntry._salt;
		user._saltedHash = dbEntry._saltedHash;
		user.data = dbEntry.data;
		user.timeCreated = dbEntry.timeCreated;
		user.timeModified = dbEntry.timeModified;
		return user;
	}
}

class UserBase {
	constructor(username) {
		this.username = username;
		this._salt = "";
		this._saltedHash = "";
		this.data = null;
	}
	
	// Does user have access to an authorization item with specified access level
	// Lower number means less access
	hasAccess(item, level) {
		// Abstract user has access to nothing
		return false;
	}
	
	// Authenticate - given set of data (for authentication)
	// Test whether user is valid thus can be authenticated
	authenticate(data) {
		var saltAndHash = null;
		saltAndHash = hashPassword(data.password, this.getSalt());
		return this.getSaltedHash() == saltAndHash.saltedHash;
	}
	
	setPassword(password) {
		var saltAndHash = null;
		
		// Converts password into salt and salted hash..
		if(password) {
			saltAndHash = hashPassword(password);
		}
		this._salt = saltAndHash.salt;
		this._saltedHash = saltAndHash.saltedHash;
	}
	
	getSalt() {
		return this._salt;
	}
	
	getSaltedHash() {
		return this._saltedHash;
	}
	
	toJSON() {
		let {username, data} = this;
		return {username, data};
	}
}

var hashPassword = function(password, saltForHash) {
	var result = {
		salt: saltForHash,
		saltedHash: ''
	};
	
	// Generate new salt if salt is not provided..
	if(!saltForHash) {
		result.salt = crypto.randomBytes(16).toString('base64');
	}
	
	// Start hashing..
	var hash = crypto.createHmac('sha512', result.salt);
	hash.update(password);
	result.saltedHash = hash.digest('base64');
	return result;
};