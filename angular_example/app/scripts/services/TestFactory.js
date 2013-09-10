'use strict';

app.factory('TestFactory', function ($resource) {

  //var apiUrl = '/stuff.json';
  var apiUrl = 'http://aklogbook.ecotrust.org/demo/forms/FRP53_survey2/api';

  return {
    awesomeStuff : $resource(apiUrl,
      {},
      {
        get: {method: 'GET', isArray: true},
        //query: {method: 'GET', isArray: true},
        query: {
          method: 'JSONP',
          isArray: true,
          params: {callback: 'JSON_CALLBACK'}
        },
        create: {method: 'POST'}
      })
    };

});
