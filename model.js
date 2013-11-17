// data model loaded on client and server
function createStdCollectionLink(collectionName, collectionObj) {
    if (Meteor.isServer) {
        Meteor.publish(collectionName, function () {
            return collectionObj.find();
        });
    }
    if (Meteor.isClient) {
        Meteor.subscribe(collectionName);
    }
}

// map board position # to screen x,y
Positions = new Meteor.Collection("positions");
createStdCollectionLink("positions", Positions);

// maps of valid moves by various transportation means
Underground = new Meteor.Collection("underground");
createStdCollectionLink("underground", Underground);
Bus = new Meteor.Collection("bus");
createStdCollectionLink("bus", Bus);
Taxi = new Meteor.Collection("taxi");
createStdCollectionLink("taxi", Taxi);
Black = new Meteor.Collection("black"); // Mr. X only - river transit or any of above
createStdCollectionLink("black", Black);
// used in server-side initialization of transport collections
Meteor.Collection.prototype.putNodes = function(theNodeMap) {
    for (var theNode in theNodeMap) {
        theNeighbors = theNodeMap[theNode];

        var existingValue = this.findOne( { node: { $all: [theNode] } } );
        if (existingValue) {
            this.update(
                    { node: {$all: [theNode]} },
                    { $set: {neighbors: theNeighbors} }
            );
        } else {
            this.insert( { node: theNode, neighbors: theNeighbors } );
        }
    }
};

// tie user information to in-game player information
Players = new Meteor.Collection("players");
Players.allow({ // allow user client-side CRUD of self
    insert: function (userId, playerObj) {
        return true;
    },
    update: function (userId, playerObj) {
        return Meteor.userId() === userId;
    },
    remove: function (userId, playerObj) {
        return Meteor.userId() === userId;
    }
});
createStdCollectionLink("players", Players);
