define(['jquery', 'backbone', 'underscore', 'app', '../models/questionmodel', '../collections/questionscollection'], function ($, Backbone, _, App, QuestionModel, QuestionsCollection){    
    //parent view for the cards style sidebar options
    var questionsCard = Backbone.View.extend({
        el: $('.modal'),        
        questionItemTemplate: _.template($("#user-list-item-tpl").html()),
        events: {
            'click .save': 'save',
            'click .load': 'load',
            'click .cancel' : 'cancel',
            'click .questions li:not(.new)': 'showSelectedQuestion',
            'click .questions li.new': 'prepareNewQuestion'
        },

        initialize: function(){
            this.questions = new QuestionsCollection();
            this.viewModel = new Backbone.Model();
            this.$title = this.$el.find('input');
            this.$content = this.$el.find('textarea');
            this.isShown = false;

        },

        render: function(){
            this.$el.find('#questions-list').empty();
            var that = this,
                $fragment = $(document.createDocumentFragment());

            $fragment.append( $(that.questionItemTemplate({
                name: 'Add New Question',
            })).addClass('new').append('<icon class="icon-plus"/>') );

            _.each(this.questions.models, function(question, index){
                $fragment.append(that.questionItemTemplate({
                    name: question.get('title')
                }));
            });

            this.$el.find("#questions-list").append($fragment);
        },

        save: function(evt){
            evt.preventDefault();
            var question = new QuestionModel({
                title: this.$el.find('input').val(),
                content: this.$el.find('textarea').val()
            });
            var that = this;
            question.save(null, {
                success: function(){
                    that.show();
                },
                error: function(){
                    that.show();
                }
            });

        },

        show: function(){
            var that = this;

            if (this.isShown === false){
                this.isShown = true;
                this.$el.show();
                this.questions.fetch().done(function(){
                    that.render();
                });
            } else {
                this.$el.hide();
                this.isShown = false;
            }

        },

        showSelectedQuestion: function(evt){
            var index = $(evt.target).index();
            this.viewModel.set('selected', index);
            this.$title.val( this.questions.at(index - 1).get('title') );
            this.$content.val( this.questions.at(index - 1).get('content') );

        },

        prepareNewQuestion: function(evt){
            this.$title.val('');
            this.$content.val('');
            this.viewModel.set('selected', -1);
        },

        load: function(evt){
            evt.preventDefault();
            App.firepad.setText(this.$content.val());
        },

        cancel: function(evt){
            evt.preventDefault();
            this.$el.hide();
        }

    })

    return questionsCard;
});