define(['jquery', 'backbone', 'underscore', 'io', 'firepad', 'codemirror', 'codemirror-js', 'codemirror-clike', 'codemirror-loadmode'], function ($, Backbone, _, io, Firepad, CodeMirror) {
    'user strict';
    var App = App || {};
    var loc = document.URL.indexOf('app/');
    App.roomHash = document.URL.substr(loc + 4).replace('#', '');

    App.socket = io.connect(window.location.origin);
    App.socket.on('connect', function(){
        App.socket.emit('room', App.roomHash);
    });

    var firepadRef = new Firebase('devscreen.firebaseIO.com/' + App.roomHash);

    App.mainEditor = CodeMirror.fromTextArea($('#code')[0], {
        mode:  'javascript',
        lineNumbers:true,
        theme: 'monokai'
    });
    App.firepad = Firepad.fromCodeMirror(firepadRef, App.mainEditor);
    //// Initialize contents.

    return App;
});