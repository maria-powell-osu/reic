'use strict';

var App = angular.module('App', ['ngRoute', 'ngSanitize', 'ui.tinymce', 'vcRecaptcha', 'ngAnimate']);

//Single Page Application Routing Set Up
//The controller as is added because it gives the ability 
//to call the controller instead of calling $parent
App.config(function($routeProvider,  $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '../app/components/about/aboutView.html',
    controller: 'AboutController',
    controllerAs: 'about',
  });
  $routeProvider.when('/investment-calculators', {
    templateUrl: '../app/components/tools/tools.html',
    controller: 'ToolsController',
  });
  $routeProvider.when('/rental-property-calculator', {
    templateUrl: '../app/components/tools/rentalCalculator/rentalCalculatorView.html',
    controller: 'RentalCalculatorController',
    controllerAs: 'rentalCalculator',
  });
  $routeProvider.when('/investment-return-calculator', {
    templateUrl: '../app/components/tools/futureValueCalculator/futureValueCalculatorView.html',
    controller: 'FutureValueCalculatorController',
    controllerAs: 'fv',
  });
  $routeProvider.when('/blogs', {
    templateUrl: '../app/components/blog/blogView.html',
    controller: 'BlogController',
    controllerAs: 'blog',
  });
  $routeProvider.when('/blogs/:blogTitle', {
    templateUrl: '../app/components/blog/blogView.html',
    controller: 'BlogController',
    controllerAs: 'blog',
  });
  $routeProvider.when('/admin', {
    templateUrl: '../app/components/admin/adminView.html',
    controller: 'AdminController',
    controllerAs: 'admin',
  });
  $routeProvider.when('/contact', {
    templateUrl: '../app/components/contact/contact.html',
  });

   // use the HTML5 History API
   $locationProvider.html5Mode(true);

});