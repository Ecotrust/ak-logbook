'use strict';

var app = angular.module('angularjsGruntExampleApp', ['ngResource']);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/permit/:permitId', {
        templateUrl: 'views/permitDetail.html',
        controller: 'PermitdetailCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
