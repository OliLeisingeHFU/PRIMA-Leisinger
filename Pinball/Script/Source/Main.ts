namespace Pinball {
  import ƒ = FudgeCore;
  //import ƒui = FudgeUserInterface;

// important Variables
  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let arena: ƒ.Node;
  let left: ƒ.Node;
  let right: ƒ.Node;
  let spring: ƒ.Node;

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
    await Ball.loadValues();
    await Script.CollisionHandler.loadValues();

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
    ƒ.AudioManager.default.listenTo(graph);
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));

    // initialize physics
    let bumpers = arena.getChildrenByName("Bumpers")[0].getChildren();
    addColliders(bumpers, undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
    addScriptComp(bumpers, "Bumper");

    addColliders(arena.getChildrenByName("Flippers")[0].getChildren(), 1000, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE);
    addColliders(arena.getChildrenByName("Spring"), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);

    let pickups: ƒ.Node = arena.getChildrenByName("Pickups")[0];
    pickups.addChild(new Power("MultiballAbility"));
    pickups.addChild(new Power("ForceUpAbility"));
    let coins = pickups.getChildrenByName("Coins")[0];
    for(let i = 0; i < 5; i++){
      coins.addChild(new Coin("Coin" + i));
    }

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

  // helper functions
  export function addColliders(_nodes: ƒ.Node[], _mass?: number, _type?: ƒ.BODY_TYPE, _colliderType?: ƒ.COLLIDER_TYPE, _trigger?: boolean): void{
    _nodes.forEach(function(object){
      if(object.cmpTransform){
        let cmpRigidBody;
        if(_colliderType == ƒ.COLLIDER_TYPE.CONVEX){ //technically not needed as no MeshExtrusions are used.
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

  export function timesWeight(_val: number): number{
    return _val * Ball.val.weight * GameState.get().baseForce * (Ball.val.effectGravity/2);
  }

  export function inSeconds(_val: number): number{
    return _val * 1000;
  }

  function flipBall(_col: ƒ.ComponentRigidbody, _flipper: ƒ.Node): void{
    let leftY = _flipper.mtxWorld.getY();
    let x = leftY.x;
    let y = leftY.y;
    let z = leftY.z;
    _col.applyLinearImpulse(ƒ.Vector3.SCALE(new ƒ.Vector3(x, y, z), timesWeight(5)));
  }

  export function deactivator(_node: ƒ.Node, time: number){
    let node = _node;
    let parent = node.getParent();
    setTimeout(function(){
      node.removeComponent(node.getComponent(Script.CollisionHandler));
      node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
      parent.removeChild(node);
      setTimeout(function(){
        switch(parent.name){
          case "Coins":
            parent.addChild(new Coin(node.name));
            break;
          default:
            parent.addChild(new Power(node.name));
        }
      }, Pinball.inSeconds(time));
    }, 100);
  }

  function update(_event: Event): void {
    let inactiveBall: boolean = false;
    if(!arena.getChildrenByName("Balls")[0].getChildren()[0] && GameState.get().lives > 0){ //check if at least one ball exists
      // spawn new ball if none exist
      arena.getChildrenByName("Balls")[0].addChild(new Ball());
      GameState.get().lives -= 1;
      if(arena.getChildrenByName("LaunchCloser")[0].getChild(0).getComponent(ƒ.ComponentRigidbody)){
        arena.getChildrenByName("LaunchCloser")[0].getChildren().forEach(function(_node){
          _node.removeComponent(_node.getComponent(ƒ.ComponentRigidbody));
        });
      }
    }else if(GameState.get().lives == 0){
      alert("You gained " + GameState.get().points + " points! Good Job :) Try again?");
      GameState.get().points = 0;
      GameState.get().lives = 3;
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
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && GameState.get().force < 50 && inactiveBall){ // launch control
      GameState.get().force += 1;
    }else if(GameState.get().force > 15 && inactiveBall && !ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])){
      let ball: ƒ.Node = arena.getChildrenByName("Balls")[0].getChild(0);
      ball.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(ball.mtxWorld.getY(), timesWeight(GameState.get().force)));
      setTimeout(function(){
        addColliders(arena.getChildrenByName("LaunchCloser")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
      }, 2250);
      GameState.get().force = 15;
    }

    // Flipper controls
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A]) && left.mtxLocal.rotation.z < 29.5){
      left.mtxLocal.rotateZ(10);
      left.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function(col){
        if(col.node.name == "Ball"){
          flipBall(col, left);
        }
      });
    }else if(!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.D]) && left.mtxLocal.rotation.z > 0.5){
      left.mtxLocal.rotateZ(-10);
    }else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]) && left.mtxLocal.rotation.z > -29.5){
      left.mtxLocal.rotateZ(-10);
      left.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function(col){
        if(col.node.name == "Ball"){
          (<Ball>(col.node)).multihit = 0;
          flipBall(col, left);
        }
      });
    }else if(!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.D]) && left.mtxLocal.rotation.z < -0.5){
      left.mtxLocal.rotateZ(10);
    }

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT]) && right.mtxLocal.rotation.z > -29.5){
      right.mtxLocal.rotateZ(-10);
      right.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function(col){
        if(col.node.name == "Ball"){
          (<Ball>(col.node)).multihit = 0;
          flipBall(col, right);
        }
      });
    }else if(!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.ARROW_LEFT]) && right.mtxLocal.rotation.z < -0.5){
      right.mtxLocal.rotateZ(10);
    }else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT]) && right.mtxLocal.rotation.z < 29.5){
      right.mtxLocal.rotateZ(10);
      right.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function(col){
        if(col.node.name == "Ball"){
          flipBall(col, right);
        }
      });
    }else if(!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.ARROW_LEFT]) && right.mtxLocal.rotation.z > 0.5){
      right.mtxLocal.rotateZ(-10);
    }

    ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();  
    ƒ.AudioManager.default.update();
  }
}