'use strict';

var App = angular.module('App', ['ngRoute', 'ngSanitize', 'ui.tinymce', 'vcRecaptcha', 'ngAnimate']);

//Single Page Application Routing Set Up
//The controller as is added because it gives the ability 
//to call the controller instead of calling $parent
App.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '../app/components/about/aboutView.html',
    controller: 'AboutController',
    controllerAs: 'about',
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
  $routeProvider.when('/blog', {
    templateUrl: '../app/components/blog/blogView.html',
    controller: 'BlogController',
    controllerAs: 'blog',
  });
  $routeProvider.when('/blog/:blogTitle', {
    templateUrl: '../app/components/blog/blogView.html',
    controller: 'BlogController',
    controllerAs: 'blog',
  });
  $routeProvider.when('/admin', {
    templateUrl: '../app/components/admin/adminView.html',
    controller: 'AdminController',
    controllerAs: 'admin',
  });
  $routeProvider.when('/videos', {
    templateUrl: '../app/components/videos/videos.html',
  });
  $routeProvider.when('/contact', {
    templateUrl: '../app/components/contact/contact.html',
  });

});