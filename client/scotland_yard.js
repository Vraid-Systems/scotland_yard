Template.lobby.show = function () {
    return !Meteor.user().gameId;
};

var hasGames = function () {
    return Games.find().count() > 0;
};
Template.lobby.hasGames = function () {
    return hasGames();
};
Template.lobby.noGames = function () {
    return !hasGames();
};
Template.lobby.listGames = function () {
    return Games.find();
};
