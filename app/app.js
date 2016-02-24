'use strict';

// Declare app level module which depends on views, and components
angular.module('ieecloud-editor', [
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
        'MESH_SIZE': "d.setMeshSize({{this}})",
        'MESH': "d.mesh()"
    })

    .constant('SERVICE.MAPPING', {
        'ruler': 'ruler',
        'dialog_double': 'dialogDouble',
        'tree': 'tree',
        'dialog_element': 'dialogElement'
    })

    .constant('IE_EVENTS', {
        'ON_TREE_LOAD': 'ON_TREE_LOAD',
        'ON_SELECT_NODE': 'ON_SELECT_NODE'
    })


    .config(function ieeEditorConfig($stateProvider, $urlRouterProvider, consoleApiProvider) {

        consoleApiProvider.setBaseUrl("http://10.66.13.144:8001");

        $urlRouterProvider.otherwise('/editor');
    }).run(function ($rootScope) {
    $rootScope.readOnly = true;
});

