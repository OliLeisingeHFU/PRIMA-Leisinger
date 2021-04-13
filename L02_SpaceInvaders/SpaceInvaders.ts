namespace SpaceInvaders {
  import ƒ = FudgeCore;
  window.addEventListener("load", init);
  window.addEventListener("keydown", onKeyDown)
  let viewport: ƒ.Viewport = new ƒ.Viewport();
  let space: ƒ.Node = new ƒ.Node("Space");
  let ship: Ship;
  let speedShip: number = 5;
  let invaders: ƒ.Node = new ƒ.Node("Invaders");
  let projectiles: ƒ.Node = new ƒ.Node("Projectiles");
  let invaderDirection: number = 1;
  let invaderDown: boolean = false;

  function init(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");

    ship = Ship.getInstance();
    space.addChild(ship);
    space.addChild(MotherShip.getInstance());

    
    let columnCount: number = 11;
    let rowCount: number = 5;

    for (let row: number = 0; row < rowCount; ++row) {
      for (let column: number = 0; column < columnCount; ++column) {
        let pos: ƒ.Vector2 = new ƒ.Vector2();
        pos.x = (column - (columnCount - 1) / 2) * 15 / 13;
        pos.y = (row * 15 + 65) / 13;

        invaders.addChild(new Invader(pos));
      }
    }
    space.addChild(invaders);

    let barricades: ƒ.Node = new ƒ.Node("Barricades");
    let nBarricade: number = 4;

    for (let iBarricade: number = 0; iBarricade < nBarricade; ++iBarricade) {
      let pos: ƒ.Vector2 = new ƒ.Vector2();
      pos.x = (iBarricade - (nBarricade - 1) / 2) * 53 / 13;
      pos.y = 24 / 13;

      barricades.addChild(new Barricade(pos));
    }

    space.addChild(barricades);
    space.addChild(projectiles);

    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    cmpCamera.mtxPivot.translateZ(18);
    cmpCamera.mtxPivot.translateY(77 / 13);
    cmpCamera.mtxPivot.rotateY(180);
    console.log(cmpCamera);

    viewport.initialize("Viewport", space, cmpCamera, canvas);
    viewport.draw();

    console.log(space);

    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
  }

  function onKeyDown(_event: KeyboardEvent): void {
    if (_event.code == ƒ.KEYBOARD_CODE.SPACE)
    projectiles.addChild(ShipProjectile.getInstance(getShipPos()));
  }

  function update(_event: Event): void {
    // console.log(_event);
    let offset: number = speedShip * ƒ.Loop.timeFrameReal / 1000;

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
      ship.mtxLocal.translateX(-offset);

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
      ship.mtxLocal.translateX(+offset);

    ShipProjectile.move();
    InvaderMove();
    checkProjectileCollision();
    viewport.draw();
  }

  function checkProjectileCollision(): void {
    for (let projectile of projectiles.getChildren() as Projectile[]) {
      for (let invader of invaders.getChildren() as Invader[]) {
        if (projectile.checkCollision(invader)) {
          projectiles.removeChild(projectile);
          if(projectile instanceof ShipProjectile)
          {
            ShipProjectile.despawnProjectile();
          }
          invaders.removeChild(invader);
        }
      }
    }
  }

  function getShipPos(): ƒ.Vector2
  {
    let x: number = ship.cmpTransform.mtxLocal.translation.x;
    let y: number = ship.cmpTransform.mtxLocal.translation.y;
    let pos: ƒ.Vector2 = new ƒ.Vector2(x, y);
    return pos;
  }

  function InvaderMove(): void
  {
    let offset: number = Invader.speed * ƒ.Loop.timeFrameReal / 1000;
    if(invaderDown)
    {
      for(let invader of invaders.getChildren() as Invader[])
      {
        invader.movedown(offset);
      }
    }else
    {
      for(let invader of invaders.getChildren() as Invader[])
      {
        invader.move(offset * invaderDirection);
      }
    }
    handleInvaderDirections();
  }

  function handleInvaderDirections()
  {
    let leftBorder: number = -8;
    let rightBorder: number = 8;

    for(let invader of invaders.getChildren() as Invader[])
      {
        if(!invaderDown && (invader.mtxLocal.translation.x >= rightBorder || invader.mtxLocal.translation.x <= leftBorder))
        {
          invaderDown = true;
          invaderDirection *= -1;
          return;
        } else if(invaderDown && invader.mtxLocal.translation.y <= (invader.lastheightPos - 0.25))
        {
          invaderDown = false;
          invader.lastheightPos = invader.mtxLocal.translation.y;
          return;
        }
      }
  }
}