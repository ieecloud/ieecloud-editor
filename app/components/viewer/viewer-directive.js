'use strict';

angular.module('ieecloud-editor.viewer.viewer-directive', [])

.directive('viewer', [function() {
     return {
         restrict: 'EA',
         replace: true,
         scope: {
             onSelectObject: '&',
             onTreeLoad: '&',
             onStartRender: '&',
             onEndRender: '&',
             model: '=model'
         },
         controller: function ($scope, $element, $attrs) {
             $scope.$watch('model', function(model) {
              if(model){
                  $($element).ieecloudEditor('reloadModel', model);
              }
             });

             $scope.$on('showRuler', function (event) {
                 $($element).ieecloudEditor('showRuler', event);
             });

             $scope.$on('showVProtractor', function (event) {
                 $($element).ieecloudEditor('showVProtractor', event);
             });

              $scope.$on('showHProtractor', function (event) {
                 $($element).ieecloudEditor('showHProtractor', event);
             });

             $scope.$on('selectObject', function (event, args) {
                 $($element).ieecloudEditor('selectObject', args.node);
             });

             $scope.$on('unSelectObject', function (event, args) {
                 $($element).ieecloudEditor('unSelectObject', args.node);
             });

         },
         // responsible for registering DOM listeners as well as updating the DOM
         link: function (scope, element, attrs) {
             $(element).ieecloudEditor({
                 textureUrl: "",
                 mode: "editor",
                 resultDigits: 3,
                 drawResults: false,
                 gridVisible: true,
                 resultColor:"white",
                 backgroundColor:"#aaa",
                 resultTextColor:"white",
                 id: attrs.id,
                 onSelectObject: function (node, value) {
                    scope.onSelectObject({node: node, selected : value});
                 },
                 onStartRender: function () {
                     scope.onStartRender();
                 },
                 onEndRender: function () {
                     scope.onEndRender();
                 },
                 onLoad: function () {

                 },
                 onTreeLoad: function (tree) {
                     scope.onTreeLoad({tree: tree});
                 }
             });


         }
     };
}]);
