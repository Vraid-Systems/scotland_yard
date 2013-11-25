Template.lobby.show = function () {
    return !Meteor.user().gameId;
};

Template.lobby.hasGames = function () {
    return Games.find().count() > 0;
};
Template.lobby.listGames = function () {
    return Games.find();
};
