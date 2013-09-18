define(['jquery', 'backbone', 'underscore', 'app'], function ($, Backbone, _, App){    
    //parent view for the cards style sidebar options
    var questionsCollection = Backbone.Collection.extend({
        url: '/api/questions',
        initialize: function(options){
        },


    })

    return questionsCollection;
});