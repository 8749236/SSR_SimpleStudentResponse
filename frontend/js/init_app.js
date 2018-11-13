var app = angular.module('appSSR', ["ngRoute"]);

var availableComposer = ["mult_choice"];

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/home.html",
				controller : "HomePageController",
    })
    .when("/login", {
        templateUrl : "views/login.html",
				controller : "LoginController",
    })
    .when("/register", {
        templateUrl : "views/register.html",
				controller : "RegisterController",
    })
    .when("/questions/", {
        templateUrl : "views/questions.html",
				controller: "QuestionListController"
    })
    .when("/questions/:question_id", {
        templateUrl : "views/question.html",
				controller: "QuestionDisplayController"
    })
		.when("/composers/", {
        templateUrl : "views/composers.html",
				controller: "QuestionComposerController"
    })
    .when("/composers/:question_type", {
        templateUrl : function(params) {
					return "views/composers/" + params.question_type + ".html"
				},
				controller: "QuestionEditorController"
    })
		.when("/questions/:question_id/statistics", {
				templateUrl : "views/statistics.html",
				controller: "StatisticController"
		});
		
		// Remove "#" from url
		// Need base tag within head tag to work
		$locationProvider.html5Mode(true);
});