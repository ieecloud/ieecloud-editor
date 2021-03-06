'use strict';

// Declare app level module which depends on views, and components
angular.module('ieecloud-editor', [
        'ngMaterial',
        'cfp.hotkeys',
        'ieecloud-editor.security',
        'ieecloud-editor.filters',
        'ieecloud-editor.services',
        'ieecloud-editor.utils',
        'ieecloud-editor.resources',
        'ieecloud-editor.viewer.viewer-directive',
        'ieecloud-editor.console',
        'ieecloud-editor.console.console-directive',
        'ieecloud-editor.cmd-info-directive',
        'ngCookies',
        'ui.router',
        'ui.tree',
        'ieecloud-fm',
        'ieecloud-editor.editor'
    ])


    .constant('PARAM.TEXT', {
        'NEW': 'com.ieecloud.fe.drawing.FEDrawing d = new com.ieecloud.fe.drawing.FEDrawing("{{wsoUuid}}", "{{wsoVersion}}", "{{pad}}")',
        'DOUBLE': '{{this}}',
        'OBJECT_NAME': '"{{this}}"',
        'OBJECT_NAMES': '{{this}}',
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
        'list-of-objects': 'listObjects',
        'file_manager': 'bottomFm',
        'tree': 'tree',
        'dialog_element': 'dialogElement'
    })

    .constant('IE_EVENTS', {
        'ON_TREE_LOAD': 'ON_TREE_LOAD',
        'ON_SELECT_NODE': 'ON_SELECT_NODE',
        'RENDER_MODEL': 'renderModel'
    })

    .constant('modes', [
        {label: '3d geometry', key: '3d_geometry'},
        {label: '3d point', key: '3d_point'},
        {label: 'faces and nodes', key: 'faces_and_nodes'}
    ])


    .config(function ieeEditorConfig($stateProvider, $urlRouterProvider, consoleApiProvider, $mdThemingProvider, $httpProvider, fileManagerConfigProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

        fileManagerConfigProvider.set({
            listUrl: 'http://store-grf.ieecloud.com/api/jsonws/fm/listUrl',
            siteListUrl: 'http://store-grf.ieecloud.com/api/jsonws/site/list',
            allowedActions: {
                createFolder: false,
                upload: false,
                rename: false,
                copy: false,
                edit: false,
                changePermissions: false,
                compress: false,
                compressChooseName: false,
                extract: false,
                download: false,
                preview: true,
                remove: false
            },
            cssClasses: {
                iconsPanelClass: 'icons-panel-class',
                sideBarPanelClass: 'side-bar'
            }
        });


        $httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
        $httpProvider.defaults.withCredentials = true;

        $mdThemingProvider.theme('default');
        $mdThemingProvider.theme("success-toast");
        $mdThemingProvider.theme("error-toast");
        $mdThemingProvider.theme("warning-toast");
        consoleApiProvider.setBaseUrl("http://egrfs.ieecloud.com");

        $urlRouterProvider.otherwise('/editor');
    }).run(function ($rootScope, security) {
           security.requestCurrentUser();
           $rootScope.readOnly = false;
});

