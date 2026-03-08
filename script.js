var lastTick = Date.now();
var dt = 0;
let svg = document.querySelector('svg');
var viewBox = svg.viewBox.baseVal;

var input = 0; //left:-1 , right:1:
var gameStarted = false;

var currentLevel

function init()
{
    currentLevel = new Level(1);
    addInput();
    animate();
}

function addInput()
{
    //INPUT
    document.addEventListener('touchstart', function (event) {
        event.preventDefault();
        if (event.touches[0].pageX < window.innerWidth / 2) { input = -1; } else { input = 1; };
    })

    document.addEventListener('touchend', function (event) {
        event.preventDefault();
        input = 0;
    })

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 37) {
            // players[0].move(-1)
            input = -1;
        }
        if (event.keyCode == 39) {
            // players[0].move(1)
            input = 1;
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode == 37) {
            // players[0].move(-1)
            input = 0;
        }
        if (event.keyCode == 39) {
            // players[0].move(1)
            input = 0;
        }
    });
}

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

        currentLevel.players[0].move(input);
    }

    currentLevel.update(dt)
}

function animate(){
    requestAnimationFrame(animate);
    // Render scene
    render(Date.now());
}

