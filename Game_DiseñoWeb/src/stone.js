class Stone {
    constructor(img, initialPosition, life, size, spliceRock) {
        this.img = img;
        this.position = Vector2.Copy(initialPosition);
        this.rotation = 0;
        this.rotationSpeed = RandomBetweenFloat(-0.08,0.08); // se pone una veliocidad de rotacion distinta para cada bola
        this.initialLife = life;

        if(this.initialLife<1)
          this.initialLife = 1; //para que nunca empiecen con una vida <= 0

        this.life = life;
        this.spliceRock = spliceRock;
  
        this.size = size; // 3,2,1

        this.BOUNDING_RADIUS_SCALE = 15; //la escala de el colider
    
        this.boundingRadius = this.size * this.BOUNDING_RADIUS_SCALE;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius;
    
        this.movement = Vector2.Zero();
        this.movement.x = RandomBetweenFloat(-1,1);
        this.speed = 200;
        this.speedAuxx = this.speed / 1.5;
    
        this.MIN_ANGLE = -Math.PI / 2;
        this.MAX_ANGLE = Math.PI / 2;

        this.timer = 0; // usamos este timer para ajustar la velocidad de la pelota
        
        this.direction = { //la direccion y en la que van las bolas
          up: false,
          down: true,
        };

        if(spliceRock) // si la bola viene de romper otra, estas empiezan con caracteristicas determinadas
        {
          this.direction.up = true;
          this.direction.down = false;

          this.speedAuxy = 50;
          this.speedAuxx  = this.speed;
        }

        this.sizes = [
          {width: 32, height: 32}, //para la animacion de hacerse mas pequeña si la golpean
          {width: 40, height: 40},
        ];

        this.sizesindex = 0;

        this.particles = [];

        this.bote_ = new Audio(sounds.bouncing.audio.src);
        this.destroy_ = new Audio(sounds.destroy.audio.src); //los audios asociados a la pelota
        
    }
  
    Update(deltaTime) {
      this.rotation -= this.rotationSpeed;
   
      if (this.position.y > canvas.height - this.boundingRadius - 60) { //cuando la pelota golpea el suelo
        this.bote_.play();

        this.timer = 0;
        this.speed = RandomBetweenInt(250,400);//sale con una velocidad aleatoria

        this.direction.up = true; //se cambia la direccion de la bola
        this.direction.down = false;

        let particleNum = RandomBetweenInt(10,50); //se genera una cantidad aleatoria de particulas

        for(let i = particleNum; i >= 0; i--){
          this.particles.push(new Particle (new Vector2(this.position.x, this.position.y + this.boundingRadius), '#fff ', 'circle'));
        }
      }
  
      if (this.speedAuxy <= 0) { //cuando la pelota se queda a 0 de velocidad, cae
        this.timer = 0;
        this.direction.down = true;
        this.direction.up = false;
      }
  
      if (this.position.x < 0 + this.boundingRadius) { // cuando la pelota choca contra los bordes de la pantalla
        this.movement.x = RandomBetweenFloat(0.5,1);
        this.movement.y = Math.sin(RandomBetweenFloat(this.MIN_ANGLE, this.MAX_ANGLE)); // Ángulo aleatorio        
      }
  
      if (this.position.x > canvas.width - this.boundingRadius) {
        this.movement.x = RandomBetweenFloat(-1,-0.5);
        this.movement.y = Math.sin(RandomBetweenFloat(this.MIN_ANGLE, this.MAX_ANGLE)); // Ángulo aleatorio
      }
      
      switch (true) { // cuando la pelota esta subiendo o bajando
        case this.direction.down:
            
          this.timer += deltaTime;
            
            if(this.speedAuxy < this.speed)
                this.speedAuxy = 200 * this.timer;
            else
                this.speedAuxy = this.speed;

          this.movement.y = 1;
          break;

        case this.direction.up:
            
          this.timer += deltaTime;
            
          if(this.speedAuxy > 0)
                this.speedAuxy = this.speed - 200 * this.timer;
            else if(this.speedAuxy < 0)
                this.speedAuxy = 0;
            
          this.movement.y = -1;
          break;
      }

      this.position.x += this.movement.x * this.speedAuxx * deltaTime;
      this.position.y += this.movement.y * this.speedAuxy * deltaTime; //se aplica el movimiento

      this.particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            // Elimina la partícula del array si su opacidad es 0
            this.particles.splice(index, 1);
        } else {
            // Actualiza la partícula solo si su opacidad es mayor que 0
            particle.Update(deltaTime);
        }
      });
    }
  
    Draw(ctx) {
      ctx.save();
    
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.rotation + PIH);
      ctx.scale(this.size,this.size);
    
      //se dibuja la bola en funcion del size
      ctx.drawImage(this.img, 0, 0, 353, 353, -this.sizes[this.sizesindex].width/2, -this.sizes[this.sizesindex].height/2, this.sizes[this.sizesindex].width, this.sizes[this.sizesindex].height);
    
      //se dibuja la vida dentro de la bola
      ctx.fillStyle = "white";
      ctx.font = "20px Boogaloo";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(Math.floor(this.life+1), 0, 0);

      // Dibujar el contorno (en negro)
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1; // Ancho del contorno, ajusta según sea necesario
      ctx.strokeText(Math.floor(this.life+1), 0, 0);

      ctx.restore();

      this.particles.forEach(particle => particle.Draw(ctx));
    }
  
    Damage(damage) {
      //cuando golpeas la bola se activa la "animacion"
      let intervalID = setInterval(()=>{

        this.sizesindex ++;

        if (this.sizesindex>=this.sizes.length) {
            clearInterval(intervalID); // Detener el intervalo si el objeto ha sido destruido
            this.sizesindex = 0;
        }
    }, 25); // Intervalo de 1 segundo (1000 milisegundos)

      this.life -= damage;
      return Math.floor(this.life) < 1; //devuelve si la bola ha muerto o no
    }
  }
