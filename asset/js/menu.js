var menuState = {

    create: function() {

        // Add a background image
        /*image is like a lightweight sprite that doesn’t need physics or animations*/
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


        // add mute button
        /*   game.add.button(x, y, name, callback, context)   */
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
//        game.add.tween(startLbl).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();


        // Create a new Phaser keyboard variable: the up arrow key
        // When pressed, call the 'start'
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.start, this);
        if(!game.device.desktop){
            game.input.onDown.add(this.start, this);

        }


    },

    start: function(){
         //Fix Mute Button
        // If we tap in the top left corner of the game on mobile
        if (!game.device.desktop && game.input.y < 50 && game.input.x < 60) {
            // It means we want to mute the game, so we don't start the game
            return;
        }

        // Start the actual game
        game.state.start('play');
    },

    toggleSound:function(){
        // Switch the variable from true to false, or false to true
        // When 'game.sound.mute = true', Phaser will mute the game
        game.sound.mute = !game.sound.mute;

        // Change the frame of the button
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    }


};