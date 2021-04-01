namespace SpaceInvaders {
  import ƒ = FudgeCore;
  
  export class PlayerShip extends ƒ.Node {
    constructor(_name: string) {
      super(_name);
      this.addComponent(new ƒ.ComponentTransform());
      this.addComponent(new ƒ.ComponentMesh(quadMesh));
      this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(7 / 13);
      this.addComponent(new ƒ.ComponentMaterial(material));
    }
  }
}