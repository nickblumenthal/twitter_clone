$.TweetCompose = function(el, options) {
  this.$el = $(el);

  this.$el.on('submit', this.submit.bind(this));
  this.$el.on('input', 'textarea', function(event) {
    var $textarea = $(event.currentTarget);
    var charactersLeft = 140 - $textarea.val().length;
    $(".chars-left").text(charactersLeft);
  })
  this.$el.on('click', '.add-mentioned-user', this.addMentionedUser)
  this.$el.on('click', '.remove-mentioned-user', function(event){
    var $target = $(event.currentTarget);
    $target.parent().remove();
  })
}

$.TweetCompose.prototype.addMentionedUser = function() {
  var html = $(".mention-users-template").html();
  $(".mentioned-users").append(html);
}

$.TweetCompose.prototype.submit = function(event) {
  var that = this;

  event.preventDefault();


  $.ajax({
    url: "/tweets",
    method: "POST",
    dataType: "json",
    data: this.$el.serializeJSON(),
    success: function(tweet){
      that.handleSuccess(tweet);
    },
    error: function(tweet){
      console.log(tweet.responseText);
    }
  })

  $(":input").prop('disabled', true);

}

$.TweetCompose.prototype.clearInput = function() {
  this.$el.find("textarea").val("");
  $(".mentioned-users").empty();
}

$.TweetCompose.prototype.handleSuccess = function(tweet) {
  this.clearInput();
  $(":input").prop('disabled', false);
  var ulId = this.$el.data("tweets-ul");
  var $ul = $(ulId);
  tweetString = JSON.stringify(tweet);
  var $li = $("<li>").text(tweetString);
  $ul.prepend($li);
}

$.fn.tweetCompose = function (options) {
  return this.each(function () {
    new $.TweetCompose(this, options);
  });
};

$(function () {
  $(".tweet-compose").tweetCompose();
});
