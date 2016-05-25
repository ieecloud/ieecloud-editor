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
                            }, function(){
                                return {
                                    "tree" : {"children" : []},
                                    "pictureData" : [
                                    ],
                                    "minResult" : 0,
                                    "maxResult" : 0
                                }
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

            resolve : {
                cmdParamTypes : function(cmdService){
                    return cmdService.getCmdParamTypes().then(function(response) {
                        return response.data;
                    });
                }
            },
            params: {wsoUuid: null, wsoVersion: null, pad: null}
        });
    }])

    .controller('EditorCtrl', ['$scope', '$rootScope', 'cmdMapping', 'IE_EVENTS', 'actionsRetryQueue','commonExecutor', 'cmdParamTypes', '$mdSidenav', '$log',
        function ($scope, $rootScope, cmdMapping, IE_EVENTS, actionsRetryQueue , commonExecutor, cmdParamTypes, $mdSidenav, $log) {

            var init = function () {
                $scope.paramTypes = cmdParamTypes;
                $scope.viewerControl = {};
                $scope.consoleControl = {};
                $scope.readOnly = true;
                $scope.cmdRunning = false;
                $scope.currentCmd = null;

                $scope.selectedNodes = [];

                $scope.settings = {
                    showTree: false,
                    showCmd: true,
                    showRuler: false,
                    showVProtractor: false,
                    showHProtractor: false,
                    mode : '3d_geometry'
                };

            };


            $scope.toggleTree = buildToggler('left');
            $scope.showTree = buildOpenSideNav('left');
            $scope.toggleCmd = buildToggler('right');
            $scope.isOpenLeft = function(){
                return $mdSidenav('left').isOpen();
            };

            function buildToggler(navID) {
                return function() {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            if('left' === navID){
                                $scope.settings.showTree =  !$scope.settings.showTree;
                            }

                            if('right' === navID){
                                $scope.settings.showCmd =  !$scope.settings.showCmd;
                            }

                        });
                }
            }

            function buildOpenSideNav(navID) {
                return function() {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                        .open()
                        .then(function(){
                            $log.debug('opened');
                        });
                }
            }

            var processCoordinate = function () {
                var param = $scope.params.shift();
                $scope.cmdType = _.find($scope.paramTypes, {'id': param});
                var possibleTools = $scope.cmdType.tools;
                $scope.setMode($scope.cmdType.mode);
                commonExecutor.execute($scope, possibleTools);
            };

            var processCommand = function () {
                if ($scope.params.length > 0) {
                    actionsRetryQueue.pushRetryFn('start-process', processCoordinate, processCommand);
                } else {
                    $scope.consoleControl.execCurrentCmd();
                    $scope.cmdRunning = false;
                    $scope.currentCmd = null;
                    $scope.selectedNodes = [];
                }
            };

            $scope.runCmd = function (cmd) {
                if ($scope.readOnly) {
                    return;
                }
                actionsRetryQueue.cancelAll();
                $scope.currentCmd = cmd;
                $scope.consoleControl.setCmd($scope.currentCmd);
                $scope.params = angular.copy($scope.currentCmd.action.params);
                $scope.cmdRunning = true;
                processCommand();
            };

            $scope.cancelCmd = function () {
                actionsRetryQueue.cancelAll();
                $scope.consoleControl.clearCmd();
                $scope.cmdRunning = false;
                $scope.currentCmd = null;
                $scope.viewerControl.showRuler(false);
                $scope.setMode('3d_geometry');
            };

            $scope.editMode = function () {
                $scope.readOnly = false;
                $scope.consoleControl.startSession();
            };

            $scope.saveModel = function () {
                $scope.cancelCmd();
                $scope.consoleControl.execCmd(cmdMapping.get('SAVE'));
            };

            $scope.meshModel = function () {
                $scope.cancelCmd();
                $scope.consoleControl.execCmd(cmdMapping.get('MESH_SIZE', 0.5));
                $scope.consoleControl.execCmd(cmdMapping.get('MESH'));
            };

            $scope.addRuler = function () {
                $scope.settings.showRuler = true;
                $scope.viewerControl.showRuler(true);
            };

            $scope.toggleRuler = function () {
                $scope.settings.showRuler =  !$scope.settings.showRuler;
                $scope.viewerControl.showRuler($scope.settings.showRuler);
            };

            $scope.showVProtractor = function () {
                $scope.viewerControl.showVProtractor(true);
            };

            $scope.toggleVProtractor = function () {
                $scope.settings.showVProtractor =  !$scope.settings.showVProtractor;
                $scope.viewerControl.showVProtractor($scope.settings.showVProtractor);
            };

            $scope.showHProtractor = function () {
                $scope.viewerControl.showHProtractor(true);
            };

            $scope.toggleHProtractor = function () {
                $scope.settings.showHProtractor =  !$scope.settings.showHProtractor;
                $scope.viewerControl.showHProtractor($scope.settings.showHProtractor);
            };

            $scope.onTreeLoad = function (tree) {
                $rootScope.$broadcast(IE_EVENTS.ON_TREE_LOAD, tree);
            };

            $scope.setMode = function (mode) {
                $scope.settings.mode = mode;
                $scope.viewerControl.setMode(mode);
            };
            init();

        }]);
