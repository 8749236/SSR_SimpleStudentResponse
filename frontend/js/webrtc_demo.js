"use strict";

var peerConn = new RTCPeerConnection(); 
console.log(peerConn);
peerConn.createOffer(
	function(sdp) {
		console.log(sdp);
		$("#output").qrcode(JSON.stringify(sdp.sdp));
	}, function(err) {
		console.log(err);
});

//establishing peer connection 
//... 
//end of establishing peer connection 
var dataChannel = peerConn.createDataChannel("myChannel", {reliable: false}); 

// here we can start sending direct messages to another peer 

console.log(dataChannel);

$("#send").click(function (e) {
	console.log(e);
	var data = $("#data").val();
	dataChannel.send(data)
});
