'use strict';

angular.module('ieecloud-editor.editor.viewer', ['ui.router'])

    .constant('modesConst', [
        {label: '3d point', key: '3d_point'},
        {label: '3d geometry', key: '3d_geometry'},
        {label: 'faces and nodes', key: 'faces_and_nodes'}
    ])

    .controller('EditorViewCtrl', ['$scope', '$rootScope', '$log', 'modesConst',  'cmdParamTypes', 'model', 'actionsRetryQueue','commonExecutor', 'IE_EVENTS',
        function ($scope, $rootScope, $log, modesConst, cmdParamTypes, model, actionsRetryQueue, commonExecutor, IE_EVENTS) {

            var init = function () {
                $scope.paramTypes = cmdParamTypes;
                $scope.modes = modesConst;
                $scope.changeModeBtnDisabled = false;
                $scope.model = model;
                //watch change cmd
                $scope.$watch('currentCmd', function (newCmd, oldCmd) {
                    if (oldCmd !== newCmd) {
                        $scope.params = angular.copy(newCmd.action.params);
                        $scope.changeModeBtnDisabled = true;
                        requireCurrentParam();
                    }
                });

                var changeModelListener = $scope.$on('renderModel', function (event, data) {
                    $scope.model = data;
                    $scope.$apply();
                });

                // fires when user select tree node
                var selectTreeNodeObject = $scope.$on('selectObject', function (event, args) {
                    if (args.node.children.length > 0) {
                        $scope.consoleControl.setCmdParams({
                            cmdType: $scope.cmdType,
                            point: point
                        });
                    }
                });

                $scope.$on("$destroy", function () {
                    changeModelListener();
                    selectTreeNodeObject();
                });

            };

            // fires when user select in viewer
            $scope.onSelectNode = function (node, select) {
                $rootScope.$broadcast(IE_EVENTS.ON_SELECT_NODE, {node: node, select: select});
                if (node.parentName) {
                    $scope.consoleControl.setCmdParams({
                        cmdType: $scope.cmdType,
                        point: node.parentName
                    });
                }
            };

            // fires when user select point by ruler
            $scope.pointSelected = function (point) {
                $scope.consoleControl.setCmdParams({
                    cmdType: $scope.cmdType,
                    point: point
                });
            };


            var processCoordinate = function () {
                var param = $scope.params.shift();
                $scope.cmdType = _.find($scope.paramTypes, {'id': param});
                var possibleTools = $scope.cmdType.tools;

                $scope.setMode($scope.cmdType.mode);

                commonExecutor.execute($scope, possibleTools);
            };

            var requireCurrentParam = function () {
                if ($scope.params.length > 0) {
                    actionsRetryQueue.pushRetryFn('start-process', processCoordinate, requireCurrentParam);
                } else {
                    $scope.consoleControl.execCurrentCmd();
                    $scope.changeModeBtnDisabled = false;
                }
            };

            init();

        }]);



