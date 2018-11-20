app.service('ModalDataService', function($rootScope) {
	// Data object for global modals to pick up data
	// Helpful when modal does not have a controller
	$rootScope.modal = {};
	
	// Helper method
	this._normalizeKey = str => str.replace(/(modal|^)(.)/, (s, g1, g2) => g2.toLowerCase());
	
	this.setData = function(key, data) {
		key = this._normalizeKey(key);
		if(!$rootScope.modal[key]) {$rootScope.modal[key] = {};}
		$rootScope.modal[key] = data;
	};
	
	this.getData = function(key) {
		key = this._normalizeKey(key);
		return $rootScope.modal[key];
	}
	
	// Prepopulate the key with all the modal (with id) it can find
	// Keys are normalized base on id
	// prefix modal is stripped and first character of remaining string
	// is converted to lower case
	// e.g. "modalTestDisplay" will have key "testDisplay"
	// If no prefix is present, only first letter is converted to lower case
	// e.g. "TestDisplay" will also have key "testDisplay"
	$(".modal").each((i, v) => v.id ? $rootScope.modal[this._normalizeKey(v.id)] = {} : null);
	console.log("ModalDataService: ", this);
});