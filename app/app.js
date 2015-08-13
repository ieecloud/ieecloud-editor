'use strict';

// Declare app level module which depends on views, and components
angular.module('ieecloud-editor', [
  'ui.router',
  'ieecloud-editor.viewer.viewer-directive',
  'ieecloud-editor.console',
  'ieecloud-editor.console.console-directive',
  'ieecloud-editor.editor'


])


.config( function ieeEditorConfig ( $stateProvider, $urlRouterProvider, consoleApiProvider) {

  consoleApiProvider.setBaseUrl("http://localhost:8000");

  $urlRouterProvider.otherwise( '/editor' );
})
