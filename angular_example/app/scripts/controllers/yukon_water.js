'use strict';

app.controller('YukonWaterCtrl', function ($scope, YukonWaterRequestFactory, YukonWaterFormRequestFactory, $routeParams, $http, $rootScope) {

  $scope.form_name = 'Logbook_wqm';
  $rootScope.formId = 'Logbook_wqm';
  $scope.surveys = YukonWaterRequestFactory.query();

  $scope.surveyInfo = function(field) {
    var survey_ids = {}, surveys = [], survey;
    for(var i = 0, l = $scope.surveys.length; i < l; ++i){
      survey = $scope.surveys[i][field];
      if(!survey_ids.hasOwnProperty(survey)) {
        surveys.push(survey);
        survey_ids[survey] = 1;
      }
    }
    return surveys;
  };

  var surveyId = ($routeParams.surveyId || $scope.surveys[0]);
  $scope.surveyId = surveyId;
  $scope.selectObs = function(id) {
    var marker = $scope.markers[id];
    if (marker) {
        $scope.center.lat = marker.lat;
        $scope.center.lng = marker.lng;
        $scope.center.zoom = 8;
    }
  };

  $scope.markerInfo = function(point) {
    var bubble_str = "";
    if (point.hasOwnProperty('_id')) {
      bubble_str = bubble_str + "Observation: " + point["_id"] + "<br/>";
    }
    // if (point.hasOwnProperty('general/obs_nm')) {
    //   bubble_str = bubble_str + point["general/obs_nm"] + "<br/>";
    // }
    // if (point.hasOwnProperty('general/wtr_nm')) {
    //   bubble_str = bubble_str + point["general/wtr_nm"] + "<br/>";
    // }
    // if (point.hasOwnProperty('general/obs_date')) {
    //   bubble_str = bubble_str + point["general/obs_date"];
    // }
    return bubble_str;
  }

  $scope.observations = YukonWaterRequestFactory.query(
    {'query': '{"_submission_time": "' + surveyId + '"}'},
    function(res) {
        for (var i = res.length - 1; i >= 0; i--) {
            var point = res[i];
            var lat, lng;
            if (point["field/gps_loc"] != undefined) {
              lat = parseFloat(point["field/gps_loc"].split(' ')[0]);
              lng = parseFloat(point["field/gps_loc"].split(' ')[1]);
            }
            if (lat != undefined && lng != undefined) {
                $scope.markers[point._id] = {
                    lat: lat,
                    lng: lng,
                    message: $scope.markerInfo(point),
                    focus: false,
                    draggable: false
                };
            }
        }
    }
  );

  $scope.surveys = YukonWaterRequestFactory.query(
    {},
    function(response) {
      $scope.survey_attrs = {};
      $scope.survey_attr_list = [];
      for (var i = 0; i < response.length; i++) {
        if (response[i]['_submission_time'] == surveyId) {
          $scope.survey_attrs = response[i];
          for (var key in $scope.survey_attrs) {
            if ($scope.survey_attrs.hasOwnProperty(key)){
              $scope.survey_attr_list.push([key, $scope.survey_attrs[key]]);
            }
          }
          break;
        }
      }
    }
  );

  $scope.form = YukonWaterFormRequestFactory.query();

  $scope.center = {
    lat: 60.095,
    lng: -153.823,
    zoom: 3
  };
  
  $scope.markers = {};
  
  $scope.tiles = {
    url: "http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    // World_Topo_Map, USA_Topo_Map
    options: {
        opacity: 0.9,
        attribution: "Sources: National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
        detectRetina: true,
        reuseTiles: true,
    }
  };

  // $scope.frpExport = {};
  // $scope.frpSubmit = function(){
  //     var data = $scope.frpExport;
  //     data.survey = $scope.surveyId;

  //     var serializedParams = '';
  //     for (var key in data) {
  //       if (serializedParams !== '') {
  //         serializedParams += '&';
  //       }
  //       serializedParams += key + '=' + data[key];
  //     }
  //     var url = $rootScope.baseUrl + '/' + $rootScope.userId + '/forms/' + $rootScope.formId + '/frp.xls?' + serializedParams;
  //     window.location.href = url;
  // };

  // $scope.awcExport = {};
  // $scope.awcObservations = [];
  // $scope.awcSubmit = function(){
  //     var data = $scope.awcExport;
  //     data.survey = $scope.surveyId;

  //     var serializedParams = '';
  //     for (var key in data) {
  //       if (serializedParams !== '') {
  //         serializedParams += '&';
  //       }
  //       serializedParams += key + '=' + data[key];
  //     }

  //     var obsIds = [];
  //     var obs;
  //     for (var i = $scope.awcObservations.length - 1; i >= 0; i--) {
  //       obs = $scope.awcObservations[i];
  //       obsIds.push(obs._uuid);
  //     }
  //     serializedParams += '&observations=' + obsIds.join(',');

  //     var url = $rootScope.baseUrl + '/' + $rootScope.userId + '/forms/' + $rootScope.formId + '/awc.pdf?' + serializedParams;
  //     window.location.href = url;
  // };

  $scope.imgUrl = "";
  $scope.focusObservation = {};

  /* Function readify
   * Takes: 1 javascript object "object"
   * Returns: 1 javascript object "readableObject"
   * Purpose: add additional fields to an object so UI can reference the keys, labels, and values.
   */
  $scope.readify = function(object) {
    var readableObject = {id: object._id};

    for (var i = 0; i < $scope.form.children.length; i++) {
      var newCategory = {}
      for (var j = 0; j < $scope.form.children[i].children.length; j++) {
        var formKey = $scope.form.children[i].name + '/' + $scope.form.children[i].children[j].name;
        if (object.hasOwnProperty(formKey)) {
          newCategory[$scope.form.children[i].children[j].name] = {
            label: $scope.form.children[i].children[j].label,
            value: object[formKey]
          }
        }
      }
      readableObject[$scope.form.children[i].name] = {
        label: $scope.form.children[i].label,
        value: newCategory
      };
    }
    return readableObject;
  }

  $scope.deleteData = function(idToDelete, username, surveyname) {
    var deleteAPIUrl = '/' + username + '/forms/' + surveyname + '/delete_data';
      $.post(deleteAPIUrl, {
          'id': idToDelete,
          'csrfmiddlewaretoken': $scope.csrftoken
      })
            .success(function(data){
              window.location.href = '/app/#/yukon_water';
            })
            .error(function(){
               alert("Delete failed.");
          });
        idToDelete = null;
  }

  $scope.observation_label = function(object) {
    return object['site/date'] + " - " + object['site/site_name'] + " - " + object['site/loc_city'] + ", " + ['site/loc_state']
  }

  // $scope.getImgUrl = function(observation) {
    // return '/media/' + $rootScope.userId + '/attachments/' + observation['general/pics'];
  // }

  $(document).on('click mouseover', '[rel="tooltip"]', function (e) {
    $(e.target).tooltip('show');
  });

  //Stolen from django docs: https://docs.djangoproject.com/en/dev/ref/contrib/csrf/#ajax
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  $scope.csrftoken = getCookie('csrftoken');

});
