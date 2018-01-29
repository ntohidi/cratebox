

var game = new Phaser.Game(500, 340);

// Define our global variable
game.global = {
    score : 0
};

var bootState = {
    preload: function() {
        game.load.image('progressBar', '/asset/images/progressBar.png');
    },

    create: function() {
        console.log('hi from boot');

        // Set some game settings

        game.stage.backgroundColor = '#3498db';
        //  include engine to game
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //  everything looks crisp
        game.renderer.renderSession.roundPixels = true;

            // If the device is not a desktop (so it's a mobile device)
            if(!game.device.desktop){
                // Set the type of scaling to 'show all'
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

                // Set the min and max width/height of the game
                game.scale.setMinMax(game.width/2, game.height/2, game.width*2, game.height*2);

                // Center the game on the screen
                game.scale.pageAlignHorizontally = true;
                game.scale.pageAlignVertically = true;

                // Add a blue color to the page to hide potential white borders
                document.body.style.backgroundColor = '#3498db';
            }

        // Start the load state
        // game.state.start('load');
        stateContext.switchState('load');
    }
};

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
        game.load.audio('jump', ['/asset/images/jump.ogg', 'asset/images/jump.mp3']);
        game.load.audio('coin', ['/asset/images/coin.ogg', 'asset/images/coin.mp3']);
        game.load.audio('dead', ['/asset/images/dead.ogg', 'asset/images/dead.mp3']);

        //load buttons for mobile touch
        game.load.image('jumpButton', '/asset/images/jumpButton.png');
        game.load.image('rightButton', '/asset/images/rightButton.png');
        game.load.image('leftButton', '/asset/images/leftButton.png');

    },

    create: function() {
        // Go to the menu state
        // game.state.start('menu');
        stateContext.switchState('menu');

    },
};

var menuState = {
    create: function() {
        game.add.image(0, 0, 'background');

        // If 'bestScore' is not defined
        // It means that this is the first time the game is played
        if(!localStorage.getItem('bestScore')){
            // Then set the best score to 0
            localStorage.setItem('bestScore', 0);
        }
        // If the score is higher than the best score
        if(game.global.score > localStorage.getItem('bestScore')){
            localStorage.setItem('bestScore', game.global.score);
        }

        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        this.muteButton.frame = game.sound.mute ? 1 : 0;

        // Display the name of the game
        // * Changed the y position to -50 so we don't see the label
        var nameLbl = game.add.text(game.width/2, -50, 'Super Coin Box', {
            font: "50px 'Pixel Digivolve'",
            fill: "#fff",
            align: "center"
        });
        nameLbl.anchor.setTo(0.5, 0.5);
        game.add.tween(nameLbl).to({y:80}, 1000).easing(Phaser.Easing.Bounce.Out).start();


        // Show the score at the center of the screen
        var scoretxt = 'score: ' + game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');
        var scoreLbl = game.add.text(game.width/2, game.height/2, scoretxt , {
            font: "25px 'Pixel Digivolve'",
            fill: "#fff",
            align: "center"
        });
        scoreLbl.anchor.setTo(0.5, 0.5);


        // Explain how to start the game
        var text;
        if(game.device.desktop){
            text = 'press the up arrow key to start';
        }
        else{
            text = 'touch the screen to start';
        }

        var startLbl = game.add.text(game.width/2, game.height-80, text, {
            font: "25px 'Pixel Digivolve'",
            fill: "#fff",
            align: "center"
        });
        startLbl.anchor.setTo(0.5, 0.5);

        // Create a new Phaser keyboard variable: the up arrow key
        // When pressed, call the 'start'
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.start, this);
        if(!game.device.desktop){
            game.input.onDown.add(this.start, this);
        }

    },

    start: function(){
        if (!game.device.desktop && game.input.y < 50 && game.input.x < 60) {
            // It means we want to mute the game, so we don't start the game
            return;
        }
        // Start the actual game
        // game.state.start('play');
        stateContext.switchState('play');
    },

    toggleSound:function(){
        // Switch the variable from true to false, or false to true
        // When 'game.sound.mute = true', Phaser will mute the game
        game.sound.mute = !game.sound.mute;
        // Change the frame of the button
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    }
};

var playState = {
    create: function() {
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        //  PLAYER
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5,0.5);
        // Tell Phaser that the player will use the Arcade physics engine
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 100;

        this.player.animations.add('right', [1,2], 8, false);
        this.player.animations.add('left', [3,4], 8, false);


        //  control the player
        this.cursor = game.input.keyboard.createCursorKeys();

        //  create the WALLS and WORLD
        this.createWorld();

         // *** add Mobile Inputs
         if(!game.device.desktop){
            this.addMobileInputs();
         }

        //  add COIN sprite to the game
        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin);
        this.coin.anchor.setTo(0.5,0.5);

        //  Display the SCORE
        this.scoreLbl = game.add.text(30, 30, 'score : 0', {
            font: "30px 'Pixel Digivolve'",
            fill: "#fff",
            align: "center"
        });

        game.global.score = 0;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');


        this.jumpSound = game.add.audio('jump');
        this.jumpSound.volume = 0.2;
        /*this.jumpSound.fadeIn(1000);*/
        this.coinSound = game.add.audio('coin');
        this.coinSound.volume = 0.2;
        this.deadSound = game.add.audio('dead');
        this.deadSound.volume = 0.2;
        this.nextEnemy = 0;

        if (!game.device.desktop) {
            // Create an empty label to write the error message if needed
            this.rotateLabel = game.add.text(game.width/2, game.height/2, '',
            {
                font: "25px 'Pixel Digivolve'",
                fill: "#ff1803",
                backgroundColor: '#000',
                align: "center"
            });
            this.rotateLabel.anchor.setTo(0.5, 0.5);
            // Call 'orientationChange' when the device is rotated
            game.scale.onOrientationChange.add(this.orientationChange, this);
            // Call the function at least once
            this.orientationChange();
        }
    },

    update: function() {
        if (this.nextEnemy < game.time.now) {
            // We add a new enemy
            this.addEnemy();
            // And we update 'nextEnemy' to have a new enemy in 2.2 seconds
            this.nextEnemy = game.time.now + 2200;

        }

        game.physics.arcade.collide(this.player, this.walls);

        game.physics.arcade.collide(this.enemies, this.walls);

        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        // If the player is dead, do nothing
        if (!this.player.alive) {
            return;
        }

        this.movePlayer();

        if(!this.player.inWorld){
            this.playerDie();
        }

    },

    movePlayer: function() {
        if (game.input.totalActivePointers == 0) {
            // Make sure the player is not moving
            this.moveLeft = false;
            this.moveRight = false;
        }

        if (this.cursor.left.isDown || this.moveLeft) {
            // Move the player to the left
            // The velocity is in pixels per second
            this.player.body.velocity.x = -200;
            // Left animation
            this.player.animations.play('left');

        }

        else if (this.cursor.right.isDown || this.moveRight) {
            // Move the player to the right
            this.player.body.velocity.x = 200;
            // Right animation
            this.player.animations.play('right');
        }

        else {
            // Stop the player
            this.player.body.velocity.x = 0;
            // Stop animation
            this.player.animations.stop();
            // Change frame (stand still)
            this.player.frame = 0;
        }

        if (this.cursor.up.isDown ) {
            this.jumpPlayer();
        }
    },

    jumpPlayer: function(){
        this.player.body.velocity.y = -320;
        this.jumpSound.play();
    },

    takeCoin: function(player, coin){

        this.updateCoinPosition();

        this.coin.scale.setTo(0,0);
        game.add.tween(this.coin.scale).to({x:1, y:1}, 300).start();
        game.add.tween(this.player.scale).to({x:1.5, y:1.5}, 100).yoyo(true).start();

        game.global.score += 5;
        this.scoreLbl.text = 'score: '  + game.global.score;
        this.coinSound.play();

    },

    updateCoinPosition: function(){
        // Store all the possible coin positions in an array
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, // Top row
            {x: 60, y: 140}, {x: 440, y: 140}, // Middle row
            {x: 130, y: 300}, {x: 370, y: 300} // Bottom row
        ];
        for (var i = 0 ; i < coinPosition.length; i++){
            if (coinPosition[i].x == this.coin.x){
                coinPosition.splice(i, 1);
            }
        }
        // Randomly select a position from the array with 'game.rnd.pick'
        var newPosition = game.rnd.pick(coinPosition);

        this.coin.reset(newPosition.x, newPosition.y);

    },

    addEnemy: function(){
        // Get the first dead enemy of the group
        var enemy = this.enemies.getFirstDead();

        // If there isn't any dead enemy, do nothing
        if(!enemy){
            return;
        }
        // Initialize the enemy
        // Set the anchor point centered at the bottom
        enemy.anchor.setTo(0.5, 1);
        // Put the enemy above the top hole
        enemy.reset(game.width/2, 0);
        // Add gravity to see it fall
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);

        enemy.body.bounce.x = 1;

        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;

    },

    createWorld: function(){
        //  Create walls group
        this.walls = game.add.group();
        // Add Arcade physics to the whole group
        this.walls.enableBody = true;

        // Create 2 walls in the group
        game.add.sprite(0, 0, 'wallV', 0, this.walls);  // Left wall
        game.add.sprite(480,0 , 'wallV',0, this.walls);  // Right wall

        game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
        game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right
        game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left
        game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right

        game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
        game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0,this.walls);
        middleBottom.scale.setTo(1.5, 1);

        // Set all the walls to be immovable
        this.walls.setAll('body.immovable', true);
    },

    playerDie: function(){
        this.deadSound.play();

        game.state.start('menu');

    },

    startMenu: function() {
        game.state.start('menu');
    },

    addMobileInputs : function(){
        // Add the jump button
        var jumpButton = game.add.sprite(350, 240, 'jumpButton');
        // start to process click / touch events and more.
        jumpButton.inputEnabled = true;
        jumpButton.alpha  = 0.5;
        // Call 'jumpPlayer' when the 'jumpButton' is pressed
        jumpButton.events.onInputDown.add(this.jumpPlayer, this);


        // Movement variables
        this.moveLeft = false;
        this.moveRight = false;

        // Add the move left button
        var leftButton = game.add.sprite(50, 240, 'leftButton');
        leftButton.inputEnabled = true;
        leftButton.alpha  = 0.5;
        leftButton.events.onInputOver.add(this.setLeftTrue, this);
        leftButton.events.onInputOut.add(this.setLeftFalse, this);
        leftButton.events.onInputDown.add(this.setLeftTrue, this);
        leftButton.events.onInputUp.add(this.setLeftFalse, this);

        // Add the move right button
        var rightButton = game.add.sprite(130, 240, 'rightButton');
        rightButton.inputEnabled = true;
        rightButton.alpha = 0.5;
        rightButton.events.onInputOver.add(this.setRightTrue, this);
        rightButton.events.onInputOut.add(this.setRightFalse, this);
        rightButton.events.onInputDown.add(this.setRightTrue, this);
        rightButton.events.onInputUp.add(this.setRightFalse, this);
    },

    setLeftTrue: function() {
        this.moveLeft = true;
    },

    setLeftFalse: function() {
        this.moveLeft = false;
    },

    setRightTrue: function() {
        this.moveRight = true;
    },

    setRightFalse: function() {
        this.moveRight = false;
    },

    orientationChange: function(){
        // If the game is in portrait (wrong orientation)
        if (game.scale.isPortrait){
            game.paused = true;
            this.rotateLabel.text = 'rotate your device in landscape';
        }
        else{
            game.paused = false;
            this.rotateLabel.text = '';
        }
    }
};

var stateContext = {
    states: {
        boot: bootState,
        load: loadState,
        menu: menuState,
        play: playState
    },
    switchState: function (state) {
        // Add the 'mainState' and call it 'main'
        if (!(state in game.state.states)) {
            game.state.add(state, this.states[state]);
        }
        // Start the state to actually start the game
        game.state.start(state);
    }
}
stateContext.switchState('boot');

