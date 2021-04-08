namespace SpaceInvaders {
    import ƒ = FudgeCore;
    
    export class ShipProjectile extends Projectile {
      static instance: Ship;

      private constructor(_pos: ƒ.Vector2) {
        super("PlayerProjectile", _pos);
      }

      static getInstance(_x: number, _y: number): ShipProjectile {
        let pos: ƒ.Vector2 = new ƒ.Vector2(_x, _y);
        if (this.instance == null) this.instance = new ShipProjectile(pos);
        return this.instance;
      }

      static shoot()
      {
        let offset: number = Projectile.speedProjectile * ƒ.Loop.timeFrameReal / 1000;
        if (this.instance != null)
        {
          this.instance.mtxLocal.translateY(+offset);
          console.log(this.instance)
          if (this.instance.cmpTransform.mtxLocal.translation.y >= 15)
          {
            this.instance = null;
          }
        }
        
      }
    }
  }