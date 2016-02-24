angular.module('ieecloud-editor.services', [])

.factory('actionsRetryQueue', ['$q', '$log', function($q, $log) {
  var retryQueue = [];
  var service = {
    onItemAddedCallbacks: [],
    
    hasMore: function() {
      return retryQueue.length > 0;
    },
    push: function(retryItem) {
      retryQueue.push(retryItem);
      angular.forEach(service.onItemAddedCallbacks, function(cb) {
        try {
          cb(retryItem);
        } catch(e) {
          $log.error('callback threw an error' + e);
        }
      });
    },
    pushRetryFn: function(reason, processFn, retryFn) {
      if ( arguments.length === 1) {
        retryFn = reason;
        reason = undefined;
      }

      var deferred = $q.defer();
      var retryItem = {
        reason: reason,
        retry: function() {
          $q.when(retryFn()).then(function(value) {
            deferred.resolve(value);
          }, function(value) {
            deferred.reject(value);
          });
        },
        cancel: function() {
          deferred.reject();
        }
      };
      service.push(retryItem);
      processFn();
      return deferred.promise;
    },
    retryReason: function() {
      return service.hasMore() && retryQueue[0].reason;
    },
    cancelAll: function() {
      while(service.hasMore()) {
        retryQueue.shift().cancel();
      }
    },
    retryAll: function() {
      while(service.hasMore()) {
        retryQueue.shift().retry();
      }
    },
    retry: function() {
      if(service.hasMore()) {
        retryQueue.shift().retry();
      }
    }
  };
  return service;
}]);
