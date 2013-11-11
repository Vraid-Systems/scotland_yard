// data model loaded on client and server

// map board position # to screen x,y
Positions = new Meteor.Collection("positions");
if (Meteor.isServer) {
    Meteor.publish("positions", function () {
        return Positions.find();
    });
}
if (Meteor.isClient) {
    Meteor.subscribe("positions");
}

// maps of valid moves by various transportation means
Underground = new Meteor.Collection("underground");
Bus = new Meteor.Collection("bus");
Taxi = new Meteor.Collection("taxi");
Black = new Meteor.Collection("black"); // Mr. X only - river transit or any of above

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

// games and players
Players = new Meteor.Collection("players");
