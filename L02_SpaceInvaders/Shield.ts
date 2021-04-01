namespace SpaceInvaders {
  import ƒ = FudgeCore;
  
  export class Shield extends ƒ.Node {
    constructor(_i: number, _n: number, _height: number[], _offset: number[]) {
      super("Shield" + _i);

      this.addComponent(new ƒ.ComponentTransform());
      this.getComponent(ƒ.ComponentTransform).mtxLocal.translateX((_i - 1.5) * 53 / 13);
      this.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(24 / 13);

      for (let iStripe: number = 0; iStripe < _n; iStripe++) {
        let barricadeStripe: ƒ.Node = new ƒ.Node("BarricadeStripe" + (iStripe + _i * _n));

        let posX: number = iStripe - (_n - 1) / 2;
        let scaleX: number = 21 / (_n * 13);

        barricadeStripe.addComponent(new ƒ.ComponentTransform());
        barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(posX * scaleX);
        barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(_offset[iStripe] / 13);

        barricadeStripe.addComponent(new ƒ.ComponentMesh(quadMesh));
        barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(scaleX);
        barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(_height[iStripe] / 13);

        barricadeStripe.addComponent(new ƒ.ComponentMaterial(material));

        this.addChild(barricadeStripe);
      }
    }
  }
}