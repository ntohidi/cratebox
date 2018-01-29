class GameObject {
    constructor(name = '') {
        if (new.target === GameObject)
            throw new TypeError("Cannot construct Abstract instances directly");
        this.name = name;
        this.physic = {};
        this.killables = [];
        this.sprite = null;
    }

    destroy() {
        this.killables.forEach(obj => {
            obj.kill();
            obj.destroy();
        })
    }

    preload(core) {
        throw new Error("This is an abstract method and not implemented");
    }

    create(core) {
        throw new Error("This is an abstract method and not implemented");
    }

    update(core) {
        throw new Error("This is an abstract method and not implemented");
    }
}

class Sprite extends GameObject {
    constructor(name, type) {
        super(name);
        this.type = type;
        this.velocity = {x: 0, y: 0};
        this.gravity = {x: 0, y: 0};
        this.events = {}

    }
}

class Boot extends GameObject {
    constructor(type = 'boot') {
        super('world');
        this.type = type;
        this.events = {
            clickTostart : function(){}
        }
    }

    preload(core) {
        core.load.image('progressBar', '/asset/images/progressBar.png');
    }

    create(core, state) {
        core.stage.backgroundColor = '#3498db';
        //  include engine to game
        core.physics.startSystem(Phaser.Physics.ARCADE);
        //  everything looks crisp
        core.renderer.renderSession.roundPixels = true;

            // If the device is not a desktop (so it's a mobile device)
            if(!core.device.desktop){
                // Set the type of scaling to 'show all'
                core.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

                // Set the min and max width/height of the game
                core.scale.setMinMax(core.width/2, core.height/2, core.width*2, core.height*2);

                // Center the game on the screen
                core.scale.pageAlignHorizontally = true;
                core.scale.pageAlignVertically = true;

                // Add a blue color to the page to hide potential white borders
                document.body.style.backgroundColor = '#3498db';
            }

        // Start the load state
        // game.state.start('load');
        //stateContext.switchState('load');

    }

    update(core) {

    }


}

class Load extends GameObject {
    constructor(type = 'load') {
        super('world');
        this.type = type;
        this.events = {
            clickTostart : function(){}
        }
    }

    preload(core) {

        core.load.image('progressBar', '/asset/images/progressBar.png');



        //load audios
        core.load.audio('jump', ['/asset/images/jump.ogg', 'asset/images/jump.mp3']);
        core.load.audio('coin', ['/asset/images/coin.ogg', 'asset/images/coin.mp3']);
        core.load.audio('dead', ['/asset/images/dead.ogg', 'asset/images/dead.mp3']);

        //load buttons for mobile touch
        core.load.image('jumpButton', '/asset/images/jumpButton.png');
        core.load.image('rightButton', '/asset/images/rightButton.png');
        core.load.image('leftButton', '/asset/images/leftButton.png');
    }

    create(core, state) {
        //stateContext.switchState('menu');
        // Add a 'loading...' label on the screen
        this.loadingLbl = core.add.text(core.width/2, 150, 'loading...', {
            font: "30px 'Pixel Digivolve'",
            fill: "#fff",
            align: "center"
        });
        this.loadingLbl.anchor.setTo(0.5, 0.5);

        // Display the progress bar
        this.progressBar = core.add.sprite(core.width/2, 200, 'progressBar');
        this.progressBar.anchor.setTo(0.5, 0.5);
        // It will take care of scaling up the ‘progressBar’ as the game loads.
        core.load.setPreloadSprite(this.progressBar);


    }

    update(core) {

    }


}


class Menu extends GameObject {
    constructor(type = 'load') {
        super('world');
        this.type = type;
        this.events = {
            clickTostart : function(){}
        }
    }

    preload(core) {

        core.load.image('background', '/asset/images/background.png');

        core.load.spritesheet('mute', '/asset/images/muteButton.png' , 28, 22);
    }

    create(core, state) {
        core.add.image(0, 0, 'background');

        // If 'bestScore' is not defined
        // It means that this is the first time the game is played
        if(!localStorage.getItem('bestScore')){
            // Then set the best score to 0
            localStorage.setItem('bestScore', 0);
        }
        // If the score is higher than the best score
        if(global.score > localStorage.getItem('bestScore')){
            localStorage.setItem('bestScore', global.score);
        }

        //this.muteButton = core.add.button(20, 20, 'mute', this.toggleSound, this);
        this.muteButton = core.add.button(20, 20, 'mute', function(){this.toggleSound(core)} , this);
        this.muteButton.frame = core.sound.mute ? 1 : 0;

        // Display the name of the game
        // * Changed the y position to -50 so we don't see the label
        this.nameLbl = core.add.text(core.width/2, -50, 'Super Coin Box', {
            font: "50px 'Pixel Digivolve'",
            fill: "#fff",
            align: "center"
        });
        this.nameLbl.anchor.setTo(0.5, 0.5);
        core.add.tween(this.nameLbl).to({y:80}, 1000).easing(Phaser.Easing.Bounce.Out).start();


        // Show the score at the center of the screen
        this.scoretxt = 'score: ' + global.score + '\nbest score: ' + localStorage.getItem('bestScore');
        this.scoreLbl = core.add.text(core.width/2, core.height/2, this.scoretxt , {
            font: "25px 'Pixel Digivolve'",
            fill: "#fff",
            align: "center"
        });
        this.scoreLbl.anchor.setTo(0.5, 0.5);


        var text = 'click to start';
        this.startLbl = core.add.text(core.width/2, core.height - 80, text, {
            font: "25px 'Pixel Digivolve'",
            fill: "#fff",
            align: "center"
        });
        this.startLbl.anchor.setTo(0.5, 0.5);
        this.startLbl.inputEnabled = true;

        this.startLbl.events.onInputDown.add(() => {
            this.events.clickTostart();
        }, this);
        var spaceKey = core.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(() => {
            this.events.clickTostart();
        }, this);


    }

    update(core) {

    }


    toggleSound(core){
        // Switch the variable from true to false, or false to true
        // When 'game.sound.mute = true', Phaser will mute the game
        core.sound.mute = !core.sound.mute;
        // Change the frame of the button
        this.muteButton.frame = core.sound.mute ? 1 : 0;
    }


}


class Player extends Sprite {
    constructor( type) {
        super( type);
        this.shape = type;

        this.gravity.y = 1000;
        this.events = {
            hitGround: function () {
            },
            hitSomething: function (obj) {
                console.log("hit by ", obj)
            },
            hitEnemy: function () {
            },
            hitCoin: function () {
            }
        };
        this.core = null;
        this.solidObjects = [Coin, Wall, Enemy];
    }

    preload(core) {
        this.core = core;

        core.load.spritesheet('player', '/asset/images/player2.png' , 20, 20);
        core.load.audio('jump', ['/asset/images/jump.ogg', 'asset/images/jump.mp3']);

        core.load.image('jumpButton', '/asset/images/jumpButton.png');
        core.load.image('rightButton', '/asset/images/rightButton.png');
        core.load.image('leftButton', '/asset/images/leftButton.png');

    }

    create(core) {
        //  PLAYER
        this.sprite = this.player = core.add.sprite(core.world.centerX, core.world.centerY, 'player');
        this.player.anchor.setTo(0.5,0.5);
        // Tell Phaser that the player will use the Arcade physics engine
        core.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 100;

        this.player.animations.add('right', [1,2], 8, false);
        this.player.animations.add('left', [3,4], 8, false);

        //  control the player
        this.cursor = core.input.keyboard.createCursorKeys();


        // *** add Mobile Inputs
        if(!core.device.desktop){
            this.addMobileInputs(core);
        }

    }

    update(core, state) {
        var _this = this;
        //debugger
        Object.entries(state.gameObjects).forEach(([k, v]) => {
            //if (this !== v && this.solidObjects.indexOf(v.constructor) != -1){
            if (this !== v && v.constructor == Wall){
                //_this.events.hitSomething(v.sprite);
                core.physics.arcade.collide(this.sprite, v.sprite)
            }
            if (this !== v && v.constructor == Enemy){
                core.physics.arcade.overlap(this.sprite, v.sprite, _this.events.hitEnemy, null, this);
            }
            if (this !== v && v.constructor == Coin){
                //game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
                core.physics.arcade.overlap(this.sprite, v.sprite, _this.events.hitCoin, null, this);
            }
        });
        // If the player is dead, do nothing
        if (!this.player.alive) {
            return;
        }

        this.movePlayer(core);

        if(!this.player.inWorld){

            // end game
            GameConsole.switchState('menu');
        }

    }



    movePlayer(core) {
        if (core.input.totalActivePointers == 0) {
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
            this.jump();

        }
    }

    addMobileInputs(core){
        // Add the jump button
        var jumpButton = core.add.sprite(350, 240, 'jumpButton');
        // start to process click / touch events and more.
        jumpButton.inputEnabled = true;
        jumpButton.alpha  = 0.5;
        // Call 'jump' when the 'jumpButton' is pressed
        jumpButton.events.onInputDown.add(this.jump, this);


        // Movement variables
        this.moveLeft = false;
        this.moveRight = false;

        // Add the move left button
        var leftButton = core.add.sprite(50, 240, 'leftButton');
        leftButton.inputEnabled = true;
        leftButton.alpha  = 0.5;
        leftButton.events.onInputOver.add(this.setLeftTrue, this);
        leftButton.events.onInputOut.add(this.setLeftFalse, this);
        leftButton.events.onInputDown.add(this.setLeftTrue, this);
        leftButton.events.onInputUp.add(this.setLeftFalse, this);

        // Add the move right button
        var rightButton = core.add.sprite(130, 240, 'rightButton');
        rightButton.inputEnabled = true;
        rightButton.alpha = 0.5;
        rightButton.events.onInputOver.add(this.setRightTrue, this);
        rightButton.events.onInputOut.add(this.setRightFalse, this);
        rightButton.events.onInputDown.add(this.setRightTrue, this);
        rightButton.events.onInputUp.add(this.setRightFalse, this);
    }

    setLeftTrue() {
        this.moveLeft = true;
    }

    setLeftFalse() {
        this.moveLeft = false;
    }

    setRightTrue() {
        this.moveRight = true;
    }

    setRightFalse() {
        this.moveRight = false;
    }


    takeCoin(core, state){

        core.add.tween(this.player.scale).to({x:1.5, y:1.5}, 100).yoyo(true).start();

    }


    jump(power = -320) {
        this.player.body.velocity.y = -320;
        //this.jumpSound.play();

    }

    endGame(core) {

    }
}


class Coin extends Sprite {
    constructor( type) {
        super( type);
        this.shape = type;

        this.gravity.y = 1000;
        this.events = {
            hitGround: function () {
            },
            hitSomething: function () {
            }
        };
        this.core = null;
        this.solidObjects = [Player];
    }

    preload(core) {
        this.core = core;
        core.load.image('coin', '/asset/images/coin.png');
        core.load.audio('coin', ['/asset/images/coin.ogg', 'asset/images/coin.mp3']);
    }

    create(core) {

        //  add COIN sprite to the game
        this.sprite = this.coin = core.add.sprite(60, 140, 'coin');
        core.physics.arcade.enable(this.coin);
        this.coin.anchor.setTo(0.5,0.5);
        this.coinSound = core.add.audio('coin');
        this.coinSound.volume = 0.2;

    }

    update(core, state) {
        var _this = this;
    }

    takeCoin(core,state){
        this.updateCoinPosition(core);

        this.coin.scale.setTo(0,0);
        core.add.tween(this.coin.scale).to({x:1, y:1}, 300).start();
        //core.add.tween(this.player.scale).to({x:1.5, y:1.5}, 100).yoyo(true).start();

        //global.score += 5;
        //this.scoreLbl.text = 'score: '  + global.score;
        //this.coinSound.play();
    }

    updateCoinPosition(core){
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
        var newPosition = core.rnd.pick(coinPosition);

        this.coin.reset(newPosition.x, newPosition.y);
    }

    endGame(core) {

    }
}


class Enemy extends Sprite {
    constructor( type) {
        super( type);
        this.shape = type;

        this.gravity.y = 1000;
        this.events = {
            hitGround: function () {
            },
            hitSomething: function () {
            }
        };
        this.core = null;
        this.solidObjects = [Wall];
    }

    preload(core) {
        this.core = core;
        core.load.image('enemy', '/asset/images/enemy.png');
    }

    create(core) {

        this.sprite = this.enemies = core.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        this.nextEnemy = 0;
    }

    update(core, state) {
        if (this.nextEnemy < core.time.now) {
            // We add a new enemy
            this.addEnemy(core);
            // And we update 'nextEnemy' to have a new enemy in 2.2 seconds
            this.nextEnemy = core.time.now + 2200;
        }
        Object.entries(state.gameObjects).forEach(([k, v]) => {
            if (this !== v && this.solidObjects.indexOf(v.constructor) != -1){
                core.physics.arcade.collide(this.sprite, v.sprite)
            }
        });

    }

    addEnemy(core){
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
        enemy.reset(core.width/2, 0);
        // Add gravity to see it fall
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * core.rnd.pick([-1, 1]);

        enemy.body.bounce.x = 1;

        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;

    }

    endGame(core) {

    }


    jump(power = -350) {

    }
}


class Wall extends Sprite {
    constructor( type) {
        super( type);
        this.shape = type;

        this.events = {
            hitGround: function () {
            },
            hitSomething: function () {
            }
        };
        this.core = null;
        this.solidObjects = [];
    }

    preload(core) {
        this.core = core;
        core.load.image('wallH', '/asset/images/wallHorizontal.png');
        core.load.image('wallV', '/asset/images/wallVertical.png');
    }

    create(core) {

        var _this = this;
        //  Create walls group
        this.sprite = this.walls = core.add.group();
        // Add Arcade physics to the whole group
        this.walls.enableBody = true;

        // Create 2 walls in the group
        core.add.sprite(0, 0, 'wallV', 0, this.walls);  // Left wall
        core.add.sprite(480,0 , 'wallV',0, this.walls);  // Right wall

        core.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
        core.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right
        core.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left
        core.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right

        core.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
        core.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right
        var middleTop = core.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = core.add.sprite(100, 240, 'wallH', 0,this.walls);
        middleBottom.scale.setTo(1.5, 1);

        // Set all the walls to be immovable
        this.walls.setAll('body.immovable', true);

    }

    update(core, state) {

    }

    endGame(core) {

    }


    jump(power = -350) {

    }
}

class GameWorld extends GameObject {
    constructor(type = 'wall') {
        super('world');
        this.type = type;

        this._score = 0;
        this.events = {
            keyDown: function (key) {
            },
            keyTap: function () {
            },
            birdHitPipe : function(){
            }
        }
    }

    set score(s) {
        this._score = s;
    }

    get score() {
        return this._score;
    }

    preload(core) {
        core.load.audio('dead', ['/asset/images/dead.ogg', 'asset/images/dead.mp3']);


    }

    create(core) {
        var _this = this;

        core.stage.backgroundColor = '#3498db';
        //  include engine to game
        core.physics.startSystem(Phaser.Physics.ARCADE);
        //  everything looks crisp
        core.renderer.renderSession.roundPixels = true;

        this.deadSound = core.add.audio('dead');
        this.deadSound.volume = 0.2;

        //  Display the SCORE
        this.scoreLbl = core.add.text(30, 30, 'score : 0', {
            font: "25px 'Pixel Digivolve'",
            fill: "#fff",
            align: "center"
        });

        global.score = 0;

    }

    update(core) {


    }

    endGame(core) {
        //this.deadSound.play();
    }

    takeCoin(core,state){
        global.score += 5;
        this.scoreLbl.text = 'score: '  + global.score;
        //this.coinSound.play();
    }
}


class GameState {
    constructor(name) {
        this.name = name;
        this.core = null;
        this._gameScore = 0;
        this.gameObjects = {}
    }

    addGameObject(gameObject, forceToCreate = false) {
        if (!(gameObject.name in this.gameObjects)) {
            this.gameObjects[gameObject.name] = gameObject;
            if (forceToCreate) {
                this.gameObjects[gameObject.name].preload(this.core);
                this.gameObjects[gameObject.name].create(this.core);
            }
        }
    }

    removeGameObject(gameObjectName) {
        if (gameObjectName in this.gameObjects) {
            try {
                this.gameObjects[gameObjectName].destroy()
            }
            catch (e) {
            }

            delete this.gameObjects[gameObjectName];
        }
    }

    set gameScore(s) {
        this._gameScore = s;
    }
    get gameScore() {
        return this._gameScore;
    }

    preload() {
        var _this = this;
        Object.entries(this.gameObjects).forEach(([k, v]) => {
            v.preload(_this.core, this)
        });
    }

    create() {
        var _this = this;
        this.core.scale.pageAlignVertically = true;
        this.core.scale.pageAlignHorizontally = true;

        Object.entries(this.gameObjects).forEach(([k, v]) => {
            v.create(_this.core, this);
        });
    }

    update() {
        var _this = this;
        Object.entries(this.gameObjects).forEach(([k, v]) => {
            v.update(_this.core, this)
        });
    }
    endGame() {
        var _this = this;
        Object.entries(this.gameObjects).forEach(([k, v]) => {
//            setTimeout(() => {
                v.endGame(_this.core, this)
//            }, 1000)
        });
    }
    updateScore() {
        var _this = this;
        this.gameObjects["world"].updateScore(_this.core, this);

    }
    takeCoin() {
    //debugger
        var _this = this;
        Object.entries(this.gameObjects).forEach(([k, v]) => {
            if ( v.constructor == Coin || v.constructor == Player || v.constructor == GameWorld){
                v.takeCoin(_this.core, this);
                }
        });
    }
}


var GameConsole = (function () {
    var _game = null;
    var _g = new (class {
        constructor() {
            this.states = {}
            this.activeState = ''
        }

        createState(gameState, force = false) {
            if (force)
                this.removeState(gameState.name);

            if (!(gameState.name in this.states)) {
                this.states[gameState.name] = gameState;
                gameState.core = _game;
                _game.state.add(gameState.name, gameState);
            }
        }

        removeState(gameStateName) {
            debugger
        }

        start() {
            if (!_game)
                _game = new Phaser.Game(500, 340, Phaser.AUTO);
        }

        switchState(stateName) {
            if (stateName in this.states) {
                this.activeState = stateName;
                _game.state.start(stateName);
            }
        }


    });
    return _g;

})();

var worlds = {
    CITY: 'city',
    START: 'start',
    GAMEOVER: 'gameOver',
}

var game = (new class {
    constructor() {
        this.console = GameConsole;

    }

    start() {
        this.console.start();
        this.menuState = new GameState('menu');
        this.mainState = new GameState('main');
    }

    addMenu( ) {
        this.menu = new Menu();
        this.menuState.addGameObject(this.menu);
    }


    clickToStart() {
        this.menu.events.clickTostart = function () {
            game.console.switchState('main');
        };
    }

    addWorld( ) {
        this.world = new GameWorld();
        this.mainState.addGameObject(this.world);
        this.walls = new Wall('wall');
        this.mainState.addGameObject(this.walls);
    }

    addPlayer() {
        this.player = new Player('player');
        this.mainState.addGameObject(this.player);
    }

    addCoin() {
        this.coin = new Coin('coin');
        this.mainState.addGameObject(this.coin);
    }

    addEnemy() {
        this.enemy = new Enemy('enemy');
        this.mainState.addGameObject(this.enemy);
    }

    playerHitEnemy(){
        game.player.events.hitEnemy = function () {
            game.mainState.endGame();
            game.console.switchState('menu');
        }
    }

    playerHitCoin(){
        game.player.events.hitCoin = function () {
            game.mainState.takeCoin();
        }
    }

    run() {
        this.console.createState(this.menuState);
        this.console.createState(this.mainState);

        this.console.switchState('menu');
    }
});



var global = {
    score : 0
};

// **** Teens G1 Style ****


GameConsole.start();
//var bootState = new GameState('boot');
//var loadState = new GameState('load');
var menuState = new GameState('menu');
var mainState = new GameState('main');

//var bootWorld = new Boot();
//var loadWorld = new Load();
var menu = new Menu();

menu.events.clickTostart = function(){
    GameConsole.switchState('main');
}

var world = new GameWorld();
var walls = new Wall('wall');
var player = new Player('player');
var coin = new Coin('coin');
var enemies = new Enemy('enemy');

player.events.hitEnemy = function () {
    mainState.endGame();
    GameConsole.switchState('menu');;
}
player.events.hitCoin = function () {
    mainState.takeCoin();
}

mainState.addGameObject(world);
mainState.addGameObject(walls);
mainState.addGameObject(player);
mainState.addGameObject(coin);
mainState.addGameObject(enemies);


//bootState.addGameObject(bootWorld);
//loadState.addGameObject(loadWorld);
menuState.addGameObject(menu);

//GameConsole.createState(bootState);
//GameConsole.createState(loadState);
GameConsole.createState(menuState);
GameConsole.createState(mainState);

GameConsole.switchState('menu');




// ***** Kids Usages ******
//
//game.start();
//
//game.addMenu();
//game.addWorld();
//game.addPlayer();
//game.addCoin();
//game.addEnemy();
//
//game.clickToStart();
//
//game.playerHitEnemy();
//game.playerHitCoin();
//
//game.run();
