"use strict";
var Pinball;
(function (Pinball) {
    var ƒ = FudgeCore;
    class Ball extends ƒ.Node {
        multihit;
        constructor(_pos) {
            super("Ball");
            this.multihit = 1;
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshSphere));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("pinball", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.9, 0.9, 0.9, 1)))));
            this.addComponent(new ƒ.ComponentTransform());
            if (!_pos) {
                this.mtxLocal.translateX(13.4);
                this.mtxLocal.translateY(2.5);
            }
            else {
                this.mtxLocal.translateX(_pos.x);
                this.mtxLocal.translateY(_pos.y);
                this.mtxLocal.translateZ(_pos.z);
            }
            Pinball.addColliders([this], 100, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.SPHERE);
        }
    }
    Pinball.Ball = Ball;
})(Pinball || (Pinball = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CollisionHandler extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CollisionHandler);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CollisionHandler added to ";
        objectType;
        constructor(_type) {
            super();
            if (_type) {
                this.objectType = _type;
            }
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node, this.objectType);
                    this.HndAdder();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    this.HndAdder();
                    break;
            }
        };
        HndAdder() {
            switch (this.objectType) {
                case "Bumper":
                    this.node.getComponent(ƒ.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.colHndEvent);
                    break;
                default:
                    this.node.getComponent(ƒ.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.colHndEvent);
                    break;
            }
        }
        colHndEvent(_event) {
            let collider = _event.cmpRigidbody;
            let vel = collider.getVelocity();
            if (collider.node.name == "Ball") {
                this.node.getParent().getComponent(ƒ.ComponentAudio).play(true);
                switch (this.node.getComponent(Script.CollisionHandler).objectType) {
                    case "Bumper":
                        collider.applyLinearImpulse(new ƒ.Vector3(vel.x, vel.y * -200, vel.z * -200)); //ƒ.Vector3.SCALE(collider.getVelocity(), -200)
                        Pinball.GameState.get().points += 5;
                        break;
                    case "Coin":
                        Pinball.GameState.get().points += 10;
                        this.activate(false);
                        setTimeout(function () { this.activate(true); }, 10000);
                        break;
                    case "Multiball":
                        this.node.activate(false);
                        this.activate(false);
                        setTimeout(function () {
                            console.log(this.node);
                            this.node.activate(true);
                            this.activate(true);
                        }, 10000);
                        for (let i = 1; i < 3; i++) {
                            setTimeout(function () {
                                let pos = collider.node.mtxLocal.translation;
                                setTimeout(function () {
                                    let ball = new Pinball.Ball(pos);
                                    collider.node.getParent().appendChild(ball);
                                    ball.getComponent(ƒ.ComponentRigidbody).addVelocity(new ƒ.Vector3(vel.x, (vel.y * (Math.random() * 20 - 10)), (vel.z * (Math.random() * 20 - 10))));
                                }, (i * 750));
                            }, (i * 750));
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    Script.CollisionHandler = CollisionHandler;
})(Script || (Script = {}));
var Pinball;
(function (Pinball) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        static controller;
        static instance;
        name = "PinBall";
        points;
        lives;
        constructor() {
            super();
            this.points = 0;
            this.lives = 4;
            let domHud = document.querySelector("#Hud");
            GameState.instance = this;
            GameState.controller = new ƒui.Controller(this, domHud);
            console.log("Hud-Controller", GameState.controller);
        }
        static get() {
            return GameState.instance || new GameState();
        }
        static newGame() {
            GameState.instance = null;
        }
        reduceMutator(_mutator) { }
    }
    Pinball.GameState = GameState;
})(Pinball || (Pinball = {}));
var Pinball;
(function (Pinball) {
    var ƒ = FudgeCore;
    //import ƒui = FudgeUserInterface;
    // important Variables
    let viewport;
    let graph;
    let arena;
    let left;
    let right;
    let spring;
    let force = 0;
    window.addEventListener("load", init);
    function init(_event) {
        let dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            start(null);
        });
        //@ts-ignore
        dialog.showModal();
    }
    async function start(_event) {
        await FudgeCore.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
        arena = graph.getChildrenByName("Arena")[0];
        // initialize Camera
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.rotateY(180);
        cmpCamera.mtxPivot.rotateX(45);
        cmpCamera.mtxPivot.translateY(16);
        cmpCamera.mtxPivot.translateZ(-62);
        // initialize viewport and sound
        let canvas = document.querySelector("canvas");
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
        let pickups = arena.getChildrenByName("Pickups")[0];
        let coins = pickups.getChildrenByName("Coins")[0].getChildren();
        addColliders(coins, undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);
        addScriptComp(coins, "Coin");
        let multiball = pickups.getChildrenByName("MultiBallAbility");
        addColliders(multiball, undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);
        addScriptComp(multiball, "Multiball");
        let barriers = arena.getChildrenByName("Barriers")[0];
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
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function addColliders(_nodes, _mass, _type, _colliderType, _trigger) {
        _nodes.forEach(function (object) {
            if (object.cmpTransform) {
                let cmpRigidBody;
                if (_colliderType == ƒ.COLLIDER_TYPE.CONVEX) {
                    let convexMesh = object.getComponent(ƒ.ComponentMesh).mesh.vertices;
                    cmpRigidBody = new ƒ.ComponentRigidbody(_mass, _type, _colliderType, undefined, undefined, convexMesh);
                }
                else {
                    cmpRigidBody = new ƒ.ComponentRigidbody(_mass, _type, _colliderType);
                }
                if (_trigger) {
                    cmpRigidBody.isTrigger = true;
                }
                cmpRigidBody.initialization = ƒ.BODY_INIT.TO_MESH;
                cmpRigidBody.isInitialized = false;
                object.addComponent(cmpRigidBody);
            }
        });
    }
    Pinball.addColliders = addColliders;
    function addScriptComp(_nodes, _type) {
        _nodes.forEach(function (object) {
            object.addComponent(new Script.CollisionHandler(_type));
        });
    }
    function flipBall(_col, _flipper) {
        let colV = 2; //_col.getVelocity().magnitude;
        //console.log(colV);
        let leftY = _flipper.mtxWorld.getY();
        let x = leftY.x;
        let y = leftY.y;
        let z = leftY.z;
        console.log("x: " + x + " y: " + y + " z: " + z);
        _col.applyLinearImpulse(ƒ.Vector3.SCALE(new ƒ.Vector3(x, y, z), (colV * 500))); //ƒ.Vector3.SCALE(left.mtxWorld.getY(), 75)
    }
    function update(_event) {
        let inactiveBall = false;
        if (!arena.getChildrenByName("Balls")[0].getChildren()[0] && Pinball.GameState.get().lives > 0) { //check if at least one ball exists
            // spawn new ball if none exist
            arena.getChildrenByName("Balls")[0].addChild(new Pinball.Ball());
            Pinball.GameState.get().lives -= 1;
        }
        else if (Pinball.GameState.get().lives == 0) {
            Pinball.GameState.newGame();
        }
        arena.getChildrenByName("Balls")[0].getChildren().forEach(function (ball) {
            spring.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function (col) {
                if (col.node.name == "Ball") {
                    inactiveBall = true;
                }
            });
            if (ball.mtxWorld.translation.y < 0) { //check if ball is below 0, the Death Zone
                // Kill ball
                ball.removeComponent(ball.getComponent(ƒ.ComponentRigidbody));
                ball.getParent().removeChild(ball);
            }
        });
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && force < 5000 && inactiveBall) {
            force += 100;
        }
        else if (force > 0 && inactiveBall && !ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            let ball = arena.getChildrenByName("Balls")[0].getChild(0);
            ball.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(ball.mtxWorld.getY(), force));
            console.log("shoot with force: " + force);
            force = 0;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && left.mtxLocal.rotation.z < 29.5) {
            left.mtxLocal.rotateZ(10);
            left.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function (col) {
                if (col.node.name == "Ball") {
                    flipBall(col, left);
                }
            });
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && left.mtxLocal.rotation.z > 0.5) {
            left.mtxLocal.rotateZ(-10);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && right.mtxLocal.rotation.z > -29.5) {
            right.mtxLocal.rotateZ(-10);
            right.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function (col) {
                if (col.node.name == "Ball") {
                    flipBall(col, right);
                }
            });
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && right.mtxLocal.rotation.z < -0.5) {
            right.mtxLocal.rotateZ(10);
        }
        ƒ.Physics.world.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Pinball || (Pinball = {}));
//# sourceMappingURL=Script.js.map