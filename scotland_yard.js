Position = new Meteor.Collection("position");
Underground = new Meteor.Collection("underground");
Bus = new Meteor.Collection("bus");
Taxi = new Meteor.Collection("taxi");

Players = new Meteor.Collection("players");
Games = new Meteor.Collection('games');

if (Meteor.is_client) {
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
        }, 20*1000);
    });
}

if (Meteor.is_server) {
    Meteor.setInterval(function () {
        var now = (new Date()).getTime();
        var idle_threshold = now - 70*1000; // 70 sec
        var remove_threshold = now - 60*60*1000; // 1hr

        Players.update({
            $lt: {
                last_keepalive: idle_threshold
            }
        }, {
            $set: {
                idle: true
            }
        });
        Players.remove({
            $lt: {
                last_keepalive: remove_threshold
            }
        });
    }, 30*1000);

    Meteor.startup(function () {
        if (Underground.find().count() === 0) {
            var UndergroundStops = {
                1:[46],
                13:[46,67,89],
                46:[1,13,79,74],
                74:[46],
                93:[79],
                79:[93,46,67,111],
                67:[79,13,89,111],
                89:[67,13,128,140],
                111:[79,67,153,163],
                163:[111,153],
                153:[163,111,140,185],
                140:[153,89,128],
                128:[140,89,185],
                185:[128,153]
            };
            for (var field in UndergroundStops) {
                Underground.insert({
                    node: field,
                    neighbors: UndergroundStops[field]
                });
            }
        }
        if (Position.find().count() === 0) {
            //PositionCoordinates are raw (x,y) pixel from looking at GIMP
            var PositionCoordinates = {
                1:[100,50],
                2:[261,20],
                3:[400,27],
                4:[473,31],
                5:[763,41],
                6:[849,45],
                7:[938,31],
                8:[68,111],
                9:[149,109],
                10:[353,98],
                11:[401,94],
                12:[445,91],
                13:[531,96],
                14:[617,71],
                15:[687,63],
                16:[781,97],
                17:[930,122],
                18:[36,141],
                19:[106,151],
                20:[188,127],
                21:[277,159],
                22:[412,169],
                23:[477,134],
                24:[583,130],
                25:[630,139],
                26:[695,97],
                27:[699,129],
                28:[738,122],
                29:[847,140],
                30:[988,149],
                31:[59,171],
                32:[153,190],
                33:[232,174],
                34:[359,189],
                35:[432,208],
                36:[460,207],
                37:[500,166],
                38:[609,174],
                39:[654,163],
                40:[723,188],
                41:[754,176],
                42:[933,186],
                43:[15,209],
                44:[113,229],
                45:[188,238],
                46:[240,221],
                47:[302,202],
                48:[375,240],
                49:[484,241],
                50:[539,212],
                51:[630,206],
                52:[684,196],
                53:[732,226],
                54:[768,214],
                55:[856,216],
                56:[967,229],
                57:[60,254],
                58:[139,256],
                59:[161,276],
                60:[202,270],
                61:[263,281],
                62:[299,274],
                63:[383,301],
                64:[434,290],
                65:[480,282],
                66:[508,275],
                67:[578,257],
                68:[650,256],
                69:[704,242],
                70:[768,258],
                71:[847,260],
                72:[914,261],
                73:[47,288],
                74:[80,322],
                75:[126,308],
                76:[189,304],
                77:[218,336],
                78:[277,326],
                79:[311,319],
                80:[396,339],
                81:[467,351],
                82:[495,331],
                83:[557,312],
                84:[617,282],
                85:[650,296],
                86:[715,310],
                87:[777,318],
                88:[801,328],
                89:[843,315],
                90:[887,313],
                91:[959,301],
                92:[25,353],
                93:[27,378],
                94:[89,362],
                95:[120,353],
                96:[260,387],
                97:[294,377],
                98:[334,363],
                99:[377,361],
                100:[449,379],
                101:[569,358],
                102:[596,326],
                103:[652,321],
                104:[713,343],
                105:[869,355],
                106:[926,366],
                107:[975,371],
                108:[858,415],
                109:[308,433],
                110:[372,392],
                111:[387,415],
                112:[406,401],
                113:[469,415],
                114:[527,396],
                115:[589,368],
                116:[714,410],
                117:[791,435],
                118:[716,456],
                119:[950,458],
                120:[23,511],
                121:[62,512],
                122:[110,507],
                123:[232,495],
                124:[303,479],
                125:[428,444],
                126:[557,417],
                127:[635,440],
                129:[787,465],
                130:[411,485],
                131:[443,468],
                132:[523,448],
                133:[599,504],
                134:[668,479],
                135:[815,488],
                136:[933,531],
                137:[204,536],
                138:[329,513],
                139:[406,517],
                140:[526,502],
                141:[631,514],
                142:[713,525],
                143:[783,518],
                144:[39,602],
                145:[72,597],
                146:[121,591],
                147:[163,579],
                148:[204,573],
                149:[249,563],
                150:[296,552],
                151:[316,574],
                152:[349,538],
                153:[373,567],
                154:[455,545],
                155:[480,589],
                156:[534,589],
                157:[580,591],
                158:[657,561],
                159:[666,661],
                160:[808,584],
                161:[885,582],
                162:[977,582],
                163:[114,614],
                164:[163,615],
                165:[263,627],
                166:[353,604],
                167:[430,617],
                168:[461,638],
                169:[533,631],
                170:[576,621],
                171:[871,733],
                172:[728,634],
                173:[838,657],
                174:[924,628],
                175:[967,664],
                176:[18,662],
                177:[64,654],
                178:[139,642],
                179:[223,656],
                180:[227,665],
                181:[327,651],
                182:[349,662],
                183:[403,636],
                184:[502,671],
                185:[557,704],
                186:[615,697],
                187:[692,701],
                188:[792,689],
                189:[65,720],
                190:[109,748],
                191:[177,699],
                192:[181,759],
                193:[313,698],
                194:[331,717],
                195:[367,714],
                196:[429,681],
                197:[441,722],
                198:[657,755],
                199:[807,769]
            }
            for (var field in PositionCoordinates) {
                if (PositionCoordinates[field].length == 2) {
                    Position.insert({ //pre-process for use in plotting overlay
                        node: field,
                        x: (PositionCoordinates[field][0] - 20),
                        y: (PositionCoordinates[field][1] - 10)
                    });
                }
            }
        }
    });
}
