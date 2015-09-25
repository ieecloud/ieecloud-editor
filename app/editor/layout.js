'use strict';

angular.module('ieecloud-editor.editor', ['ieecloud-editor.editor.tree', 'ieecloud-editor.editor.viewer', 'ieecloud-editor.editor.console'])

.config(['$stateProvider', function($stateProvider) {
   $stateProvider.state( 'root.editor', {
      url: '/editor/wsoUuid/:wsoUuid/wsoVersion/:wsoVersion/pad/:pad',
      views: {
        "left": {
          controller: 'TreeViewCtrl',
          templateUrl: 'editor/left/tree-view.tpl.html'
        },

        "center": {
          controller: 'EditorViewCtrl',
          templateUrl: 'editor/center/editor-view.tpl.html'
        },

        "right": {
          controller: 'ConsoleViewCtrl',
          templateUrl: 'editor/right/console-view.tpl.html'
        }
      },
      params: {wsoUuid: null, wsoVersion: null, pad:null}
    });
}]);
