// User Class
// var user = new User({facebookId: 1235, randomAttr: 'asdfs'});
User = (function() {

  function User(attrs) {
    _.extend(this, attrs);
  }

  return User;

})();
