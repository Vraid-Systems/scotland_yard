// for game players
var enterGame = function(gameId) {
    var affectedRows = Meteor.users.update(
        { _id: Meteor.userId() },
        {
            $set: { gameId: gameId }
        }
    );
    return affectedRows;
};
var exitGame = function(gameId) {
    var affectedRows = Meteor.users.update(
        { _id: Meteor.userId() },
        {
            $set: { gameId: "" }
        }
    );
    return affectedRows;
};

// for game managers
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
