namespace Shadowrun {
  import ƒ = FudgeCore;

  export class Arena extends ƒ.Node {
    static instance: Arena;
    static ground: ƒ.Node = new ƒ.Node("Ground");
    static material: ƒ.Material = new ƒ.Material("White", ƒ.ShaderFlat, new ƒ.CoatColored());

    private constructor() {
      super("Arena");
      this.addComponent(new ƒ.ComponentTransform());
      for(let x: number = 0; x < 20; ++x){
        for(let z: number = 0; z < 20; ++z){
          let tile: ƒ.Node = new ƒ.Node(("TileX" + x + "Y" + z));
          let cube: ƒ.MeshCube = new ƒ.MeshCube("cube");
          let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(cube);
          cmpMesh.mtxPivot.scaleX(1.5);
          cmpMesh.mtxPivot.scaleZ(1.5);
          tile.addComponent(new ƒ.ComponentMaterial(Arena.material));
          tile.addComponent(new ƒ.ComponentTransform());
          tile.mtxLocal.translateX(x * 1.55 - 15);
          tile.mtxLocal.translateZ(z * 1.55 - 15);
          tile.addComponent(cmpMesh);
          Arena.ground.addChild(tile);

          let rngCover: number = Math.random() * 50;
          if (rngCover > 49) {
            let cover: ƒ.Node = new ƒ.Node(("CoverX" + x + "Y" + z));
            let cmpMeshCover: ƒ.ComponentMesh = new ƒ.ComponentMesh(cube);
            cmpMeshCover.mtxPivot.scaleX(Math.random() * 4 + 0.1);
            cmpMeshCover.mtxPivot.scaleZ(Math.random() * 4 + 0.1);
            cover.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("Gray", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.5, 0.5, 0.5)))));
            cover.addComponent(new ƒ.ComponentTransform());
            cover.mtxLocal.translateX(x * 1.55 - 15);
            cover.mtxLocal.translateZ(z * 1.55 - 15);
            cover.mtxLocal.translateY(1);
            cover.addComponent(cmpMeshCover);
            Arena.ground.addChild(cover);
          }
        }
      }

      this.addChild(Arena.ground);
      let r: number = (221 / 255);
      let g: number = (209 / 255);
      let b: number = (235 / 255);
      let cmpLightAmbient: ƒ.ComponentLight = new ƒ.ComponentLight(new ƒ.LightAmbient(new ƒ.Color(r, g, b, 0.1)));
      this.addComponent(cmpLightAmbient);
      let cmpLightPoint: ƒ.ComponentLight = new ƒ.ComponentLight(new ƒ.LightPoint(new ƒ.Color(r, g, b, 1)));
      this.addComponent(cmpLightPoint);
      cmpLightPoint.mtxPivot.translateY(2);
      cmpLightPoint.mtxPivot.translateX(10);
      cmpLightPoint.mtxPivot.translateZ(10);
    }

    static getInstance(): Arena {
      if (this.instance == null) this.instance = new Arena();
      return this.instance;
    }
  }
}