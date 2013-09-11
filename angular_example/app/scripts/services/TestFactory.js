'use strict';

app.factory('TestFactory', function ($resource, $rootScope) {
  var apiUrl = $rootScope.baseUrl + '/:userId/forms/:formId/api';

  if (!$rootScope.userId || !$rootScope.formId) {
    return;
  }

  var api = $resource(apiUrl,
    // The $rootScope variables are defined in sessions/auth.js 
    // running behind nginx, this is dynamically served by django
    // running behind grunt, it's static
    {userId: $rootScope.userId, formId: $rootScope.formId},
    {
      query: {
        method: 'JSONP',
        isArray: true,
        params: {callback: 'JSON_CALLBACK'}
      }
    }
  );

  return api;

});
