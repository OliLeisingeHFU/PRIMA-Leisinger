"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class MotherShip extends SpaceInvaders.Enemy {
        constructor(_name) {
            super(_name);
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateX(75 / 13);
            this.mtxLocal.translateY(140 / 13);
            this.addComponent(new ƒ.ComponentMesh(SpaceInvaders.quadMesh));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(14 / 13);
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(7 / 13);
            this.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
        }
    }
    SpaceInvaders.MotherShip = MotherShip;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=MotherShip.js.map