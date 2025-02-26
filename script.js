var lastTick = Date.now();
var dt = 0;
let svg = document.querySelector('svg');
var viewBox = svg.viewBox.baseVal;

var camera = document.getElementById("Level");
    camera.velocity = {x:0,y:0};
    camera.position = {x:0,y:0};
    camera.targetOffset = {x:viewBox.width/2,y:-100};

var highScoreLabel = document.getElementById("Highscore");
var scoreLabel = document.getElementById("Score");
var highScoreLine;

var players = [];
var level = [];
var input = {"left":0,"right":0};
var highScore = 0;
var score = 0;
var lastHighscore = 0;
var playerCount = 1;
var paused = false;
var levelLimit = -20000;
var currentLevel = 1;

function init()
{
    for (let i = 0; i < playerCount; i++) {
        addPlayer({x:768/2,y:0});
    }

    highScoreLine =  document.getElementById("highScoreLine");
    highScoreLine.setAttribute("transform","translate(0,"+(200)+")");
    highScore = 0;
    document.getElementById("goal").setAttribute("transform","translate(0,"+(levelLimit)+")");
    document.getElementById("goal").style.opacity = 0.6;

    createLevel(100);

    camera.target = players[0];
    animate();
}

function resetLevel()
{
    currentLevel++;
    document.getElementById("labelLevel").innerHTML ="LEVEL "+currentLevel;
    highScore = 0;
    highScoreLabel.innerHTML = "Best: "+highScore*-1;
    highScoreLine.setAttribute("transform","translate(0,"+(100)+")");

    for (let i = 0; i < players.length; i++)
    {
        players[i].reset({x:768/2-100+Math.random()*200,y:0},players[i].brain)
    }

    for (let levelPart of level) 
    {
        if(levelPart.active)
        {
            document.getElementById("Level").removeChild(levelPart.group)
        }
    }
    level = [];
    createLevel(100);

    camera.velocity.y = 0;
    camera.velocity.x = 0;
    camera.position.y = 0;
    camera.position.x = 0;
    camera.setAttribute("transform","translate("+(-camera.position.x)+","+(-camera.position.y)+")");
}

function createLevel(PartCount)
{
    var stepSize = -1280;
    for (let i = 0; i < PartCount; i++) 
    {
        var newLevelPart = new LevelPart({x:0,y:stepSize*i});
        level.push(newLevelPart);
        newLevelPart.isVisible()
    }
}

function addPlayer(Position)
{
    var player = new Player(Position,players.length);
    players.push(player);
    document.getElementById("Level").appendChild(player.body);
}

function restartLevel()
{
    score = 0;
    highScoreLabel.innerHTML = "Best: "+highScore*-1;
    highScoreLine.setAttribute("transform","translate(0,"+(+highScore-98)+")");
    
    camera.target = players[0];
    // paused = false;
    for (let i = 0; i < players.length; i++)
    {
        players[i].reset({x:768/2,y:0})
    } 

    camera.velocity.y = 0;
    camera.velocity.x = 0;
    camera.position.y = 0;
    camera.position.x = 0;
    camera.setAttribute("transform","translate("+(-camera.position.x)+","+(-camera.position.y)+")");
}

//INPUT
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        // players[0].move(-1)
        input.left = -1;
    }
    else if(event.keyCode == 39) {
        // players[0].move(1)
        input.right = 1;
    }
});

document.addEventListener('keyup', function(event) {
    if(event.keyCode == 37) {
        // players[0].move(-1)
        input.left = 0;
    }
    else if(event.keyCode == 39) {
        // players[0].move(1)
        input.right = 0;
    }
});

function render(time)
{
    dt = (time-lastTick)*.06;
    lastTick = time;

    //UPDATE PLAYERS
    if(input.left||input.right)
    {
        players[0].move(input.left||input.right)
    }
   
    var deadPlayers = 0;
    var topHeight = 0;
    for (let i = 0; i < players.length; i++) {
        if(players[i].alive)
        {
            players[i].update();
            
            //COLLISION
            if(level[players[i].getLevelPart()].checkCollision(players[i].position))
            {
                //CRASH
                players[i].crash();
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
    camera.velocity.y = (camera.target.position.y-camera.position.y-camera.targetOffset.y)/(2);
    camera.velocity.x = ((camera.target.position.x-camera.position.x-camera.targetOffset.x))/4;
    camera.position.y += ( Math.min(camera.position.y + camera.velocity.y*dt,20)-camera.position.y)/10;
    camera.position.x +=   (camera.velocity.x-camera.position.x)/10;
    camera.setAttribute("transform","translate("+(-camera.position.x)+","+(-camera.position.y)+")");

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

