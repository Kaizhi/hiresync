require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        codemirror: '../bower_components/CodeMirror/lib/codemirror'
    }
});

require(['app', 'jquery', 'codemirror'], function (app, $, CodeMirror) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
});
