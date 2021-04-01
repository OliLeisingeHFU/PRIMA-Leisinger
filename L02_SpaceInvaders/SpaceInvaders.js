"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    window.addEventListener("load", init);
    let viewport = new ƒ.Viewport();
    SpaceInvaders.quadMesh = new ƒ.MeshQuad("Quad");
    SpaceInvaders.material = new ƒ.Material("Florian", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));
    function init(_event) {
        const canvas = document.querySelector("canvas");
        let space = new ƒ.Node("Space");
        let ship = new SpaceInvaders.PlayerShip("Ship");
        space.addChild(ship);
        let motherShip = new SpaceInvaders.MotherShip("MotherShip");
        space.addChild(motherShip);
        let invaders = new ƒ.Node("Invaders");
        for (let y = 0; y < 5; ++y) {
            for (let x = 0; x < 11; ++x) {
                let invader = new SpaceInvaders.Invader(x, y);
                invaders.addChild(invader);
            }
        }
        space.addChild(invaders);
        let barricades = new ƒ.Node("Barricades");
        let nStripes = 21;
        let barricadeStripeHeights = [14, 15, 16, 17, 17, 12, 11, 10, 9, 8, 8, 8, 9, 10, 11, 12, 17, 17, 16, 15, 14];
        let barricadeStripeYOffsets = [-1.5, -1, -0.5, 0, 0, 2.5, 3, 3.5, 4, 4.5, 4.5, 4.5, 4, 3.5, 3, 2.5, 0, 0, -0.5, -1, -1.5];
        for (let iBarricade = 0; iBarricade < 4; iBarricade++) {
            let shield = new SpaceInvaders.Shield(iBarricade, nStripes, barricadeStripeHeights, barricadeStripeYOffsets);
            barricades.addChild(shield);
        }
        space.addChild(barricades);
        let projectile0 = new SpaceInvaders.Projectile("Projektile0", 0, 1);
        space.addChild(projectile0);
        let projectile1 = new SpaceInvaders.Projectile("Projektile1", -45, 4);
        space.addChild(projectile1);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(18);
        cmpCamera.mtxPivot.translateY(77 / 13);
        cmpCamera.mtxPivot.rotateY(180);
        viewport.initialize("Viewport", space, cmpCamera, canvas);
        viewport.draw();
        console.log(space);
    }
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=SpaceInvaders.js.map