// ! TEMPLATE LOGIC ! //

// template - top-level lobby
Template.lobby.inGame = function() {
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.gameId;
};
// in-game
Template.lobby.game = function () {
    var gameId = getPlayerGame();
    return Games.findOne({_id: gameId});
};
Template.lobby.events({
    'click .exit': function() {
        exitGame();
    }
});
// out-game
var hasGames = function() {
    return Games.find().count() > 0;
};
Template.lobby.hasGames = function() {
    return hasGames();
};
Template.lobby.listGames = function() {
    return Games.find();
};
// out-game create game text input
Template.game_create.events({
    'keypress #game_name': function(event, template) {
        var code = (event.keyCode ? event.keyCode : event.which);
        if (code == 13) { //Enter keycode
            var gameName = template.find("#game_name").value;
            createGame(gameName);
        }
    }
});

// template - game item
Template.game_item.isOwner = function() {
    return this.owner === Meteor.userId();
};
Template.game_item.events({
    'click .enter': function() {
        enterGame(this._id);
    },
    'click .start': function() {
        startGame(getPlayerGame());
    },
    'click .trash': function() {
        if (confirm("Are you sure you want to delete this game?")) {
            exitGame();
            game_log_delete_all(this._id);
            Games.remove(this._id);
        }
    }
});

// template - player listing in-game
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
Template.game_players.disabledViewer = function() {
    if (getGameOwner(getPlayerGame()) === Meteor.userId())
        return '';
    else
        return ' disabled="disabled"';
};
Template.game_players.selectedMrx = function() {
    if (getGameMrX(getPlayerGame()) === Meteor.userId())
        return ' selected="selected"';
    else
        return '';
};
Template.game_players.selectedPolice = function() {
    var policeArray = getGamePolice(getPlayerGame());
    if (policeArray && (policeArray.indexOf(Meteor.userId()) > -1))
        return ' selected="selected"';
    else
        return '';
};

// template - game log items
Template.game_log.listLogs = function() {
    return game_log_get_all(getPlayerGame());
};
Template.game_log.events({
    'keypress #new_message': function(event, template) {
        var code = (event.keyCode ? event.keyCode : event.which);
        if (code == 13) { //Enter keycode
            var newMessage = template.find("#new_message").value;
            game_log_add(getPlayerGame(), newMessage);
        }
    }
});


// ! GAME DATA LOGIC ! //

var createGame = function(gameName) {
    check(gameName, String);
    var gameId = Games.insert(
        {
            name: gameName,
            owner: Meteor.userId(),
            police: [],
            mrx: "",
            running: false
        }
    );
    return gameId;
};

// current user enter/exit game profile/session update
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

    Meteor.users.update(
        {_id: Meteor.userId()},
        {
            $set: {profile: userObj.profile}
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

// game owner functions for control start/stop, adding Police, Mr. X
var getGameById = function(gameId) {
    if (gameId)
        return Games.findOne({_id: gameId});
    return null;
};
var getGameOwner = function(gameId) {
    var game = getGameById(gameId);
    if (game && game.owner)
        return game.owner;
    return '';
};
var getGameMrX = function(gameId) {
    var game = getGameById(gameId);
    if (game && game.mrx)
        return game.mrx;
    return '';
};
var setGameMrX = function(gameId, playerUserId) {
    check(gameId, String);
    check(playerUserId, String);
    var affectedRows = Games.update(
        {_id: gameId, owner: Meteor.userId()},
        {
            $set: {mrx: playerUserId}
        }
    );
    return affectedRows;
};
var getGamePolice = function(gameId) {
    var game = getGameById(gameId);
    if (game && game.police)
        return game.police;
    return [];
};
var setGamePolice = function(gameId, policeUserIds) {
    check(gameId, String);
    check(policeUserIds, Array);
    var affectedRows = Games.update(
        {_id: gameId, owner: Meteor.userId()},
        {
            $set: {police: policeUserIds}
        }
    );
    return affectedRows;
};
var startGame = function(gameId) {
    check(gameId, String);
    var affectedRows = Games.update(
        {_id: gameId, owner: Meteor.userId()},
        {
            $set: {running: true}
        }
    );
    return affectedRows;
};
var stopGame = function(gameId) {
    check(gameId, String);
    var affectedRows = Games.update(
        {_id: gameId, owner: Meteor.userId()},
        {
            $set: {running: false}
        }
    );
    return affectedRows;
};


//! LOGGING OF GAME ACTIONS/MESSAGES ! //
var game_log_add = function(gameId, textData) {
    check(gameId, String);
    check(textData, String);
    var gameLogId = GameLog.insert(
        {
            gameId: gameId,
            owner: Meteor.userId(),
            owner_name: Meteor.user().profile.name,
            textData: textData,
            time: new Date()
        }
    );
    return gameLogId;
};
var game_log_get_all = function(gameId) {
    check(gameId, String);
    var gameLogItems = GameLog.find(
        {gameId: gameId},
        {sort: {time: 1}}
    ).fetch();
    // get all log items associated with game, sort ASC by timestamp
    // time baked into _id - http://stackoverflow.com/a/5128574
    return gameLogItems;
};
var game_log_delete_all = function (gameId) {
    check(gameId, String);
    var gameLogItems = game_log_get_all(gameId);
    gameLogItems.forEach(function (logItem) {
        GameLog.remove({_id: logItem._id});
    });
};
