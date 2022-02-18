namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  interface Values{
    bumperValue: number;
    coinValue: number;
    coinTime: number;
  }

  export class CollisionHandler extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CollisionHandler);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CollisionHandler added to ";
    public objectType: String;
    public static val: Values;

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
          this.HndRemover();
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
    private HndRemover(){
      switch(this.objectType){
        case "Bumper":
          this.node.getComponent(ƒ.ComponentRigidbody).removeEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.colHndEvent);
          break;
        default:
          this.node.getComponent(ƒ.ComponentRigidbody).removeEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, this.colHndEvent);
          break;
      }
      
    }

    

    public static async loadValues(): Promise<void>{
      let response: Response = await fetch("Script/pointBalancing.json");
      CollisionHandler.val = await response.json();
    }

    private colHndEvent(_event: ƒ.EventPhysics){
      let collider: ƒ.ComponentRigidbody = _event.cmpRigidbody;
      let colNode: ƒ.Node = collider.node;
      let vel: ƒ.Vector3 = collider.getVelocity();
      if(colNode.name == "Ball"){
        let mult: number = (<Pinball.Ball>colNode).multihit;
        this.node.getParent().getComponent(ƒ.ComponentAudio).play(true);
        switch(this.node.getComponent(Script.CollisionHandler).objectType){
          case "Bumper":
            collider.applyLinearImpulse(new ƒ.Vector3(vel.x, vel.y * Pinball.timesWeight(-2), vel.z * Pinball.timesWeight(-2)));
            Pinball.GameState.get().pointAdder(CollisionHandler.val.bumperValue, mult);
            (<Pinball.Ball>colNode).multihit++;
            break;
          case "Coin":
            let parent = this.node.getParent();
            Pinball.GameState.get().pointAdder(CollisionHandler.val.coinValue, mult);
            Pinball.deactivator(this.node, CollisionHandler.val.coinTime);
            (<Pinball.Ball>colNode).multihit++;
            if(!parent.getChildren()[0]){
              Pinball.GameState.get().pointAdder(CollisionHandler.val.coinValue * 10, mult);
              Pinball.GameState.get().notificator("COINS!" + CollisionHandler.val.coinValue * 10 + " Bonus points!");
            }
            break;
          case "Multiball":
            for(let i = 0; i < 2; i++){
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
            setTimeout(function(){
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

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}