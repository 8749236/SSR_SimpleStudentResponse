module.exports = {
	setup: _sseSetup,
	sendToUsers: _sseSendToUsers,
	sendAll: _sseSendAll
}

var _sseConnections = {};
function _sseSetup(req, res, next) {
	// Setup header
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive"
	});
	
	// Store connection
	
	// Setup helper methods
	res.sseSend = function(eventName, msg, eventType, id) {
		if(id) {
			res.write("id: " + id + "\n");
		}
		if(eventType) {
			res.write("event: " + eventType + "\n");
		}
		var dataToSend = {
			eventName : eventName,
			msg: msg
		}
		res.write("data: " + JSON.stringify(dataToSend) + "\n\n");
	};
	res.sseClose = function() {
		// Returns 204, No Content
		// Since no more content will be returned for this SSE connection
		// Set content-type to text/plain to prevent further reconnection
		res.writeHead(204, {
			"Content-Type": "text/plain"
		});
	};
	// Key is username
	_sseConnections[req.session.user.username] = res;
	return next();
}

function _sseSendAll(eventName, msg, eventType, id) {
	// Loop through all keys
	for(var key in _sseConnections) {
		_sseConnections[key].sseSend(eventName, msg, eventType, id);
		// What error does .write() throw again?
		// We need to catch that in case a connection has already closed
	}
}

function _sseSendToUsers(usernames, eventName, msg, eventType, id) {
	var failedList = [];
	for(var username of usernames) {
		if(_sseConnections[username]) {
			_sseConnections[username].sseSend(eventName, msg, eventType, id);
		} else {
			failedList.push(username);
		}
	}
	return failedList;
}

// TODO: needs a feature that only sends information
// to user that actually needs it; this also removes privacy and sercurity risks