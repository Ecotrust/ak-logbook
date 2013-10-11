'use strict';

// Assume global app variable
// running behind grunt, this file is static for testing purposes only
// see the django template in formhub by the same name for the dynamic version
// that is served behind nginx
app.run(function($rootScope){
    $rootScope.userId = 'rhodges';
    // $rootScope.userId = '';
    $rootScope.formId = 'FRP53_survey4';
    $rootScope.baseUrl = 'http://formhub.aklogbook.ecotrust.org'; // no trailing slash
});