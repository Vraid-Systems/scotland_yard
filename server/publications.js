Meteor.publish("allUserData", function () {
    return Meteor.users.find(
            {},
            {fields: { 'profile': 1 }}
    );
});
