namespace SpaceInvaders {
    import ƒ = FudgeCore;
    
    export class ShipProjectile extends Projectile {
      static instance: ShipProjectile;

      private constructor(_pos: ƒ.Vector2) {
        super("PlayerProjectile", _pos);
      }

      static getInstance(_pos: ƒ.Vector2): ShipProjectile {
        if (this.instance == null) this.instance = new ShipProjectile(_pos);
        return this.instance;
      }

      static move(): void
      {
        if (ShipProjectile.projectileExists())
        {
          console.log(this.instance);
          let offset: number = Projectile.speedProjectile * ƒ.Loop.timeFrameReal / 1000;
          this.instance.mtxLocal.translateY(+offset);
          this.instance.setRectPosition();
          if (this.instance.cmpTransform.mtxLocal.translation.y >= 14)
          {
            this.despawnProjectile();
          }
        }
      }

      static projectileExists(): boolean
      {
        if(this.instance == null)
        {
          return false;
        }
        return true;
      }

      static despawnProjectile(): void
      {
          this.instance = null;
      }
    }
  }