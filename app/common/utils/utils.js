angular.module('ieecloud-editor.utils', [])
    //TODO get API root from config
    .factory('urlHelper', ['$state', /*'apiRoot',*/  function($state/*, apiRoot*/) {
        return {
            getApiUrl: function(url) {
                return 'http://eprupetw6356:9000' + url;
            }
        };
    }]);