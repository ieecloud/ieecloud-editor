angular.module('ieecloud-editor.filters', []);
angular.module('ieecloud-editor.filters')
.filter('querySearch', function () {
        return function (arr, criteria) {
            if (!criteria) {
                return arr;
            }
            var result = [];
            criteria = criteria.toLowerCase();
            angular.forEach(arr, function (item) {
                if (item.name != null) {
                    if (item.name.toLowerCase().indexOf(criteria) !== -1) {
                        result.push(item);
                    }
                }
            });
            return result;
        };

    });