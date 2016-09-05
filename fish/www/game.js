var fishSprite, grabbables, fish, score, txtScore, food, pneu, textDead, playButton;

var game = new Phaser.Game(
	800, 600, Phaser.AUTO, 'app',
	{ preload: preload, create: create, update: update }
	);

function preload(){
	 //  This sets a limit on the up-scale
   // game.scale.maxWidth = 480;
  //  game.scale.maxHeight = 320;
  game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

   if (game.device.desktop === false){ //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.pageAlignVertically = true;
    game.scale.pageAlignHorizontally = true;
    game.scale.forceOrientation(true, false);
    game.scale.enterIncorrectOrientation.add(this, enterIncorrectOrientation, this);
    game.scale.leaveIncorrectOrientation.add(this, leaveIncorrectOrientation, this);
}


    

	game.load.image('background','1.png');
	game.load.spritesheet('fish', 'swim_to_right_sheet.png', 256, 256,6,1,1);
	//game.load.atlasJSONHash('fish', 'swim_to_right_sheet.png', 'fish.json');
	game.load.image('coral', 'coral.gif');
	game.load.image('food', 'food.png');
	game.load.image('pneu', 'pneu.png');
}

function create(){
	game.add.sprite(0,0, 'background');
	//fish
	//fishSprite = game.add.sprite(320,10,  'fish',0);

	fishSprite = game.add.sprite(300,700, 'fish');
	swim = fishSprite.animations.add('swim',[0,1,2,3,4], 6, true);
	fishSprite.animations.play('swim');

	fishSprite.scale.setTo(0.35);
	game.physics.arcade.enable(fishSprite);
	fishSprite.body.allowGravity = false; //makes gravity
	fishSprite.body.collideWorldBounds = true;
	fishSprite.body.setSize(230, 120, 15, 80);
	fishSprite.body.drag.x = 100;
	fishSprite.anchor.setTo(.5, .5);

	//add new spires
	coral= game.add.sprite(400,400, 'coral');
	coral.scale.setTo(2.5);

	//grabbables
	food = game.add.sprite('food');
	food.anchor.setTo(0.5,0.5);
	//enemy
	pneu = game.add.sprite('penu');
	pneu.anchor.setTo(0.5,0.5);
	//RESIZ\E COLIDING BOX NOT NOT SURE IF IT WORK
	game.physics.arcade.enable(pneu);
	pneu.body.setSize(20, 18, 6, 5);


	game.physics.arcade.enable(food);
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 10;

	

	grabbables = game.add.group();
	grabbables.enableBody = true;
	grabbables.setAll('outOfBoundsKill', true);
	game.time.events.loop(Phaser.Timer.SECOND * 2, createFood, this);

	function createFood() {

    grabbables.create((game.world.randomY), 0, 'food');

    }
   
    enemy = game.add.group();
    enemy.enableBody = true;
   
    enemy.setAll('outOfBoundsKill', true);
    game.time.events.loop(Phaser.Timer.SECOND *1.5, createPneu, this);

    function createPneu(){
    	enemy.create((game.world.randomY), 0, 'pneu');
    
    	
    	
    }

	
	
	

	//score
    style = {font: '30px Arial', fill: 'red', align: 'center'}; 
    txtScore = game.add.text(50, 50, "0",style);
    txtScore.anchor.setTo(0.5,0.5);
    score = 0;



//debug text field
info = game.add.text(16,16, ' ');
info.font = "Courier";
info.fontSize = 14;
info.fill = "#fff";
info.lineSpacing = 4;
info.setShadow(2,2);
}//end of create

	


function update(){
	if (game.device.desktop === true){
			game.physics.arcade.enable(fishSprite);
			if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
				fishSprite.body.velocity.x = -200;
				fishSprite.scale.x = -0.35;
				
			} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
				fishSprite.body.velocity.x = 200;
				fishSprite.scale.x = 0.35;
			}

			if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
				fishSprite.body.velocity.y = -200;
			}else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
				fishSprite.body.velocity.y = 200;
	} 
}else {
		 //  If the sprite is > 8px away from the pointer then let's move to it
			    if (game.physics.arcade.distanceToPointer(fishSprite, game.input.activePointer) > 28)
			    {
			        //  Make the object seek to the active pointer (mouse or touch).
			        game.physics.arcade.moveToPointer(fishSprite, 400);
			    }
			    else
			    {
			        //  Otherwise turn off velocity because we're close enough to the pointer
			        fishSprite.body.velocity.set(0);
			    }

				if (game.input.activePointer.x < fishSprite.x) {    fishSprite.scale.x = -0.35;  }  else {   fishSprite.scale.x = 0.35;  }
	}


	

	//chcekc for colisions
	game.physics.arcade.collide(fishSprite, grabbables, fishHitFood, null, this);

	function fishHitFood(fish, food){
		food.kill();
		score++;
		//update visible
		txtScore.text = score.toString();
	}

	game.physics.arcade.collide(fishSprite, enemy, enemyHitFish, null, this);
	
	function enemyHitFish(fish, enemy){
		fish.kill();

    textDead = game.add.text(380,300, 'Dude, you just died.\nClick to restart', { font: "50px Arial", fill: "#ffffff", align: "center" });
    textDead.anchor.setTo(0.5, 0.5);
    game.input.onTap.addOnce(restart,this);
	}
	function restart(){
		  //  A new level starts
    
    
    //  And brings the aliens back from the dead :)
    enemy.removeAll();
    grabbables.removeAll();
    

    //revives the player
    fishSprite.revive();

    //hides the text
    textDead.visible = false;
    txtScore.destroy();
    txtScore = game.add.text(50, 50, "0",style);
    txtScore.anchor.setTo(0.5,0.5);
    score = 0;
	}
		
	//scaling debug
	s = "Game size: " + game.width + " x " + game.height + "\n";
	s = s.concat("Actual size " + game.scale.width + " x " + game.scale.height + "\n");
	s = s.concat("minWidth: " + game.scale.maxWidth + " - minHeight: " + game.scale.minHeight + "\n");
	s = s.concat("maxWidth: " + game.scale.maxWidth + " -maxHeight: " + game.scale.maxHeight + "\n");
	s = s.concat("aspect ratio: "+ game.scale.aspectRatio + "\n");
	s = s.concat("parent is window: " + game.scale.parentIsWindow + "\n");
	s = s.concat("bounds x: " + game.scale.bounds.x + " y: " + game.scale.bounds.y + "width: " + game.scale.bounds.width + 
		+" height: " + game.scale.bounds.height + "\n");

	info.text = s;


}//end of update