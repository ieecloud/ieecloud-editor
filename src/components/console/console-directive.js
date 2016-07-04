'use strict';

angular.module('ieecloud-editor.console.console-directive', [])

    .directive('ieeConsole', ['consoleApi', '$stateParams', 'actionsRetryQueue', 'cmdMapping',
        function (consoleApiProvider, $stateParams, actionsRetryQueue, cmdMapping) {
        return {
            restrict: 'EA',
            scope: {
                control: '='
            },
            link: function ($scope, element) {

                var controller;

                var init = function () {

                    $scope.internalControl = $scope.control || {};

                    controller = $(element).console({
                        promptLabel: 'java> ',
                        commandValidate: function () {
                            return !consoleApiProvider.session.requesting;
                        },
                        commandHandle: function (line, report) {
                            if (line == ":snap") {
                                var snapUri = consoleApiProvider.makeSnap();
                                $(".jquery-console-inner").append('<div class="jquery-console-message jquery-console-link">' +
                                    '<a href="' + snapUri + '" target="_blank">' + snapUri + '</a></div>');
                                report([]);
                                return [];
                            }
                            var expression = consoleApiProvider.readExpressionLine(line);

                            if (expression) {
                                consoleApiProvider.execute(report, expression);
                            } else {
                                report([]);
                                consoleApiProvider.session.requesting = false;
                            }

                            return [];

                        },
                        completeHandle: function (prefix) {
                            var completionResult;

                            consoleApiProvider.complete(function (data) {
                                completionResult = data;
                            }, prefix);

                            var candidates = _.map(completionResult.candidates, function (cand) {
                                return cand.value;
                            });
                            var candidatesForms = _.map(completionResult.candidates, function (cand) {
                                return cand.forms;
                            });
                            var promptText = controller.promptText();

                            if (candidates.length == 0) {
                                return [];
                            }

                            if (candidates.length == 1) {
                                var uniqueForms = _.filter(_.unique(candidatesForms[0]), function (form) {
                                    return form != candidates[0];
                                });
                                var text = controller.promptText().substr(0, parseInt(completionResult.position)) + candidates[0];

                                if (uniqueForms.length > 0) {
                                    controller.commandResult(consoleApiProvider.layoutCompletions(candidatesForms[0]), "jquery-console-message-completion");
                                }
                                controller.promptText(text);
                                return [];
                            }

                            controller.commandResult(consoleApiProvider.layoutCompletions(candidates), "jquery-console-message-completion");

                            for (var i = candidates[0].length; i > 0; --i) {
                                var prefixedCandidatesCount = _.filter(candidates, function (cand) {
                                    return i > cand.length ? false : cand.substr(0, i) == candidates[0].substr(0, i);
                                }).length;

                                if (prefixedCandidatesCount == candidates.length) {
                                    controller.promptText(promptText.substr(0, parseInt(completionResult.position)) + candidates[0].substr(0, i));
                                    return [];
                                }
                            }

                            controller.promptText(promptText);
                            return [];
                        },
                        welcomeMessage: consoleApiProvider.session.welcomeMessage,
                        autofocus: false,
                        animateScroll: true,
                        promptHistory: true,
                        charInsertTrigger: function () {
                            return true;
                        }
                    });

                };

                init();

                $scope.internalControl.clearCmd = function () {
                    controller.promptText("");
                };

                // public methods
                $scope.internalControl.setCmd = function (cmd) {
                    if (cmd) {
                        var cmdNameStart = 'd.' + cmd.action.method + "(";
                        controller.promptText(cmdNameStart);
                    }
                };

                $scope.internalControl.setCmdParams = function (data) {

                    if(!actionsRetryQueue.hasMore()){
                        return;
                    }
                    var currentCmd = controller.promptText();
                    var text = cmdMapping.get(data.cmdType.id, data.point);

                    if(!text){
                        return;
                    }

                    //TODO avoid this check
                    if (currentCmd.indexOf('Coordinate') !== -1) {
                        controller.promptText(currentCmd + "," + text);
                        actionsRetryQueue.retry();
                        return;
                    }

                    //TODO avoid this check
                    if (currentCmd.indexOf('setElements') !== -1) {
                        if (currentCmd != 'd.setElements(') {
                            currentCmd = currentCmd + ",";
                        }
                        controller.promptText(currentCmd + text);
                        actionsRetryQueue.retry();
                        return;
                    }
                    controller.promptText(currentCmd + text);
                    actionsRetryQueue.retry();

                };

                $scope.internalControl.execCurrentCmd = function () {
                    var currentCmd = controller.promptText();
                    controller.promptText(currentCmd + ")");
                    controller.commandTrigger();
                };

                $scope.internalControl.execCmd = function (cmdText) {
                    controller.promptText(cmdText);
                    controller.commandTrigger();
                };


                $scope.internalControl.startSession = function () {
                    consoleApiProvider.startSession();
                    var cmdNewDrawing = cmdMapping.get('NEW', $stateParams);
                    controller.promptText(cmdNewDrawing);
                    controller.commandTrigger();
                };

            }
        };
    }]);