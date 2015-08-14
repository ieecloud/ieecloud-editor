'use strict';

angular.module('ieecloud-editor.viewer.viewer-directive', [])

.directive('viewer', [function() {
     return {
         restrict: 'EA',
         replace: true,
         scope: {
             onChange: '&',
             onStartRender: '&',
             onEndRender: '&',
             model: '=model'
         },
         controller: function ($scope, $element, $attrs) {
             $scope.$watch('model', function(model) {
              if(model){
                  $($element).ieecloudEditor('addModel', model);
              }
             });
         },
         // responsible for registering DOM listeners as well as updating the DOM
         link: function (scope, element, attrs) {
             $(element).ieecloudEditor({
                 textureUrl: "",
                 mode: "viewer",
                 resultDigits: 3,
                 drawResults: false,
                 gridVisible: true,
                 resultColor:"white",
                 backgroundColor:"#aaa",
                 resultTextColor:"white",
                 id: attrs.id,
                 onChange: function (branch) {
                     scope.$apply(function () {
                         scope.onChange({branch: branch});
                     });
                 },
                 onStartRender: function () {
                     scope.onStartRender();
                 },
                 onEndRender: function () {
                     scope.onEndRender();
                 },
                 onLoad: function () {

                 }
             });


         }
     };
}]);
