namespace SpaceInvaders {
    import ƒ = FudgeCore;
    
    export class Projectile extends QuadNode {
      static speedProjectile: number = 10;
      constructor(_name: string, _pos: ƒ.Vector2) {
        let scale: ƒ.Vector2 = new ƒ.Vector2(1 / 13, 5 / 13);  
        super(_name, _pos, scale);
      }
    }
  }