'use strict';

// Assume global app variable
// running behind grunt, this file is static for testing purposes only
// see the django template in formhub by the same name for the dynamic version
// that is served behind nginx
app.run(function($rootScope){
    $rootScope.userId = 'demo';
    // $rootScope.userId = '';
    $rootScope.formId = 'frp_awc_survey';
    $rootScope.baseUrl = 'http://localhost'; // no trailing slash
});
