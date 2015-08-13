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
                          $.post('/execute', {id: consoleApiProvider.session.clientId, expression: expression})
                              .done(function (data) {
                                  var messages = [];
                                  var hadError = false;

                                  for (var i = 0; i < data.logs.length; i++) {
                                      var type = data.logs[i].type == "ERROR" ? "jquery-console-message-error" : "jquery-console-message-success";

                                      if (data.logs[i].type == "ERROR") {
                                          hadError = true;
                                      }
                                      messages.push({msg: data.logs[i].message, className: type})
                                  }

                                  if (!hadError) {
                                      _gaq.push(["_trackEvent", "console", "evaluation", "success"]);
                                  } else {
                                      _gaq.push(["_trackEvent", "console", "evaluation", "error"]);
                                  }

                                  report(messages);
                                  consoleApiProvider.session.requesting = false;
                              })
                              .fail(function (xhr, textStatus, errorThrown) {
                                  report([
                                      {msg: "Session terminated. Starting new session...", className: "jquery-console-message-service-error"}
                                  ]);
                                  restartSession()
                              });
                      } else {
                          report([]);
                          consoleApiProvider.session.requesting = false;
                      }

                      return [];

                  },
                  completeHandle: function (prefix) {
                      var completionResult;
                      $.ajax({type: 'GET', async: false, cache: false, url: '/completions', data: {id: consoleApiProvider.session.clientId, expression: prefix}})
                          .done(function (data) {
                              completionResult = data;
                          });


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
         }};
  }]);