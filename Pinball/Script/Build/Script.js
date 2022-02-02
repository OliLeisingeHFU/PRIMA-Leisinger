"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
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
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Pinball;
(function (Pinball) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let graph;
    let arena;
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
        // initialize viewport
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        // initialize physics
        addColliders(arena.getChildrenByName("Bumpers")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CONVEX);
        addColliders(arena.getChildrenByName("Flippers")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
        let pickups = arena.getChildrenByName("Pickups")[0];
        addColliders(pickups.getChildrenByName("Coins")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);
        addColliders(pickups.getChildrenByName("MultiBallAbility")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);
        let barriers = arena.getChildrenByName("Barriers")[0];
        addColliders(barriers.getChildrenByName("Case")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
        addColliders(barriers.getChildrenByName("Pyramids")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.PYRAMID);
        addColliders(barriers.getChildrenByName("Corners")[0].getChildren(), undefined, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CONVEX);
        // Initialize Controlls
        // start game
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
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
                cmpRigidBody.initialization = ƒ.BODY_INIT.TO_MESH;
                if (_trigger) {
                    cmpRigidBody.isTrigger = true;
                }
                cmpRigidBody.isInitialized = false;
                object.addComponent(cmpRigidBody);
            }
        });
    }
    function update(_event) {
        ƒ.Physics.world.simulate(); // if physics is included and used
        console.log(arena.getChildrenByName("Balls"));
        arena.getChildrenByName("Balls")[0].getChildren().forEach(function (ball) {
            if (ball.mtxWorld.translation.y >= 0) { //check if ball is below 0, the Death Zone
                // Kill ball
            }
        });
        if (!arena.getChildrenByName("Balls")[0].getChildren()) { //check if at least one ball exists
            // spawn new ball if none exist
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Pinball || (Pinball = {}));
//# sourceMappingURL=Script.js.map