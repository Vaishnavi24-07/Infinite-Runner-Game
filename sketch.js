var PLAY = 1;
var END = 0;
var gameState = PLAY;

var player, player_running, player_collided ;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacleImage
var gameOverImg , restartImg
var score;


function preload(){
    player_running = loadAnimation("player2.png", "player4.png");
    player_collided = loadAnimation("player1.png");
    groundImage = loadImage("ground.png");
     cloudImage = loadImage("cloud.png")
    obstacleImage = loadImage("obstacle2.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
}

function setup() {
    createCanvas(600, 200);
  
    player = createSprite(50,175,20,50);
    player.addAnimation("running", player_running);
    player.addAnimation("collided" , player_collided);
    player.scale = 0.5;
    
    ground = createSprite(200,180,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width/2;
    ground.scale = 1;

    gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5;
    
    restart = createSprite(300,140);
    restart.addImage(restartImg);
    restart.scale = 0.2;

    invisibleGround= createSprite(200,200,400,10);
    invisibleGround.visible = false;
    
    //create Obstacle and Cloud Groups
    obstaclesGroup = new Group();
    cloudsGroup = new Group();
    
  //  console.log("Hello" + 5);
    
    player.setCollider("circle",0,0,45);
    
   player.debug = false;
    
    score = 0
  }
  

function draw() {
    background("lightblue");
    //displaying score
    text("Score: "+ score, 500,50);
    
    
    if(gameState === PLAY){

        gameOver.visible = false;
        restart.visible = false;

      //move the land
     ground.velocityX = -(4 + 3* score/100)

      //scoring
      score = score + Math.round(frameCount/60);
      
      if (ground.x < 0){
        ground.x =ground.width/2;

      }
      
      //jump when the up arrow key is pressed
      if(keyDown("space")&& player.y >=100) {
          player.velocityY = -13;
      }
      
      //add gravity
      player.velocityY = player.velocityY + 1
    
      //spawn the clouds
      spawnClouds();
    
      //spawn obstacles on the ground
      spawnObstacles();


      if(obstaclesGroup.isTouching(player)){
          gameState = END;
      }
    }
     else if (gameState === END) {
         gameOver.visible = true;
         restart.visible = true;

      ground.velocityX = 0;
       
     
       obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
  
       ////set lifetime of the game objects so that they are never destroyed
       obstaclesGroup.setLifetimeEach(-1);
       cloudsGroup.setLifetimeEach(-1);

  
       player.changeAnimation("collided" , player_collided);
     }
    
   
    //stop trex from falling down
    player.collide(invisibleGround);

    if (mousePressedOver(restart)){
        reset();
        console.log("Restart the game")
    }
    drawSprites();
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;

    player.changeAnimation("running", player_running);

    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();

    score = 0;
}

function spawnObstacles(){
    if (frameCount % 60 === 0){
      var obstacle = createSprite(400,165,10,40);
      obstacle.y = Math.round(random(170,190));
       obstacle.addImage(obstacleImage);
       obstacle.scale = 0.1;
      obstacle.velocityX = -(6 + score/100);
      
      
       //assign scale and lifetime to the obstacle           
      
       obstacle.lifetime = 100;
      
      //add each obstacle to the group
       obstaclesGroup.add(obstacle);
    }
   }
   
   function spawnClouds() {
     //write code here to spawn the clouds
      if (frameCount % 60 === 0) {
        cloud = createSprite(600,100,40,10);
       cloud.y = Math.round(random(10,90));
       cloud.addImage(cloudImage);
       cloud.scale = 0.5;
       cloud.velocityX = -3;
       
        //assign lifetime to the variable
       cloud.lifetime = 250;
       
       //adjust the depth
       cloud.depth = player.depth;
       player.depth = player.depth + 1;

       cloud.depth = gameOver.depth;
       gameOver.depth += 1;
       
       //adding cloud to the group
      cloudsGroup.add(cloud);
       }
   }


   