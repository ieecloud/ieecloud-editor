angular.module('ieecloud-editor.security.service', [
        'ieecloud-editor.security.retryQueue',
        'ieecloud-editor.security.login'

    ])

    .factory('security', ['$http', '$q', 'securityRetryQueue', 'urlHelper', '$mdDialog', function ($http, $q, queue, urlHelper, $mdDialog) {

        function openLoginDialog() {
            $mdDialog.show({
                    controller: 'LoginFormController',
                    templateUrl: 'form.tpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                })
                .then(function (answer) {
                    onLoginDialogClose(answer);
                }, function () {
                });
        }


        function closeLoginDialog(success) {
            $mdDialog.hide();
        }


        function onLoginDialogClose(success) {
            if (success) {
                queue.retryAll();
            } else {
                queue.cancelAll();
            }
        }

        queue.onItemAddedCallbacks.push(function (retryItem) {
            if (queue.hasMore()) {
                service.showLogin();
            }
        });

        var service = {

            getLoginReason: function () {
                return queue.retryReason();
            },

            showLogin: function () {
                openLoginDialog();
            },

            login: function (email, password) {
                var requestBody = {};
                requestBody.login = 'demo@ieecloud.com';
                requestBody.password = 'demo';
                var request = $http.post(urlHelper.getStoreUrl('/login-rest'), requestBody);
                return request.then(function (response) {
                    service.currentUser = response.data;
                    if (service.isAuthenticated()) {
                        closeLoginDialog(true);
                    }
                    return service.isAuthenticated();
                });
            },

            cancelLogin: function () {
                closeLoginDialog(false);
            },

            logout: function () {

            },

            requestCurrentUser: function () {
                if (service.isAuthenticated()) {
                    return $q.when(service.currentUser);
                } else {
                    return $http.get(urlHelper.getStoreUrl('/current-user')).then(function (response) {
                        service.currentUser = response.data;
                        return service.currentUser;
                    });
                }
            },

            currentUser: null,

            isAuthenticated: function () {
                return !!service.currentUser;
            }
        };

        return service;
    }]);
