class Camera {

    constructor()
    {
        this.view = document.getElementById("Level");
        this.target = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.position = { x: 0, y: -100 };
        this.targetOffset = { x: viewBox.width / 2, y: -100 };
    }

    reset()
    {
        this.position = { x: 0, y: this.targetOffset.y };
    }
    
    update(dt)
    {
        this.velocity.y = (this.target.position.y - this.position.y - this.targetOffset.y) / (2);
        this.velocity.x = ((this.target.position.x - this.position.x - this.targetOffset.x)) / 4;
        this.position.y += (Math.min(this.position.y + this.velocity.y * dt, 20) - this.position.y) / 10;
        this.position.x += (this.velocity.x - this.position.x) / 10;

        this.view.setAttribute("transform", "translate(" + (-this.position.x) + "," + (-this.position.y) + ")");
    }

}