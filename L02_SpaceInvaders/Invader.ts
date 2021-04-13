namespace SpaceInvaders {
  import ƒ = FudgeCore;

  export class Invader extends QuadNode {
    private static count: number = 0;
    public static speed: number = 1;
    public lastheightPos: number;

    constructor(_pos: ƒ.Vector2) {
      let scale: ƒ.Vector2 = new ƒ.Vector2(12 / 13, 8 / 13);
      super("Invader" + (++Invader.count), _pos, scale);

      this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0.5, 1, 0.1, 1);

      this.lastheightPos = this.mtxLocal.translation.y;
    }

    move(_offset: number): void
    {
      this.mtxLocal.translateX(+_offset);
      this.setRectPosition();
    }

    movedown(_offset: number): void
    {
      this.mtxLocal.translateY(-_offset);
      this.setRectPosition();
    }
  }
}