'use strict';

describe('Service: TestFactory', function () {

  // load the service's module
  beforeEach(module('angularjsGruntExampleApp'));

  // instantiate service
  var TestFactory;
  beforeEach(inject(function (_TestFactory_) {
    TestFactory = _TestFactory_;
  }));

  it('should do something', function () {
    expect(!!TestFactory).toBe(true);
  });

});
