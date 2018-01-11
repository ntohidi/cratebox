var bootState = {

    preload: function() {
        game.load.image('progressBar', '/asset/images/progressBar.png');
    },

    create: function() { 

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
        game.state.start('load');
    }
};
