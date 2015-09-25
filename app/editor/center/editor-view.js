'use strict';

angular.module('ieecloud-editor.editor.viewer', ['ui.router'])

.controller('EditorViewCtrl', ['$scope', '$http', '$rootScope', '$stateParams', '$log',  function($scope, $http, $rootScope, $stateParams, $log) {

    $scope.loadModel = function () {
        $http.get('/../../resources/testmodel.json').success(function(data) {
             $scope.model = data;
        });
    };

     $scope.editMode = function () {
         $rootScope.$broadcast('editMode', 'true');
     };

     $scope.addRuler = function () {
         $rootScope.$broadcast('showRuler', 'true');
     };

     $scope.showVProtractor = function () {
         $rootScope.$broadcast('showVProtractor', 'true');
     };

     $scope.showHProtractor = function () {
         $rootScope.$broadcast('showHProtractor', 'true');
     };

      $scope.$on('renderModel', function (event, data) {
           console.log("rendering");
          $scope.model = data;
          $scope.$apply();
      });

      $scope.onTreeLoad = function(tree){
        $rootScope.$broadcast('onTreeLoad', tree);
      };

}]);