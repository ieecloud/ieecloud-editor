'use strict';

angular.module('ieecloud-editor.editor.console', ['ui.router'])

    .controller('ConsoleViewCtrl', ['$scope', 'commands', function ($scope, commands) {

        var init = function () {
            $scope.commands = commands;
        };

        init();


    }]);