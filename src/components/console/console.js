angular.module('ieecloud-editor.console', [])

    .provider('consoleApi', function ConsoleApiProvider() {
        var baseUrl = '';

        this.setBaseUrl = function (newBaseUrl) {
            baseUrl = /\/$/.test(newBaseUrl) ?
                newBaseUrl.substring(0, newBaseUrl.length - 1) : newBaseUrl;
        },

            this.$get = ['$injector', '$stateParams', '$cookies', function ($injector, $stateParams, $cookies) {

                var service = {

                    session: [],

                    _gaq: [],

                    createNewSession: function (expression, snap) {

                        var cookieJavaREPLSessionClientId = $cookies.getObject("javaREPLSessionClientId");

                        if (cookieJavaREPLSessionClientId) {
                            service.session = [];
                            service.session.requesting = false;
                            service.session.clientId = cookieJavaREPLSessionClientId;
                            return;
                        }

                        var newSession = [];
                        newSession.expression = expression;
                        newSession.snap = snap;

                        $.ajax({
                                type: 'POST',
                                async: false,
                                url: baseUrl + '/create',
                                data: (expression ? "expression=" + expression : "") + "&" + (snap ? "snap=" + snap : "")
                            }
                        ).done(function (data) {
                            newSession.clientId = data.id;
                            newSession.welcomeMessage = data.welcomeMessage;
                        });

                        newSession.requesting = false;

                        service.session = newSession;

                        $cookies.putObject("javaREPLSessionClientId", newSession.clientId);
                    },


                    getBaseURL: function () {
                        return location.protocol + "//" + location.hostname +
                            (location.port && ":" + location.port) + location.pathname;
                    },

                    closeSession: function () {
                        $cookies.remove("javaREPLSessionClientId");
                        $.ajax({
                            type: 'POST',
                            async: false,
                            url: baseUrl + '/remove',
                            data: 'id=' + service.session.clientId
                        });
                    },

                    restartSession: function () {
                        service.closeSession();
                        service.startSession();
                    },

                    startSession: function () {
                        service.createNewSession(service.session.expression, service.session.snap);
                    },

                    makeSnap: function () {
                        var snapUrl = null;
                        $.ajax({
                                type: 'POST',
                                async: false,
                                url: baseUrl + '/snap',
                                data: 'id=' + service.session.clientId
                            })
                            .done(function (data) {

                                snapUrl = service.getBaseURL() + '?snap=' + data.snap;
                            }).fail(function () {
                            service.restartSession();
                        });

                        return snapUrl;
                    },

                    readExpressionLine: function (line) {
                        var expression = null;

                        $.ajax({
                                type: 'POST',
                                async: false,
                                url: baseUrl + '/readExpression',
                                data: {id: service.session.clientId, line: line}
                            })
                            .done(function (data) {
                                expression = data.expression;
                            })
                            .fail(function () {
                                service.restartSession();
                            });

                        return expression;
                    },

                    execute: function (cb, expression) {
                        $.post(baseUrl + '/execute', {id: service.session.clientId, expression: expression})
                            .done(function (data) {
                                var messages = [];
                                var hadError = false;

                                for (var i = 0; i < data.logs.length; i++) {
                                    var type = data.logs[i].type == "ERROR" ? "jquery-console-message-error" : "jquery-console-message-success";

                                    if (data.logs[i].type == "ERROR") {
                                        hadError = true;
                                    }
                                    messages.push({msg: data.logs[i].message, className: type});
                                }

                                if (!hadError) {
                                    service._gaq.push(["_trackEvent", "console", "evaluation", "success"]);
                                } else {
                                    service._gaq.push(["_trackEvent", "console", "evaluation", "error"]);
                                }

                                cb(messages);
                                service.session.requesting = false;

                                // render model
                                service.executeGetModelAsJsonAndRenderModel('d.getModelAsJson()', 'renderModel');
                            })
                            .fail(function () {
                                cb([
                                    {
                                        msg: "Session terminated. Starting new session...",
                                        className: "jquery-console-message-service-error"
                                    }
                                ]);
                                service.restartSession();
                            });
                    },

                    executeGetModelAsJsonAndRenderModel: function (cmd, broadcast) {
                        $.post(baseUrl + '/execute', {id: service.session.clientId, expression: cmd})
                            .done(function (data) {

                                var messages = [];
                                var hadError = false;

                                for (var i = 0; i < data.logs.length; i++) {
                                    var type = data.logs[i].type == "ERROR" ? "jquery-console-message-error" : "jquery-console-message-success";

                                    if (data.logs[i].type == "ERROR") {
                                        hadError = true;
                                    }
                                    messages.push({msg: data.logs[i].message, className: type});
                                }

                                if (!hadError) {
                                    var resp = data.logs[0].message;
                                    var json = resp.substring(resp.indexOf('"') + 1, resp.lastIndexOf('"'));
                                    //console.log(broadcast);

                                    $injector.get('$rootScope').$broadcast(broadcast, JSON.parse(json));

                                } else {
                                    service._gaq.push(["_trackEvent", "console", "evaluation", "error"]);
                                }

                                service.session.requesting = false;
                            })
                            .fail(function () {
                                //cb([
                                //    {
                                //        msg: "Session terminated. Starting new session...",
                                //        className: "jquery-console-message-service-error"
                                //    }
                                //]);
                                service.restartSession();
                            });
                    },

                    complete: function (cb) {
                        var prefix = '';
                        $.ajax({
                                type: 'GET',
                                async: false,
                                cache: false,
                                url: baseUrl + '/completions',
                                data: {id: service.session.clientId, expression: prefix}
                            })
                            .done(function (data) {
                                cb(data);
                            });
                    },

                    layoutCompletions: function (candidates) {
                        var max = 0;
                        for (var i = 0; i < candidates.length; i++) {
                            max = Math.max(max, candidates[i].length);
                        }
                        max += 2;
                        var n = Math.floor(85 / max);
                        var buffer = "";
                        var col = 0;
                        for (i = 0; i < candidates.length; i++) {
                            var completion = candidates[i];
                            buffer += candidates[i];
                            for (var j = completion.length; j < max; j++) {
                                buffer += " ";
                            }
                            if (++col >= n) {
                                buffer += "\n";
                                col = 0;
                            }
                        }
                        return buffer;
                    }

                };
                return service;
            }];
    });