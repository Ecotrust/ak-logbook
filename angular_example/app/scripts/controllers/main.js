'use strict';

app.controller('MainCtrl', function ($scope, RequestFactory) {
  // TODO make a more specific factory to grab unique permits for this user

  $scope.permits = RequestFactory.query();

  $scope.permitInfo = function(field) {
    var perm_ids = {}, permits = [], permit;
    for(var i = 0, l = $scope.permits.length; i < l; ++i){
      permit = $scope.permits[i][field];
      if(!perm_ids.hasOwnProperty(permit)) {
        permits.push(permit);
        perm_ids[permit] = 1;
      }
    }
    return permits;
  };

  //Display a random carousel image at top of page
  $('.item').removeClass('active').eq(Math.floor((Math.random() * $('.item').length))).addClass("active");

});
