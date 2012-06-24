var GAME_LOCATION = 'http://gamma.firebase.com/firstlife/';
var dataReference = new Firebase(GAME_LOCATION);

var usersRef = dataReference.child('players_list');
var gamesRef = dataReference.child('games_list');

var FLModel = {
	createUser: function (userId, userData, callback) {

		usersRef.child(userId).transaction(function(snapshot) {
			if (snapshot === null) {
				usersRef.transaction(function(snapshot){
					var user = new Array();
					user[userId]={
						name: userData.name,
						email: userData.email,
						link: userData.link,
						gender: userData.gender
					};
					usersRef.push(user);
					callback(userId, userData);
				});
			}

	  }, function(success, snapshot) {
				// callback if user_id is not found
				if(success)
	    		callback(userId, snapshot);
	  });

	}
}




