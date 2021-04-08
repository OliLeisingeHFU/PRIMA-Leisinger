"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class ShipProjectile extends SpaceInvaders.Projectile {
        constructor(_pos) {
            super("PlayerProjectile", _pos);
        }
        static getInstance(_x, _y) {
            let pos = new ƒ.Vector2(_x, _y);
            if (this.instance == null)
                this.instance = new ShipProjectile(pos);
            return this.instance;
        }
        static shoot() {
            let offset = SpaceInvaders.Projectile.speedProjectile * ƒ.Loop.timeFrameReal / 1000;
            if (this.instance != null) {
                this.instance.mtxLocal.translateY(+offset);
                console.log(this.instance);
                if (this.instance.cmpTransform.mtxLocal.translation.y >= 15) {
                    this.instance = null;
                }
            }
        }
    }
    SpaceInvaders.ShipProjectile = ShipProjectile;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=ShipProjectile.js.map