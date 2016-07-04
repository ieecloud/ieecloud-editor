'use strict';

angular.module('ieecloud-editor.editor.tree', ['ui.router'])

    .controller('TreeViewCtrl', ['$scope', '$http', '$rootScope', '$log', 'IE_EVENTS', function ($scope, $http, $rootScope, $log, IE_EVENTS) {

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
        }

        $scope.visible = function (item) {

            return findChildren(item, $scope.query || '', function (node, text) {
                return !(text && text.length > 0 && node.name.toLowerCase().indexOf(text.toLowerCase()) === -1);
            });
        };

        var traverseTree = function (node, callback) {
            callback(node);
            _.map(node.children, function (child) {
                traverseTree(child, callback);
            });
        };


        var removeNodeFromSelection = function (node) {
            _.remove($scope.selectedNodes, function (n) {
                return n.uniqueId === node.uniqueId;
            });
        };

        var getParentNode = function (node) {
            var parentName = node.parentName;
            var tree = {children: $scope.treeData};
            var parentNode;
            traverseTree(tree, function (child) {
                if (child.children && child.children.length > 0 && child.name === parentName) {
                    parentNode = child;
                }
            });
            return parentNode;
        };

        var isAllParentChildSelected = function (parentNode) {
            var include = true;
            traverseTree(parentNode, function (child) {
                if (child.children && child.children.length === 0) {
                    var includeOld = include;
                    include = _.includes($scope.selectedNodes, child) && includeOld;
                }
            });
            return include;
        };

        $scope.selectNode = function (node) {
            if (_.includes($scope.selectedNodes, node)) {
                removeNodeFromSelection(node);
                traverseTree(node, function (child) {
                    if (child.children && child.children.length === 0) {
                        removeNodeFromSelection(child);
                    }
                });

                if (node.children && node.children.length === 0) {
                    var parentNode = getParentNode(node);

                    if (_.includes($scope.selectedNodes, parentNode)) {
                        removeNodeFromSelection(parentNode);
                        $scope.viewerControl.unSelectObject({node: parentNode});
                    }

                    traverseTree(parentNode, function (child) {
                        if (_.includes($scope.selectedNodes, child)) {
                            //$rootScope.$broadcast('selectObject', {node: child});
                            $scope.viewerControl.selectObject({node: child});
                            $scope.consoleControl.setCmdParams({
                                cmdType: $scope.cmdType,
                                point: child.parentName
                            });
                        }
                    });
                }

                $scope.viewerControl.unSelectObject({node: node});
                return;
            }

            $scope.selectedNodes.push(node);
            //leaf
            if (node.children && node.children.length === 0) {
                parentNode = getParentNode(node);
                if (isAllParentChildSelected(parentNode)) {
                    $scope.selectedNodes.push(parentNode);
                    $scope.viewerControl.selectObject({node: parentNode});
                    $scope.consoleControl.setCmdParams({
                        cmdType: $scope.cmdType,
                        point: parentNode.name
                    });
                    return;
                }
            }

            traverseTree(node, function (child) {
                if (child.children && child.children.length === 0) {
                    $scope.selectedNodes.push(child);
                }
            });
            $scope.viewerControl.selectObject({node: node});
            $scope.consoleControl.setCmdParams({
                cmdType: $scope.cmdType,
                point: node.parentName || node.name
            });

        };

        $scope.isInclude = function (node) {
            return _.includes($scope.selectedNodes, node);
        };

        // fires when user select in viewer
        $scope.onSelectNode = function (node, select) {
            if (!select) {
                removeNodeFromSelection(node);
                traverseTree(node, function (child) {
                    if (child.children && child.children.length === 0) {
                        removeNodeFromSelection(child);
                    }
                });
                if (node.children && node.children.length === 0) {
                    var parentNode = getParentNode(node);
                    if (_.includes($scope.selectedNodes, parentNode)) {
                        removeNodeFromSelection(parentNode);
                    }
                }
                $scope.$apply();
                return;
            }

            traverseTree(node, function (child) {
                if (child.children && child.children.length === 0) {
                    $scope.selectedNodes.push(child);
                }
            });

            if (node.children && node.children.length === 0) {
                   parentNode = getParentNode(node);
                if (isAllParentChildSelected(parentNode)) {
                    $scope.selectedNodes.push(parentNode);
                    $scope.$apply();
                    return;
                }
            }
            $scope.$apply();
        };


        var init = function () {
            var treeLoadListener = $scope.$on(IE_EVENTS.ON_TREE_LOAD, function (event, data) {
                $scope.treeData = data.children;
            });

            var selectNodeListener =  $scope.$on(IE_EVENTS.ON_SELECT_NODE, function (event, data) {
                $scope.onSelectNode(data.node, data.select);
            });

            $scope.$on("$destroy", function () {
                treeLoadListener();
                selectNodeListener();
            });

        };

        init();
    }]);