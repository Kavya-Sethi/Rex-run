var trex,trex_run,trex_crash;
var cloud,cloudImage;
var grImage;
var edges;
var ground;
var van_ground;
var prob1,prob2,prob3,prob4,prob5,prob6;
var obstacle;
var r;
var score=0;
var cloudsGroup;
var obstaclesGroup;
var PLAY=1;
var END=0;
var gameState=PLAY;
var gameOver,goImage;
var re,reImage;
var trex_jump;
var jump,die,cp;



function preload(){
  //loading animation to trex
  trex_run=loadAnimation("trex1.png","trex3.png","trex4.png");
  
  trex_jump=loadAnimation("trex1.png");
   trex_crash=loadAnimation("crash.png");
  cloudImage=loadImage("cloud.png");

  //loading ground image
  grImage=loadImage("g2.png");
  
   prob1=loadImage("obstacle1.png");
   prob2=loadImage("obstacle2.png");
   prob3=loadImage("obstacle3.png");
   prob4=loadImage("obstacle4.png");
   prob5=loadImage("obstacle5.png");
   prob6=loadImage("obstacle6.png");
  
   goImage=loadImage("gameOver.png");
  reImage=loadImage("restart.png");
  
  jump=loadSound("jump.mp3");
   die=loadSound("die.mp3");
   cp=loadSound("checkPoint.mp3");  
  
}

function setup(){
  
  //create canvas
  createCanvas(windowWidth,windowHeight);
   
  //creating the edges
  edges=createEdgeSprites(); 
  
  //creating the trex
  trex=createSprite(50,height-40,10,50);
  trex.addAnimation("t_x",trex_run);
  trex.addAnimation("jump",trex_jump);
  trex.addAnimation("crash",trex_crash);
  trex.scale=0.5;
 // trex.debug=true;
 // trex.setCollider("rectangle",0,0,400,trex.height);
 
  
  //creating ground
  ground=createSprite(width/2,height-20,width,5);
  ground.addImage("gr",grImage);
  
  
//creating the vanishing ground
  van_ground=createSprite(width/2,height-10,width,5);
  van_ground.visible=false; 
  
  //creating game over 
  gameOver=createSprite(width/2,height/2-50);
  gameOver.addImage("go",goImage);
  gameOver.scale=0.5;
  gameOver.visible=false;
  
  //creating restart
  re=createSprite(width/2,height/2);
  re.addImage("re",reImage);
  re.scale=0.5;
  re.visible=false;

  
cloudsGroup=new Group();
  
 obstaclesGroup=new Group();

}  

function draw(){
  //console.log(frameRate());

  background("white");
  trex.changeAnimation("t_x");
console.log(trex.y);
  //display score
  text("score: "+score,500,50);
  
  if(gameState === PLAY){
    
  score=score+Math.round(frameRate()/60); 
    
    if(score%100==0&&score>0){
      cp.play(); 
    }
    
     //grounds velocity
  ground.velocityX=-(5 + score/100); 
  
  //making the trex jump
  if((touches.length>0 || keyDown("space"))&&trex.y>=height-36){
    trex.velocityY=-10; 
    jump.play();
    touches=[];
  }
    if(trex.y<163){
    trex.changeAnimation("jump");
    }

  //gravity for trex
  trex.velocityY=trex.velocityY+0.5;
  
  //to give infinite length to ground 
  if(ground.x<0){
  ground.x=ground.width/2  ;
  }
      spawnClouds();
   spawnProblems();
    
    if(obstaclesGroup.isTouching (trex)){
       die.play();
       gameState=END;
   //   trex.velocityY=-10;
     // jump.play();
      
       }
    
  }

  else if(gameState === END){
    ground.velocityX=0;
    trex.velocityY=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
   trex.changeAnimation("crash");
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
       gameOver.visible=true;
       re.visible=true;
    
    if(touches.length>0 || mousePressedOver(re)){
       reset();
      touches=[];
       }
  }     
  trex.collide(van_ground);   
  drawSprites();
  
}
  

function spawnClouds(){
 if(frameCount%150==0){
 cloud=createSprite(width,100,10,10);
   cloud.addImage("cl",cloudImage);
   cloud.scale=0.2;
  cloud.velocityX=-3; 
   cloud.y=Math.round(random(height-100,height-300))
     console.log(cloud.depth);
   cloud.depth=trex.depth;   
   trex.depth=trex.depth+1;
   cloud.lifetime=200;
   
   cloudsGroup.add(cloud);
 }
   
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("t_x");
  re.visible=false;
    gameOver.visible=false;
}

function spawnProblems(){
  if(frameCount%60==0){
 obstacle=createSprite(width,height-35,10,10);
    r=Math.round(random(1,6));
    
    switch(r){
            case 1: obstacle.addImage(prob1);
            break;
            case 2: obstacle.addImage(prob2);
            break;
            case 3: obstacle.addImage(prob3);
            break; 
            case 4: obstacle.addImage(prob4);
            break; 
            case 5: obstacle.addImage(prob5);
            break;  
            case 6: obstacle.addImage(prob6);
            break;
            default:break;
    }
   obstacle.scale=0.5;
  obstacle.velocityX=-(6+score/100);
    obstacle.lifetime=100;
    obstaclesGroup.add(obstacle);
  }
  
}