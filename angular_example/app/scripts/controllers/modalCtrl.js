angular.module('angularjsGruntExampleApp').controller('ModalCtrl', function ($scope, RequestFactory, $modal, $log, $rootScope) {

  /* Function readify
   * Takes: 1 javascript object "object"
   * Returns: 1 javascript object "readableObject"
   * Purpose: add additional fields to an object so UI can reference the keys, labels, and values.
   */
  $scope.readify = function(object) {
    var readableObject = {id: object._id,
      form_name: object._xform_id_string};

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
  };

  $scope.setFocusObservation = function(modalType) {
    RequestFactory.query(
      {'query': '{"_id": "' + $rootScope.focusObsId + '"}'},
      function(res) {
        $rootScope.focusObservation = $scope.readify(res[0]);
        $scope.open(modalType);
        return true;
      }
    );
  };

  $scope.open = function (modalType) {
    if (modalType == "survey") {
      var surveyModalInstance = $modal.open({
        templateUrl: 'surveyModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    } else if (modalType == "export-frp"){
      var frpModalInstance = $modal.open({
        templateUrl: 'exportFrpModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    } else if (modalType == "export-awc"){
      var frpModalInstance = $modal.open({
        templateUrl: 'exportAwcModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    } else if (modalType == "photo"){
      var photoModalInstance = $modal.open({
        templateUrl: 'photoModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    } else if (modalType == "details"){
      var photoModalInstance = $modal.open({
        templateUrl: 'detailsModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    } else if (modalType == "delete"){
      var photoModalInstance = $modal.open({
        templateUrl: 'deleteModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    } else if (modalType == "export-yukon"){
      var frpModalInstance = $modal.open({
        templateUrl: 'exportYukonModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    }
  };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('angularjsGruntExampleApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, $rootScope) {

  $scope.close = function () {
    $modalInstance.dismiss();
  };

  //Stolen from django docs: https://docs.djangoproject.com/en/dev/ref/contrib/csrf/#ajax
  $scope.getCookie = function (name) {
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

  $scope.csrftoken = $scope.getCookie('csrftoken');

  $scope.deleteData = function(idToDelete, username, surveyname) {
    var deleteAPIUrl = '/' + username + '/forms/' + surveyname + '/delete_data';
    $.post(deleteAPIUrl, {
        'id': idToDelete,
        'csrfmiddlewaretoken': $scope.csrftoken
    })
    .success(function(data){
      window.location.href = '/app/#/permits';
    })
    .error(function(){
       alert("Delete failed.");
    });
    idToDelete = null;
  };

});