
$(function() {

	var Wine = Backbone.Model.extend({ });

	var Wines = Backbone.Collection.extend({
		model: Wine,
		url: 'http://localhost:8080/cellar/rest/wines'
	});

  var WinesView = Backbone.View.extend({

    tagName: 'tbody',

    initialize:function () {
      this.model.bind('reset', this.render, this);
    },

    render: function() {
      _.each(this.model.models, function(wine) {
        var view = new WineView({model: wine});
        $(this.el).append(view.render().el);
      }, this);
      return this;      
    }

  });

	var WineView = Backbone.View.extend({
		tagName: 'tr',
		template: _.template($('#wine-template').html()),

    render: function(wine) {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    initialize: function() {
      this.model.bind('destroy', this.remove, this)
    },

    events: {
      'click a.delete': 'delete'
    },

    delete: function(e) {
      e.preventDefault();
      alert('about to delete ' + this.model.get('name') + '(' + this.model.get('id') + ')');
      this.model.destroy();
    }

	});

  this.wines = new Wines();
  this.winesView = new WinesView({model: this.wines});
  this.wines.fetch();

  $('#wines').html($('#wines-template').html());
  $('#wines tbody').replaceWith(this.winesView.render().el);
  
  $('#navbar').html($('#navbar-template').html());
  $('#breadcrumb').html($('#breadcrumb-template').html());

});