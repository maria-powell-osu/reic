'use strict';

var App = angular.module('App', ['ngRoute']);

//I change the AngularJS delimiters because JINJA uses the same delimiters and it caused errors
//In this app just use "{[ ]}" instead of "{{ }}"
App.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[');
  $interpolateProvider.endSymbol(']}');
}]);

//Single Page Application Routing Set Up
App.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '../reic/templates/analyzeadeal.html',
  });
  $routeProvider.when('/howitworks', {
    templateUrl: '../reic/templates/howitworks.html',
  });
  $routeProvider.when('/contact', {
    templateUrl: '../reic/templates/contact.html',
  });
});