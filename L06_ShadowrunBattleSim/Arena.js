"use strict";
var Shadowrun;
(function (Shadowrun) {
    var ƒ = FudgeCore;
    class Arena extends ƒ.Node {
        constructor() {
            super("Arena");
            this.addComponent(new ƒ.ComponentTransform());
            for (let x = 0; x < 20; ++x) {
                for (let z = 0; z < 20; ++z) {
                    let tile = new ƒ.Node(("TileX" + x + "Y" + z));
                    let cube = new ƒ.MeshCube("cube");
                    let cmpMesh = new ƒ.ComponentMesh(cube);
                    cmpMesh.mtxPivot.scaleX(1.5);
                    cmpMesh.mtxPivot.scaleZ(1.5);
                    tile.addComponent(new ƒ.ComponentMaterial(Arena.material));
                    tile.addComponent(new ƒ.ComponentTransform());
                    tile.mtxLocal.translateX(x * 1.55 - 15);
                    tile.mtxLocal.translateZ(z * 1.55 - 15);
                    tile.addComponent(cmpMesh);
                    Arena.ground.addChild(tile);
                    let rngCover = Math.random() * 50;
                    if (rngCover > 49) {
                        let cover = new ƒ.Node(("CoverX" + x + "Y" + z));
                        let cmpMeshCover = new ƒ.ComponentMesh(cube);
                        cmpMeshCover.mtxPivot.scaleX(Math.random() * 4 + 0.1);
                        cmpMeshCover.mtxPivot.scaleZ(Math.random() * 4 + 0.1);
                        cover.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("Gray", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.5, 0.5, 0.5)))));
                        cover.addComponent(new ƒ.ComponentTransform());
                        cover.mtxLocal.translateX(x * 1.55 - 15);
                        cover.mtxLocal.translateZ(z * 1.55 - 15);
                        cover.mtxLocal.translateY(1);
                        cover.addComponent(cmpMeshCover);
                        Arena.ground.addChild(cover);
                    }
                }
            }
            this.addChild(Arena.ground);
            let r = (221 / 255);
            let g = (209 / 255);
            let b = (235 / 255);
            let cmpLightAmbient = new ƒ.ComponentLight(new ƒ.LightAmbient(new ƒ.Color(r, g, b, 0.1)));
            this.addComponent(cmpLightAmbient);
            let cmpLightDirect = new ƒ.ComponentLight(new ƒ.LightDirectional(new ƒ.Color(r, g, b, 0.75)));
            this.addComponent(cmpLightDirect);
            cmpLightDirect.mtxPivot.translateY(2);
            cmpLightDirect.mtxPivot.translateX(10);
            cmpLightDirect.mtxPivot.translateZ(10);
            cmpLightDirect.mtxPivot.rotateY(150);
            cmpLightDirect.mtxPivot.rotateX(42);
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