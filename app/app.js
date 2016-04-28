'use strict';

// Declare app level module which depends on views, and components
angular.module('ieecloud-editor', [
        'ngMaterial',
        'ieecloud-editor.filters',
        'ieecloud-editor.services',
        'ieecloud-editor.utils',
        'ieecloud-editor.resources',
        'ieecloud-editor.viewer.viewer-directive',
        'ieecloud-editor.console',
        'ieecloud-editor.console.console-directive',
        'ui.router',
        'ngCookies',
        'ui.bootstrap',
        'ui.tree',
        'ieecloud-fm',
        'ieecloud-editor.editor'
    ])


    .constant('PARAM.TEXT', {
        'NEW': 'com.ieecloud.fe.drawing.FEDrawing d = new com.ieecloud.fe.drawing.FEDrawing("{{wsoUuid}}", "{{wsoVersion}}", "{{pad}}")',
        'DOUBLE': '{{this}}',
        'OBJECT_NAME': '"{{this}}"',
        'COORDINATE': "new com.ieecloud.geometry.Coordinate({{x}}, {{y}}, {{z}})",
        'ELEMENT': "\"{{this}}\"",
        'MATERIAL': "{{this}}",
        'SAVE': "d.save()",
        'MATERIAL_NAME': '"{{this}}"',
        'MESH_SIZE': "d.setMeshSize({{this}})",
        'MESH': "d.mesh()"
    })

    .constant('SERVICE.MAPPING', {
        'ruler': 'ruler',
        'dialog_double': 'dialogDouble',
        'file_manager': 'bottomFm',
        'tree': 'tree',
        'dialog_element': 'dialogElement'
    })

    .constant('IE_EVENTS', {
        'ON_TREE_LOAD': 'ON_TREE_LOAD',
        'ON_SELECT_NODE': 'ON_SELECT_NODE',
        'RENDER_MODEL': 'renderModel'
    })


    .config(function ieeEditorConfig($stateProvider, $urlRouterProvider, consoleApiProvider, $mdThemingProvider) {
        $mdThemingProvider.theme('default');
        consoleApiProvider.setBaseUrl("https://egrfs.ieecloud.com");

        $urlRouterProvider.otherwise('/editor');
    }).run(function ($rootScope) {
    $rootScope.readOnly = true;
});

