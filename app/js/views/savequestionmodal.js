define(['jquery', 'backbone', 'underscore', 'app', '../models/questionmodel'], function ($, Backbone, _, App, QuestionModel){    
    //parent view for the cards style sidebar options
    var saveQuestionModal = Backbone.View.extend({
        el: $('.modal'),        
        events: {
            'click .save': 'save',
            'click .cancel': 'cancel'
        },

        initialize: function(){
            console.log(this.$el);
        },

        render: function(){
        },

        save: function(evt){
            evt.preventDefault();
            var question = new QuestionModel({
                title: this.$el.find('input').val(),
                content: this.$el.find('textarea').val()
            });
            question.save();

        },

        show: function(){
            this.$el.show();
        },

        cancel: function(evt){
            evt.preventDefault();
            this.$el.hide();
        }

    })

    return saveQuestionModal;
});