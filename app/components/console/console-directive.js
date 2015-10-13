'use strict';

angular.module('ieecloud-editor.console.console-directive', [])

 .directive('console', ['consoleApi', function(consoleApiProvider) {
    return {
      restrict: 'EA',
      scope: {},
      link: function(scope, element, attrs) {

           var controller = $(element).console({
                  promptLabel: 'java> ',
                  commandValidate: function (line) {
                      return !consoleApiProvider.session.requesting;
                  },
                  commandHandle: function (line, report) {
                      if (line == ":snap") {
                          var snapUri = consoleApiProvider.makeSnap();
                          $(".jquery-console-inner").append('<div class="jquery-console-message jquery-console-link">' +
                              '<a href="' + snapUri + '" target="_blank">' + snapUri + '</a></div>')
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

                      consoleApiProvider.complete(function(data){
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
                              return form != candidates[0]
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
                          var prefixedCandidatesCount = _.filter(candidates,function (cand) {
                              return i > cand.length ? false : cand.substr(0, i) == candidates[0].substr(0, i)
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
                  autofocus: true,
                  animateScroll: true,
                  promptHistory: true,
                  charInsertTrigger: function (keycode, line) {
                      return true;
                  }
              });


              scope.$on('editor.cmd', function (event, cmd) {
                if(cmd){
                    var cmdNameStart = 'd.' + cmd.name + "(";
                   controller.promptText(cmdNameStart);
                }
              });

              scope.$on('editor.cmd.update', function (event, data) {
                   var currentCmd = controller.promptText();
                   if(currentCmd.indexOf('Coordinate')!==-1){
                       controller.promptText(currentCmd  + ", new Coordinate (" + data.point.x + "," + data.point.y + "," + data.point.z + "))" );
                       return;
                   }
                   controller.promptText(currentCmd  + "new Coordinate (" + data.point.x + "," + data.point.y + "," + data.point.z + ")" );
              });
         }};
  }]);