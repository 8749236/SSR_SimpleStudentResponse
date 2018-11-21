app.directive('ssrStatistic', function() {
  return {
		link: function(scope, element, attrs) {
			// Prepare chart
			var modalStatisticChart = Highcharts.chart('modal_question_statistic_chart', {
				title: {
					text: "Response counts"
				},
				chart: {
					type: 'column'
				},
				xAxis: {
					title: {
						text: "Choices"
					}
				},
				yAxis: {
					title: {
						text: "Count"
					}
				},
				legend: {
						// Hide series toggling by hiding legend
						enabled: false
				},
				series: [{
					name: 'Responses',
					data: []
				}]
			});
			// Since modal is global, watch from $root
			scope.$root.$watch(attrs.responseCounts, function(value) {
				console.log("Update chart: ", modalStatisticChart);
				console.log("New data: ", value);				
				modalStatisticChart.series[0].setData(value);
				modalStatisticChart.redraw();
			});
		},
    restrict: 'E',
    scope: {
      responseCounts: '='
    },
    templateUrl: 'views/directives/questionStatistic.html'
  };
});