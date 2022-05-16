var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bg, backgroundImg
var score=0;
var dia ;
var gameOver, restart;


function preload(){
  trex_running =   loadAnimation("trex.png","trex.2.png","trex.3.png");
  trex_collided = loadAnimation("trex.4.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("nuve.png");
  
  obstacle1 = loadImage("cactus1.png");
  obstacle2 = loadImage("cactus2.png");
  obstacle3 = loadImage("cactus3.png");
  obstacle4 = loadImage("cactus4.png");
  obstacle5 = loadImage("cactus5.png");
  obstacle6 = loadImage("cactus6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  dia = loadImage("fondo.jpg");

  getBackgroundImg();
}

function setup() {
  createCanvas(windowWidth, 200);

  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.15;
  trex.velocityX = (6 + 3*score/100);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.visible=false;
 
  
  gameOver = createSprite(0,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(0,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,600,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  // background(backgroundImg);
 background(dia);
  // text(mouseX+","+mouseY,mouseX+10,mouseY);
  text("Puntuación: "+ score, trex.x + (3*(windowWidth/4)-80),50);
  camera.position.x= trex.x +windowWidth/3 ;


  
  gameOver.x= trex.x + windowWidth/3
  restart.x= trex.x + windowWidth/3

  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/30);
    trex.velocityX = (6 + 3*score/100);
  
    if(keyDown("space") && trex.y > 130) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (trex.x===ground.x){
      ground.x = ground.x +ground.width/2;
    }

    invisibleGround.x= trex.x; 
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //establece velocidad de cada objeto del juego en 0
    trex.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //cambia la animación de Trex
    trex.changeAnimation("collided",trex_collided);
    
    //establece ciclo de vida a los objetos del juego para que nunca puedan ser destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 60 === 2) {
    var cloud = createSprite(trex.x + (3*(windowWidth/4)-80),100,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
  
    
     //asigna ciclo de vida a la variable
    cloud.lifetime = 200;
    
    //ajusta la profundiad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    
    //agrega cada nube al grupo
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(trex.x + (3*(windowWidth/4)-80),160,10,40);
    //obstacle.debug = true;
  
    
    //genera obstáculos al azar
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
    
    //asigna escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
  
    //agrega cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}

async function getBackgroundImg(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/America/Toronto");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  
  if(hour>=0600 && hour<=1900){
      bg = "dia.jpg";
  }
  else{
      bg = "noche.jpg";
  }
backgroundImg = loadImage(bg);
}