require.config({
    paths: {
        'jquery': '../bower_components/jquery/jquery',
        'codemirror': '../bower_components/CodeMirror/lib/codemirror',
        'codemirror-js': "../bower_components/CodeMirror/mode/javascript/javascript",
        'io': "../bower_components/socket.io-client/dist/socket.io"
    },
    shim: {
    	'codemirror': {
    		exports: 'CodeMirror'
    	},
    	'codemirror-js': ['codemirror'],
    }
});

require(['app', 'jquery', 'codemirror', 'io', 'codemirror-js'], function (app, $, CodeMirror, io) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);

	window.editor = CodeMirror(document.body, {
	  value: "function myScript(){return 100;}\n",
	  mode:  "javascript",
	  theme: "monokai"
	});

	var socket = io.connect();
    socket.on('editorUpdate', function (data) {
        editor.setByAPI = true;
        editor.setValue(data.contents);
        editor.setByAPI = false;
    });

	editor.on('change', function() {
	    if (!editor.setByAPI) {
	        socket.emit('editorUpdate', {
	            contents:editor.getValue()
	        });
	    }
	});
});
