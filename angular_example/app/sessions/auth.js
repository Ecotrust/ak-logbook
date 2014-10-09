'use strict';

// Assume global app variable
// running behind grunt, this file is static for testing purposes only
// see the django template in formhub by the same name for the dynamic version
// that is served behind nginx
app.run(function($rootScope){
  $rootScope.userId = 'demo';
  // $rootScope.formId = '';
  $rootScope.baseUrl = 'http://logbook.ecotrust.org'; // no trailing slash
  //$rootScope.baseUrl = 'http://aklogbook.ecotrust.org'; // no trailing slash
});
// var PORT_NUMBER = ':8080';  