
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