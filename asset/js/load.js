var loadState = {

    preload: function() {

        // Add a 'loading...' label on the screen
        var loadingLbl = game.add.text(game.width/2, 150, 'loading...', {
            font: "30px 'Pixel Digivolve'",
            fill: "#fff",
            align: "center"
        });
        loadingLbl.anchor.setTo(0.5, 0.5);

        // Display the progress bar
        var progressBar = game.add.sprite(game.width/2, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        // It will take care of scaling up the ‘progressBar’ as the game loads.
        game.load.setPreloadSprite(progressBar);

        // Load all our assets
//        game.load.image('player', '/asset/images/player.png');
        // ******  for animation, add spritesheet
        /*
        game.load.spritesheet ; needs to know the width and height of each frame
        */
        game.load.spritesheet('player', '/asset/images/player2.png' , 20, 20);
        game.load.image('enemy', '/asset/images/enemy.png');
        game.load.image('coin', '/asset/images/coin.png');
        game.load.image('wallH', '/asset/images/wallHorizontal.png');
        game.load.image('wallV', '/asset/images/wallVertical.png');
        // Load a new asset that we will use in the menu state
        game.load.image('background', '/asset/images/background.png');
        //  load mute and unmute button
        game.load.spritesheet('mute', '/asset/images/muteButton.png' , 28, 22);

        //load audios
        game.load.audio('jump', ['/asset/images/jump.ogg', '/asset/images/jump.mp3']);
        game.load.audio('coin', ['/asset/images/coin.ogg', '/asset/images/coin.mp3']);
        game.load.audio('dead', ['/asset/images/dead.ogg', '/asset/images/dead.mp3']);



        //load buttons for mobile touch
        game.load.image('jumpButton', '/asset/images/jumpButton.png');
        game.load.image('rightButton', '/asset/images/rightButton.png');
        game.load.image('leftButton', '/asset/images/leftButton.png');



    },

    create: function() { 
        // Go to the menu state
        game.state.start('menu')

    },
};
