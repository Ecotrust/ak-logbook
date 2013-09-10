'use strict';

describe('Controller: PermitdetailCtrl', function () {

  // load the controller's module
  beforeEach(module('angularjsGruntExampleApp'));

  var PermitdetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PermitdetailCtrl = $controller('PermitdetailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
