'use strict';

var app = angular.module('angularjsGruntExampleApp',
  [
    'ngResource',
    'leaflet-directive'
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
      .when('/permit/:permitId', {
        templateUrl: 'views/permitDetail.html',
        controller: 'PermitdetailCtrl'
      })
      .when('/permits/:permitId', {
        templateUrl: 'views/permits.html',
        controller: 'PermitsCtrl'
      })
      .when('/permits', {
        templateUrl: 'views/permits.html',
        controller: 'PermitsCtrl'
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
    $('.carousel').carousel();
  });
});
