define(['jquery', 'backbone', 'underscore', 'app'], function ($, Backbone, _, App){    
    var editorOptionsView = Backbone.View.extend({
        el: $('.card'),
        dropdownItemTemplate: _.template($("#editor-dropdown-list-item-tpl").html()),
        events: {
            'click .codrop-dropdown': 'onDropdownClicked',
            'click .syntax.codrop-dropdown li': 'selectMode',
            'click .theme.codrop-dropdown li': 'selectTheme'

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

        themeItems: [ //list of themes
            'Monokai',
            'Default'
        ],

        initialize: function(){
            $(document).click(function() {
                // all dropdowns
                $('.codrop-dropdown').removeClass('active');
            });

            this.render(this.syntaxItems, this.$el.find(".syntax"));
            this.render(this.themeItems, this.$el.find(".theme"));
            this.delegateEvents();
        },

        render: function(items, $el){
            var that = this,
                $fragment = $(document.createDocumentFragment());

            _.each(items, function(item, index){
                $fragment.append(that.dropdownItemTemplate({
                    item: item,
                    itemPath: item.toLowerCase()
                }));
            });  
            $el.find('ul').append($fragment);
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
            //special handling for clike languages
            switch (name) {
                case "java":
                    App.mainEditor.setOption('mode', 'text/x-java');
                    break;
                case "c":
                    App.mainEditor.setOption('mode', 'text/x-csrc');
                    break;
                case "c++":
                    App.mainEditor.setOption('mode', 'text/x-c++src');
                    break;
                case "c#":
                    App.mainEditor.setOption('mode', 'text/x-csharp');
                    break;
                default:
                    //load the style mode using require
                    require(['/bower_components/CodeMirror/mode/' + name + '/' + name + '.js'], function(){
                        App.mainEditor.setOption('mode', name);
                    });
                    break;
            }
            this.updateModeName(upperName);
        },

        updateModeName: function(upperName){
            this.$el.find(".syntax")[0].firstChild.nodeValue = upperName;
        },

        selectTheme: function(evt){
            evt.preventDefault();
            var name = $(evt.target).data('path'),
                upperName = $(evt.target).text();
            App.mainEditor.setOption('theme', name);
            this.$el.find(".theme")[0].firstChild.nodeValue = upperName;

        }
    })

    return editorOptionsView;
});