'use strict';

angular.module('ieecloud-editor.editor.viewer', ['ui.router'])


    .controller('EditorViewCtrl', ['$scope', '$rootScope', '$log',  'model', 'modes', 'IE_EVENTS',
        function ($scope, $rootScope, $log, model, modes, IE_EVENTS) {

            var init = function () {
                $scope.model = model;
                $scope.modes = modes;

                var changeModelListener = $scope.$on(IE_EVENTS.RENDER_MODEL, function (event, data) {
                    $scope.model = data;
                    $scope.$apply();
                });

                // fires when user select tree node
                var selectTreeNodeObject = $scope.$on("selectObject", function (event, args) {
                    if (args.node.children.length > 0) {
                        $scope.consoleControl.setCmdParams({
                            cmdType: $scope.cmdType/*,
                            point: point*/
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

            init();

        }]);



