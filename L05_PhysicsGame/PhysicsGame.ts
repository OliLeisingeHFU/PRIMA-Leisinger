namespace L05_PhysicsGame {
  import ƒ = FudgeCore;
  // import ƒAid = FudgeAid;
  let root: ƒ.Graph;
  let cmpAvatar: ƒ.ComponentRigidbody;
  let cmpCamera: ƒ.ComponentCamera;
  let viewport: ƒ.Viewport;
  let avatar: ƒ.Node;
  let speedPC: number = 1;
  let rotSpeed: number = 4;

  window.addEventListener("load", start);

  async function start(_event: Event): Promise<void> {
    ƒ.Physics.settings.debugDraw = true;

    await FudgeCore.Project.loadResourcesFromHTML();
    // await FudgeCore.Project.loadResources("PhysicsGame.json");
    // pick the graph to show
    root = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-04-27T14:37:42.239Z|64317"];

    
    createAvatar();
    createRigidbodies();
    

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", root, cmpCamera, canvas);


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function createAvatar(): void {
    cmpAvatar = new ƒ.ComponentRigidbody(0.1, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CAPSULE, ƒ.PHYSICS_GROUP.DEFAULT);
    cmpAvatar.restitution = 0.5;
    cmpAvatar.rotationInfluenceFactor = ƒ.Vector3.ZERO();
    cmpAvatar.friction = 1;
    cmpCamera = new ƒ.ComponentCamera();
    avatar  = new ƒ.Node("Avatar")
    avatar.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(3))));
    avatar.addComponent(cmpAvatar);
    avatar.addComponent(cmpCamera);
    root.appendChild(avatar);
    cmpCamera.mtxPivot.translateY(1);
  }

  function update(): void {
    ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
    let forward: ƒ.Vector3;
    forward = avatar.mtxWorld.getZ();

    // Movement:
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
    cmpAvatar.applyForce(ƒ.Vector3.SCALE(forward, speedPC));

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
      cmpAvatar.applyForce(ƒ.Vector3.SCALE(forward, - speedPC));

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
      cmpAvatar.rotateBody(ƒ.Vector3.Y(rotSpeed));
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
      cmpAvatar.rotateBody(ƒ.Vector3.Y(-rotSpeed));
      

    viewport.draw();
    ƒ.Physics.settings.debugDraw = true;
  }

  function createRigidbodies(): void {
    let level: ƒ.Node = root.getChildrenByName("level")[0];
    for (let node of level.getChildren()) {
      let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(0, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.DEFAULT);
      node.addComponent(cmpRigidbody);
    }

    ƒ.Physics.adjustTransforms(root, true);


    for (let node of level.getChildren()) {
      console.log(node.name, node.cmpTransform?.mtxLocal.toString());
    }
  }
}