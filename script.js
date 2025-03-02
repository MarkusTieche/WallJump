var lastTick = Date.now();
var dt = 0;
let svg = document.querySelector('svg');
var viewBox = svg.viewBox.baseVal;

var camera = document.getElementById("Level");
    camera.velocity = {x:0,y:0};
    camera.position = {x:0,y:-100};
    camera.targetOffset = {x:viewBox.width/2,y:-100};

var highScoreLabel = document.getElementById("Highscore");
var scoreLabel = document.getElementById("Score");
var highScoreLine;

var players = [];
var level = [];
var input = 0; //left:-1 , right:1:
var highScore = 0;
var score = 0;
var lastHighscore = 0;
var playerCount = 1;
var levelLimit = -5000;
var currentLevel = 1;
var gameStarted = false;

function init()
{
    for (let i = 0; i < playerCount; i++) {
        addPlayer({x:768/2,y:0},i,("#"+Math.floor(Math.random()*16777215).toString(16)));
    }

    highScoreLine =  document.getElementById("highScoreLine");
    highScore = 0;
    document.getElementById("goal").style.opacity = 0.6;

    createLevel(Math.ceil((levelLimit*-1)/1280));

    camera.target = players[0];
    animate();
}

function resetLevel()
{
    currentLevel++;
    document.getElementById("labelLevel").innerHTML ="LEVEL "+currentLevel;
    highScore = 0;

    for (let levelPart of level) 
    {
        if(levelPart.active)
        {
            document.getElementById("Level").removeChild(levelPart.group);
        }
    }
    level = [];
    createLevel(Math.ceil((levelLimit*-1)/1280));
    restartLevel();
    highScoreLine.setAttribute("transform","translate(0,"+0+")");
}

function createLevel(PartCount)
{
    var stepSize = -1280;
    document.getElementById("goal").setAttribute("transform","translate(0,"+(levelLimit)+")");
    for (let i = 0; i < PartCount; i++) 
    {
        var newLevelPart = new LevelPart({x:0,y:stepSize*i});
        level.push(newLevelPart);
        newLevelPart.isVisible()
    }
}

function addPlayer(Position,index,Color)
{
    var player = new Player(Position,index,Color);
    players.push(player);
    document.getElementById("Level").appendChild(player.body);
}

function restartLevel()
{
    score = 0;
    highScoreLabel.innerHTML = "Best: "+highScore*-1;
    document.getElementById("labelHighscore").innerHTML =  "HIGHSCORE: "+highScore*-1
    gameStarted = false;
    document.getElementById("Input").style.visibility = "visible";
    document.getElementById("Black").style.visibility ="hidden";
    
    for (let i = 0; i < players.length; i++)
    {
        players[i].reset({x:768/2,y:0});
    } 

    camera.target = players[0];
    camera.position = {x:0,y:camera.targetOffset.y};
    highScoreLine.setAttribute("transform","translate(0,"+(+highScore-98)+")");
}

function levelFinished()
{
    levelLimit -= 5000;
    resetLevel();
}

function setCamera(target)
{
    camera.velocity.y = (target.y-camera.position.y-camera.targetOffset.y)/(2);
    camera.velocity.x = ((target.x-camera.position.x-camera.targetOffset.x))/4;
    camera.position.y += ( Math.min(camera.position.y + camera.velocity.y*dt,20)-camera.position.y)/10;
    camera.position.x +=   (camera.velocity.x-camera.position.x)/10;
        
    camera.setAttribute("transform","translate("+(-camera.position.x)+","+(-camera.position.y)+")");
}

//INPUT
document.addEventListener('touchstart', function(event) 
{
    event.preventDefault();
    if(event.touches[0].pageX<window.innerWidth/2)
    {input = -1;}else{input =1;};
})

document.addEventListener('touchend', function(event) 
{
    event.preventDefault();
    input = 0;
})

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        // players[0].move(-1)
        input = -1;
    }
    if(event.keyCode == 39) {
        // players[0].move(1)
        input = 1;
    }
});

document.addEventListener('keyup', function(event) {
    if(event.keyCode == 37) {
        // players[0].move(-1)
        input = 0;
    }
    if(event.keyCode == 39) {
        // players[0].move(1)
        input = 0;
    }
});

function render(time)
{
    dt = (time-lastTick)*.06;
    lastTick = time;

    //UPDATE PLAYERS
    if(input)
    {
        if(!gameStarted)
        {
            gameStarted = true;
            document.getElementById("Input").style.visibility = "hidden";
        }

        players[0].move(input)
    }
   
    var deadPlayers = 0;
    var topHeight = 0;
    for (let i = 0; i < players.length; i++) {
        players[i].update();
        
        if(players[i].alive)
        {
            //COLLISION
            if(level[players[i].getLevelPart()].checkCollision(players[i].position))
            {
                //CRASH
                document.getElementById("Black").style.visibility ="visible"
                players[i].crash(camera.position);
                setTimeout(() => {
                    restartLevel();
                }, 1000);
            }

            //TOP POSITION
            if(players[i].topPosition <= topHeight)
            {
                topHeight = players[i].topPosition;
                camera.target = players[i];
            }

            //LEVEL FINISHED
            if(players[i].topPosition < levelLimit)
            {
                players[i].finish(camera.position);
                setTimeout(() => {
                    levelFinished();
                }, 1000);
            }

            highScore = Math.floor(Math.min(highScore,players[i].position.y+players[i].halfSize))
            score = Math.max(Math.floor(topHeight)*-1,score);
        }
        else
        {    
            deadPlayers++;
        }
    }

    scoreLabel.innerHTML = Math.floor(score);
    
    //UPDATE CAMERA
    setCamera(camera.target.position)
    
    //UPDATE LEVEL
    for (let i = 0; i < level.length; i++) 
    {
       level[i].isVisible();
    }
}

function animate(){
    requestAnimationFrame(animate);
    // Render scene
    render(Date.now());
}

