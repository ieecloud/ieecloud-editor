angular.module('ieecloud-editor.resources', [])
    .factory('cmdService', function($http) {
        return {
            getCmdParamTypes: function() {
                return $http.get('/../../resources/drawing_cmd_param_types.json');
            },

            getCmdList: function() {
                return $http.get('/../../resources/drawing_cmd.json');
            }
        };
    })
    .factory('modelService', function($http, urlHelper) {
        return {
            loadModel: function(wsoUuid, wsoVersion, pad) {
                return $http.get(urlHelper.getApiUrl('/data/wso_display/' +wsoUuid + '/' + wsoVersion + '/' +pad + '.json'));
            }

        };
    });