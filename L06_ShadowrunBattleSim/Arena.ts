namespace Shadowrun {
  import ƒ = FudgeCore;

  export class Arena extends ƒ.Node {
    static instance: Arena;
    static ground: ƒ.Node = new ƒ.Node("Ground");
    static lightSource: ƒ.ComponentLight;
    static material: ƒ.Material = new ƒ.Material("White", ƒ.ShaderFlat, new ƒ.CoatColored());

    private constructor() {
      super("Arena");
      
      for(let x: number = 0; x < 20; ++x){
        for(let z: number = 0; z < 20; ++z){
          let tile: ƒ.Node = new ƒ.Node(("TileX" + x + "Y" + z));
          let cube: ƒ.MeshCube = new ƒ.MeshCube("cube");
          let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(cube);
          cmpMesh.mtxPivot.scaleX(1.5);
          cmpMesh.mtxPivot.scaleZ(1.5);
          tile.addComponent(new ƒ.ComponentMaterial(Arena.material));
          tile.addComponent(new ƒ.ComponentTransform());
          tile.mtxLocal.translateX(x * 1.55);
          tile.mtxLocal.translateZ(z * 1.55);
          tile.addComponent(cmpMesh);
          Arena.ground.addChild(tile);
        }
      }

      this.addChild(Arena.ground);
      
      let cmpLight: ƒ.ComponentLight = new ƒ.ComponentLight(new ƒ.LightPoint(new ƒ.Color((221 / 255), (209 / 255), (235 / 255))));
      this.addComponent(cmpLight);
      cmpLight.mtxPivot.translateY(10);
      cmpLight.mtxPivot.translateX(15);
      cmpLight.mtxPivot.translateZ(15);
    }

    static getInstance(): Arena {
      if (this.instance == null) this.instance = new Arena();
      return this.instance;
    }
  }
}