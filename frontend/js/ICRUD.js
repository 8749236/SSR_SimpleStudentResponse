class ICRUD {
	constructor() {}
	_defaultUploadSuccess(data) {
			console.log(data);
			alert("Upload success");
	}
	_defaultDownloadSuccess(data) {
			console.log(data);
			alert("Download success");
	}
	_defaultUpdateSuccess(data) {
			console.log(data);
			alert("Update success");
	}
	_defaultDeleteSuccess(data) {
			console.log(data);
			alert("Delete success");
	}
	// Basic functions
	// Corresponds to CRUD of RESTful API
	upload() {throw new Error(SSR_ERRORS.UNIMPLEMENTED_METHOD);};
	download() {throw new Error(SSR_ERRORS.UNIMPLEMENTED_METHOD);};
	update() {throw new Error(SSR_ERRORS.UNIMPLEMENTED_METHOD);};
	remove(){throw new Error(SSR_ERRORS.UNIMPLEMENTED_METHOD);};
}