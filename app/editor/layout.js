'use strict';

angular.module('ieecloud-editor.editor', ['ieecloud-editor.editor.tree', 'ieecloud-editor.editor.viewer', 'ieecloud-editor.editor.console', 'ieecloud-editor.resources'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('editor', {
            url: '/editor/wsoUuid/:wsoUuid/wsoVersion/:wsoVersion/pad/:pad',
            views: {
                "main": {
                    controller: 'EditorCtrl',
                    templateUrl: 'editor/layout.tpl.html'
                },

                "left@editor": {
                    controller: 'TreeViewCtrl',
                    templateUrl: 'editor/left/tree-view.tpl.html'
                },

                "center@editor": {
                    controller: 'EditorViewCtrl',
                    templateUrl: 'editor/center/editor-view.tpl.html',
                    resolve : {
                        model : function($stateParams, modelService){
                            return modelService.loadModel($stateParams.wsoUuid, $stateParams.wsoVersion, $stateParams.pad).then(function(response) {
                                return response.data;
                            });
                        },

                        cmdParamTypes : function(cmdService){
                            return cmdService.getCmdParamTypes().then(function(response) {
                                return response.data;
                            });
                        }
                    }
                },

                "right@editor": {
                    controller: 'ConsoleViewCtrl',
                    templateUrl: 'editor/right/console-view.tpl.html',
                    resolve : {
                        commands : function(cmdService){
                            return cmdService.getCmdList().then(function(response) {
                                return response.data;
                            });
                        }
                    }
                }
            },
            params: {wsoUuid: null, wsoVersion: null, pad: null}
        });
    }])

    .controller('EditorCtrl', ['$scope', '$rootScope', 'cmdMapping', 'IE_EVENTS',
        function ($scope, $rootScope, cmdMapping, IE_EVENTS) {

            var init = function () {
                $scope.viewerControl = {};
                $scope.consoleControl = {};
                $scope.readOnly = true;
                $scope.currentCmd = null;
            };

            $scope.runCmd = function (cmd) {
                if ($scope.readOnly) {
                    return;
                }
                $scope.currentCmd = cmd;
                $scope.consoleControl.setCmd(cmd);
            };

            $scope.editMode = function () {
                $scope.readOnly = false;
                $scope.consoleControl.startSession();
            };

            $scope.saveModel = function () {
                $scope.consoleControl.execCmd(cmdMapping.get('SAVE'));
            };

            $scope.meshModel = function () {
                $scope.consoleControl.execCmd(cmdMapping.get('MESH_SIZE', 0.5));
                $scope.consoleControl.execCmd(cmdMapping.get('MESH'));
            };

            $scope.addRuler = function () {
                $scope.viewerControl.showRuler('true');
            };

            $scope.showVProtractor = function () {
                $scope.viewerControl.showVProtractor('true');
            };

            $scope.showHProtractor = function () {
                $scope.viewerControl.showHProtractor('true');
            };

            $scope.toggleTree = function () {
                var $wrapper = $("#wrapper");
                $wrapper.toggleClass("toggled");
                $wrapper.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
                    function () {
                        $scope.viewerControl.resizeViewer();
                    });
            };

            $scope.showTree = function () {
                var $wrapper = $("#wrapper");
                $wrapper.removeClass("toggled");
                $wrapper.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
                    function () {
                        $scope.viewerControl.resizeViewer();
                    });
            };

            $scope.onTreeLoad = function (tree) {
                $rootScope.$broadcast(IE_EVENTS.ON_TREE_LOAD, tree);
            };

            $scope.setMode = function (modeKey) {
                $scope.viewerControl.setMode(modeKey);
            };
            init();

        }]);
