define(['jquery', 'backbone', 'underscore', 'app', 
    './userlist', 
    './editoroptions',
    './questionscard',
    '../models/recordingmodel',], 
    function ($, Backbone, _, App, UserListView, EditorOptionsView, QuestionsCard, RecordingModel){    
    //parent view for the cards style sidebar options
    var mainCard = Backbone.View.extend({
        el: $('.cards'),
        template: _.template($("#main-card-tpl").html()),
        
        events: {
            'click .newTemplate': 'newQuestion',
            'click .save-recording': 'saveRecording'
        },
        _RECORDING_STARTED: false,

        initialize: function(){
            var that = this;
            this.$el.html(this.template);
            this.render();          

            if (!window.user){
                //populate the auth only feature buttons with a tooltip hint
                $('.need-auth').addClass('hint--left').attr('data-hint', 'You must be logged in to use this feature');
            }
            this.recording = new RecordingModel();
            this.startRecording();
            this.listenTo(App.mainEditor, 'change', _.bind(this.onEditorChanged, this));

            $("#loader").on('click', function(){
                that.questionsCard.show();
            });
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
            if (!window.user){
                return;
            }
            this.questionsCard.show();
        },

        startRecording: function(){
            if (!window.user){
                return;
            }
            this._RECORDING_STARTED = true;
        },

        onEditorChanged: function(){
            if (this._RECORDING_STARTED){
                var evt = {};
                evt.contents = App.mainEditor.getValue();
                evt.time = Math.round(performance.now());
                this.recording.get('events').push(evt);
            }
        },

        //persist recording to server
        saveRecording: function(){
            if (!window.user){
                return;
            }
            this.recording.save(null, {});
        },


    })

    return mainCard;
});