var GAME_LOCATION = 'http://gamma.firebase.com/firstlife/';
var dataReference = new Firebase(GAME_LOCATION);
var room = getURLParameter("room");
if( room != "null"){
	dataReference = new Firebase(GAME_LOCATION+room+"/");
}

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

function addMyScoreBy(score){

	if(FLApp.localUser){
		var user = FLApp.localUser();
		usersRef.child(user.id).child("score").set(user.score + score);
	}
}

function buildUser( userSnapShot ) {
	var d = userSnapShot;
	var data = d['fbData'];
	data['role'] = d['role'];
	data['score'] = d['score'];
	data['kickedBy'] = d['kickedBy'];
	data['status'] = d['status']? d['status']: 'online';
	return new User(data);
}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

var FLModel = {

	createUser: function (userId, userData, callback) {

		usersRef.child(userId).transaction(function(snapshot) {
			if(snapshot===null){
				return { role:"", score:0, kickedBy:-1, fbData: userData };
			}
	  }, function(success, snapshot) {

	  		if (snapshot.val().role == "") {
				usersRef.once("value", function(playerList) {
					var playerList = playerList.val();

					var role = "nicehole";
					var size = arrayFromObject(playerList).length;
					if((size-1) % 2 == 0) {
						role = "asshole";
					}
					usersRef.child(userId).child("role").set(role);

					callback(userId);
				});
			}
			else {
				usersRef.child(userId).child("kickedBy").transaction(function(snapshot) {
					if (snapshot != -1) {
						return -1;
					}
					return snapshot;
				}, function(success, snapshot) {
					callback(userId);
				});
			}
			usersRef.child(userId).removeOnDisconnect();
			FLModel.setUserStatus(userId,'online');
			
	  });

	},

	bindUserChange: function(userId, callback) {
		usersRef.child(userId).on('value', function(snapshot) {
			var user = buildUser(snapshot.val());

			callback(user);
		});
	},

	bindUsersChange: function(callback){
		usersRef.on('value', function(snapshot) {
			var userSnapShots = arrayFromObject(snapshot.val());
			var users = new Array();
			for(i=0; i< userSnapShots.length; i++) {
				users.push(buildUser( userSnapShots[i] ));
			}

			callback(_(users).sortBy(function(user){ return -(user['score']); }));
		});

	},

	checkIfUserExists: function (userId) {
	  usersRef.child(userId).once('value', function(snapshot) {
	    var exists = (snapshot.val() !== null);
	    //alert(exists);
	  });
	},

	kick: function(localUser, targetId) {
		addMyScoreBy(10);
		usersRef.child(targetId).child("kickedBy").set(localUser.id);
	},

	clearKickedBy: function(localUser) {
		usersRef.child(localUser.id).child("kickedBy").set(-1);
	},

	bindUserKickedByChange: function(localUserId, callback) {
		usersRef.child(localUserId).child("kickedBy").on('value', function(snapshot) {
			var kickedBy = snapshot.val();

			if (kickedBy != -1) {
				var theGuessList = FLApp.allUsers().slice();
				var theAsshole;
				theGuessList = _.reject(theGuessList, function(user) 
					{ 
						if (user.id == kickedBy) {
							theAsshole = user;
							return true;
						}
						else
							return user.id == FLApp.localUser().id;
					});

				var others = _.shuffle(theGuessList).slice(0, 2);
				others.push(theAsshole);
				theGuessList = _.shuffle(others);

				callback(kickedBy, theGuessList);
			}
		});
	},

	bindUserRoleChange: function(localUserId, callback) {
		usersRef.child(localUserId).child("role").on('value', function(snapshot) {
			callback(snapshot.val());
		});
	},

	guess: function(localUser, kickedBy, guessId) {
		if(kickedBy == guessId){
			addMyScoreBy(20);
			usersRef.child(localUser.id).child("kickedBy").set(-1);

			// swap roles
			usersRef.child(localUser.id).child("role").set("asshole");
			usersRef.child(kickedBy).child("role").set("nicehole");

			return true;
		}else{

			usersRef.child(localUser.id).child("kickedBy").set(-1);
			return false;
		}
	},
	
	setUserStatus: function(userId, status) {
	  usersRef.child(userId).child('status').transaction(function(snapshot){
			return status;
		});
	}
}




