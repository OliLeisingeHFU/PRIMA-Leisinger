namespace SpaceInvaders {
  import ƒ = FudgeCore;

  window.addEventListener("load", init);
  let viewport: ƒ.Viewport = new ƒ.Viewport();
  export let quadMesh: ƒ.Mesh = new ƒ.MeshQuad("Quad");
  export let material: ƒ.Material = new ƒ.Material("Florian", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));

  function init(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");

    let space: ƒ.Node = new ƒ.Node("Space");

    let ship: ƒ.Node = new PlayerShip("Ship");
    space.addChild(ship);

    let motherShip: ƒ.Node = new MotherShip("MotherShip");
    space.addChild(motherShip);

    let invaders: ƒ.Node = new ƒ.Node("Invaders");
    for (let y: number = 0; y < 5; ++y) {
      for (let x: number = 0; x < 11; ++x) {
        let invader: ƒ.Node = new Invader(x, y);
        invaders.addChild(invader);
      }
    }
    space.addChild(invaders);

    let barricades: ƒ.Node = new ƒ.Node("Barricades");
    let nStripes: number = 21;
    let barricadeStripeHeights: number[] = [14, 15, 16, 17, 17, 12, 11, 10, 9, 8, 8, 8, 9, 10, 11, 12, 17, 17, 16, 15, 14];
    let barricadeStripeYOffsets: number[] = [-1.5, -1, -0.5, 0, 0, 2.5, 3, 3.5, 4, 4.5, 4.5, 4.5, 4, 3.5, 3, 2.5, 0, 0, -0.5, -1, -1.5];

    for (let iBarricade: number = 0; iBarricade < 4; iBarricade++) {
      let shield: ƒ.Node = new Shield(iBarricade, nStripes, barricadeStripeHeights, barricadeStripeYOffsets);
      barricades.addChild(shield);
    }
    space.addChild(barricades);

    let projectile0: ƒ.Node = new Projectile("Projektile0", 0, 1);
    space.addChild(projectile0);

    let projectile1: ƒ.Node = new Projectile("Projektile1", -45, 4);
    space.addChild(projectile1);

    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    cmpCamera.mtxPivot.translateZ(18);
    cmpCamera.mtxPivot.translateY(77 / 13);
    cmpCamera.mtxPivot.rotateY(180);

    viewport.initialize("Viewport", space, cmpCamera, canvas);
    viewport.draw();


    console.log(space);
  }
}