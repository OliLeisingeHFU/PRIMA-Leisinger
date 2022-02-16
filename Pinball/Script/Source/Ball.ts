namespace Pinball {
  import ƒ = FudgeCore;
  let mesh : ƒ.ComponentMesh = new ƒ.ComponentMesh(new ƒ.MeshSphere);
  let material: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(new ƒ.Material("pinball", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.9, 0.9, 0.9, 1))));

  export class Ball extends ƒ.Node {
    public multihit: number;
    constructor(_pos?: ƒ.Vector3) {
      super("Ball");
      this.multihit = 1;

      this.addComponent(mesh);
      this.addComponent(material);
      this.addComponent(new ƒ.ComponentTransform());

      if(!_pos){
        this.mtxLocal.translateX(13.4);
        this.mtxLocal.translateY(2.5);
      }else {
        this.mtxLocal.translateX(_pos.x);
        this.mtxLocal.translateY(_pos.y);
        this.mtxLocal.translateZ(_pos.z);
      }
      addColliders([this], 10, ƒ.BODY_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.SPHERE);
    }
  }
}