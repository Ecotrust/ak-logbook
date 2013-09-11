"use strict";var app=angular.module("angularjsGruntExampleApp",["ngResource","leaflet-directive"]);app.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/permit/:permitId",{templateUrl:"views/permitDetail.html",controller:"PermitdetailCtrl"}).otherwise({redirectTo:"/"})}]),app.controller("MainCtrl",["$scope","TestFactory",function(a,b){a.observations=b.awesomeStuff.query(),a.filterObs=function(){a.observations.pop()},a.uniqueStuff=function(b){for(var c,d={},e=[],f=0,g=a.observations.length;g>f;++f)c=a.observations[f][b],d.hasOwnProperty(c)||(e.push(c),d[c]=1);return e}}]),app.factory("TestFactory",["$resource","$rootScope",function(a,b){var c="http://aklogbook.ecotrust.org/:userId/forms/:formId/api";return b.userId&&b.formId?{awesomeStuff:a(c,{userId:b.userId,formId:b.formId},{query:{method:"JSONP",isArray:!0,params:{callback:"JSON_CALLBACK"}}})}:(alert("Not logged in? check /app/sessions/auth.js \n TODO: redirect to login"),void 0)}]),app.controller("PermitdetailCtrl",["$scope","TestFactory","$routeParams",function(a,b,c){var d=c.permitId||"";a.permitId=d,a.selectObs=function(b){var c=a.markers[b];c&&(a.center.lat=c.lat,a.center.lng=c.lng,a.center.zoom=8)},a.observations=b.awesomeStuff.query({query:'{"obs_nm": "'+d+'"}'},function(b){for(var c=b.length-1;c>=0;c--){var d=b[c],e=parseFloat(d._geolocation[0]),f=parseFloat(d._geolocation[1]);e&&f&&(a.markers[d._id]={lat:e,lng:f,message:d.obs_nm+"<br>"+d.today,focus:!1,draggable:!1})}}),a.center={lat:60.095,lng:-153.823,zoom:3},a.markers={},a.tiles={url:"http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",options:{opacity:.9,attribution:"Sources: National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",detectRetina:!0,reuseTiles:!0}}}]);