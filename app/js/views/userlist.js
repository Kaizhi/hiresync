define(['jquery', 'backbone', 'underscore', 'app'], function ($, Backbone, _, App){    
    var userListView = Backbone.View.extend({
        el: $('#users'),
        template: _.template($("#user-list-item-tpl").html()),
        events: {
            'blur li[contenteditable="true"]': 'onNameChanged',
            'keyup li[contenteditable="true"]': 'onEnterKeyPressed'
        },

        initialize: function(){
            this.listenTo(App.socket, 'users:update', _.bind(this.render, this));
            if (typeof window.user !== 'undefined'){
                App.socket.emit('name:change', window.user);
            }            
        },

        render: function(users){
            var that = this,
                $fragment = $(document.createDocumentFragment());

            _.each(users, function(user, index){
                var contenteditable = false;
                if (App.socket.socket.sessionid === user.id){
                    //if this is user name for this client, we change the name in the list to contenteditable
                    contenteditable = true;
                }
                $fragment.append(that.template({
                    name: user.userName,
                    contenteditable: contenteditable
                }));
            });  
            this.$el.html($fragment);
            App.spinner.stop();
        },

        onNameChanged: function(evt){
            App.socket.emit('name:change', evt.target.textContent);
        },

        onEnterKeyPressed: function(evt){
            if(evt.which === 13){
                this.onNameChanged(evt);
            }
        }
    })

    return userListView;
});