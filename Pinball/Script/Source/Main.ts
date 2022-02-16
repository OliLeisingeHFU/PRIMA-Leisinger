namespace Pinball {
  import ƒ = FudgeCore;

  ƒ.Debug.info("Main Program Template running!");
// important Variables
  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let arena: ƒ.Node;
  let left: ƒ.Node;
  let right: ƒ.Node;
  let spring: ƒ.Node;
  let force: number = 0;

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

    // initialize viewport and sound
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
    ƒ.AudioManager.default.listenTo(graph);
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));

    // initialize physics
    let bumpers = arena.getChildrenByName("Bumpers")[0].getChildren();
    addColliders(bumpers, undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
    addScriptComp(bumpers, "Bumper");

    addColliders(arena.getChildrenByName("Flippers")[0].getChildren(), 1000, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE);
    addColliders(arena.getChildrenByName("Spring"), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);

    let pickups: ƒ.Node = arena.getChildrenByName("Pickups")[0];
    let coins = pickups.getChildrenByName("Coins")[0].getChildren();
    addColliders(coins, undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);
    addScriptComp(coins, "Coin");

    let multiball = pickups.getChildrenByName("MultiBallAbility");
    addColliders(multiball, undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);
    addScriptComp(multiball, "Multiball");

    let barriers: ƒ.Node = arena.getChildrenByName("Barriers")[0];
    addColliders(barriers.getChildrenByName("Case")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
    addColliders(barriers.getChildrenByName("Pyramids")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.PYRAMID);
    addColliders(barriers.getChildrenByName("Corners")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);

    // Initialize Controls
    left = arena.getChildrenByName("Flippers")[0].getChildrenByName("LeftFlipper")[0];
    right = arena.getChildrenByName("Flippers")[0].getChildrenByName("RightFlipper")[0];
    spring = arena.getChildrenByName("Spring")[0];

    // Sound
    arena.getChildrenByName("Bumpers")[0].addComponent(new ƒ.ComponentAudio(new ƒ.Audio("./Sound/Effects/pling.wav"), false, false));
    pickups.getChildrenByName("Coins")[0].addComponent(new ƒ.ComponentAudio(new ƒ.Audio("./Sound/Effects/coin.wav"), false, false));
    pickups.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("./Sound/Effects/power-up.wav"), false, false));
    // start game
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  export function addColliders(_nodes: ƒ.Node[], _mass?: number, _type?: ƒ.BODY_TYPE, _colliderType?: ƒ.COLLIDER_TYPE, _trigger?: boolean): void{
    _nodes.forEach(function(object){
      if(object.cmpTransform){
        let cmpRigidBody;
        if(_colliderType == ƒ.COLLIDER_TYPE.CONVEX){
          let convexMesh = object.getComponent(ƒ.ComponentMesh).mesh.vertices;
          cmpRigidBody = new ƒ.ComponentRigidbody(_mass, _type, _colliderType, undefined, undefined, convexMesh);
        }else{
          cmpRigidBody = new ƒ.ComponentRigidbody(_mass, _type, _colliderType);
        }
        if(_trigger){
          cmpRigidBody.isTrigger = true;
        }
        cmpRigidBody.initialization = ƒ.BODY_INIT.TO_MESH;
        cmpRigidBody.isInitialized = false;
        
        object.addComponent(cmpRigidBody);
      }
    });
  }

  function addScriptComp(_nodes: ƒ.Node[], _type: String){
    _nodes.forEach(function(object){
      object.addComponent(new Script.CollisionHandler(_type));
    });
  }

  function flipBall(_col: ƒ.ComponentRigidbody, _flipper: ƒ.Node): void{
    let colV = 2;//_col.getVelocity().magnitude;
    //console.log(colV);
    let leftY = _flipper.mtxWorld.getY();
    let x = leftY.x;
    let y = leftY.y;
    let z = leftY.z;
    console.log("x: " + x + " y: " + y + " z: " + z);
    _col.applyLinearImpulse(ƒ.Vector3.SCALE(new ƒ.Vector3(x, y, z), (colV * 50))); //ƒ.Vector3.SCALE(left.mtxWorld.getY(), 75)
  }

  function update(_event: Event): void {
    let inactiveBall: boolean = false;
    if(!arena.getChildrenByName("Balls")[0].getChildren()[0]){ //check if at least one ball exists
      // spawn new ball if none exist
      arena.getChildrenByName("Balls")[0].addChild(new Ball());
    }
    arena.getChildrenByName("Balls")[0].getChildren().forEach(function(ball){
      spring.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function(col){
        if(col.node.name == "Ball"){ 
          inactiveBall = true;
        }
      });

      if(ball.mtxWorld.translation.y < 0){ //check if ball is below 0, the Death Zone
        // Kill ball
        ball.removeComponent(ball.getComponent(ƒ.ComponentRigidbody));
        ball.getParent().removeChild(ball);
      }
    });
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && force < 500 && inactiveBall){
      force += 10;
    }else if(force > 0 && inactiveBall && !ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])){
      let ball: ƒ.Node = arena.getChildrenByName("Balls")[0].getChild(0);
      ball.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(ball.mtxWorld.getY(), force));
      console.log("shoot with force: " + force);
      force = 0;
    }

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && left.mtxLocal.rotation.z < 29.5){
      left.mtxLocal.rotateZ(10);
      left.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function(col){
        if(col.node.name == "Ball"){
          flipBall(col, left);
        }
      });
    }else if(!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && left.mtxLocal.rotation.z > 0.5){
      left.mtxLocal.rotateZ(-10);
    }

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && right.mtxLocal.rotation.z > -29.5){
      right.mtxLocal.rotateZ(-10);
      right.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function(col){
        if(col.node.name == "Ball"){
          flipBall(col, right);
        }
      });
    }else if(!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && right.mtxLocal.rotation.z < -0.5){
      right.mtxLocal.rotateZ(10);
    }

    ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();  
    ƒ.AudioManager.default.update();
  }
}