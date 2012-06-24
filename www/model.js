var GAME_LOCATION = 'http://gamma.firebase.com/firstlife/';
var dataReference = new Firebase(GAME_LOCATION);

var usersRef = dataReference.child('users_list');
var gamesRef = dataReference.child('games_list');

function arrayFromObject(obj){
	var arr = new Array(), key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) 
			arr.push(obj[key]);
	}
	return arr;
}


var FLModel = {
	createUser: function (userId, userData, callback) {

		usersRef.child(userId).transaction(function(snapshot) {
			if(snapshot===null){
				return { role:"", fbData: userData };
			}
	  }, function(success, snapshot) {
		
			usersRef.once("value", function(playerList) {
					var playerList = playerList.val(); 
					
					var role = "nice";
					var size = arrayFromObject(playerList).length;
					console.log(size);
				  if(size-1 % 5 == 0){
						role = "asshole";
					}
					usersRef.child(userId).child("role").set(role);
					
			   
			  });
	  });

	},
	allUsers: function(callback){
		usersRef.once('value', function(snapshot) {
			var users = arrayFromObject(snapshot.val());
			console.log(users);
		});
	},
	checkIfUserExists: function (userId) {
	  usersRef.child(userId).once('value', function(snapshot) {
	    var exists = (snapshot.val() !== null);
	    //alert(exists);
	  });
	}
}




