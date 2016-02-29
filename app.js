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
        templateUrl: 'templates/welcome.html',
        controller: 'WelcomeController',
        controllerAs: 'welcome'
      })
      .when('/aggregator-with-hazelcast', {
        templateUrl: 'templates/posts/2015/aggregator-with-hazelcast.html',
        controller: 'WelcomeController',
        controllerAs: 'welcome'
      })
      .when('/ngeurope-2014', {
        templateUrl: 'templates/posts/2014/ngeurope-2014.html',
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
