'use strict';

app.controller('PermitdetailCtrl', function ($scope, TestFactory, $routeParams) {

  var permitId = ($routeParams.permitId || "");
  $scope.permitId = permitId;
  $scope.observations = TestFactory.awesomeStuff.query(
    {'query': '{"obs_nm": "' + permitId + '"}'}
  );

  });
