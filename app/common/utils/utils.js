angular.module('ieecloud-editor.utils', [])
    //TODO get API root from config
    .factory('urlHelper', ['$state', /*'apiRoot',*/  function($state/*, apiRoot*/) {
        return {
            getApiUrl: function(url) {
                return 'https://store-grf.ieecloud.com' + url;
            },

            getStoreUrl: function(url) {
                return 'https://store-grf.ieecloud.com' + url;
            }
        };
    }]);