'use strict';

var App = angular.module('App', ['ngRoute']);

//Single Page Application Routing Set Up
App.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '../reic/app/components/rentalCalculator/rentalCalculatorView.html',
    controller: 'RentalCalculatorController',
    controllerAs: 'rentalCalculator',
  });
  //this needs to be switched back to analyzeadeal
  $routeProvider.when('/blog', {
    templateUrl: '../reic/app/components/blog/blog.html',
  });
  $routeProvider.when('/videos', {
    templateUrl: '../reic/app/components/videos/videos.html',
  });
  $routeProvider.when('/contact', {
    templateUrl: '../reic/app/components/contact/contact.html',
  });

});