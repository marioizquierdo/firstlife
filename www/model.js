var GAME_LOCATION = 'http://gamma.firebase.com/firstlife/';
var dataReference = new Firebase(GAME_LOCATION);

var usersRef = dataReference.child('users_list');
var gamesRef = dataReference.child('games_list');

var FLModel = {
	createUser: function (userId, userData, callback) {

		usersRef.child(userId).transaction(function(snapshot) {

			if(snapshot===null){
				return userData;
			}
	  }, function(success, snapshot) {
	  	callback();
	  });

	},
	checkIfUserExists: function (userId) {
	  usersRef.child(userId).once('value', function(snapshot) {
	    var exists = (snapshot.val() !== null);
	    //alert(exists);
	  });
	}
}




