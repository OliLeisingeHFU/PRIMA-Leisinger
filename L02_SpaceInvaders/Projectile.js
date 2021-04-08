"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class Projectile extends SpaceInvaders.QuadNode {
        constructor(_name, _pos) {
            let scale = new ƒ.Vector2(1 / 13, 5 / 13);
            super(_name, _pos, scale);
        }
    }
    Projectile.speedProjectile = 10;
    SpaceInvaders.Projectile = Projectile;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Projectile.js.map