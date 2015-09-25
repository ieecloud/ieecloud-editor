'use strict';

angular.module('ieecloud-editor.editor.tree', ['ui.router'])

.controller('TreeViewCtrl', ['$scope', '$http', '$rootScope', '$stateParams', '$log',  function($scope, $http, $rootScope, $stateParams, $log) {

       $scope.$on('onTreeLoad', function (event, data) {
           $scope.treeData = data.children;
       });


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
           if (node.children && node.children.length > 0) {
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
         };

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


         var removeNodeFromSelection = function (node) {
           _.remove($scope.selectedNodes, function(n) {
                return n.uniqueId === node.uniqueId;
           });
         };

         var getParentNode = function (node) {
              var parentName = node.parentName;
              var tree = {children: $scope.treeData};
              var parentNode;
              traverseTree(tree, function (child) {
                 if(child.children && child.children.length > 0 && child.name === parentName){
                     parentNode = child;
                 }
              });
              return parentNode;
         };

         var isAllParentChildSelected = function (parentNode) {
             var include = true;
             traverseTree(parentNode, function (child) {
                   if(child.children && child.children.length === 0){
                       var includeOld = include;
                       include =  _.includes($scope.selectedNodes, child) && includeOld;
                   }
             });
             return include;
         };

   //      TODO refactor
         $scope.selectNode = function (node) {

            $log.info("You selected: " , node);

            if(_.includes($scope.selectedNodes, node)){
               removeNodeFromSelection(node);
               traverseTree(node, function (child) {
                  if(child.children && child.children.length === 0){
                     removeNodeFromSelection(child);
                  }
                });

                 if(node.children && node.children.length === 0){
                     var parentNode = getParentNode(node);

                     if( _.includes($scope.selectedNodes, parentNode)){
                         removeNodeFromSelection(parentNode);
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
                var parentNode = getParentNode(node);
                if(isAllParentChildSelected(parentNode)){
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


          $scope.$on('onSelectNode', function (event, data) {
             $scope.onSelectNode(data.node, data.select);
          });

         // fires when user select in viewer
         $scope.onSelectNode = function(node, select){
             if(!select){
                removeNodeFromSelection(node);
                traverseTree(node, function (child) {
                   if(child.children && child.children.length === 0){
                      removeNodeFromSelection(child);
                   }
                 });
                 if(node.children && node.children.length === 0){
                   var parentNode = getParentNode(node);
                   if( _.includes($scope.selectedNodes, parentNode)){
                       removeNodeFromSelection(parentNode);
                   }
                 }
                $scope.$apply();
                return;
             }

              traverseTree(node, function (child) {
                if(child.children && child.children.length === 0){
                  $scope.selectedNodes.push(child);
                }
              });

              if(node.children && node.children.length === 0){
                   var parentNode = getParentNode(node);
                   if(isAllParentChildSelected(parentNode)){
                     $scope.selectedNodes.push(parentNode);
                     $scope.$apply();
                     return;
                   }
              }
              $scope.$apply();
         }


         var init = function(){
             $scope.selectedNodes = []
         };

    init();
}]);