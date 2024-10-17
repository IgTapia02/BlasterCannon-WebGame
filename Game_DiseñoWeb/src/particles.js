class Particle{
    constructor(position,color,shape){
        this.position = Vector2.Copy(position);
        this.opacity = 1;
        this.color = color || '#8714fb';
        this.shape = shape;
        this.radius = RandomBetweenFloat(0,12);

        this.velocity ={
            x: RandomBetweenFloat(-1,3), //se le pone una velocidad aleatoria
            y: RandomBetweenFloat(-3,-1)
        }
    }

    Update(deltaTime){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.opacity -= 0.01; // se va difuminando con el tiempo
    }

    Draw(ctx){
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.opacity <= 0? 'transparent' : this.color; //preguntamos si la opacidad es menor que 0 para pintar o no la particula

        if(this.shape === 'circle'|| this.velocity>3){
            ctx.beginPath();
            ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2);
            ctx.fill();
            ctx.closePath();

        }else{
            ctx.fillRect(this.position.x,this.position.y,this.radius, this.radius);
        }
        
        ctx.restore();
    }
}