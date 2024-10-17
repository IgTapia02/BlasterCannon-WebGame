class Power {
    constructor(initialPosition, powerTipe) {

        switch(powerTipe)  //depende del poder que sea le ponemos una imagen u otra
        {
          case 1:
            this.img = assets.bullet_.img;
            break;

          case 2:
            this.img = assets.shield_.img;
            break;
        }

      this.position = Vector2.Copy(initialPosition);
  
      this.movement = Vector2.Zero();
      this.movement.y = 1;

      this.speed = 300;

      this.powerTipe =  powerTipe;
    }
  
    Update(deltaTime) {
        if(this.position.y < canvas.height - 100) //cae hacia abajo hbasta el suelo
        {
            this.position.y += this.movement.y * this.speed * deltaTime;
        }
    }
  
    Draw(ctx) {
        ctx.save();
      
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation + PIH);
        ctx.scale(10,10);
      
        ctx.drawImage(this.img, 0, 0, 256, 256, -2.5, -2.5, 5, 5);
      
        ctx.restore();
    }
  }