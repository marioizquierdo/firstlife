var GAME_LOCATION = 'http://gamma.firebase.com/firstlife/';
var dataReference = new Firebase(GAME_LOCATION);

var usersRef = dataReference.child('users_list');
var gamesRef = dataReference.child('games_list');

usersRef.on('child_added', function(childSnapshot, prevChildName) {
	
});

var FLModel = {
	createUser: function (userId, userData, callback) {

		usersRef.child(userId).transaction(function(snapshot) {
			if(snapshot===null){
				return { role:"", fbData: userData };
			}
	  }, function(success, snapshot) {
		
			usersRef.transaction(function(playerList) {

			    if (playerList === null) {
			      playerList = [];
			    }
					
					var role = "nice";
					var size = 0, key;
					for (key in playerList) {
						if (playerList.hasOwnProperty(key)) size++;
					}
					console.log(size);
				  if(size-1 % 5 == 0){
						role = "asshole";
					}
					usersRef.child(userId).child("role").set(role);
					
			   
			  }, function (success) {
			  	callback();
			  });
	  });

	},
	
	checkIfUserExists: function (userId) {
	  usersRef.child(userId).once('value', function(snapshot) {
	    var exists = (snapshot.val() !== null);
	    //alert(exists);
	  });
	}
}




