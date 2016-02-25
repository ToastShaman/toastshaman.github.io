"use strict";

(function () {

  var application = angular.module('toastshaman', [
    'ngRoute',
    'angular-loading-bar',
    'gist'
  ]);

  application.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'welcome.html',
        controller: 'WelcomeController',
        controllerAs: 'welcome'
      })
      .when('/ngeurope-2014', {
        templateUrl: 'ngeurope-2014.html',
        controller: 'WelcomeController',
        controllerAs: 'welcome'
      })
      .otherwise({ redirectTo: '/' });
  });

  application.controller('WelcomeController', function ($location) {
    this.goto = function(page) {
      $location.path(page);
    }
  });
  
})();
