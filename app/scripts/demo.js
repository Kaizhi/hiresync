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

	window.editor = CodeMirror.fromTextArea($("#code")[0], {
	  value: "function myScript(){return 100;}\n",
	  mode:  "javascript",
	  theme: "monokai"
	});

    window.playback = CodeMirror.fromTextArea($("#replay")[0], {
      mode:  "javascript",
      theme: "monokai"
    });

    var Recording = function(){
        this.startTime = performance.now();
        this.events = [];
        return this;
    };
    var startRecording = false, //record on/off flag
        recording = null; 

	var socket = io.connect();
    socket.on('editorUpdate', function (data) {
        editor.setByAPI = true;
        editor.setValue(data.contents);
        editor.setByAPI = false;
    });

    $("#record").on('click', function(){
        recording = new Recording();
        startRecording = true;
    });

    var startPlayback = function(i){
        if (i > recording.events.length - 1){
            return;
        }
        if (i === 0){
            var timer = recording.events[i].time - recording.startTime;
        } else {
            var timer = recording.events[i].time - recording.events[i-1].time;
        }

        var data = recording.events[i].contents;
        playbackEvent(data, timer);
        function playbackEvent(data, timer){
            setTimeout(function(){
                playback.setValue(data);
                startPlayback(i+1);
            }, timer);
        }
    }

    $("#play").on('click', function(){
        console.log(recording);
        startRecording = false;
        startPlayback(0);
    });

	editor.on('change', function() {
	    if (!editor.setByAPI) {
            if (startRecording){
                var evt = {};
                evt.contents = editor.getValue();
                evt.time = Math.round(performance.now());
                recording.events.push(evt);
            }
            
	        socket.emit('editorUpdate', {
	            contents: editor.getValue()
	        });
	    }
	});
});
