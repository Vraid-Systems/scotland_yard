var player = function () {
    return Players.findOne(Session.get('player_id'));
};

var game = function () {
    var me = player();
    return me && me.game_id && Games.findOne(me.game_id);
};

Template.lobby.show = function () {
    // only show lobby if we're not in a game
    return !game();
};

Template.lobby.waiting = function () {
    var players = Players.find({
        _id: {
            $ne: Session.get('player_id')
        },
        name: {
            $ne: ''
        },
        game_id: {
            $exists: false
        },
        idle: {
            $ne: true
        }
    });

    return players;
};

Template.lobby.count = function () {
    var players = Players.find({
        _id: {
            $ne: Session.get('player_id')
        },
        name: {
            $ne: ''
        },
        game_id: {
            $exists: false
        },
        idle: {
            $ne: true
        }
    });

    return players.count();
};

Template.lobby.disabled = function () {
    var me = player();
    if (me && me.name && (Template.lobby.count() >= 2)) {
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

Template.about.greeting = function () {
    return "Welcome to the online version of Scotland Yard!";
};

Meteor.startup(function () {
    // Allocate a new player id.
    //
    // XXX this does not handle hot reload. In the reload case,
    // Session.get('player_id') will return a real id. We should check for
    // a pre-existing player, and if it exists, make sure the server still
    // knows about us.
    var player_id = Players.insert({
        name: '',
        idle: false
    });
    Session.set('player_id', player_id);

    // send keepalives so the server can tell when we go away.
    //
    // XXX this is not a great idiom. meteor server does not yet have a
    // way to expose connection status to user code. Once it does, this
    // code can go away.
    Meteor.setInterval(function() {
        if (Meteor.status().connected)
            Meteor.call('keepalive', Session.get('player_id'));
    }, 20*1000); // every 20 seconds
});
