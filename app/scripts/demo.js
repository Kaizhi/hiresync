require.config({
    paths: {
        'jquery': '../bower_components/jquery/jquery',
        'codemirror-js': '../bower_components/CodeMirror/mode/javascript/javascript',
        'io': '../bower_components/socket.io-client/dist/socket.io',
        'firepad': '../scripts/firepad'
    },
    shim: {
        'firepad' : {
            exports: 'Firepad'
        },
    }
});

require(['app', 'jquery', 'io', 'firepad'], function (app, $, io, Firepad) {
    'use strict';

    String.prototype.hashCode = function(){
        var hash = 0, i, char;
        if (this.length == 0) return hash;
        for (i = 0, l = this.length; i < l; i++) {
            char  = this.charCodeAt(i);
            hash  = ((hash<<5)-hash)+char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    
    var firepadRef = new Firebase('devscreen.firebaseIO.com/');
	window.editor = CodeMirror.fromTextArea($('#code')[0], {
	    mode:  'javascript',
        lineNumbers:true,
	    theme: 'monokai'
	});
    var firepad = Firepad.fromCodeMirror(firepadRef, window.editor);
    //// Initialize contents.
    firepad.on('ready', function() {
        if (firepad.isHistoryEmpty()) {
            firepad.setText('// JavaScript Editing with Firepad!');
        }
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
});
