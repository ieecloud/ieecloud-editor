angular.module('ieecloud-editor.editor.viewer').controller('dialogElementExecutor', ['$scope', '$uibModal', '$log', function ($scope, $uibModal, $log) {
        $scope.execute = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'elementsModalContent.html',
                controller: 'ModalElementInstanceCtrl'
            });

            modalInstance.result.then(function (doubleValue) {
                $scope.consoleControl.setCmdParams({
                    cmdType: $scope.cmdType,
                    point: doubleValue
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }])

    .controller('ModalElementInstanceCtrl', function ($scope, $modalInstance) {

        $scope.strValue = "";

        $scope.todos = [
            {text: 'learn angular', done: true},
            {text: 'build an angular app', done: false}];

        $scope.data = [
            {
                "id": 1,
                "title": "node1",
                "nodes": [
                    {
                        "id": 11,
                        "title": "node1.1",
                        "nodes": [
                            {
                                "id": 111,
                                "title": "node1.1.1",
                                "nodes": []
                            }
                        ]
                    },
                    {
                        "id": 12,
                        "title": "node1.2",
                        "nodes": []
                    }
                ]
            },
            {
                "id": 2,
                "title": "node2",
                "nodrop": true,
                "nodes": [
                    {
                        "id": 21,
                        "title": "node2.1",
                        "nodes": []
                    },
                    {
                        "id": 22,
                        "title": "node2.2",
                        "nodes": []
                    }
                ]
            },
            {
                "id": 3,
                "title": "node3",
                "nodes": [
                    {
                        "id": 31,
                        "title": "node3.1",
                        "nodes": []
                    }
                ]
            }
        ];

        $scope.ok = function () {
            $modalInstance.close($scope.strValue);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });