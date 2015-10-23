'use strict';

angular.module('ieecloud-editor.editor.viewer', ['ui.router'])

 .constant('modesConst', [
    {label: '3d point', key: '3d_point'},
    {label: '3d geometry', key: '3d_geometry'},
    {label: 'faces and nodes', key: 'faces_and_nodes'}
  ])

.controller('EditorViewCtrl', ['$scope', '$http', '$rootScope', '$stateParams', '$log',  'modesConst', '$q', '$uibModal',
  function($scope, $http, $rootScope, $stateParams, $log, modesConst, $q, $uibModal) {

    $scope.modes = modesConst;

    $scope.changeModeBtnDisabled = false;

    $scope.loadModel = function () {
        $http.get('/../../resources/testmodel.json').success(function(data) {
             $scope.model = data;
        });
    };

     $scope.toggleTree = function () {
       var $wrapper = $("#wrapper");
       $wrapper.toggleClass("toggled");
       $wrapper.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
        function() {
           $rootScope.$broadcast('resizeViewer');
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
          if($scope.queue.length > 0){
             $scope.queue.shift().resolve();
             $rootScope.$broadcast('editor.cmd.update', {cmdType: $scope.cmdType, point:point, paramsLength : $scope.cmd.action.params.length});
          }
      };


       var processCoordinate = function(param){
           var deferred = $q.defer();

           $scope.cmdType = _.find($scope.paramTypes, { 'id': param});
            var possibleTools = $scope.cmdType.tools;
            if(_.includes(possibleTools, "3d_point")){
               $scope.setMode("3d_point")
            }

            if(_.includes(possibleTools, "ruler")){
                $scope.addRuler();
            }

            if(_.includes(possibleTools, "dialog_double")){
                    var modalInstance = $uibModal.open({
                      animation: true,
                      templateUrl: 'myModalContent.html',
                      controller: 'ModalInstanceCtrl'
                    });

                    modalInstance.result.then(function (doubleValue) {
                       if($scope.queue.length > 0){
                          $scope.queue.shift().resolve();
                          $rootScope.$broadcast('editor.cmd.update', {cmdType: $scope.cmdType, point:doubleValue, paramsLength : $scope.cmd.action.params.length});
                       }
                    }, function () {
                      $log.info('Modal dismissed at: ' + new Date());
                    });
            }

            $scope.queue.push(deferred);
            return deferred.promise;
       }

       var requireCurrentParam = function(){
          if($scope.params.length > 0){
            var promise = processCoordinate($scope.params.shift());
            promise.then(function(){
                requireCurrentParam();
            });

          }else{
              console.log("DISPATCH RUN");
//              $rootScope.$broadcast('editor.cmd.run');
              $scope.changeModeBtnDisabled = false;
          }
       }


       $scope.$on('editor.cmd', function (event, cmd) {
          if(cmd){
             $scope.cmd = cmd;
             $scope.params = angular.copy(cmd.action.params);
             $scope.changeModeBtnDisabled = true;
             requireCurrentParam();
          }
       });

       var init = function(){
           $http.get('/../../resources/drawing_cmd_param_types.json').success(function(data) {
               $scope.paramTypes = data;
           });

            $scope.queue = [];
       }

       init();

}])

.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.doubleValue  = ""
  $scope.ok = function () {
    $modalInstance.close($scope.doubleValue);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});