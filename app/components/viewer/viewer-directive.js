'use strict';

angular.module('ieecloud-editor.viewer.viewer-directive', [])

.directive('viewer', [function() {
     return {
         restrict: 'A',
         scope: {
             onChange: '&',
             onStartRender: '&',
             onEndRender: '&'
         },
         controller: function ($scope, $element, $attrs) {

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
