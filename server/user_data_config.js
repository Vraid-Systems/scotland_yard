//see http://docs.meteor.com/#meteor_users

Meteor.publish("userData", function () {
    // expose "gameId" field for self edit
    return Meteor.users.find({}, {fields: {'gameId': 1}});
});
