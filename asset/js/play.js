var playState = {
    // ***Removed the preload function, already load in previous state load.js

    create: function() {


        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        // ***Removed background color, physics system, and roundPixels, already load  the previous state boot.js

        // Create a state variable with 'this.player'
        //  PLAYER
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5,0.5);
        // Tell Phaser that the player will use the Arcade physics engine
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 100;
        //  adding the animation to player:  ** animations.add(name, frames, frameRate, loop)
        // Create the 'right' animation by looping the frames 1 and 2
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
        // Initialize the score variable
        // ***replace 'var score = 0' by this, the global score
        game.global.score = 0;


        //  ENEMY
        // Create an enemy group with Arcade physics
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        // Create 10 enemies in the group with the 'enemy' image
        // Enemies are "dead" by default so they are not visible in the game
        this.enemies.createMultiple(10, 'enemy');


        this.jumpSound = game.add.audio('jump');
        this.jumpSound.volume = 0.2;
        /*this.jumpSound.fadeIn(1000);*/
        this.coinSound = game.add.audio('coin');
        this.coinSound.volume = 0.2;
        this.deadSound = game.add.audio('dead');
        this.deadSound.volume = 0.2;


        /*  Better Difficulty   */

        // Call 'addEnemy' every 2.2 seconds
//        game.time.events.loop(2200, this.addEnemy, this);

        // Contains the time of the next enemy creation
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
/*
The Phaser function onOrientationChange.add will automatically call our new function
whenever the device is rotated. But if the game starts in the wrong orientation our
function won’t be called. That’s why I added a call to orientationChange
at the end to make sure it is executed at least once.
*/
    },

    update: function() {

    // If the 'nextEnemy' time has passed
        if (this.nextEnemy < game.time.now) {
            // We add a new enemy
            this.addEnemy();
            // And we update 'nextEnemy' to have a new enemy in 2.2 seconds
            this.nextEnemy = game.time.now + 2200;

        }

        // Tell Phaser that the player and the walls should collide
        game.physics.arcade.collide(this.player, this.walls);

        //enemies should walk on the walls.
        // Make the enemies and walls collide
        game.physics.arcade.collide(this.enemies, this.walls);

        /*
            game.physics.arcade.overlap(objectA, objectB, callback, process, context)
        */
        //   check is there overlap between player and coin, and if it is, increase the score
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

        //player should die if it overlaps with an enemy.
        // Call the 'playerDie' function when the player and an enemy overlap
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

        // If 0 finger are touching the screen
        if (game.input.totalActivePointers == 0) {
            // Make sure the player is not moving
            this.moveLeft = false;
            this.moveRight = false;
        }

        // If the left arrow key is pressed, Player moving left
        if (this.cursor.left.isDown || this.moveLeft) {
            // Move the player to the left
            // The velocity is in pixels per second
            this.player.body.velocity.x = -200;
            // Left animation
            this.player.animations.play('left');

        }
        // If the right arrow key is pressed, Player moving right
        else if (this.cursor.right.isDown || this.moveRight) {
            // Move the player to the right
            this.player.body.velocity.x = 200;
            // Right animation
            this.player.animations.play('right');
        }

        // If neither the right or left arrow key is pressed
        else {
            // Stop the player
            this.player.body.velocity.x = 0;
            // Stop animation
            this.player.animations.stop();
            // Change frame (stand still)
            this.player.frame = 0;
        }
        // If the up arrow key is pressed and the player is on the ground
        //&& this.player.body.touching.down
        if (this.cursor.up.isDown ) {
//        if (this.cursor.up.isDown || this.wasd.up.isDown) {
            // Move the player upward (jump)
//            this.player.body.velocity.y = -320;
//            this.jumpSound.play();
            this.jumpPlayer();
        }
    },

    jumpPlayer: function(){
        // If the player is touching the ground
//        if (this.player.body.touching.down) {
            // Jump with sound
            this.player.body.velocity.y = -320;
            this.jumpSound.play();
//        }
    },

    takeCoin: function(player, coin){
        /*
        Note that this function has 2 parameters: player and coin.
        They are the 2 overlapped objects that are automatically sent by the game.physics.arcade.overlap function.
        */
        // Kill the coin to make it disappear from the game
        //this.coin.kill();

/*
        // Get 2 random numbers
        var newX = game.rnd.integerInRange(0, game.width);
        var newY = game.rnd.integerInRange(0, game.height);
        // Set the new coin position
        this.coin.reset(newX, newY);
*/
        //  Choose random position for new coin
        this.updateCoinPosition();

        //  TWEEN , scale the coin
        this.coin.scale.setTo(0,0);
        game.add.tween(this.coin.scale).to({x:1, y:1}, 300).start();
        //.onComplete.add(function(){alert('done')}, this);

        //scale player; each time we take a coin we want to see the player grow slightly for a short amount of time
        /*The yoyo function will do the previous tween in reverse*/
        game.add.tween(this.player.scale).to({x:1.5, y:1.5}, 100).yoyo(true).start();


        // Increase the score by 5
        // ***Use the new score variable
        game.global.score += 5;
        // Update the score label by using its 'text' property
        // ***Use the new score variable
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
        // Remove the current coin position from the array
        // Otherwise the coin could appear at the same spot twice in a row
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
        /*
        When an enemy is moving right and hits a wall, we want it to start moving left.
        */
        enemy.body.bounce.x = 1;
        /*
        automatically kill the sprite when it’s no longer in the world (when it falls into the bottom hole).
        never run out of dead enemies for getFirstDead.
        */
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
//        enemy.body.collideWorldBounds = true;


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
        // ***When the player dies, we go to the menu, instead of main state

        // Flash the color white for 300ms
        /*game.camera.flash(0xffffff, 1000);
        game.camera.shake(0.02, 300);*/
        this.deadSound.play();

//        game.time.events.add(300, this.startMenu, this);
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

// ***Delete all Phaser initialization code

/*
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');*/
