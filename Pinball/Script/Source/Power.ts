namespace Pinball {
  import ƒ = FudgeCore;

  export class Power extends ƒ.Node {
    private mesh = new ƒ.MeshSphere();
    private matMult = new ƒ.Material("multiball", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.7, 0, 0.7, 1)));
    private matForce = new ƒ.Material("force", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.75, 0.5, 0, 1)));

    constructor(_name: string) {
      super(_name);

      this.addComponent(new ƒ.ComponentMesh(this.mesh));
      
      this.addComponent(new ƒ.ComponentTransform());
      this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.75,0.75,0.75));
      addColliders([this], 1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);

      switch(this.name){
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
}