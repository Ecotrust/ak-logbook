angular.module('angularjsGruntExampleApp').controller('SurveyModalCtrl', function ($scope, $modal, $log) {

  $scope.open = function () {

    var surveyModalInstance = $modal.open({
      templateUrl: 'surveyModalContent.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

  };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('angularjsGruntExampleApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.close = function () {
    $modalInstance.dismiss();
  };

});