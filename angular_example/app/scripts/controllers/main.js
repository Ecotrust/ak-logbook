'use strict';

app.controller('MainCtrl', function ($scope, TestFactory) {
  // TODO make a more specific factory to grab unique permits for this user

  $scope.observations = TestFactory.query();

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
