$.FollowToggle = function (el, options) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id") || options.userId;
  this.followState = this.$el.data("initial-follow-state") || options.followState;

  this.render();
  this.$el.on('click', this.handleClick.bind(this));
};

$.FollowToggle.prototype.render = function () {
  var text = "";
  if(this.followState == "unfollowed") {
    text = "Follow!";
    this.$el.prop("disabled", false);
  } else if (this.followState == "followed") {
    text = "Unfollow!";
    this.$el.prop("disabled", false);
  } else {
    this.$el.prop("disabled", true);
    text = "Sending Request";
  }

  this.$el.text(text);
};

$.FollowToggle.prototype.handleClick = function(event) {
  event.preventDefault();
  var that = this;
  if(that.followState === 'unfollowed') {
    that.followState = "following";
    that.render();

    $.ajax({
      url: '/users/' + that.userId + '/follow',
      type: 'POST',
      dataType: 'json',
      success: function() {
        that.followState = 'followed';
        that.render();
      },
      error: function(followObject) {
        console.log(followObject.errors.full_messages);
      }
    })
  } else {
    that.followState = "unfollowing";
    that.render();
    $.ajax({
      url: '/users/' + that.userId + '/follow',
      type: 'DELETE',
      dataType: 'json',
      success: function() {
        that.followState = 'unfollowed';
        that.render();
      },
      error: function(followObject) {
        console.log(followObject.errors.full_messages);
      }
    })
  }
}

$.fn.followToggle = function (options) {
  return this.each(function () {
    new $.FollowToggle(this, options);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});
