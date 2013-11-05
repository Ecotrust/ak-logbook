'use strict';

app.factory('FormRequestFactory', function ($resource, $rootScope) {
  var apiUrl = $rootScope.baseUrl + '/:userId/forms/:formId/form.json';

  var api = $resource(apiUrl,
    // The $rootScope variables are defined in sessions/auth.js 
    // running behind nginx, this is dynamically served by django
    // running behind grunt, it's static
    {userId: $rootScope.userId, formId: $rootScope.formId},
    {
      query: {
        method: 'JSONP',
        isArray: false,
        params: {callback: 'JSON_CALLBACK'}
      }
    }
  );

  return api;

});
