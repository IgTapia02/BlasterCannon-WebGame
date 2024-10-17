
class Bullet {

    constructor() {
        this.position = { x: 0, y: 0};
        this.rotation = 0;
        this.damage = 1;
        this.active = false;
        this.owner = null;
        this.speed = 200;
        this.onDeactivate = null;

        this.pop_ = new Audio(sounds.pop.audio.src);
    }

    Update(deltaTime) {
        this.position.y += Math.sin(this.rotation) * this.speed * deltaTime; // se mueve la bala hacia arriba
    }

    Draw(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation + PIH);
        ctx.drawImage(assets.bola.img, 0, 0, 177, 177, -10, -10, 20, 20)

        ctx.restore();
    }
}

class BulletPool {
    constructor(owner, maxSize) {
        this.owner = owner;
        this.bullets = [];
    
        //inicializa la pull de balas
        for (let i = maxSize; i > 0; i--) {
            const bullet = new Bullet();
            bullet.owner = this.owner;
            bullet.onDeactivate = this.Deactivate;

            this.bullets.push(bullet);
        }
    }

    Activate() {
        let bullet = null;
        let i = 0;

        while (bullet == null && i < this.bullets.length) {
            //si hay alguna bala inactiva, se activa y se usa esa
            if (!this.bullets[i].active) {
                bullet = this.bullets[i];
            }
            else {
                i++;
            }
        }

        if (bullet == null) {
            //si no hay balas crea una
            bullet = new Bullet();
            bullet.owner = this.owner;
            bullet.onDeactivate = this.Deactivate;

            this.bullets.push(bullet);
        }

        bullet.active = true;
        return bullet;
    }

    Deactivate(bullet) {
        bullet.active = false;
    }

    Update(deltaTime) {
        this.bullets.forEach(bullet => { //activa el update de todas las balas de la pull
            if (bullet.active) {
                bullet.Update(deltaTime);
            }
        });
    }

    Draw(ctx) {
        this.bullets.forEach(bullet => {
            if (bullet.active)
                bullet.Draw(ctx);
        });
    }
}