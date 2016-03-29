'use strict';

var App = angular.module('App', ['ngRoute', 'ngMaterial']);

//Single Page Application Routing Set Up
App.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '../reic/views/analyzeadeal.html',
  });
  //this needs to be switched back to analyzeadeal
  $routeProvider.when('/howitworks', {
    templateUrl: '../reic/views/howitworks.html',
  });
  $routeProvider.when('/contact', {
    templateUrl: '../reic/views/contact.html',
  });
});

//Set the color theme for ng material (radio buttons)
//Note: it came with pink and blue only and I wanted black
App.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('grey');
});