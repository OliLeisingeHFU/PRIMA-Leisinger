"use strict";
var Shadowrun;
(function (Shadowrun) {
    var ƒ = FudgeCore;
    window.addEventListener("load", init);
    let viewport = new ƒ.Viewport();
    let game = new ƒ.Node("Game");
    let arena = new ƒ.Node("Arena");
    function init(_event) {
        const canvas = document.querySelector("canvas");
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translateX(30);
        cmpCamera.mtxPivot.translateY(30);
        cmpCamera.mtxPivot.translateZ(30);
        cmpCamera.mtxPivot.rotateY(180 + 45);
        cmpCamera.mtxPivot.rotateX(45);
        console.log(cmpCamera);
        arena = Shadowrun.Arena.getInstance();
        game.addChild(arena);
        viewport.initialize("Viewport", game, cmpCamera, canvas);
        viewport.draw();
        console.log(game);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function update(_event) {
        viewport.draw();
    }
})(Shadowrun || (Shadowrun = {}));
//# sourceMappingURL=Main.js.map