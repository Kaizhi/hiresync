define(['jquery', 'backbone', 'underscore', 'io', 'firepad'], function ($, Backbone, _, io, Firepad) {
    'user strict';
    var App = App || {};
    var loc = document.URL.indexOf('app/');
    App.roomHash = document.URL.substr(loc + 4);

    App.socket = io.connect('http://localhost');
    App.socket.on('connect', function(){
        App.socket.emit('room', App.roomHash);
    });

    var firepadRef = new Firebase('devscreen.firebaseIO.com/' + App.roomHash);
    window.editor = CodeMirror.fromTextArea($('#code')[0], {
        mode:  'javascript',
        lineNumbers:true,
        theme: 'monokai'
    });
    App.firepad = Firepad.fromCodeMirror(firepadRef, window.editor);
    //// Initialize contents.
    App.firepad.on('ready', function() {
        if (App.firepad.isHistoryEmpty()) {
            App.firepad.setText('// JavaScript Editing with Firepad!');
        }
    });

    return App;
});