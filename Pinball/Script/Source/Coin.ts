namespace Pinball {
  import ƒ = FudgeCore;

  export class Coin extends ƒ.Node {
    private mesh = new ƒ.MeshTorus();
    private mat = new ƒ.Material("coin", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.75, 0.65, 0, 1)));

    constructor(_name: string) {
      super(_name);

      this.addComponent(new ƒ.ComponentMesh(this.mesh));
      this.addComponent(new ƒ.ComponentMaterial(this.mat));
      this.addComponent(new ƒ.ComponentTransform());
      addColliders([this], 1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, true);
      this.addComponent(new Script.CollisionHandler("Coin"));

      switch(this.name){
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
}