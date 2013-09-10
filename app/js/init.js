require.config({
    paths: {
        'jquery': '../bower_components/jquery/jquery',
        'jquery.cookie': '../bower_components/jquery.cookie/jquery.cookie',
        'codemirror-js': '../bower_components/CodeMirror/mode/javascript/javascript',
        'io': '../bower_components/socket.io-client/dist/socket.io',
        'firepad': '../js/lib/firepad',
        'backbone': '../bower_components/backbone/backbone-min',
        'underscore': '../bower_components/underscore/underscore-min',
        'app':'../js/app',
        'router': '../js/router'
    },
    shim: {
        'firepad' : {
            exports: 'Firepad'
        },
        'jquery.cookie' : ['jquery'],
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});

require(['app',  './views/userlist'], function (App, userListView) {
    'use strict';
    var UserListView = new userListView();

});
    
    /*window.playback = CodeMirror.fromTextArea($("#replay")[0], {
        mode:  "javascript",
        theme: "monokai"
    });

    var Recording = function(){
        this.startTime = window.performance.now();
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
	});*/

