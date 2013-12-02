define(['jquery', 'backbone', 'underscore', 'app', '../models/questionmodel', '../collections/questionscollection'], function ($, Backbone, _, App, QuestionModel, QuestionsCollection){    
    //parent view for the cards style sidebar options
    var questionsCard = Backbone.View.extend({
        el: $('.snippets'),        

        questionItemTemplate: _.template($("#user-list-item-tpl").html()),
        dropdownItemTemplate: _.template($("#editor-dropdown-list-item-tpl").html()),

        events: {
            'click .save': 'save',
            'click .load': 'load',
            'click .cancel' : 'cancel',
            'click .questions li:not(.new)': 'showSelectedQuestion',
            'click .questions li.new': 'prepareNewQuestion',
            'click .codrop-dropdown': 'onDropdownClicked',
            'click .syntax.codrop-dropdown li': 'selectMode',
        },

        syntaxItems: [ //list of languages
            'JavaScript',
            'CoffeeScript',
            'C',
            'C++',
            'C#',
            'Java',
            'Python',
            'Ruby',
            'Go',
            'Haskell',
            'Scala',
            'Clojure',
            'PHP'
        ],

        initialize: function(){
            this.questions = new QuestionsCollection();
            this.viewModel = new Backbone.Model();
            this.$title = this.$el.find('input');
            this.bIsShown = false; 
        },

        render: function(){
            this.$el.find('#questions-list').empty();
            this.$el.find('.syntax ul').empty();
            
            var that = this,
                $fragment = $(document.createDocumentFragment());

            $fragment.append( $(that.questionItemTemplate({
                name: 'Add New Snippet',
                contenteditable: 'false'
            })).addClass('new').append('<icon class="icon-plus"/>') );

            _.each(this.questions.models, function(question, index){
                $fragment.append(that.questionItemTemplate({
                    name: question.get('title'),
                    contenteditable: 'false'
                }));
            });

            this.$el.find("#questions-list").append($fragment);

            //create codemirror editor in the editor area
            this.editorInstance = CodeMirror.fromTextArea(this.$el.find('textarea')[0], {
                mode:  'javascript',
                lineNumbers:true,
                value: '//Find the sum of all the multiples of 3 or 5 below 1000.'
            });
            
            this.renderModeOptions();
        },

        renderModeOptions: function(){
            var that = this,
                $fragment = $(document.createDocumentFragment());

            _.each(this.syntaxItems, function(item, index){
                $fragment.append(that.dropdownItemTemplate({
                    item: item,
                    itemPath: item.toLowerCase()
                }));
            });  
            this.$el.find('.syntax ul').append($fragment);
        },

        onDropdownClicked: function(evt){
            $('.codrop-dropdown').not(evt.target).removeClass('active');
            $(evt.target).toggleClass('active');
            evt.stopPropagation();
        },

        selectMode: function(evt){
            evt.preventDefault();
            var name = $(evt.target).data('path'),
                upperName = $(evt.target).text();

            this.selectModeByName(name);
            this.updateModeName(upperName);
        },

        selectModeByName: function(name){
            var that = this;
            //special handling for clike languages
            switch (name) {
                case "java":
                    this.editorInstance.setOption('mode', 'text/x-java');
                    break;
                case "c":
                    this.editorInstance.setOption('mode', 'text/x-csrc');
                    break;
                case "c++":
                    this.editorInstance.setOption('mode', 'text/x-c++src');
                    break;
                case "c#":
                    this.editorInstance.setOption('mode', 'text/x-csharp');
                    break;
                default:
                    //load the style mode using require
                    require(['/bower_components/CodeMirror/mode/' + name + '/' + name + '.js'], function(){
                        that.editorInstance.setOption('mode', name);
                    });
                    break;
            }
        },

        updateModeName: function(upperName){
            this.$el.find(".syntax")[0].firstChild.nodeValue = upperName;
        },

        save: function(evt){
            evt.preventDefault();
            var question = new QuestionModel({
                title: this.$el.find('input').val(),
                content: this.editorInstance.getValue(),
                language: this.editorInstance.getOption('mode')
            });
            var that = this;
            question.save(null, {
                success: function(){
                    that.show();
                    that.show();
                },
                error: function(){
                    that.show();
                    that.show();
                }
            });

        },

        show: function(){
            var that = this;

            if (this.bIsShown === false){
                this.bIsShown = true;
                this.$el.show();
                $("#loader").addClass('overlay');
                this.questions.fetch().done(function(){
                    that.render();
                });
            } else {
                this.$el.hide();
                $("#loader").removeClass('overlay');

                this.editorInstance.toTextArea();
                this.bIsShown = false;
            }

        },

        showSelectedQuestion: function(evt){
            var index = $(evt.target).index();
            this.viewModel.set('selected', index);
            var selectedModel = this.questions.at(index - 1);

            this.$title.val( selectedModel.get('title') );
            this.editorInstance.setValue( selectedModel.get('content') );

            //update the question editor instance with the saved language
            if (selectedModel.has('language')){
                this.selectModeByName( selectedModel.get('language') );
                this.updateModeName( selectedModel.get('language') );
            }
        },

        prepareNewQuestion: function(evt){
            this.$title.val('');
            this.editorInstance.setValue('');
            this.viewModel.set('selected', -1);
        },

        load: function(evt){
            evt.preventDefault();
            App.firepad.setText(this.editorInstance.getValue());
        },

        cancel: function(evt){
            evt.preventDefault();
            this.$el.hide();
        }

    })

    return questionsCard;
});