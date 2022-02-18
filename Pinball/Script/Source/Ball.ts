namespace Pinball {
  import ƒ = FudgeCore;

  interface Values {
    weight: number;
    restitution: number;
    effectGravity: number;
  }

  export class Ball extends ƒ.Node {
    public multihit: number;
    public static val: Values;
    private mesh = new ƒ.MeshSphere();
    private mat = new ƒ.Material("pinball", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.9, 0.9, 0.9, 1)));

    constructor(_pos?: ƒ.Vector3) {
      super("Ball");
      this.multihit = 0;

      this.addComponent(new ƒ.ComponentMesh(this.mesh));
      this.addComponent(new ƒ.ComponentMaterial(this.mat));
      this.addComponent(new ƒ.ComponentTransform());

      if(!_pos){
        this.mtxLocal.translateX(13.4);
        this.mtxLocal.translateY(2.5);
      }else {
        this.mtxLocal.translateX(_pos.x);
        this.mtxLocal.translateY(_pos.y);
        this.mtxLocal.translateZ(_pos.z);
      }
      addColliders([this], Ball.val.weight, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.SPHERE);
      this.getComponent(ƒ.ComponentRigidbody).restitution = Ball.val.restitution;
      this.getComponent(ƒ.ComponentRigidbody).effectGravity = Ball.val.effectGravity;
    }

    public static async loadValues(): Promise<void>{
      let response: Response = await fetch("Script/physics.json");
      Ball.val = await response.json();
    }
  }
}