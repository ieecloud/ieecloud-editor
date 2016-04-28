angular.module('ieecloud-editor.security.interceptor', ['ieecloud-editor.security.retryQueue'])

.factory('securityInterceptor', ['$injector', 'securityRetryQueue', '$q',  function($injector, queue, $q) {

  return {

    request: function (config) {
      if (localStorage.getItem('authToken')) {
          config.headers['X-XSRF-TOKEN'] = localStorage.getItem('authToken');
      }
      return config;
    },

    response: function (response) {
      var url = response.config.url;
      var isLogin = url.indexOf('login-rest') !== -1;
      if(isLogin){
         localStorage.setItem('authToken', response.data.authToken);
      }
      return response;
    },

    responseError: function (rejection) {
      if (rejection.status === 401) {
        queue.pushRetryFn('unauthorized-server', function retryRequest() {
          return $injector.get('$http')(rejection.config);
        });
      }
      return $q.reject(rejection);
    }
  };
}])

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('securityInterceptor');
}]);