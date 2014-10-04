'use strict';

var app = angular.module('angularjsGruntExampleApp',
  [
    'ngResource',
    'leaflet-directive',
    'ngRoute',
    'ui.bootstrap'
  ]
);

var checkLoggedin = function($location, $rootScope){ 
    //TODO: later tie this to an actual check for auth
    if (!$rootScope.userId || $rootScope.userId == ''){
        $rootScope.message = 'You need to log in.'; 
        $location.url('/login'); 
    } 
};

app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/permits/:permitId', {
        templateUrl: 'views/permits.html',
        controller: 'PermitsCtrl'
      })
      .when('/permits', {
        templateUrl: 'views/permits.html',
        controller: 'PermitsCtrl'
      })
      .when('/yukon_water/:siteId', {
        templateUrl: 'views/yukon_water.html',
        controller: 'YukonWaterCtrl'
      })
      .when('/yukon_water', {
        templateUrl: 'views/yukon_water.html',
        controller: 'YukonWaterCtrl'
      })
      .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'helpCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

app.run(function($rootScope){
  if (!$rootScope.baseUrl) {
    $rootScope.baseUrl = 'http://localhost';
  }

  $(document).ready(function(){
    // $('.carousel').carousel();
  });
});
