'use strict';

angular.module('ieecloud-editor.editor.viewer', ['ui.router'])

 .constant('modesConst', [
    {label: '3d point', key: '3d_point'},
    {label: '3d geometry', key: '3d_geometry'},
    {label: 'faces and nodes', key: 'faces_and_nodes'}
  ])

.controller('EditorViewCtrl', ['$scope', '$http', '$rootScope', '$stateParams', '$log',  'modesConst', function($scope, $http, $rootScope, $stateParams, $log, modesConst) {

    $scope.modes = modesConst;

    $scope.loadModel = function () {
        $http.get('/../../resources/testmodel.json').success(function(data) {
             $scope.model = data;
        });
    };

     $scope.setMode = function (modeKey) {
       $rootScope.$broadcast('setMode', modeKey);
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
          $scope.model = data;
          $scope.$apply();
      });

      $scope.onTreeLoad = function(tree){
        $rootScope.$broadcast('onTreeLoad', tree);
      };
       // fires when user select in viewer
      $scope.onSelectNode = function(node, select){
         $rootScope.$broadcast('onSelectNode', {node:node, select:select});
      };

       // fires when user select point by ruler
      $scope.pointSelected = function(point){
          $rootScope.$broadcast('editor.cmd.update', {cmdType: $scope.cmdType, point:point, paramsLength : $scope.cmd.action.params.length});
      };


       $scope.$on('editor.cmd', function (event, cmd) {
          if(cmd){
             $scope.cmd = cmd;
             if(cmd.action.params.length  === 2  && cmd.action.params[1]){
                 $scope.cmdType = _.find($scope.paramTypes, { 'id': cmd.action.params[1].coordinate});
                 var possibleTools = $scope.cmdType.tools;
                 if(_.includes(possibleTools, "3d_point")){
                    $scope.setMode("3d_point")
                 }

                 if(_.includes(possibleTools, "ruler")){
                     $scope.addRuler();
                 }

             }
          }
       });

       var init = function(){
           $http.get('/../../resources/drawing_cmd_param_types.json').success(function(data) {
               $scope.paramTypes = data;
           });
       }

       init();

}]);