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

    var fbProfileUrl = 'https://graph.facebook.com/' + this.id + '/picture'
    this.fbProfileUrl = ko.observable(fbProfileUrl);
  }

  return User;
})();
