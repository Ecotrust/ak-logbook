'use strict';

//angular.module('angularjsGruntExampleApp')
app.controller('MainCtrl', function ($scope, TestFactory) {

  $scope.observations = TestFactory.query();

  $scope.filterObs = function() {
      $scope.observations.pop();
  };

  $scope.uniqueStuff = function(field) {
        var u = {}, a = [], ob;
        for(var i = 0, l = $scope.observations.length; i < l; ++i){
          ob = $scope.observations[i][field];
          if(!u.hasOwnProperty(ob)) {
            a.push(ob);
            u[ob] = 1;
          }
        }
        return a;
      };
});
