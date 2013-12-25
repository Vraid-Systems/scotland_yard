// template logic
Template.lobby.inGame = function() {
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.gameId;
};
Template.lobby.game = function () {
    var gameId = getPlayerGame();
    return Games.findOne({_id: gameId});
};
Template.lobby.events({
    'click .exit': function() {
        exitGame();
    }
});

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
            createGame(gameName);
        }
    }
});

Template.game_item.isOwner = function() {
    return this.owner === Meteor.userId();
};
Template.game_item.events({
    'click span': function() {
        enterGame(this._id);
    },
    'click .trash_button': function() {
        Games.remove(this._id);
    }
});

var listPlayers = function(gameId) {
    var userList = Meteor.users.find();

    var retUserList = [];
    userList.forEach(function (user) {
        if (user && user.profile && user.profile.online) {
            if (gameId) {
                if (user.profile.gameId === gameId)
                    retUserList.push(user);
            } else {
                retUserList.push(user);
            }
        }
    });

    return retUserList;
};
Template.game_players.listPlayers = function() {
    return listPlayers(getPlayerGame());
};
var hasPlayers = function(gameId) {
    return listPlayers(gameId).length > 0;
};
Template.game_players.hasPlayers = function() {
    return hasPlayers(getPlayerGame());
};
Template.game_players.events({
    'click span': function(event) {
        //handle CMD-click to add selected
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
    userObj.profile.online = true;

    // update self
    Meteor.users.update(
        { _id: Meteor.userId() },
        {
            $set: { profile: userObj.profile }
        }
    );
    Session.set("gameId", gameId);

    userObj = Meteor.user();
    return userObj.profile.gameId === gameId;
};
var getPlayerGame = function() {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.gameId) {
        return Meteor.user().profile.gameId;
    }

    return Session.get("gameId");
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
