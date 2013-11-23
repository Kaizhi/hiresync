require.config({
    paths: {
        'jquery': '../bower_components/jquery/jquery',
        'jquery.cookie': '../bower_components/jquery.cookie/jquery.cookie',
        'codemirror' : '../bower_components/CodeMirror/lib/codemirror',
        'codemirror-js': '../bower_components/CodeMirror/mode/javascript/javascript',
        'codemirror-clike': '../bower_components/CodeMirror/mode/clike/clike',

        'codemirror-loadmode': '../js/lib/loadmode',
        'io': '../bower_components/socket.io-client/dist/socket.io',
        'firepad': '../js/lib/firepad',
        'backbone': '../bower_components/backbone/backbone-min',
        'underscore': '../bower_components/underscore/underscore-min',
        'spin': '../bower_components/spinjs/dist/spin.min',
        'app':'../js/app',
        'router': '../js/router'
    },
    shim: {
        'firepad' : {
            deps: ['codemirror'],
            exports: 'Firepad'
        },
        'jquery.cookie' : ['jquery'],
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        'codemirror': {
            exports: 'CodeMirror'
        },
        'codemirror-js' : ['codemirror'],
        'codemirror-clike' : ['codemirror'],

        'codemirror-loadmode' : ['codemirror']

    }
});

require(['app',  './views/maincard', 'spin'], function (App, MainCardView, Spinner) {
    'use strict';

    var mainCardView = new MainCardView();

});
