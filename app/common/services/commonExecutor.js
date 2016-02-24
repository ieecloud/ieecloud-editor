angular.module('ieecloud-editor.services').factory('commonExecutor', ['$log', 'SERVICE.MAPPING', '$controller', function ($log, controllerMapping, $controller) {

    return {
        execute: function ($scope, possibleTools) {
            _.each(possibleTools, function (tool) {
                try{
                    var toolCtrlName = controllerMapping[tool];
                    var toolCtrlScope = $scope.$new();
                    $controller(toolCtrlName + 'Executor',{$scope : toolCtrlScope });
                    toolCtrlScope.execute();
                }catch (e){

                }
            });
        }
    };
}]);