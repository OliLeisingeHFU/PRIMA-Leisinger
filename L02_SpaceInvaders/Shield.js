"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class Shield extends ƒ.Node {
        constructor(_i, _n, _height, _offset) {
            super("Shield" + _i);
            this.addComponent(new ƒ.ComponentTransform());
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translateX((_i - 1.5) * 53 / 13);
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(24 / 13);
            for (let iStripe = 0; iStripe < _n; iStripe++) {
                let barricadeStripe = new ƒ.Node("BarricadeStripe" + (iStripe + _i * _n));
                let posX = iStripe - (_n - 1) / 2;
                let scaleX = 21 / (_n * 13);
                barricadeStripe.addComponent(new ƒ.ComponentTransform());
                barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(posX * scaleX);
                barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(_offset[iStripe] / 13);
                barricadeStripe.addComponent(new ƒ.ComponentMesh(SpaceInvaders.quadMesh));
                barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(scaleX);
                barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(_height[iStripe] / 13);
                barricadeStripe.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
                this.addChild(barricadeStripe);
            }
        }
    }
    SpaceInvaders.Shield = Shield;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Shield.js.map