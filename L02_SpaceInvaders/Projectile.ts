namespace SpaceInvaders {
  import ƒ = FudgeCore;
  
  export class Projectile extends ƒ.Node {
    constructor(_name: string, _x: number, _y: number) {
      super(_name);
      this.addComponent(new ƒ.ComponentTransform());
      this.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(_x / 13);
      this.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(_y);

      this.addComponent(new ƒ.ComponentMesh(quadMesh));
      this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(1 / 13);
      this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(5 / 13);

      this.addComponent(new ƒ.ComponentMaterial(material));
    }
  }
}