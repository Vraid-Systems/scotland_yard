// data model loaded on client and server

Meteor.Collection.prototype.putNodes = function(theNodeMap) {
    for (var theNode in theNodeMap) {
        theNeighbors = theNodeMap[theNode];

        var existingValue = this.findOne({ node: { $all: [theNode] } });
        if (existingValue) {
            this.update(
                    {
                        node: {$all: [theNode]}
                    },
                    {
                        $set: {neighbors: theNeighbors}
                    }
            );
        } else {
            this.insert(
                    {
                        node: theNode,
                        neighbors: theNeighbors
                    }
            );
        }
    }
};

Positions = new Meteor.Collection("positions"); // map board position # to screen x,y

// maps of valid moves by various transportation means
Underground = new Meteor.Collection("underground");
Bus = new Meteor.Collection("bus");
Taxi = new Meteor.Collection("taxi");
Black = new Meteor.Collection("black"); // Mr. X only - river transit or any of above

Players = new Meteor.Collection("players");
Games = new Meteor.Collection('games');
