'use strict';

app.factory('YukonWaterRequestFactory', function ($resource, $rootScope) {

  //We must take extra steps to retain port numbers due to this issue: https://github.com/angular/angular.js/issues/1243
  //    This is fixed (supposedly) in newer versions of Angular, but not the one we're using.

  var formId = 'Logbook_wqm';
  var base = $rootScope.baseUrl;
  var baseLen = base.split(':').length

  if (baseLen > 1 && !isNaN(base.split(':')[baseLen-1])) {
    base = base.split(':').slice(0, baseLen-1).join(':') + '\\:' + base.split(':')[baseLen-1];
  }

  var apiUrl = base + '/:userId/forms/:formId/api';

  var api = $resource(apiUrl,
    // The $rootScope variables are defined in sessions/auth.js 
    // running behind nginx, this is dynamically served by django
    // running behind grunt, it's static
    {userId: $rootScope.userId, formId: formId},
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
