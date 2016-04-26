'use strict';

var App = angular.module('App', ['ngRoute', 'ngSanitize']);

//Single Page Application Routing Set Up
//The controller as is added because it gives the ability 
//to call the controller instead of calling $parent
App.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '../reic/app/components/about/about.html',
    controller: 'AboutController',
    controllerAs: 'aboutController',
  });
  $routeProvider.when('/tools', {
    templateUrl: '../reic/app/components/tools/rentalCalculator/rentalCalculatorView.html',
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