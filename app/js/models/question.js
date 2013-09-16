define(['jquery', 'backbone', 'underscore', 'app'], function ($, Backbone, _, App){    
    //parent view for the cards style sidebar options
    var questionModel = Backbone.Model.extend({
        url: '/api/question',
        initialize: function(options){
            this.title = options.title;
            this.content = options.content;
        },


    })

    return questionModel;
});