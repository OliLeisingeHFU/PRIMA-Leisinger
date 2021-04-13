"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class ShipProjectile extends SpaceInvaders.Projectile {
        constructor(_pos) {
            super("PlayerProjectile", _pos);
        }
        static getInstance(_pos) {
            if (this.instance == null)
                this.instance = new ShipProjectile(_pos);
            return this.instance;
        }
        static move() {
            if (ShipProjectile.projectileExists()) {
                console.log(this.instance);
                let offset = SpaceInvaders.Projectile.speedProjectile * ƒ.Loop.timeFrameReal / 1000;
                this.instance.mtxLocal.translateY(+offset);
                this.instance.setRectPosition();
                if (this.instance.cmpTransform.mtxLocal.translation.y >= 14) {
                    this.despawnProjectile();
                }
            }
        }
        static projectileExists() {
            if (this.instance == null) {
                return false;
            }
            return true;
        }
        static despawnProjectile() {
            this.instance = null;
        }
    }
    SpaceInvaders.ShipProjectile = ShipProjectile;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=ShipProjectile.js.map