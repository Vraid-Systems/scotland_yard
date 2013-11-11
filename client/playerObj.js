function PlayerObj(userName) {
    var private_UserName = userName;
    var private_GameId = "";
    var private_IntraGamePlayerNumber = -1; // player 0 is Mr. X
    var private_NodeId = "";

    function _getDomId(playerNumber) {
        return "#player_" + playerNumber.toString();
    }

    this.drawToBoard = function() {
        var boardPosition = Positions.findOne({node: this.getNodeId().toString()}).fetch();
        var domId = _getDomId(this.getPlayerNumber());
        $(domId).css("display", "");
        $(domId).css("left", boardPosition.x);
        $(domId).css("top", boardPosition.y);
    };

    this.getGameId = function() {
        return private_GameId;
    };
    this.setGameId = function(gameId) {
        private_GameId = gameId;
    };

    this.getNodeId = function() {
        return private_NodeId;
    };
    this.setNodeId = function(nodeId) {
        private_NodeId = nodeId;
    };

    this.getPlayerNumber = function() {
        return private_IntraGamePlayerNumber;
    };
    this.setPlayerNumber = function(playerNumber) {
        private_IntraGamePlayerNumber = playerNumber;
    };

    this.getUserName = function() {
        return private_UserName;
    };
}
