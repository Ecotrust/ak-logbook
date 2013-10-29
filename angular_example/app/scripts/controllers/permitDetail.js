'use strict';

app.controller('PermitdetailCtrl', function ($scope, RequestFactory, $routeParams, $http, $rootScope) {

  var permitId = ($routeParams.permitId || "");
  $scope.permitId = permitId;
  $scope.selectObs = function(id) {
    var marker = $scope.markers[id];
    if (marker) {
        $scope.center.lat = marker.lat;
        $scope.center.lng = marker.lng;
        $scope.center.zoom = 8;
    }
  };
  $scope.observations = RequestFactory.query(
    {'query': '{"general/perm_num": "' + permitId + '"}'},
    function(res) {
        for (var i = res.length - 1; i >= 0; i--) {
            var point = res[i];
            var lat = parseFloat(point._geolocation[0]);
            var lng = parseFloat(point._geolocation[1]);
            if (lat && lng) {
                $scope.markers[point._id] = {
                    lat: lat,
                    lng: lng,
                    message: point["general/perm_num"] + "<br>" + point["general/obs_date"],
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
          // var obj = response[i];
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
      var url = $rootScope.baseUrl + '/' + $rootScope.userId + '/forms/' + $rootScope.formId + '/awc.pdf?' + serializedParams;
      window.location.href = url;
  };

});
