class Player{
  
    constructor(Position,Index) 
    {
        this.gravity = 1;
        this.halfSize = 98/2;
        this.body = document.getElementById("Player").cloneNode(true);
        this.body.setAttribute("fill", "#"+Math.floor(Math.random()*16777215).toString(16));//RANDOM COLOR1
        this.index = Index;
        this.reset(Position);
    }

    reset(Position,Brain)
    {
        this.position = {x:Position.x,y:Position.y-this.halfSize};
        this.rotation = 0;
        this.velocity = {x:0,y:0};
        this.body.setAttribute("transform","translate("+this.position.x+","+this.position.y+") rotate("+this.rotation+")");
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
        this.velocity.y  =-10;
        this.velocity.x  =25*DirectionX;
    }

    //BRAIN
    initBrain(Brain)
    {
        this.brain = Brain;
        this.thinkTime = 15 ;
        this.fitness = 0;
        this.inputs = [];
    }

    think(ClosestSpike)
    {
        this.thinkTime --;
        if(this.thinkTime+this.index <= 0)
        {

            this.thinkTime = 15 ;
            //USE NORAMLIZED VALUES
            this.inputs[0] = this.position.x/768;//PLAYER X POSITION
            this.inputs[1] = (this.position.y+this.getLevelPart()*1280)/-1280;//PLAYER Y POSITION
            this.inputs[2] = ClosestSpike.x/768; //NEXT SPIKE X POSITION 
            this.inputs[3] = ClosestSpike.y/-1280;  //NEXT SPIKE Y POSITION 

            var output = this.brain.predict(this.inputs);
            if(output[0] > output[1])
            {
               this.move(-1)
            }
            else
            {
                this.move(1)
            }
        }
    }

    save(){}
    //

    update()
    {
        this.velocity.y += this.gravity;
        if(this.position.y+this.velocity.y >= -this.halfSize)
        {
            this.position.y = -this.halfSize;
            this.velocity.y = 0;
        }
        
        this.position.x += this.velocity.x*dt;
        this.position.x = Math.min(Math.max(this.position.x, 768/2-230), 768/2+230);
        this.position.y += this.velocity.y*dt;

        if(this.position.x <= 768/2-230 || this.position.x >= 768/2+230)
        {
            this.gravity = 0.1;
        }
        else
        {
            this.gravity = 1;
        }

        this.body.setAttribute("transform","translate("+this.position.x+","+this.position.y+") rotate("+this.rotation+")");

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