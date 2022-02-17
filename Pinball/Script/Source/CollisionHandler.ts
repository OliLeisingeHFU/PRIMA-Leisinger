namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class CollisionHandler extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CollisionHandler);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CollisionHandler added to ";
    public objectType: String;

    constructor(_type?: String) {
      super();
      if(_type){
        this.objectType = _type;
      }
      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;
      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log(this.message, this.node, this.objectType);
          this.HndAdder();
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          this.HndAdder();
          break;
      }
    }

    private HndAdder(){
      switch(this.objectType){
        case "Bumper":
          this.node.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.colHndEvent);
          break;
        default:
          this.node.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, this.colHndEvent);
          break;
      }
    }

    private colHndEvent(_event: ƒ.EventPhysics){
      let collider: ƒ.ComponentRigidbody = _event.cmpRigidbody;
      let vel: ƒ.Vector3 = collider.getVelocity();
      if(collider.node.name == "Ball"){
        this.node.getParent().getComponent(ƒ.ComponentAudio).play(true);
        switch(this.node.getComponent(Script.CollisionHandler).objectType){
          case "Bumper":
            
            collider.applyLinearImpulse(new ƒ.Vector3(vel.x, vel.y * -200, vel.z * -200)); //ƒ.Vector3.SCALE(collider.getVelocity(), -200)
            Pinball.GameState.get().points += 5;
            break;
          case "Coin":
            Pinball.GameState.get().points += 10;
            this.activate(false);
            setTimeout(function(){this.activate(true);}, 10000);
            break;
          case "Multiball":
            this.node.activate(false);
            this.activate(false);
            setTimeout(function(){
              console.log(this.node);
              this.node.activate(true);
              this.activate(true);
            }, 10000);

            for(let i = 1; i < 3; i++){
              setTimeout(function(){
                let pos = collider.node.mtxLocal.translation;
                setTimeout(function(){
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


    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}