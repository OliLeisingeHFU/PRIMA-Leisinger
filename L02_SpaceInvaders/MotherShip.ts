namespace SpaceInvaders {
  import ƒ = FudgeCore;
  
  export class MotherShip extends Enemy {
    constructor(_name: string) {
      super(_name);
      this.addComponent(new ƒ.ComponentTransform());
      this.mtxLocal.translateX(75 / 13);
      this.mtxLocal.translateY(140 / 13);

      this.addComponent(new ƒ.ComponentMesh(quadMesh));
      this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(14 / 13);
      this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(7 / 13);

      this.addComponent(new ƒ.ComponentMaterial(material));
    }
  }
}