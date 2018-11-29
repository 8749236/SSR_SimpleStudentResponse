app.directive('ssrShareLink', function() {
  return {
		link: function(scope, element, attrs) {
			var scopeToWatch = attrs.global != undefined ? scope.$root : scope;
			scopeToWatch.$watch(attrs.link, function(value) {
				console.log("New link to share: ", value);
				if(value) {
					$("#linkToShareQR").empty();
					$("#linkToShareQR").qrcode(value);
				}
			});
		},
    restrict: 'E',
    scope: {
      link: '=',
			global: '@'
    },
    templateUrl: 'views/directives/shareLink.html'
  };
});