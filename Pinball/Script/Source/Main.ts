namespace Pinball {
  import ƒ = FudgeCore;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let arena: ƒ.Node;

  window.addEventListener("load", init);
  function init(_event: Event): void {
    let dialog: HTMLDialogElement = document.querySelector("dialog");
    dialog.querySelector("h1").textContent = document.title;
    dialog.addEventListener("click", function (_event: Event): void {
      // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
      dialog.close();
      start(null);
    });
    //@ts-ignore
    dialog.showModal();
  }

  async function start(_event: CustomEvent): Promise<void> {
    await FudgeCore.Project.loadResourcesFromHTML();
    graph = <ƒ.Graph>ƒ.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
    arena = graph.getChildrenByName("Arena")[0];
    // initialize Camera
    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    cmpCamera.mtxPivot.rotateY(180);
    cmpCamera.mtxPivot.rotateX(45);
    cmpCamera.mtxPivot.translateY(16);
    cmpCamera.mtxPivot.translateZ(-62);

    // initialize viewport
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;

    // initialize physics
    addColliders(arena.getChildrenByName("Bumpers")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CONVEX);
    addColliders(arena.getChildrenByName("Flippers")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
    let pickups: ƒ.Node = arena.getChildrenByName("Pickups")[0];
    addColliders(pickups.getChildrenByName("Coins")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);
    addColliders(pickups.getChildrenByName("MultiBallAbility")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);

    let barriers: ƒ.Node = arena.getChildrenByName("Barriers")[0];
    addColliders(barriers.getChildrenByName("Case")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
    addColliders(barriers.getChildrenByName("Pyramids")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.PYRAMID);
    addColliders(barriers.getChildrenByName("Corners")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CONVEX);
    // Initialize Controlls
    

    // start game
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function addColliders(_nodes: ƒ.Node[], _mass?: number, _type?: ƒ.BODY_TYPE, _colliderType?: ƒ.COLLIDER_TYPE, _trigger?: boolean): void{
    _nodes.forEach(function(object){
      if(object.cmpTransform){
        let cmpRigidBody;
        if(_colliderType == ƒ.COLLIDER_TYPE.CONVEX){
          let convexMesh = object.getComponent(ƒ.ComponentMesh).mesh.vertices;
          cmpRigidBody = new ƒ.ComponentRigidbody(_mass, _type, _colliderType, undefined, undefined, convexMesh);
        }else{
          cmpRigidBody = new ƒ.ComponentRigidbody(_mass, _type, _colliderType);
        }
        cmpRigidBody.initialization = ƒ.BODY_INIT.TO_MESH;
        if(_trigger){
          cmpRigidBody.isTrigger = true;
        }
        cmpRigidBody.isInitialized = false;
        object.addComponent(cmpRigidBody);
      }
    });
  }

  function update(_event: Event): void {
    ƒ.Physics.world.simulate();  // if physics is included and used
    arena.getChildrenByName("Balls")[0].getChildren().forEach(function(ball){
      if(ball.mtxWorld.translation.y >= 0){ //check if ball is below 0, the Death Zone
        // Kill ball
      }
    });
    if(!arena.getChildrenByName("Balls")[0].getChildren()){ //check if at least one ball exists
      // spawn new ball if none exist
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}