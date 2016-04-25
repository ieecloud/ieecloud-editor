angular.module('ieecloud-editor.editor.viewer').controller('bottomFmExecutor', ['$scope', '$mdBottomSheet', '$log', '$mdToast', function ($scope, $mdBottomSheet, $log, $mdToast) {
    $scope.execute = function () {


        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: 'file-manager-template.html',
            controller: 'GridBottomSheetCtrl',
            clickOutsideToClose: false,
            disableBackdrop:true
        }).then(function(clickedItem) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(clickedItem['name'] + ' clicked!')
                    .position('top right')
                    .hideDelay(1500)
            );


            $scope.consoleControl.setCmdParams({
                cmdType: $scope.cmdType,
                point: clickedItem['name']
            });


        });
    };
}])

    .controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
        $scope.selectFile = function(item) {
            $mdBottomSheet.hide(item);
        };
    });

