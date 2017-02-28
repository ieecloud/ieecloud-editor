angular.module('ieecloud-editor.utils', [])
    //TODO get API root from config
    .factory('urlHelper', [function() {
        return {
            getApiUrl: function(url) {
                return 'http://store-grf.ieecloud.com' + url;
            },

            getStoreUrl: function(url) {
                return 'http://store-grf.ieecloud.com' + url;
            }
        };
    }]);