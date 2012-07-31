// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  var Member = Backbone.Model.extend({
    idAttribute: "id",
    
    // Remove this Todo from *localStorage* and delete its view.
    clear: function() {
      alert('about to destroy ' + this.get('name'));
      this.destroy();
    }    
  });

  var MemberList = Backbone.Collection.extend({
    model: Member,
    url: "http://localhost:8080/jboss-javaee6-webapp/rest/members"
  });

  var MemberGridView = Backbone.View.extend({

    el: $('#memberGrid'),

    initialize: function() {
      this.model.bind("reset", this.render, this);
    },

    template: _.template($('#memberGrid-template').html()),

    render: function() {
      $(this.el).html(this.template( { members: this.model.models }));
      return this;
    }

  })

  // Views
  var MemberListView = Backbone.View.extend({
   
    tagName: 'tbody',   //dom element for the members list

    initialize:function () {
      this.model.bind("reset", this.render, this);
    },

    render: function (eventName) {
      _.each(this.model.models, function (member) {
        $(this.el).append(new MemberView({model:member}).render().el);
      }, this);
      return this;
    }

  });

  var MemberView = Backbone.View.extend({

    tagName: 'tr',   //dom element a single member

    template: _.template($('#member-template').html()),

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    events: {
      "click a.delete"  : "clear",
      "click div.edit"  : "edit"
    },

    // The MemberView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Member** and a **MemberView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.model.bind('destroy', this.remove, this);
    },

    // Remove the item, destroy the model.
    clear: function() {
      alert('about to delete ' + this.model.get('name'));
      this.model.clear();
    },
    
    edit: function() {
      var template = _.template($('#memberEdit-template').html())
      $('#memberEdit').html(template(this.model.toJSON()))
    }

  });

  this.memberList = new MemberList();
  this.memberListView = new MemberListView({model:this.memberList});
  this.memberList.fetch();

  //this.memberGridView = new MemberGridView({model:this.memberList});

  $('#navbar').html($('#navbar-template').html())
  $('#breadcrumb').html($('#breadcrumb-template').html())
  
  $('#members').html($('#memberList-template').html())
  $('#members table tbody').replaceWith(this.memberListView.render().el);

  //$('#memberEdit').html($('#memberEdit-template').html());

});
