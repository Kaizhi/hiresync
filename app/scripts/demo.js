require.config({
    paths: {
        'jquery': '../bower_components/jquery/jquery',
        'jquery.cookie': '../bower_components/jquery.cookie/jquery.cookie',
        'codemirror-js': '../bower_components/CodeMirror/mode/javascript/javascript',
        'io': '../bower_components/socket.io-client/dist/socket.io',
        'firepad': '../scripts/firepad',
        'backbone': '../bower_components/backbone/backbone-min',
        'underscore': '../bower_components/underscore/underscore-min'
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

require(['jquery', 'backbone', 'underscore', 'io', 'firepad', 'jquery.cookie'], function ($, Backbone, _, io, Firepad) {
    'use strict';

    _.templateSettings = { 'interpolate' : /{{([\s\S]+?)}}/g };

    String.prototype.hashCode = function(){
        var hash = 0, i, l, char;
        if (this.length === 0) return hash;
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

    var socket = io.connect('http://localhost');

    var userListView = Backbone.View.extend({
        el: $('#users'),
        template: _.template($("#user-list-item-tpl").html()),
        events: {
        },

        initialize: function(){
            this.listenTo(socket, 'users:update', _.bind(this.render, this));            
        },

        render: function(users){
            var that = this,
                $fragment = $(document.createDocumentFragment());

            console.log(users);
            _.each(users, function(user, index){
                $fragment.append(that.template({
                    name: user.name
                }));
            });  
            this.$el.html($fragment);
        }
    })
    var UserListView = new userListView();

    
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
