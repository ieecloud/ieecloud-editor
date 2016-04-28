angular.module('ieecloud-editor.security.login.form', [])
.controller('LoginFormController', ['$scope', 'security',  function($scope, security) {
  $scope.user = {};

  $scope.authError = null;

  $scope.authReason = null;
  if ( security.getLoginReason() ) {
    $scope.authReason = ( security.isAuthenticated() ) ?
      'login.reason.notAuthorized' :
      'login.reason.notAuthenticated';
  }

  $scope.login = function() {
    $scope.authError = null;

    security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
      if ( !loggedIn ) {
        $scope.authError = 'login.error.invalidCredentials';
      }
    }, function(x) {
      $scope.authError = 'login.error.serverError';
    });
  };

  $scope.clearForm = function() {
    $scope.user = {};
  };

  $scope.cancelLogin = function() {
    security.cancelLogin();
  };
}]);
