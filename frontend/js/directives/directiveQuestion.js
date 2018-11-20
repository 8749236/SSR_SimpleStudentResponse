app.directive('ssrQuestion', function() {
  return {
    restrict: 'E',
    scope: {
      question: '='
    },
    templateUrl: 'views/directives/questionBase.html'
  };
});