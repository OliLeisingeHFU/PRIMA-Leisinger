"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    window.addEventListener("load", init);
    window.addEventListener("keydown", onKeyDown);
    let viewport = new ƒ.Viewport();
    let space = new ƒ.Node("Space");
    let ship;
    let speedShip = 5;
    let invaders = new ƒ.Node("Invaders");
    let projectiles = new ƒ.Node("Projectiles");
    let invaderDirection = 1;
    let invaderDown = false;
    function init(_event) {
        const canvas = document.querySelector("canvas");
        ship = SpaceInvaders.Ship.getInstance();
        space.addChild(ship);
        space.addChild(SpaceInvaders.MotherShip.getInstance());
        let columnCount = 11;
        let rowCount = 5;
        for (let row = 0; row < rowCount; ++row) {
            for (let column = 0; column < columnCount; ++column) {
                let pos = new ƒ.Vector2();
                pos.x = (column - (columnCount - 1) / 2) * 15 / 13;
                pos.y = (row * 15 + 65) / 13;
                invaders.addChild(new SpaceInvaders.Invader(pos));
            }
        }
        space.addChild(invaders);
        let barricades = new ƒ.Node("Barricades");
        let nBarricade = 4;
        for (let iBarricade = 0; iBarricade < nBarricade; ++iBarricade) {
            let pos = new ƒ.Vector2();
            pos.x = (iBarricade - (nBarricade - 1) / 2) * 53 / 13;
            pos.y = 24 / 13;
            barricades.addChild(new SpaceInvaders.Barricade(pos));
        }
        space.addChild(barricades);
        space.addChild(projectiles);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(18);
        cmpCamera.mtxPivot.translateY(77 / 13);
        cmpCamera.mtxPivot.rotateY(180);
        console.log(cmpCamera);
        viewport.initialize("Viewport", space, cmpCamera, canvas);
        viewport.draw();
        console.log(space);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function onKeyDown(_event) {
        if (_event.code == ƒ.KEYBOARD_CODE.SPACE)
            projectiles.addChild(SpaceInvaders.ShipProjectile.getInstance(getShipPos()));
    }
    function update(_event) {
        // console.log(_event);
        let offset = speedShip * ƒ.Loop.timeFrameReal / 1000;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
            ship.mtxLocal.translateX(-offset);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            ship.mtxLocal.translateX(+offset);
        SpaceInvaders.ShipProjectile.move();
        InvaderMove();
        checkProjectileCollision();
        viewport.draw();
    }
    function checkProjectileCollision() {
        for (let projectile of projectiles.getChildren()) {
            for (let invader of invaders.getChildren()) {
                if (projectile.checkCollision(invader)) {
                    projectiles.removeChild(projectile);
                    if (projectile instanceof SpaceInvaders.ShipProjectile) {
                        SpaceInvaders.ShipProjectile.despawnProjectile();
                    }
                    invaders.removeChild(invader);
                }
            }
        }
    }
    function getShipPos() {
        let x = ship.cmpTransform.mtxLocal.translation.x;
        let y = ship.cmpTransform.mtxLocal.translation.y;
        let pos = new ƒ.Vector2(x, y);
        return pos;
    }
    function InvaderMove() {
        let offset = SpaceInvaders.Invader.speed * ƒ.Loop.timeFrameReal / 1000;
        if (invaderDown) {
            for (let invader of invaders.getChildren()) {
                invader.movedown(offset);
            }
        }
        else {
            for (let invader of invaders.getChildren()) {
                invader.move(offset * invaderDirection);
            }
        }
        handleInvaderDirections();
    }
    function handleInvaderDirections() {
        let leftBorder = -8;
        let rightBorder = 8;
        for (let invader of invaders.getChildren()) {
            if (!invaderDown && (invader.mtxLocal.translation.x >= rightBorder || invader.mtxLocal.translation.x <= leftBorder)) {
                invaderDown = true;
                invaderDirection *= -1;
                return;
            }
            else if (invaderDown && invader.mtxLocal.translation.y <= (invader.lastheightPos - 0.25)) {
                invaderDown = false;
                invader.lastheightPos = invader.mtxLocal.translation.y;
                return;
            }
        }
    }
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=SpaceInvaders.js.map