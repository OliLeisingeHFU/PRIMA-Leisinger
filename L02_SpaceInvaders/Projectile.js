"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class Projectile extends ƒ.Node {
        constructor(_name, _x, _y) {
            super(_name);
            this.addComponent(new ƒ.ComponentTransform());
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(_x / 13);
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(_y);
            this.addComponent(new ƒ.ComponentMesh(SpaceInvaders.quadMesh));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(1 / 13);
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(5 / 13);
            this.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
        }
    }
    SpaceInvaders.Projectile = Projectile;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Projectile.js.map