'use strict';

app.controller('YukonWaterCtrl', function ($scope, YukonWaterRequestFactory, YukonWaterFormRequestFactory, $routeParams, $http, $rootScope) {

  $scope.form_name = 'Logbook_wqm';
  $rootScope.formId = 'Logbook_wqm';
  $scope.sites = YukonWaterRequestFactory.query();

  $scope.siteInfo = function(field) {
    var site_ids = {}, sites = [], site;
    for(var i = 0, l = $scope.sites.length; i < l; ++i){
      site = $scope.sites[i][field];
      if(!site_ids.hasOwnProperty(site)) {
        sites.push(site);
        site_ids[site] = 1;
      }
    }
    return sites;
  };

  var siteId = ($routeParams.siteId || $scope.sites[0]);
  $scope.siteId = siteId;
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
    if (point.hasOwnProperty('general/wtr_bdy')) {
      bubble_str = bubble_str + point["general/wtr_bdy"] + "<br/>";
    }
    if (point.hasOwnProperty('general/date')) {
      bubble_str = bubble_str + point["general/date"];
      if (point.hasOwnProperty('general/st_time')) {
        bubble_str = bubble_str + ' ' + point["general/st_time"];
      }
      bubble_str = bubble_str + "<br/>";
    }
    if (point.hasOwnProperty('general/tech_name') ||
      point.hasOwnProperty('field/ph') ||
      point.hasOwnProperty('field/dssvld_o_perc') ||
      point.hasOwnProperty('field/dssvld_o') ||
      point.hasOwnProperty('field/conduct') ||
      point.hasOwnProperty('field/air_temp') ||
      point.hasOwnProperty('field/wtr_temp')
      ) {
      var table_exists = true;
      bubble_str = bubble_str + "<table>";
    } else {
      var table_exists = false;
    }
    if (point.hasOwnProperty('general/tech_name')) {
      bubble_str = bubble_str + "<tr><td><b>Technicians</b>:</td><td>" + point["general/tech_name"] + "</td></tr>";
    }
    if (point.hasOwnProperty('field/ph')) {
      bubble_str = bubble_str + "<tr><td><b>pH</b>:</td><td>" + point["field/ph"] + "</td></tr>";
    }
    if (point.hasOwnProperty('field/dssvld_o_perc') || point.hasOwnProperty('field/dssvld_o')) {
      bubble_str = bubble_str + "<tr><td><b>Dissolved <br/>0<sub>2</sub></b>:</td><td>";
      if (point.hasOwnProperty('field/dssvld_o_perc')) {
        bubble_str = bubble_str + point["field/dssvld_o_perc"] + "%";
        if (point.hasOwnProperty('field/dssvld_o')) {
          bubble_str = bubble_str + " / ";
        }
      }  
      if (point.hasOwnProperty('field/dssvld_o')) {
        bubble_str = bubble_str + point["field/dssvld_o"] + "mg/L<br/>";
      } 
      bubble_str = bubble_str + "</td></tr>";
    }
    if (point.hasOwnProperty('field/conduct')) {
      bubble_str = bubble_str + '<tr><td><b>Conductivity</b>:</td><td>' + point["field/conduct"] + "</td></tr>";
    }
    if (point.hasOwnProperty('field/air_temp')) {
      bubble_str = bubble_str + "<tr><td><b>Air Temp</b>:</td><td>" + point["field/air_temp"] + "</td></tr>";
    }
    if (point.hasOwnProperty('field/wtr_temp')) {
      bubble_str = bubble_str + "<tr><td><b>Water Temp</b>:</td><td>" +  point["field/wtr_temp"] + "</td></tr>";
    }
    if (table_exists) {
      bubble_str = bubble_str + "</table>"
    }
    return bubble_str;
  }

  $scope.observations = YukonWaterRequestFactory.query(
    {'query': '{"general/site_id": "' + siteId + '"}'},
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

  $scope.sites = YukonWaterRequestFactory.query(
    {},
    function(response) {
      $scope.site_attrs = {};
      $scope.site_attr_list = [];
      for (var i = 0; i < response.length; i++) {
        if (response[i]['general/site_id'] == siteId) {
          $scope.site_attrs = response[i];
          for (var key in $scope.site_attrs) {
            if ($scope.site_attrs.hasOwnProperty(key)){
              $scope.site_attr_list.push([key, $scope.site_attrs[key]]);
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

  $scope.yukonExport = {};
  $scope.yukonCustomSubmit = function(){
      var data = $scope.yukonExport;
      data.site = $scope.siteId;

      var serializedParams = '';
      for (var key in data) {
        if (serializedParams !== '') {
          serializedParams += '&';
        }
        serializedParams += key + '=' + data[key];
      }
      var url = $rootScope.baseUrl + '/' + $rootScope.userId + '/forms/' + $rootScope.formId + '/yukon.xls?' + serializedParams;
      window.location.href = url;
  };

  $scope.observation_label = function(object) {
    return object['site/date'] + " - " + object['site/site_name'] + " - " + object['site/loc_city'] + ", " + ['site/loc_state']
  }

  $(document).on('click mouseover', '[rel="tooltip"]', function (e) {
    $(e.target).tooltip('show');
  });

});
