define(['jquery', 'backbone', 'underscore', 'app'], function ($, Backbone, _, App){    
    var recordingModel = Backbone.Model.extend({
        url: '/api/recording',

        initialize: function(options){
       		this.startTime = window.performance.now();
        	this.events = [];
        },

        play: function(editorInstance){
        	this.editor = editorInstance;
        	this.doPlayback(0);
        },

        /*playback the recording by looping through the events array
          at the delta time interval and outputting the contents 
          to the specififed editorInstance*/
        doPlayback: function(i){
            var that = this;

            if (i > this.events.length - 1){
                return; 
            }
            if (i === 0){
                var timer = this.events[i].time - this.startTime;
            } else {
                var timer = this.events[i].time - this.events[i-1].time;
            }
            var data = this.events[i].contents;

            (function(data, timer){
                setTimeout(function(){
                    that.editorInstance.setValue(data);
                    that.doPlayback(i+1);
                }, timer);
            })(data, timer);
        },


    })

    return recordingModel;
});