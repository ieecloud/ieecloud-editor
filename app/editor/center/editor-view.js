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

     $scope.showTree = function () {
       var $wrapper = $("#wrapper");
       $wrapper.removeClass("toggled");
       $wrapper.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
        function() {
           $rootScope.$broadcast('resizeViewer');
        });
     };

     $scope.setMode = function (modeKey) {
       $rootScope.$broadcast('setMode', modeKey);
     };

     $scope.editMode = function () {
         $rootScope.readOnly = false;
         $rootScope.$broadcast('editMode', 'true');
     };

     $scope.saveModel = function () {
         $rootScope.$broadcast('editor.cmd.exec', 'd.save()');
     };

      $scope.meshModel = function () {
          $rootScope.$broadcast('editor.cmd.exec', 'd.setMeshSize(0.5)');
          $rootScope.$broadcast('editor.cmd.exec', 'd.mesh()');
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
         if($scope.queue.length > 0 && node.parentName){
           $scope.queue.shift().resolve();
           $rootScope.$broadcast('editor.cmd.update', {cmdType: $scope.cmdType, point:node.parentName, paramsLength : $scope.cmd.action.params.length});
         }
      };

       // fires when user select point by ruler
      $scope.pointSelected = function(point){
          if($scope.queue.length > 0){
             $scope.queue.shift().resolve();
             $rootScope.$broadcast('editor.cmd.update', {cmdType: $scope.cmdType, point:point, paramsLength : $scope.cmd.action.params.length});
          }
      };
       // fires when user select tree node
      $scope.$on('selectObject', function (event, args) {
           if($scope.queue.length > 0 && args.node.children.length > 0){
             $scope.queue.shift().resolve();
             $rootScope.$broadcast('editor.cmd.update', {cmdType: $scope.cmdType, point:args.node.name, paramsLength : $scope.cmd.action.params.length});
          }
       });

       var processCoordinate = function(param){
           var deferred = $q.defer();

           $scope.cmdType = _.find($scope.paramTypes, { 'id': param});
            var possibleTools = $scope.cmdType.tools;
            $scope.setMode($scope.cmdType.mode);

            if(_.includes(possibleTools, "ruler")){
                $scope.addRuler();
            }

            if(_.includes(possibleTools, "tree")){
                 $scope.showTree();
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

           if(_.includes(possibleTools, "dialog_element")){
               var modalInstance = $uibModal.open({
                   animation: true,
                   templateUrl: 'elementsModalContent.html',
                   controller: 'ModalElementInstanceCtrl'
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
              $rootScope.$broadcast('editor.cmd.run');
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

           //TODO set base url instead of hardcoded value
           var urlModel = 'http://10.66.12.186:9000' + '/data/wso_display/'+$stateParams.wsoUuid+'/'+$stateParams.wsoVersion+'/'+$stateParams.pad+'.json';
           $http.get(urlModel).success(function(data) {
               $scope.model = data;
           });
       };

       init();

}])

.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.doubleValue  = "";
  $scope.ok = function () {
    $modalInstance.close($scope.doubleValue);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})

.controller('ModalElementInstanceCtrl', function ($scope, $modalInstance) {

    $scope.strValue  = "";

    $scope.todos = [
        {text:'learn angular', done:true},
        {text:'build an angular app', done:false}];

    $scope.data = [
        {
            "id": 1,
            "title": "node1",
            "nodes": [
                {
                    "id": 11,
                    "title": "node1.1",
                    "nodes": [
                        {
                            "id": 111,
                            "title": "node1.1.1",
                            "nodes": []
                        }
                    ]
                },
                {
                    "id": 12,
                    "title": "node1.2",
                    "nodes": []
                }
            ]
        },
        {
            "id": 2,
            "title": "node2",
            "nodrop": true,
            "nodes": [
                {
                    "id": 21,
                    "title": "node2.1",
                    "nodes": []
                },
                {
                    "id": 22,
                    "title": "node2.2",
                    "nodes": []
                }
            ]
        },
        {
            "id": 3,
            "title": "node3",
            "nodes": [
                {
                    "id": 31,
                    "title": "node3.1",
                    "nodes": []
                }
            ]
        }
    ];

    $scope.ok = function () {
        $modalInstance.close($scope.strValue);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});