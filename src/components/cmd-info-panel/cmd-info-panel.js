angular.module('ieecloud-editor.cmd-info-directive', [])
    .directive('cmdInfoPanel', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/cmd-info-panel/cmd-info-panel.tpl.html',
            scope: {
                control: '=',
                onCancelCmd: '&'
            },
            controllerAs: 'cmdInfoPanelCtrl',
            controller: function($scope) {
                var self = this;

                var init = function() {
                    self.collapsed = false;
                    self.internalControl = $scope.control || {};

                    self.togglePanel = togglePanel;
                    self.toTop = toTop;
                    self.cancelCommand = cancelCommand;
                    //public methods
                    self.internalControl.setCmd = setCmd;
                    self.internalControl.hidePanel = hidePanel;
                    self.internalControl.setCmdParamType = setCmdParamType;
                };


                function toTop() {
                    self.collapsed = false;
                }


                function hidePanel() {
                    self.visible = false;
                }

                function showPanel() {
                    self.visible = true;
                }

                function cancelCommand() {
                    $scope.onCancelCmd();
                }

                function setCmd(cmd) {
                    showPanel();
                    self.cmd = cmd;
                }

                function setCmdParamType(cmdParam) {
                    self.cmdParam = cmdParam;
                }

                function togglePanel() {
                    self.collapsed = !self.collapsed;
                }

                init();
            }
        };
    });