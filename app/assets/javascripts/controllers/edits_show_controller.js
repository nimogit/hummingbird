HB.EditsShowController = Ember.Controller.extend({
  ignoredProps: [
    'poster_image_updated_at',
    'poster_image_content_type',
    'cover_image_updated_at',
    'cover_image_content_type'
  ],
  attachmentProps: [
    'poster_image_updated_at',
    'cover_image_updated_at'
  ],

  changes: function() {
    var html = [];
    var objectChanges = this.get('model.objectChanges');
    for (var key in objectChanges) {
      // show attachment previews
      if (this.get('attachmentProps').contains(key)) {
        var stripped = key.substr(0, key.indexOf('_updated_at'));
        var code = '<img class="' + stripped + '" src="' + this.get('model.object')[stripped] + '"/>';
        html.push([ stripped, new Handlebars.SafeString(code)]);
      }

      // skip ignored properties
      if (this.get('ignoredProps').contains(key)) { continue; }

      // htmldiff doesn't like null values
      var change = objectChanges[key];
      change[0] = change[0] || "";
      change[1] = change[1] || "";

      var diff = htmldiff(change[0].toString(), change[1].toString());
      html.push([ key, new Handlebars.SafeString(diff)]);
    }
    return html;
  }.property('model.objectChanges'),

  actions: {
    approveEdit: function() {
      this.get('model').save().then(function() {
        this.transitionToRoute('edits.index');
        Messenger().post('Edit was approved!');
      }.bind(this));
    },

    rejectEdit: function() {
      var res = window.confirm("Are you sure you want to reject this edit?");
      if (!res) { return; }
      this.get('model').destroyRecord().then(function() {
        this.transitionToRoute('edits.index');
        Messenger().post('Edit was rejected.');
      }.bind(this));
    }
  }
});
