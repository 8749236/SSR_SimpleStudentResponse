module.exports = {
	setup: _sseSetup,
	sendAll: _sseSendAll
}

var _sseConnections = [];
function _sseSetup(req, res, next) {
	// Setup header
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive"
	});
	
	// Store connection
	
	// Setup helper methods
	res.sseSend = function(msg, eventName, id) {
		if(id) {
			res.write("id: " + id + "\n");
		}
		if(eventName) {
			res.write("event: " + eventName + "\n");
		}
		res.write("data: " + JSON.stringify(msg) + "\n\n");
	};
	res.sseClose = function() {
		// Returns 204, No Content
		// Since no more content will be returned for this SSE connection
		// Set content-type to text/plain to prevent further reconnection
		res.writeHead(204, {
			"Content-Type": "text/plain"
		});
	};
	_sseConnections.push(res);
	return next();
}

function _sseSendAll(msg, eventName, id) {
	_sseConnections.forEach(function(conn, index, arr) {
		conn.sseSend(msg, eventName, id);
		// What error does .write() throw again?
	});
}
