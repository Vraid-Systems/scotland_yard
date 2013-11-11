Template.lobby.show = function () {
    return !Meteor.user().gameId;
};

Template.lobby.waiting = function () {
    var players = Meteor.users.find({
        _id: {
            $ne: Meteor.userId()
        },
        gameId: {
            $exists: false
        },
        online: true
    });
    return players;
};

Template.lobby.count = function () {
    var players = Meteor.users.find({
        _id: {
            $ne: Meteor.userId()
        },
        gameId: {
            $exists: false
        },
        online: true
    });
    return players.count();
};

Template.lobby.disabled = function () {
    var me = Meteor.user();
    if (me && me.username && (Template.lobby.count() >= 2)) {
        return '';
    } else {
        return 'disabled="disabled"';
    }
};

Template.lobby.events = {
    'keyup input#myname': function (evt) {
        var name = $('#lobby input#myname').val().trim();
        name = name.replace(/ /gi, "_"); //replace all spaces with underscores
        Players.update(Session.get('player_id'), {
            $set: {
                name: name
            }
        });
    },
    'click button.startgame': function () {
        Meteor.call('start_new_game');
    }
};
