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

    })
    .filter('keyboardShortcut', function($window) {
        return function(str) {
            if (!str) return;
            var keys = str.split('-');
            var isOSX = /Mac OS X/.test($window.navigator.userAgent);
            var seperator = (!isOSX || keys.length > 2) ? '+' : '';
            var abbreviations = {
                M: isOSX ? '⌘' : 'Ctrl',
                A: isOSX ? 'Option' : 'Alt',
                S: 'Shift'
            };
            return keys.map(function(key, index) {
                var last = index == keys.length - 1;
                return last ? key : abbreviations[key];
            }).join(seperator);
        };
    });