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

    $http.get('/../../resources/drawing_cmd.json').success(function(data) {
        $scope.commands = data;
    });

    $scope.onTreeLoad = function(tree){
       $scope.treeData = tree.children;
    };


    $scope.remove = function (scope, $event) {
       $event.stopPropagation();
       scope.remove();
    };

      $scope.newSubItem = function (scope, $event) {
        $event.stopPropagation();
        var nodeData = scope.$modelValue;
        nodeData.children.push({
          id: nodeData.id * 10 + nodeData.children.length,
          name: nodeData.name + '.' + (nodeData.children.length + 1),
          children: []
        });
      };


      function findChildren(node, text, predicate) {
        var found = false;
        if (node.children && node.children.length) {
          var result = _.map(node.children, function (child) {
            return findChildren(child, text, predicate);
          });
          found = _.find(result, Boolean);
        }
        // leaf
        if (node.children && node.children.length == 0 || !node.children) {
          return found || predicate(node, text);
        }
        return found;
      }

      $scope.visible = function (item) {
        return findChildren(item, $scope.query || '', function (node, text) {
          return !(text && text.length > 0 && node.name.toLowerCase().indexOf(text.toLowerCase()) === -1)
        });
      };

      $scope.selectNode = function (node, scope) {

        if (node.children && node.children.length > 0) {
           scope.toggle();
           return;
        }

//        TODO : select in viewer
      };


}]);