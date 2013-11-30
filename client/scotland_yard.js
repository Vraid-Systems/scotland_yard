// template logic
Template.lobby.show = function() {
    return !Meteor.user().gameId;
};

var hasGames = function() {
    return Games.find().count() > 0;
};
Template.lobby.hasGames = function() {
    return hasGames();
};
Template.lobby.listGames = function() {
    return Games.find();
};

Template.game_create.events({
    'keypress #game_name': function(event, template) {
        var code = (event.keyCode ? event.keyCode : event.which);
        if (code == 13) { //Enter keycode

            var gameName = template.find("#game_name").value;
            var gameId = createGame(gameName);
            if (enterGame(gameId)) {
                alert(gameName + " created");
            } else {
                alert(gameName + " failed to be created");
            }

        }
    }
});

Template.game_item.isOwner = function() {
    return this.owner === Meteor.userId();
};
Template.game_item.events({
    'click .trash_button': function() {
        Games.remove(this._id);
    }
});


// game data logic
var createGame = function(gameName) {
    check(gameName, String);
    var gameId = Games.insert(
        {
            name: gameName,
            owner: Meteor.userId(),
            players: [],
            mrx: "",
            running: false
        }
    );
    return gameId;
};

var enterGame = function(gameId) {
    return setPlayerGame(gameId);
};
var exitGame = function() {
    return setPlayerGame("");
};
var setPlayerGame = function(gameId) {
    var userObj = Meteor.user();
    if (!userObj.profile)
        userObj.profile = {};
    userObj.profile.gameId = gameId;

    Meteor.users.update(
        { _id: Meteor.userId() },
        {
            $set: { profile: userObj.profile }
        }
    );

    userObj = Meteor.user();
    return userObj.profile.gameId === gameId;
};

var setGameMrX = function(gameId, playerUserId) {
    check(gameId, String);
    check(playerUserId, String);
    var affectedRows = Games.update(
        { _id: gameId, owner: Meteor.userId() },
        {
            $set: { mrx: playerUserId }
        }
    );
    return affectedRows;
};
var setGamePlayers = function(gameId, playerUserIds) {
    check(gameId, String);
    check(playerUserIds, Array);
    var affectedRows = Games.update(
        { _id: gameId, owner: Meteor.userId() },
        {
            $set: { players: playerUserIds }
        }
    );
    return affectedRows;
};
var startGame = function(gameId) {
    check(gameId, String);
    var affectedRows = Games.update(
        { _id: gameId, owner: Meteor.userId() },
        {
            $set: { running: true }
        }
    );
    return affectedRows;
};
var stopGame = function(gameId) {
    check(gameId, String);
    var affectedRows = Games.update(
        { _id: gameId, owner: Meteor.userId() },
        {
            $set: { running: false }
        }
    );
    return affectedRows;
};
