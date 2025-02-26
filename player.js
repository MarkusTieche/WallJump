class Player{
  
    constructor(Position,Index) 
    {
        this.gravity = 1.5;
        this.halfSize = 98/2;
        this.onWall = 0;
        this.body = document.getElementById("Player").cloneNode(true);
        this.body.setAttribute("fill", "#"+Math.floor(Math.random()*16777215).toString(16));//RANDOM COLOR1
        this.index = Index;
        this.reset(Position);
    }

    reset(Position)
    {
        this.position = {x:Position.x,y:Position.y-this.halfSize};
        this.onWall = 0;
        this.velocity = {x:0,y:0};
        this.body.setAttribute("transform","translate("+this.position.x+","+this.position.y+")");
        this.alive = true;
        this.lastRecord = 0;
        this.topPosition = 0;
        this.body.style.opacity = 1;
    }

    crash()
    {
        this.body.style.opacity = 0.4;
        this.alive = false;
    }

    getLevelPart()
    {
        return Math.floor(Math.abs((this.position.y)/1280));
    }

    move(DirectionX)
    {
        if(this.onWall)
        {
            console.log("jj")
            this.velocity.x  =30*DirectionX;
            this.velocity.y = -20
        }
    }


    update()
    {
        this.velocity.y += this.gravity;

        if(this.position.x <= 768/2-230 || this.position.x >= 768/2+230)
        {
            this.onWall = 1;
            this.velocity.y = -20;
        }
        else
        {
            this.onWall = 0;
            if(this.position.y+this.velocity.y >= -this.halfSize)//OnGround
            {
                this.position.y = -this.halfSize;
                this.velocity.y = 0;
                this.onWall = 1;
            }
        }
        
        this.position.x += this.velocity.x*dt;
        this.position.x = Math.min(Math.max(this.position.x, 768/2-230), 768/2+230);
        this.position.y += this.velocity.y*dt;


        this.body.setAttribute("transform","translate("+this.position.x+","+this.position.y+")");

        var topPosition = Math.min(this.topPosition,this.position.y+this.halfSize);

        this.lastRecord++;
        if(topPosition < this.topPosition)
        {
            this.lastRecord = 0;
            this.topPosition =topPosition
        }

        if(this.topPosition < levelLimit)
        {
            this.crash()
        }
    }
}