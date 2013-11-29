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
            'click .save-recording': 'toggleRecordingModal',
        },
        _RECORDING_STARTED: false,

        initialize: function(){
            var that = this;
            this.$el.html(this.template);
            this.render();          

            this.$recordingModal = $(".recording-modal"); //cache selector

            if (!window.user){
                //populate the auth only feature buttons with a tooltip hint
                $('.need-auth').addClass('hint--left').attr('data-hint', 'You must be logged in to use this feature');
            }

            //start recording by default
            this.recording = new RecordingModel();
            this.startRecording();
            this.listenTo(App.mainEditor, 'change', _.bind(this.onEditorChanged, this));
            this.bindExternalEvents();
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

        bindExternalEvents: function(){
            var that = this;
            //hide the modal if the overlay is clicked when modal is active
            $("#loader").on('click', function(){
                that.questionsCard.show(); 
            });
            //hide modal on cancel click -- todo refactor into a subview maybe
            $('.recording-cancel').on('click', function(evt){
                evt.preventDefault();
                that.$recordingModal.toggle();
            });
            $('.recording-save').on('click', function(evt){
                evt.preventDefault();
                that.saveRecording();
            });
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

        onEditorChanged: function(instance, changeObj){
            if (this._RECORDING_STARTED){
                changeObj.time = Math.round(performance.now());
                this.recording.get('events').push(changeObj);
            }
        },

        //persist recording to server
        toggleRecordingModal: function(){
            if (!window.user){
                return;
            }
            this.$recordingModal.toggle();
        },

        saveRecording: function(){
            var that = this;
            //set the recording name to the input's value or 'untitled recording'
            var nameValue = $('.recording-name').val();
            if (nameValue.length > 0){
                this.recording.set('name', nameValue);
            }

            this.recording.set('language', App.mainEditor.getOption('mode'));
            //persist model to server
            this.recording.save(null, {
                success: function (model, response) {
                    console.log("success");
                    //on success, hide the modal and start a new recording
                    that.$recordingModal.toggle();
                    that.recording = new RecordingModel();
                    that._RECORDING_STARTED = true;
                },
                error: function (model, response) {
                }
            });
        },

        play: function(){
        },

    })

    return mainCard;
});