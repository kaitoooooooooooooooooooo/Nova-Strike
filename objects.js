class Entity {
    constructor(x, y, width, height, hitboxOffset = { x: 0, y: 0, w: 0, h: 0 }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hitboxOffset = hitboxOffset;
    }

    getHitbox() {
        return {
            x: this.x + this.hitboxOffset.x,
            y: this.y + this.hitboxOffset.y,
            width: this.hitboxOffset.w || this.width,
            height: this.hitboxOffset.h || this.height
        };
    }
}

class Rocket extends Entity {
    constructor(x, y) {
        super(x, y, 80, 80, { x: 10, y: 5, w: 60, h: 70 });
        this.speedX = 0;
        this.speedY = 0;
    }
}

class Alien extends Entity {
    constructor(x, speed) {
        super(x, -50, 50, 50, { x: 5, y: 5, w: 40, h: 40 });
        this.speed = speed;
    }
}

class Meteor extends Entity {
    constructor(x, speed, imgIndex) {
        super(x, -50, 50, 50, { x: 8, y: 8, w: 34, h: 34 });
        this.speed = speed;
        this.imgIndex = imgIndex;
        this.life = 10;
    }
}

class Bullet extends Entity {
    constructor(x, y) {
        super(x, y, 20, 20);
        this.speed = 7;
    }
}