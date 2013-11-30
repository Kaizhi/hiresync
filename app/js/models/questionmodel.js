define(['jquery', 'backbone', 'underscore', 'app'], function ($, Backbone, _, App){    
    //parent view for the cards style sidebar options
    var questionModel = Backbone.Model.extend({
        url: '/api/questions',
        initialize: function(options){
            this.title = options.title;
            this.content = options.content;
            this.language = options.language;
        },


    })

    return questionModel;
});