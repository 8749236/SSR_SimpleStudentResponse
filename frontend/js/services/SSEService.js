app.service('SSEService', function($rootScope) {
	this._serviceURL = 
	this._eventSource = null;;
	
	this.setURL = function(url) {
		if(this._eventSource
				&& this._eventSource.readyState != EventSource.CLOSED
				&& this._eventSource.url != url) {
			throw new Error("Attempting to change SSEService URL when active, unsubscribe all subscribers before changing URL");
		}
		this._serviceURL = url;
	};
	
	this.start = function(initiatingScope) {
		if(!this._serviceURL) {
			throw new Error("SSEService event source URL has not been set; set source URL before subscribing");
		}
		
		if(initiatingScope) {
			initiatingScope.$on("$destroy", function(e) {
				this.stop();
			}.bind(this));
		}
		
		// Configure SSEService
		if(EventSource) {
			if(		!this._eventSource
					|| this._eventSource.readyState == EventSource.CLOSED) {
				//"/api/questions/" + questionId + "/statistic"
				this._eventSource = new EventSource(this._serviceURL);
				this._eventSource.onerror = function(e) {
					console.log(e);
					//alert("Failed to start live statistic monitoring: ");
					// Destroy existing event source
					this._eventSource = null;
					$rootScope.$broadcast("SSEService.error", e);
				};
				this._eventSource.onmessage = function(e) {
					console.log(e);
					var tmp = JSON.parse(e.data);
					// Pipe into AngularJS' event system
					if(tmp) {
						$rootScope.$broadcast("SSEService." + tmp.eventName, tmp.msg);
					}
				};
			}
		} else {
			// Web Socket alternative or timed-poll alternative
		}
		$rootScope.$broadcast("SSEService.start");
	};
	
	this.stop = function() {
		if(EventSource && this._eventSource) {
			this._eventSource.close();
		} else {
			// Closing logics for alternatives
		}
		$rootScope.$broadcast("SSEService.stop");
	};
	console.log(this);
});