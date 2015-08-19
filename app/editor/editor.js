'use strict';

angular.module('ieecloud-editor.editor', ['ieecloud-editor.viewer.viewer-directive', 'ui.router'])

.config(['$stateProvider', function($stateProvider) {
   $stateProvider.state( 'editor', {
      url: '/editor',
      views: {
        "main": {
          controller: 'EditorCtrl',
          templateUrl: 'editor/editor.tpl.html'
        }
      },
      data:{ pageTitle: 'Editor' }
    });
}])

.controller('EditorCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
     $scope.loadModel = function () {
         $http.get('/../../resources/emptymodel.json').success(function(data) {
                $scope.model = data;
          });
     };

     $scope.editMode = function () {
         $rootScope.$broadcast('editMode', 'true');
     };

    $scope.$on('renderModel', function (event, data) {
        console.log("rendering");
        $scope.model = data;
        $scope.$apply();
    });

}]);