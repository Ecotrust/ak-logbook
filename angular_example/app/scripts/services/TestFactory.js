'use strict';

app.factory('TestFactory', function ($resource) {

  //var apiUrl = '/stuff.json';
  var apiUrl = 'http://aklogbook.ecotrust.org/:userId/forms/:formId/api';

  return {
    awesomeStuff : $resource(apiUrl,
      {userId: "demo", formId: "FRP53_survey2"},
      {
        query: {
          method: 'JSONP',
          isArray: true,
          params: {callback: 'JSON_CALLBACK'}
        }
      })
    };

});
