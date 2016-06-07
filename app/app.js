'use strict';

var App = angular.module('App', ['ngRoute', 'ngSanitize']);

//Single Page Application Routing Set Up
//The controller as is added because it gives the ability 
//to call the controller instead of calling $parent
App.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '../app/components/about/aboutView.html',
    /*controller: 'AboutController',
    controllerAs: 'aboutController',*/
  });
  $routeProvider.when('/tools', {
    templateUrl: '../app/components/tools/tools.html',
  });
  $routeProvider.when('/rentalCalculator', {
    templateUrl: '../app/components/tools/rentalCalculator/rentalCalculatorView.html',
    controller: 'RentalCalculatorController',
    controllerAs: 'rentalCalculator',
  });
  $routeProvider.when('/futureValueCalculator', {
    templateUrl: '../app/components/tools/futureValueCalculator/futureValueCalculatorView.html',
    controller: 'FutureValueCalculatorController',
    controllerAs: 'fv',
  });
  //this needs to be switched back to analyzeadeal
  $routeProvider.when('/blog', {
    templateUrl: '../app/components/blog/blogView.html',
    controller: 'BlogController',
    controllerAs: 'blog',
  });
  $routeProvider.when('/videos', {
    templateUrl: '../app/components/videos/videos.html',
  });
  $routeProvider.when('/contact', {
    templateUrl: '../app/components/contact/contact.html',
  });

});