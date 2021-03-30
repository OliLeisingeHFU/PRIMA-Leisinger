"use strict";
var L01_FirstFudge;
(function (L01_FirstFudge) {
    var ƒ = FudgeCore;
    window.addEventListener("load", init);
    let nodePlayer = new ƒ.Node("Player");
    let nodeLeft = new ƒ.Node("Left");
    let nodeRight = new ƒ.Node("Right");
    let viewport = new ƒ.Viewport();
    function init(_event) {
        const canvas = document.querySelector("canvas");
        boundaryDraw();
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(10);
        cmpCamera.mtxPivot.rotateY(180);
        viewport.initialize("Viewport", nodePlayer, cmpCamera, canvas);
        viewport.draw();
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function boundaryDraw() {
        nodePlayer.addComponent(new ƒ.ComponentTransform());
        let meshPlayer = new ƒ.MeshQuad("Quad");
        nodePlayer.addComponent(new ƒ.ComponentMesh(meshPlayer));
        nodePlayer.getComponent(ƒ.ComponentMesh).mtxPivot.translateZ(1);
        let meshLeft = new ƒ.MeshQuad("LeftQ");
        nodeLeft.addComponent(new ƒ.ComponentMesh(meshLeft));
        nodeLeft.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-9);
        nodeLeft.getComponent(ƒ.ComponentMesh).mtxPivot.translateZ(1);
        let meshRight = new ƒ.MeshQuad("RightQ");
        nodeRight.addComponent(new ƒ.ComponentMesh(meshRight));
        nodeRight.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(9);
        nodeRight.getComponent(ƒ.ComponentMesh).mtxPivot.translateZ(1);
        let material = new ƒ.Material("Florian", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        nodePlayer.addComponent(cmpMaterial);
        nodeLeft.addComponent(cmpMaterial);
        nodeRight.addComponent(cmpMaterial);
    }
    function update(_event) {
        // console.log(_event);
        viewport.draw();
    }
})(L01_FirstFudge || (L01_FirstFudge = {}));
//# sourceMappingURL=SpaceInvader.js.map