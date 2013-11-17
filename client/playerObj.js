function PlayerObj(userId, userName) {
    var _userId = userId;
    var _userName = userName;
    var _gameId = "";
    var _playerNumber = -1; // player 0 is Mr. X
    var _nodeId = "0"; // 1 - 199
    var _nodeNeighbors = {'underground':null, 'bus':null, 'taxi':null, 'black':null};

    function _getDomId(playerNumber) {
        return "#player_" + playerNumber.toString();
    }

    this.drawToBoard = function() {
        var boardPosition = Positions.findOne({node: this.getNodeId()});
        var domId = _getDomId(this.getPlayerNumber());
        $(domId).css("display", "");
        $(domId).css("left", boardPosition.x);
        $(domId).css("top", boardPosition.y);
    };

    this.loadNodeNeighbors = function() {
        var nodeUnderground = Underground.findOne({node: this.getNodeId()});
        if (nodeUnderground) {
            _nodeNeighbors.underground = nodeUnderground.neighbors;
        } else {
            _nodeNeighbors.underground = null;
        }

        var nodeBus = Bus.findOne({node: this.getNodeId()});
        if (nodeBus) {
            _nodeNeighbors.bus = nodeBus.neighbors;
        } else {
            _nodeNeighbors.bus = null;
        }

        var nodeTaxi = Taxi.findOne({node: this.getNodeId()});
        if (nodeTaxi) {
            _nodeNeighbors.taxi = nodeTaxi.neighbors;
        } else {
            _nodeNeighbors.taxi = null;
        }

        _nodeNeighbors.black = null;
        if (this.isMrX()) {
            var nodeBlack = Black.findOne({node: this.getNodeId()});
            if (nodeBlack) {
                _nodeNeighbors.black = nodeBlack.neighbors;
            }
        }
    };

    this.isMrX = function() {
        return _playerNumber === 0;
    };

    this.getGameId = function() {
        return _gameId;
    };
    this.setGameId = function(gameId) {
        _gameId = gameId;
    };

    this.getNodeId = function() {
        return _nodeId;
    };
    this.setNodeId = function(nodeId) {
        if (typeof nodeId === 'number' || nodeId instanceof Number) {
            _nodeId = nodeId.toString();
        } else if (typeof nodeId === 'string' || nodeId instanceof String) {
            _nodeId = nodeId;
        } else {
            throw "PlayerObj.setNodeId accepts Numbers and will begrudgingly handle Strings only";
        }
    };

    this.getPlayerNumber = function() {
        return _playerNumber;
    };
    this.setPlayerNumber = function(playerNumber) {
        _playerNumber = playerNumber;
    };

    this.getUserId = function () {
        return _userId;
    };
    this.getUserName = function() {
        return _userName;
    };
}
