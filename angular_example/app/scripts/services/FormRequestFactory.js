'use strict';

app.factory('FormRequestFactory', function ($resource, $rootScope) {

  //We must take extra steps to retain port numbers due to this issue: https://github.com/angular/angular.js/issues/1243
  //    This is fixed (supposedly) in newer versions of Angular, but not the one we're using.

  var base = $rootScope.baseUrl;
  var baseLen = base.split(':').length

  if (baseLen > 0 && !isNaN(base.split(':')[baseLen-1])) {
    base = base.split(':').slice(0, baseLen-1).join(':') + '\\:' + base.split(':')[baseLen-1];
  }

  var apiUrl = base + '/:userId/forms/:formId/form.json';

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
