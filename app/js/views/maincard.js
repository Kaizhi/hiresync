define(['jquery', 'backbone', 'underscore', 'app', 
    './userlist', 
    './editoroptions',
    './savequestionmodal'], function ($, Backbone, _, App, UserListView, EditorOptionsView, SaveQuestionModal){    
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

            this.saveQuestionModal = new SaveQuestionModal();

        },

        newQuestion: function(){
            this.saveQuestionModal.show();
        },

    })

    return mainCard;
});