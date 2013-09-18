define(['jquery', 'backbone', 'underscore', 'app', 
    './userlist', 
    './editoroptions',
    './questionscard'], function ($, Backbone, _, App, UserListView, EditorOptionsView, QuestionsCard){    
    //parent view for the cards style sidebar options
    var mainCard = Backbone.View.extend({
        el: $('.cards'),
        template: _.template($("#main-card-tpl").html()),
        
        events: {
            'click .newTemplate': 'newQuestion'
        },

        initialize: function(){
            this.$el.html(this.template);
            this.render();          
        },

        render: function(){
            this.userListView = new UserListView({
                el: this.$el.find('#users')
            });
            this.editorOptionsView = new EditorOptionsView({
                el: this.$el.find('.card')
            });

            this.questionsCard = new QuestionsCard();

        },

        newQuestion: function(){
            this.questionsCard.show();
        },

    })

    return mainCard;
});