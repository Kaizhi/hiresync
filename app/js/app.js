define(['jquery', 'backbone', 'underscore', 'io', 'firepad', 'spin', 'codemirror', 'codemirror-js', 'codemirror-clike', 'codemirror-loadmode'], function ($, Backbone, _, io, Firepad, Spinner, CodeMirror) {
    'user strict';
    var App = App || {};
    var loc = document.URL.indexOf('app/');
    App.roomHash = document.URL.substr(loc + 4).replace('#', '');

    //create the spinner
    var opts = {
      lines: 6, // The number of lines to draw
      length: 11, // The length of each line
      width: 15, // The line thickness
      radius: 23, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 17, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#fff', // #rgb or #rrggbb or array of colors
      speed: 0.7, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: true, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };
    
    var target = document.querySelector('#loader');
    App.spinner = new Spinner(opts).spin(target);

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