"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class PlayerShip extends ƒ.Node {
        constructor(_name) {
            super(_name);
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(SpaceInvaders.quadMesh));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(7 / 13);
            this.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
        }
    }
    SpaceInvaders.PlayerShip = PlayerShip;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=PlayerShip.js.map