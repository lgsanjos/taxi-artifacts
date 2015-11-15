function saveCookie (key, value, minutes) {
  var expires;
  if (minutes) {
    var date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  }
  else {
    expires = "";
  }
  document.cookie = key + "=" + value + expires + "; path=/";
};

function readCookie(cname, defaultValue) {
  var name = cname + "=";
  var ca = document.cookie.split(';');

  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) {
      var value = c.substring(name.length,c.length);
      if (value === '')
        return defaultValue;

      return value;
    }
  }
  return defaultValue;
};

function removeCookie(key) {
  saveCookie(key, '', 0);
};

var AuthService = {

  KEY: 'user_key',

  saveUser: function (user) {
    var minutes = 4 * 60; // No idea, but 4 hours
    saveCookie(this.KEY, JSON.stringify(user), minutes);
  },

  validateUser: function () {
    return this.currentToken().length > 0;
  },

  signOff: function () {
    removeCookie(this.KEY);
  },

  readUser: function () {
    var user = JSON.stringify({ access_token: '' });

    var user = readCookie(this.KEY, user);
    return JSON.parse(user);
  },

  currentToken: function () {
    return this.readUser().access_token;
  },

  userName: function () {
    return this.readUser().username;
  }
};
