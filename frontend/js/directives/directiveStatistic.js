app.directive('ssrStatistic', function() {
  return {
    restrict: 'E',
    scope: {
      dataResponseCounts: '='
    },
    templateUrl: 'views/directives/questionStatistic.html'
  };
});