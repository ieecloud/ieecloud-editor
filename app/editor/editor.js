'use strict';

angular.module('ieecloud-editor.editor', ['ieecloud-editor.viewer.viewer-directive', 'ui.router'])

.config(['$stateProvider', function($stateProvider) {
   $stateProvider.state( 'editor', {
      url: '/editor/wsoUuid/:wsoUuid/wsoVersion/:wsoVersion/pad/:pad',
      views: {
        "main": {
          controller: 'EditorCtrl',
          templateUrl: 'editor/editor.tpl.html'
        }
      },
      params: {wsoUuid: null, wsoVersion: null, pad:null},
      data:{ pageTitle: 'Editor' }
    });
}])

.controller('EditorCtrl', ['$scope', '$http', '$rootScope', '$stateParams',  function($scope, $http, $rootScope, $stateParams) {
     console.log($stateParams)


     $scope.selCmdId = 0;
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

    $scope.$on('renderCommands', function (event, data) {
        console.log("rendering commands");
        console.log(data);
        $scope.commands = JSON.parse(data);
        $scope.$apply();
    });

    $scope.runCmd = function(cmd){
       $scope.selCmdId = cmd.id;
       $rootScope.$broadcast('editor.cmd', cmd);
    };

    $http.get('/../../resources/drawing_cmd.json.json').success(function(data) {
        $scope.commands = data;
    });

   $scope.treeData = [{
          'id': 1,
          'title': 'node1',
          'nodes': [
            {
              'id': 11,
              'title': 'node1.1',
              'nodes': [
                {
                  'id': 111,
                  'title': 'node1.1.1',
                  'nodes': []
                }
              ]
            },
            {
              'id': 12,
              'title': 'node1.2',
              'nodes': []
            }
          ]
        }, {
          'id': 2,
          'title': 'node2',
          'nodrop': true, // An arbitrary property to check in custom template for nodrop-enabled
          'nodes': [
            {
              'id': 21,
              'title': 'node2.1',
              'nodes': []
            },
            {
              'id': 22,
              'title': 'node2.2',
              'nodes': []
            }
          ]
        }, {
          'id': 3,
          'title': 'node3',
          'nodes': [
            {
              'id': 31,
              'title': 'node3.1',
              'nodes': []
            }
          ]
      }];


      $scope.remove = function (scope) {
        scope.remove();
      };

      $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
          id: nodeData.id * 10 + nodeData.nodes.length,
          title: nodeData.title + '.' + (nodeData.nodes.length + 1),
          nodes: []
        });
      };

      $scope.visible = function (item) {
        return !($scope.query && $scope.query.length > 0
        && item.title.indexOf($scope.query) == -1);

      };

      $scope.findNodes = function () {

      };

}]);