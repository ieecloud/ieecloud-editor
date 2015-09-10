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

.controller('EditorCtrl', ['$scope', '$http', '$rootScope', '$stateParams', '$log',  function($scope, $http, $rootScope, $stateParams, $log) {
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

      var traverseTree = function (node, callback) {
         callback(node);
        _.map(node.children, function (child) {
              traverseTree(child, callback);
         });
      };


      var removeNode = function (node) {
        _.remove($scope.selectedNodes, function(n) {
             return n.uniqueId === node.uniqueId;
        });
      };

//      TODO refactor
      $scope.selectNode = function (node, scope) {

         $log.info("You selected: " , node);

         if(_.includes($scope.selectedNodes, node)){
            removeNode(node);
            traverseTree(node, function (child) {
               if(child.children && child.children.length === 0){
                  removeNode(child);
               }
             });

              if(node.children && node.children.length === 0){
                  var parentName = node.parentName;
                  var tree = {children: $scope.treeData};
                  var parentNode;
                  traverseTree(tree, function (child) {
                     if(child.children && child.children.length > 0 && child.name === parentName){
                         parentNode = child;
                     }
                  });

                  if( _.includes($scope.selectedNodes, parentNode)){
                      removeNode(parentNode);
                      $rootScope.$broadcast('unSelectObject', {node:parentNode});
                  }

                  traverseTree(parentNode, function (child) {
                       if( _.includes($scope.selectedNodes, child)){
                           $rootScope.$broadcast('selectObject', {node:child});
                       }
                 });
              }

             $rootScope.$broadcast('unSelectObject', {node:node});
             return;
         }

         $scope.selectedNodes.push(node);
         //leaf
         if(node.children && node.children.length === 0){
             var parentName = node.parentName;
             var tree = {children: $scope.treeData};
             var parentNode;
             traverseTree(tree, function (child) {
                if(child.children && child.children.length > 0 && child.name === parentName){
                    parentNode = child;
                }
             });
             var include = true;
             traverseTree(parentNode, function (child) {
                   if(child.children && child.children.length === 0){
                       var includeOld = include;
                       include =  _.includes($scope.selectedNodes, child) && includeOld;
                   }
             });

             if(include){
                $scope.selectedNodes.push(parentNode);
                $rootScope.$broadcast('selectObject', {node:parentNode});
                return;
             }
         }


         traverseTree(node, function (child) {
           if(child.children && child.children.length === 0){
              $scope.selectedNodes.push(child);
           }
         });
         $rootScope.$broadcast('selectObject', {node:node});

      };

      $scope.isInclude = function (node){
         return _.includes($scope.selectedNodes, node);
      };


      $scope.onSelectNode = function(node){
           $scope.selectedNodes.push(node);
      }


      var init = function(){
          $scope.selectedNodes = []
      };

      init();

}]);