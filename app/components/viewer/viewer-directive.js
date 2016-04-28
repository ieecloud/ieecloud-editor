'use strict';

angular.module('ieecloud-editor.viewer.viewer-directive', [])

    .directive('viewer', [function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                onSelectObject: '&',
                onTreeLoad: '&',
                onStartRender: '&',
                onEndRender: '&',
                onSelect3dPoint: '&',
                control: '=',
                model: '=model'
            },
            controllerAs: '3dViewer',
            controller: function ($scope, $element, $attrs) {
                var self = this;

                var init = function () {
                    $scope.$watch('model', function (model) {
                        if (model) {
                            $($element).ieecloudEditor('reloadModel', model);
                        }
                    });

                    self.internalControl = $scope.control || {};

                    // public methods
                    self.internalControl.resizeViewer = function () {
                        $($element).ieecloudEditor('resize');
                    };

                    self.internalControl.setMode = function (modeKey) {
                        $($element).ieecloudEditor('setMode', modeKey);
                    };

                    self.internalControl.showRuler = function () {
                        $($element).ieecloudEditor('showRuler', event);
                    };

                    self.internalControl.showVProtractor = function () {
                        $($element).ieecloudEditor('showVProtractor', event);
                    };

                    self.internalControl.showHProtractor = function () {
                        $($element).ieecloudEditor('showHProtractor', event);
                    };

                    self.internalControl.selectObject = function (args) {
                        $($element).ieecloudEditor('selectObject', args.node);
                    };

                    self.internalControl.unSelectObject = function (args) {
                        $($element).ieecloudEditor('unSelectObject', args.node);
                    };
                };

                init();

            },
            // responsible for registering DOM listeners as well as updating the DOM
            link: function (scope, element, attrs) {
                $(element).ieecloudEditor({
                    textureUrl: "",
                    mode: "3d_geometry",
                    resultDigits: 3,
                    drawResults: false,
                    gridVisible: true,
                    resultColor: "white",
                    backgroundColor: "#aaa",
                    resultTextColor: "white",
                    id: attrs.id,
                    onSelectObject: function (node, value) {
                        scope.onSelectObject({node: node, selected: value});
                    },
                    onStartRender: function () {
                        scope.onStartRender();
                    },
                    onEndRender: function () {
                        scope.onEndRender();
                    },
                    onLoad: function () {

                    },
                    onTreeLoad: function (tree) {
                        scope.onTreeLoad({tree: tree});
                    },
                    onSelect3dPoint: function (point) {
                        scope.onSelect3dPoint({point: point});
                    }
                });


            }
        };
    }]);
