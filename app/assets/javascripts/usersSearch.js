$.UsersSearch = function (el) {
  this.$el = $(el);
  this.$input = this.$el.find('.search-field');
  this.$ul = this.$el.find('ul.users');

  this.$input.on('input', this.handleInput.bind(this));
}

$.UsersSearch.prototype.handleInput = function(event) {
  var that = this;

  $.ajax({
    url: '/users/search',
    method: 'GET',
    dataType: 'json',
    data: this.$input.serialize(),
    success: function(users){
      that.renderResults(users);
    },
    error: function(users){
      console.log(users.errors.full_messages);
    }
  })
}

$.UsersSearch.prototype.renderResults = function(users){
  var that = this;
  that.$ul.html("");
  users.forEach(function(user){
    var $li = $("<li>");
    var $link = $("<a>").attr("href", '/users/' + user.id).text(user.username);
    var $button = $("<button>").addClass("follow-toggle");
    $button.followToggle({
      "userId" : user.id,
      "followState" : user.followed ? 'followed' : 'unfollowed'
    });
    $li.append($link).append($button);
    that.$ul.append($li);


    // that.$ul.append("<li><a href='/users/" + user.id + "'>" + user.username + "</a></li>");
  })
}

$.fn.usersSearch = function () {
  return this.each(function () {
    new $.UsersSearch(this);
  });
};

$(function () {
  $("div.users-search").usersSearch();
});
