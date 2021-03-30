namespace L01_FirstFudge {
  import ƒ = FudgeCore;
  window.addEventListener("load", init);
  let nodePlayer: ƒ.Node = new ƒ.Node("Player");
  let nodeLeft: ƒ.Node = new ƒ.Node("Left");
  let nodeRight: ƒ.Node = new ƒ.Node("Right");
  let viewport: ƒ.Viewport = new ƒ.Viewport();
  

  function init(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    boundaryDraw();

    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    cmpCamera.mtxPivot.translateZ(10);
    cmpCamera.mtxPivot.rotateY(180);

    viewport.initialize("Viewport", nodePlayer, cmpCamera, canvas);
    viewport.draw();

    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
  }

  function boundaryDraw(): void {
    nodePlayer.addComponent(new ƒ.ComponentTransform());

    let meshPlayer: ƒ.Mesh = new ƒ.MeshQuad("Quad");
    nodePlayer.addComponent(new ƒ.ComponentMesh(meshPlayer));
    nodePlayer.getComponent(ƒ.ComponentMesh).mtxPivot.translateZ(1);

    let meshLeft: ƒ.Mesh = new ƒ.MeshQuad("LeftQ");
    nodeLeft.addComponent(new ƒ.ComponentMesh(meshLeft));
    nodeLeft.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-9);
    nodeLeft.getComponent(ƒ.ComponentMesh).mtxPivot.translateZ(1);

    let meshRight: ƒ.Mesh = new ƒ.MeshQuad("RightQ");
    nodeRight.addComponent(new ƒ.ComponentMesh(meshRight));
    nodeRight.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(9);
    nodeRight.getComponent(ƒ.ComponentMesh).mtxPivot.translateZ(1);

    let material: ƒ.Material = new ƒ.Material("Florian", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));
    let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
    nodePlayer.addComponent(cmpMaterial);
    nodeLeft.addComponent(cmpMaterial);
    nodeRight.addComponent(cmpMaterial);
  }

  function update(_event: Event): void {
    // console.log(_event);
    viewport.draw();
  }
}