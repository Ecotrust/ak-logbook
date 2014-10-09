'use strict';

app.controller('PermitsCtrl', function ($scope, RequestFactory, FormRequestFactory, $routeParams, $http, $rootScope) {
  $rootScope.formId = 'frp_awc_survey';
  $scope.form_name = $rootScope.formId;
  $scope.permits = RequestFactory.query();

  $scope.permitInfo = function(field) {
    var perm_ids = {}, permits = [], permit;
    for(var i = 0, l = $scope.permits.length; i < l; ++i){
      permit = $scope.permits[i][field];
      if(!perm_ids.hasOwnProperty(permit)) {
        permits.push(permit);
        perm_ids[permit] = 1;
      }
    }
    return permits;
  };

  var permitId = ($routeParams.permitId || $scope.permits[0]);
  $scope.permitId = permitId;
  $scope.selectObs = function(id) {
    $rootScope.focusObsId = id;
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
    if (point.hasOwnProperty('general/obs_nm')) {
      bubble_str = bubble_str + point["general/obs_nm"] + "<br/>";
    }
    if (point.hasOwnProperty('general/wtr_nm')) {
      bubble_str = bubble_str + point["general/wtr_nm"] + "<br/>";
    }
    if (point.hasOwnProperty('general/obs_date')) {
      bubble_str = bubble_str + point["general/obs_date"];
    }
    return bubble_str;
  }

  $scope.observations = RequestFactory.query(
    {'query': '{"general/perm_num": "' + permitId + '"}'},
    function(res) {
        for (var i = res.length - 1; i >= 0; i--) {
            var point = res[i];
            var lat, lng;
            if (point["frp/obs_loc"] != undefined) {
              lat = parseFloat(point["frp/obs_loc"].split(' ')[0]);
              lng = parseFloat(point["frp/obs_loc"].split(' ')[1]);
            } else if (point["frp/obs_lat"] != undefined && point["frp/obs_lon"] != undefined) {
              lat = parseFloat(point["frp/obs_lat"]);
              lng = parseFloat(point["frp/obs_lon"]);
            } else if (point["awc/wtr_st"] != undefined) {
              lat = parseFloat(point["awc/wtr_st"].split(' ')[0]);
              lng = parseFloat(point["awc/wtr_st"].split(' ')[1]);
            } else if (point["awc/wtr_end"] != undefined) {
              lat = parseFloat(point["awc/wtr_end"].split(' ')[0]);
              lng = parseFloat(point["awc/wtr_end"].split(' ')[1]);
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

  $scope.permits = RequestFactory.query(
    {},
    function(response) {
      $scope.permit_attrs = {};
      $scope.permit_attr_list = [];
      for (var i = 0; i < response.length; i++) {
        if (response[i]['general/perm_num'] == permitId) {
          $scope.permit_attrs = response[i];
          for (var key in $scope.permit_attrs) {
            if ($scope.permit_attrs.hasOwnProperty(key)){
              $scope.permit_attr_list.push([key, $scope.permit_attrs[key]]);
            }
          }
          break;
        }
      }
    }
  );

  $scope.form = FormRequestFactory.query();

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

  $scope.frpExport = {};
  $scope.frpSubmit = function(){
      var data = $scope.frpExport;
      data.permit = $scope.permitId;

      var serializedParams = '';
      for (var key in data) {
        if (serializedParams !== '') {
          serializedParams += '&';
        }
        serializedParams += key + '=' + data[key];
      }
      var url = $rootScope.baseUrl + '/' + $rootScope.userId + '/forms/' + $rootScope.formId + '/frp.xls?' + serializedParams;
      window.location.href = url;
  };

  $scope.awcExport = {};
  $scope.awcObservations = [];
  $scope.awcSubmit = function(){
      var data = $scope.awcExport;
      data.permit = $scope.permitId;

      var serializedParams = '';
      for (var key in data) {
        if (serializedParams !== '') {
          serializedParams += '&';
        }
        serializedParams += key + '=' + data[key];
      }

      var obsIds = [];
      var obs;
      for (var i = $scope.awcObservations.length - 1; i >= 0; i--) {
        obs = $scope.awcObservations[i];
        obsIds.push(obs._uuid);
      }
      serializedParams += '&observations=' + obsIds.join(',');

      var url = $rootScope.baseUrl + '/' + $rootScope.userId + '/forms/' + $rootScope.formId + '/awc.pdf?' + serializedParams;
      window.location.href = url;
  };

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

  $scope.observation_label = function(object) {
    return object['general/obs_date'] + " - " + object['general/wtr_nm'] + " - " + object['general/sps_name']
  }

  $(document).on('click mouseover', '[rel="tooltip"]', function (e) {
    $(e.target).tooltip('show');
  });

});
