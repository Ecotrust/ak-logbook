'use strict';

app.controller('PermitdetailCtrl', function ($scope, TestFactory, $routeParams) {

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
  $scope.observations = TestFactory.awesomeStuff.query(
    {'query': '{"obs_nm": "' + permitId + '"}'},
    function(res) {
        for (var i = res.length - 1; i >= 0; i--) {
            var point = res[i];
            var lat = parseFloat(point._geolocation[0]);
            var lng = parseFloat(point._geolocation[1]);
            if (lat && lng) {
                $scope.markers[point._id] = {
                    lat: lat,
                    lng: lng,
                    message: point.obs_nm + "<br>" + point.today,
                    focus: false,
                    draggable: false
                };
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
    options: {
        opacity: 0.9,
        attribution: "Sources: National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
        detectRetina: true,
        reuseTiles: true,
    }
  };

  });
