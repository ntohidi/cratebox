var mainState = {
    preload: function() {
        game.load.image('player', '/asset/images/player.png');
        game.load.image('wallH', '/asset/images/wallHorizontal.png');
        game.load.image('wallV', '/asset/images/wallVertical.png');
        game.load.image('coin', '/asset/images/coin.png');
        game.load.image('enemy', '/asset/images/enemy.png');
    },

    create: function() { 

        game.stage.backgroundColor = '#3498db';
        //  include engine to game
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //  everything looks crisp
        game.renderer.renderSession.roundPixels = true;

        // Create a state variable with 'this.player'
        //  PLAYER
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5,0.5);
        // Tell Phaser that the player will use the Arcade physics engine
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 100;

        //  control the player
        this.cursor = game.input.keyboard.createCursorKeys();

        //  create the WALLS and WORLD
        this.createWorld();

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
        this.score = 0;


        //  ENEMY
        // Create an enemy group with Arcade physics
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        // Create 10 enemies in the group with the 'enemy' image
        // Enemies are "dead" by default so they are not visible in the game
        this.enemies.createMultiple(10, 'enemy');

        // Call 'addEnemy' every 2.2 seconds
        game.time.events.loop(2200, this.addEnemy, this);


    },

    update: function() {
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

        this.movePlayer();

        if(!this.player.inWorld){
            this.playerDie();
        }

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

        // Increase the score by 5
        this.score += 5;
        // Update the score label by using its 'text' property
        this.scoreLbl.text = 'score: '  + this.score;

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

    movePlayer: function() {
        // If the left arrow key is pressed
        if (this.cursor.left.isDown) {
            // Move the player to the left
            // The velocity is in pixels per second
            this.player.body.velocity.x = -200;
        }
        // If the right arrow key is pressed
        else if (this.cursor.right.isDown) {
            // Move the player to the right
            this.player.body.velocity.x = 200;
        }
        else if (this.cursor.up.isDown) {
            // Move the player to the right
            this.player.body.velocity.y = -200;
        }

        // If neither the right or left arrow key is pressed
        else {
            // Stop the player
            this.player.body.velocity.x = 0;
        }
        // If the up arrow key is pressed and the player is on the ground
        if (this.cursor.up.isDown && this.player.body.touching.down) {
            // Move the player upward (jump)
            this.player.body.velocity.y = -320;
        }
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
        game.state.start('main');
    },


};

var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');