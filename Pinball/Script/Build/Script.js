"use strict";
var Pinball;
(function (Pinball) {
    var ƒ = FudgeCore;
    class Ball extends ƒ.Node {
        multihit;
        static val;
        mesh = new ƒ.MeshSphere();
        mat = new ƒ.Material("pinball", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.9, 0.9, 0.9, 1)));
        constructor(_pos) {
            super("Ball");
            this.multihit = 0;
            this.addComponent(new ƒ.ComponentMesh(this.mesh));
            this.addComponent(new ƒ.ComponentMaterial(this.mat));
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
            Pinball.addColliders([this], Ball.val.weight, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.SPHERE);
        }
        static async loadValues() {
            let response = await fetch("Script/physics.json");
            Ball.val = await response.json();
        }
    }
    Pinball.Ball = Ball;
})(Pinball || (Pinball = {}));
var Pinball;
(function (Pinball) {
    var ƒ = FudgeCore;
    class Coin extends ƒ.Node {
        mesh = new ƒ.MeshTorus();
        mat = new ƒ.Material("coin", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.75, 0.65, 0, 1)));
        constructor(_name) {
            super(_name);
            this.addComponent(new ƒ.ComponentMesh(this.mesh));
            this.addComponent(new ƒ.ComponentMaterial(this.mat));
            this.addComponent(new ƒ.ComponentTransform());
            Pinball.addColliders([this], 1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);
            this.addComponent(new Script.CollisionHandler("Coin"));
            switch (this.name) {
                case "Coin0":
                    this.mtxLocal.translateX(-4);
                    this.mtxLocal.translateY(4);
                    break;
                case "Coin1":
                    this.mtxLocal.translateX(-2);
                    this.mtxLocal.translateY(5);
                    break;
                case "Coin2":
                    this.mtxLocal.translateY(5.5);
                    break;
                case "Coin3":
                    this.mtxLocal.translateX(2);
                    this.mtxLocal.translateY(5);
                    break;
                default:
                    this.mtxLocal.translateX(4);
                    this.mtxLocal.translateY(4);
                    break;
            }
        }
    }
    Pinball.Coin = Coin;
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
        static val;
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
                    this.HndRemover();
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
        HndRemover() {
            switch (this.objectType) {
                case "Bumper":
                    this.node.getComponent(ƒ.ComponentRigidbody).removeEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.colHndEvent);
                    break;
                default:
                    this.node.getComponent(ƒ.ComponentRigidbody).removeEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.colHndEvent);
                    break;
            }
        }
        static async loadValues() {
            let response = await fetch("Script/pointBalancing.json");
            CollisionHandler.val = await response.json();
        }
        colHndEvent(_event) {
            let collider = _event.cmpRigidbody;
            let colNode = collider.node;
            let vel = collider.getVelocity();
            if (colNode.name == "Ball") {
                let mult = colNode.multihit;
                this.node.getParent().getComponent(ƒ.ComponentAudio).play(true);
                switch (this.node.getComponent(Script.CollisionHandler).objectType) {
                    case "Bumper":
                        collider.applyLinearImpulse(new ƒ.Vector3(vel.x, vel.y * Pinball.timesWeight(-2), vel.z * Pinball.timesWeight(-2)));
                        Pinball.GameState.get().pointAdder(CollisionHandler.val.bumperValue, mult);
                        colNode.multihit++;
                        break;
                    case "Coin":
                        let parent = this.node.getParent();
                        Pinball.GameState.get().pointAdder(CollisionHandler.val.coinValue, mult);
                        Pinball.deactivator(this.node, CollisionHandler.val.coinTime);
                        colNode.multihit++;
                        if (!parent.getChildren()[0]) {
                            Pinball.GameState.get().pointAdder(CollisionHandler.val.coinValue * 10, mult);
                            Pinball.GameState.get().notificator("COINS!" + CollisionHandler.val.coinValue * 10 + " Bonus points!");
                        }
                        break;
                    case "Multiball":
                        for (let i = 0; i < 2; i++) {
                            let pos = new ƒ.Vector3((i - 1) * 5, 40, 0);
                            let ball = new Pinball.Ball(pos);
                            colNode.getParent().addChild(ball);
                            ball.getComponent(ƒ.ComponentRigidbody).addVelocity(new ƒ.Vector3(vel.x, (vel.y * (Math.random() * 20 - 10)), (vel.z * (Math.random() * 20 - 10))));
                        }
                        Pinball.deactivator(this.node, 30);
                        Pinball.GameState.get().notificator("Extra Balls!");
                        break;
                    case "ForceUp":
                        Pinball.GameState.get().baseForce = 1.25;
                        Pinball.GameState.get().notificator("Force up!");
                        setTimeout(function () {
                            Pinball.GameState.get().baseForce = 1;
                            Pinball.GameState.get().notificator("Force normal");
                        }, 10000);
                        Pinball.deactivator(this.node, 30);
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
        force;
        baseForce = 1;
        notification = "-";
        constructor() {
            super();
            this.points = 0;
            this.lives = 4;
            this.force = 15;
            let domHud = document.querySelector("#Hud");
            GameState.instance = this;
            GameState.controller = new ƒui.Controller(this, domHud);
            console.log("Hud-Controller", GameState.controller);
        }
        static get() {
            return GameState.instance || new GameState();
        }
        notificator(_notification) {
            GameState.get().notification = _notification;
            setTimeout(function () {
                GameState.get().notification = "-";
            }, 5000);
        }
        pointAdder(_amount, _multihit) {
            GameState.get().points += _amount * (1 + (_multihit / 10)) + 1;
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
        await Pinball.Ball.loadValues();
        await Script.CollisionHandler.loadValues();
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
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        // initialize physics
        let bumpers = arena.getChildrenByName("Bumpers")[0].getChildren();
        addColliders(bumpers, undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
        addScriptComp(bumpers, "Bumper");
        addColliders(arena.getChildrenByName("Flippers")[0].getChildren(), 1000, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE);
        addColliders(arena.getChildrenByName("Spring"), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
        let pickups = arena.getChildrenByName("Pickups")[0];
        pickups.addChild(new Pinball.Power("MultiballAbility"));
        pickups.addChild(new Pinball.Power("ForceUpAbility"));
        let coins = pickups.getChildrenByName("Coins")[0];
        for (let i = 0; i < 5; i++) {
            coins.addChild(new Pinball.Coin("Coin" + i));
        }
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
    // helper functions
    function addColliders(_nodes, _mass, _type, _colliderType, _trigger) {
        _nodes.forEach(function (object) {
            if (object.cmpTransform) {
                let cmpRigidBody;
                if (_colliderType == ƒ.COLLIDER_TYPE.CONVEX) { //technically not needed as no MeshExtrusions are used.
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
    function timesWeight(_val) {
        return _val * Pinball.Ball.val.weight * Pinball.GameState.get().baseForce;
    }
    Pinball.timesWeight = timesWeight;
    function inSeconds(_val) {
        return _val * 1000;
    }
    Pinball.inSeconds = inSeconds;
    function flipBall(_col, _flipper) {
        let colV = 5;
        let leftY = _flipper.mtxWorld.getY();
        let x = leftY.x;
        let y = leftY.y;
        let z = leftY.z;
        _col.applyLinearImpulse(ƒ.Vector3.SCALE(new ƒ.Vector3(x, y, z), timesWeight(colV * 5))); //ƒ.Vector3.SCALE(left.mtxWorld.getY(), 75)
    }
    function deactivator(_node, time) {
        let node = _node;
        let parent = node.getParent();
        setTimeout(function () {
            node.removeComponent(node.getComponent(Script.CollisionHandler));
            node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
            parent.removeChild(node);
            setTimeout(function () {
                switch (parent.name) {
                    case "Coins":
                        parent.addChild(new Pinball.Coin(node.name));
                        break;
                    default:
                        parent.addChild(new Pinball.Power(node.name));
                }
            }, Pinball.inSeconds(time));
        }, 250);
    }
    Pinball.deactivator = deactivator;
    function update(_event) {
        let inactiveBall = false;
        if (!arena.getChildrenByName("Balls")[0].getChildren()[0] && Pinball.GameState.get().lives > 0) { //check if at least one ball exists
            // spawn new ball if none exist
            arena.getChildrenByName("Balls")[0].addChild(new Pinball.Ball());
            Pinball.GameState.get().lives -= 1;
            if (arena.getChildrenByName("LaunchCloser")[0].getChild(0).getComponent(ƒ.ComponentRigidbody)) {
                arena.getChildrenByName("LaunchCloser")[0].getChildren().forEach(function (_node) {
                    _node.removeComponent(_node.getComponent(ƒ.ComponentRigidbody));
                });
            }
        }
        else if (Pinball.GameState.get().lives == 0) {
            alert("You gained " + Pinball.GameState.get().points + " points! Good Job :) Try again?");
            Pinball.GameState.get().points = 0;
            Pinball.GameState.get().lives = 3;
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
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && Pinball.GameState.get().force < 50 && inactiveBall) { // launch control
            Pinball.GameState.get().force += 1;
        }
        else if (Pinball.GameState.get().force > 15 && inactiveBall && !ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            let ball = arena.getChildrenByName("Balls")[0].getChild(0);
            ball.getComponent(ƒ.ComponentRigidbody).applyLinearImpulse(ƒ.Vector3.SCALE(ball.mtxWorld.getY(), timesWeight(Pinball.GameState.get().force)));
            setTimeout(function () {
                addColliders(arena.getChildrenByName("LaunchCloser")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
            }, 2250);
            Pinball.GameState.get().force = 15;
        }
        // Flipper controls
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A]) && left.mtxLocal.rotation.z < 29.5) {
            left.mtxLocal.rotateZ(10);
            left.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function (col) {
                if (col.node.name == "Ball") {
                    flipBall(col, left);
                }
            });
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.D]) && left.mtxLocal.rotation.z > 0.5) {
            left.mtxLocal.rotateZ(-10);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]) && left.mtxLocal.rotation.z > -29.5) {
            left.mtxLocal.rotateZ(-10);
            left.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function (col) {
                if (col.node.name == "Ball") {
                    (col.node).multihit = 0;
                    flipBall(col, left);
                }
            });
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.D]) && left.mtxLocal.rotation.z < -0.5) {
            left.mtxLocal.rotateZ(10);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT]) && right.mtxLocal.rotation.z > -29.5) {
            right.mtxLocal.rotateZ(-10);
            right.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function (col) {
                if (col.node.name == "Ball") {
                    (col.node).multihit = 0;
                    flipBall(col, right);
                }
            });
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.ARROW_LEFT]) && right.mtxLocal.rotation.z < -0.5) {
            right.mtxLocal.rotateZ(10);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT]) && right.mtxLocal.rotation.z < 29.5) {
            right.mtxLocal.rotateZ(10);
            right.getComponent(ƒ.ComponentRigidbody).collisions.forEach(function (col) {
                if (col.node.name == "Ball") {
                    flipBall(col, right);
                }
            });
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.ARROW_LEFT]) && right.mtxLocal.rotation.z > 0.5) {
            right.mtxLocal.rotateZ(-10);
        }
        ƒ.Physics.world.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Pinball || (Pinball = {}));
var Pinball;
(function (Pinball) {
    var ƒ = FudgeCore;
    class Power extends ƒ.Node {
        mesh = new ƒ.MeshSphere();
        matMult = new ƒ.Material("multiball", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.7, 0, 0.7, 1)));
        matForce = new ƒ.Material("force", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.75, 0.5, 0, 1)));
        constructor(_name) {
            super(_name);
            this.addComponent(new ƒ.ComponentMesh(this.mesh));
            this.addComponent(new ƒ.ComponentTransform());
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.75, 0.75, 0.75));
            Pinball.addColliders([this], 1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);
            switch (this.name) {
                case "MultiballAbility":
                    this.mtxLocal.translateX(-4);
                    this.mtxLocal.translateY(30);
                    this.addComponent(new ƒ.ComponentMaterial(this.matMult));
                    this.addComponent(new Script.CollisionHandler("Multiball"));
                    break;
                default:
                    this.mtxLocal.translateX(4);
                    this.mtxLocal.translateY(30);
                    this.addComponent(new ƒ.ComponentMaterial(this.matForce));
                    this.addComponent(new Script.CollisionHandler("ForceUp"));
                    break;
            }
        }
    }
    Pinball.Power = Power;
})(Pinball || (Pinball = {}));
//# sourceMappingURL=Script.js.map