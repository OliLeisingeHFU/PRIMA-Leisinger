namespace Shadowrun {
  import ƒ = FudgeCore;
  window.addEventListener("load", init);
  let viewport: ƒ.Viewport = new ƒ.Viewport();
  let game: ƒ.Node = new ƒ.Node("Game");
  let arena: ƒ.Node = new ƒ.Node("Arena");
  let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();

  function init(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");

    cmpCamera.mtxPivot.translateX(30);
    cmpCamera.mtxPivot.translateY(30);
    cmpCamera.mtxPivot.translateZ(30);
    cmpCamera.mtxPivot.rotateY(180 + 45);
    cmpCamera.mtxPivot.rotateX(40);

    console.log(cmpCamera);
    arena = Arena.getInstance();
    game.addChild(arena);

    viewport.initialize("Viewport", game, cmpCamera, canvas);
    viewport.draw();

    console.log(game);

    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
  }

  function update(_event: Event): void {
    let offset: number = 20 * ƒ.Loop.timeFrameReal / 1000;

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
      arena.mtxLocal.rotateY(-offset);

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
    arena.mtxLocal.rotateY(+offset);

    viewport.draw();
  }
}