var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg,trex_jumping
var jumpSound , checkPointSound, dieSound,boom
var jump = 0


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_jumping = loadAnimation("trex1.png")
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obama.jpg");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkpoint.mp3")
  boom = loadSound("boom.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-200,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width,height-143,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(width/2,height/2.9);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2.4);
  restart.addImage(restartImg);
  
  gameOver.scale = width/1600;
  restart.scale = width/1600;
  
  invisibleGround = createSprite(width/2,height-137,width,10);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hola" + 5);
  
  trex.setCollider("rectangle",0,0,70,80);
  trex.addAnimation("jumping",trex_jumping);
  trex.debug = false
  
  score = 0;
  
}

function draw() {

  
  background(180);
  //mostrar puntuación
  textSize(width/80)
  text("Puntuación: "+ score, width-200,50);
  
  console.log("esto es ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //mover el suelo
    ground.velocityX = (-6 * score/1000) - 6;
    //puntuación
    score = score  + 2;

    if (score/100 == Math.round(score/100)){
      jumpSound.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    
    //hacer que el trex salte al presionar la barra espaciadora
    if(keyDown("space") && jump == 0) {
        trex.velocityY = trex.velocityY - 16;
        boom.stop();
        boom.play();
        jump = 1;
    }
    console.log("jump ",jump)
    if( trex.y <= height-185   ){
      trex.changeAnimation("jumping",trex_jumping);
    }
    else {
      jump = 0;
      trex.changeAnimation("running",trex_running);
    }
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer las nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //cambiar la animación del trex
      trex.changeAnimation("collided", trex_collided);
     
      //establecer lifetime de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     if (mouseIsPressed === true){
        gameState = PLAY;
        algo = 80;
        obstaclesGroup.setLifetimeEach(0);
        cloudsGroup.setLifetimeEach(0);
        score = 0;
     }
   }
  
 
  //evitar que el trex caiga
  trex.collide(invisibleGround);
  var lasokar  = 30
  
  
  
  drawSprites();
}
algo = 80
function spawnObstacles(){
  if (frameCount % 120 === 0){
    algo = algo - 1
  }
 if (frameCount % algo  === 0){
   var obstacle = createSprite(width,height-160,10,40);
   obstacle.velocityX =  (-6 * score/1000) - 6;;
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 500;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,100,40,10);
    cloud.y = Math.round(random(heigth+10,heigth-100));
    cloud.addImage(cloudImage);
    cloud.scale = width/1600;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 134;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube al grupo
   cloudsGroup.add(cloud);
    }
}

