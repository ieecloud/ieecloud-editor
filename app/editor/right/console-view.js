'use strict';

angular.module('ieecloud-editor.editor.console', ['ui.router'])

.controller('ConsoleViewCtrl', ['$scope', '$http', '$rootScope', '$stateParams', '$log',  function($scope, $http, $rootScope, $stateParams, $log) {

      $scope.selCmdId = 0;

      $scope.$on('renderCommands', function (event, data) {
          console.log("rendering commands");
          console.log(data);
          $scope.commands = JSON.parse(data);
          $scope.$apply();
      });

      $scope.runCmd = function(cmd){
         $scope.selCmdId = cmd.id;
         $rootScope.$broadcast('editor.cmd', cmd);
      };

      $http.get('/../../resources/drawing_cmd.json').success(function(data) {
          $scope.commands = data;
      });
}]);