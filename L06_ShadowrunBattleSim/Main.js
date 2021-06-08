"use strict";
var Shadowrun;
(function (Shadowrun) {
    var ƒ = FudgeCore;
    window.addEventListener("load", init);
    let viewport = new ƒ.Viewport();
    let game = new ƒ.Node("Game");
    let arena = new ƒ.Node("Arena");
    let cmpCamera = new ƒ.ComponentCamera();
    function init(_event) {
        const canvas = document.querySelector("canvas");
        cmpCamera.mtxPivot.translateX(30);
        cmpCamera.mtxPivot.translateY(30);
        cmpCamera.mtxPivot.translateZ(30);
        cmpCamera.mtxPivot.rotateY(180 + 45);
        cmpCamera.mtxPivot.rotateX(40);
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
        let offset = 20 * ƒ.Loop.timeFrameReal / 1000;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
            arena.mtxLocal.rotateY(-offset);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            arena.mtxLocal.rotateY(+offset);
        viewport.draw();
    }
    /*
    code for loading json:
    let response: Response = await fetch("config.json");
    let textResponse: Object = await response.json();
    */
})(Shadowrun || (Shadowrun = {}));
//# sourceMappingURL=Main.js.map