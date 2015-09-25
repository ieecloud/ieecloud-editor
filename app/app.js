'use strict';

// Declare app level module which depends on views, and components
angular.module('ieecloud-editor', [
  'ieecloud-editor.filters',
  'ieecloud-editor.viewer.viewer-directive',
  'ieecloud-editor.console',
  'ieecloud-editor.console.console-directive',

  'ui.router',
  'ui.bootstrap',
  'ui.tree',
  'ieecloud-editor.editor'



])


.config( function ieeEditorConfig ( $stateProvider, $urlRouterProvider, consoleApiProvider) {

  consoleApiProvider.setBaseUrl("http://localhost:8000");


  $stateProvider.state( 'root', {
    abstract:true,
    views: {
      '@': {
        templateUrl: 'editor/layout.tpl.html'
      }
    },
    data:{ pageTitle: 'Editor' }
  });

   $urlRouterProvider.otherwise( '/editor' );

})

