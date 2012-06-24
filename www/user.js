/**
  var user = new User({
    email: "tothemario@gmail.com"
    facebookUrl: function c(){if(0<arguments.length){if(!c.equalityComparer||!c.equalityComparer(d,arguments[0]))c.I(),d=arguments[0],c.H();return this}a.U.La(c);return d}
    first_name: "Mario"
    gender: "male"
    id: "1058178116"
    last_name: "Tothe"
    link: "http://www.facebook.com/tothemario"
    locale: "en_GB"
    name: "Tothe Mario"
    role: "nice"
    timezone: -7
    updated_time: "2012-04-24T22:28:06+0000"
    username: "tothemario"
    verified: true
  });
*/

User = (function() {

  function User(attrs) {
    _.extend(this, attrs); // assign all attributes

    var fbProfileUrl = 'https://graph.facebook.com/' + this.id + '/picture&type=square';
    this.fbProfileUrl = ko.observable(fbProfileUrl);

    var fbProfileUrlBig = 'https://graph.facebook.com/' + this.id + '/picture&type=normal';
    this.fbProfileUrlBig = ko.observable(fbProfileUrlBig);
  }

  User.prototype.leaderboardPosition = function() {
    var self = this;
    if (FLApp.allUsers().length > 0) {
      var found = false;
      var i = 0;
      console.log('looking for my id: ', self.id);
      _.each(FLApp.allUsers(), function() {
        if (found == false) {
          var user = FLApp.allUsers()[i];
          console.log(i, ', user.id=', parseInt(user.id), ', self.id=', parseInt(self.id));
          if (parseInt(user.id) == parseInt(self.id)) {
            found == true;
            console.log('found on i == ', i)
          } else {
            i++;
          }
        }
      });
    }
    return i+1; // +1 because the leaderboard is 1-based index
  };

  return User;
})();
