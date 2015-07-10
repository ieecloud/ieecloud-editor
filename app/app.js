'use strict';

// Declare app level module which depends on views, and components
angular.module('ieecloud-editor', [
  'ui.router',
  'ieecloud-editor.viewer.viewer-directive',
  'ieecloud-editor.editor'


])


.config( function ieeEditorConfig ( $stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise( '/editor' );
})
