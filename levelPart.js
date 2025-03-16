class LevelPart{
  
    constructor(Position) 
    {
        this.position = Position;
        // this.position.y +=1200;
        this.spikes = []; //LIST OF SPIKES
        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.group.setAttribute("name","mygroup");
        this.group.setAttribute("transform","translate("+this.position.x+","+this.position.y+")");
        
        this.active = false;
        this.init();

    }

    init()
    {
        if(Math.random()<0.5)
        {
            var random = Math.ceil(Math.random()*3)
            var Bg = document.getElementById("BG_"+random).cloneNode(true);
            // Bg.setAttribute("transform","translate(0,"+(-200-Math.random()*400)+") scale("+Math.sign(Math.random()-0.5)+",1)");
            Bg.setAttribute("transform","translate(0,"+(-200-Math.random()*400)+") scale(1,1)");
            this.group.appendChild(Bg);
        }

        var numSpikes = 2;
        for (let i = 0; i < numSpikes; i++) 
        {
            var spike = document.getElementById("Spike").cloneNode(true);
            var flipped = Math.sign(Math.random()-0.5);
            var spikePosition = {x:768/2-240*flipped,y:-200+(Math.random()*-400)-600*i}
            spike.setAttribute("transform","translate("+spikePosition.x+","+spikePosition.y+") scale("+flipped+",1)");
            this.group.appendChild(spike);
            this.spikes.push(spikePosition);
        }

        var wallL = document.getElementById("wall").cloneNode(true);
        wallL.setAttribute("transform","translate("+-70+","+0+")");
        this.group.appendChild(wallL);
        
        var wallR = document.getElementById("wall").cloneNode(true);
        wallR.setAttribute("transform","translate("+(768+70)+","+0+")");
        this.group.appendChild(wallR);
    }

    checkCollision(Position)
    {
        for (let i = 0; i < this.spikes.length; i++) 
        {
            let y = (this.position.y+this.spikes[i].y)-Position.y;
            let x = (this.position.x+this.spikes[i].x)-Position.x;
    
            let d = Math.sqrt(x * x + y * y);
            if(d < 90)
            {
                return true
            }
        }
    }

    getClosestSpike(Position)
    {
        var distance = Infinity;
        var closest = null;
        for (let i = 0; i < this.spikes.length; i++) 
        {
            if(distance > Math.abs((this.position.y+this.spikes[i].y)-Position.y))
            {
                // console.log( Math.abs((this.position.y+this.spikes[i].y)-Position.y))
                closest = i;
                distance =Math.abs((this.position.y+this.spikes[i].y)-Position.y)
            }
        }
       return this.spikes[closest];
    }

    isVisible()
    {
        if(Math.sqrt((camera.position.y - this.position.y)*(camera.position.y - this.position.y))<1600)
        {
            this.show()
        }
        else
        {
            this.hide()
        }
    }

    show()
    {   
        if(!this.active)
        {
            document.getElementById("levelParts").appendChild(this.group);
            this.active = true;
        }
    }

    hide()
    {
        if(this.active)
        {
            document.getElementById("levelParts").removeChild(this.group)
            this.active = false;
        }
    }
}