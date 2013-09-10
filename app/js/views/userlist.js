define(['jquery', 'backbone', 'underscore', 'app'], function ($, Backbone, _, App){    
    var userListView = Backbone.View.extend({
        el: $('#users'),
        template: _.template($("#user-list-item-tpl").html()),
        events: {
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
                $fragment.append(that.template({
                    name: user
                }));
            });  
            this.$el.html($fragment);
        }
    })

    return userListView;
});