"use strict";
var Shadowrun;
(function (Shadowrun) {
    var ƒ = FudgeCore;
    class Arena extends ƒ.Node {
        constructor() {
            super("Arena");
            for (let x = 0; x < 20; ++x) {
                for (let z = 0; z < 20; ++z) {
                    let tile = new ƒ.Node(("TileX" + x + "Y" + z));
                    let cube = new ƒ.MeshCube("cube");
                    let cmpMesh = new ƒ.ComponentMesh(cube);
                    cmpMesh.mtxPivot.scaleX(1.5);
                    cmpMesh.mtxPivot.scaleZ(1.5);
                    tile.addComponent(new ƒ.ComponentMaterial(Arena.material));
                    tile.addComponent(new ƒ.ComponentTransform());
                    tile.mtxLocal.translateX(x * 1.55);
                    tile.mtxLocal.translateZ(z * 1.55);
                    tile.addComponent(cmpMesh);
                    Arena.ground.addChild(tile);
                }
            }
            this.addChild(Arena.ground);
            let cmpLight = new ƒ.ComponentLight(new ƒ.LightPoint(new ƒ.Color((221 / 255), (209 / 255), (235 / 255))));
            this.addComponent(cmpLight);
            cmpLight.mtxPivot.translateY(10);
            cmpLight.mtxPivot.translateX(15);
            cmpLight.mtxPivot.translateZ(15);
        }
        static getInstance() {
            if (this.instance == null)
                this.instance = new Arena();
            return this.instance;
        }
    }
    Arena.ground = new ƒ.Node("Ground");
    Arena.material = new ƒ.Material("White", ƒ.ShaderFlat, new ƒ.CoatColored());
    Shadowrun.Arena = Arena;
})(Shadowrun || (Shadowrun = {}));
//# sourceMappingURL=Arena.js.map