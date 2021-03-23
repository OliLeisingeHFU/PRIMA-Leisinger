namespace L01_FirstFudge {
  import ƒ = FudgeCore;
  window.addEventListener("load", init);
  
  function init(_event: Event): void{
	let node: ƒ.Node = new ƒ.Node("Test");
	const canvas: HTMLCanvasElement = document.querySelector("canvas");

	let mesh: ƒ.MeshQuad = new ƒ.MeshQuad("Quad");
  node.addComponent(new ƒ.ComponentMesh(mesh));

  let material: ƒ.Material = new ƒ.Material("Bacon", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.5, 0, 0.75, 1)));
  let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
  node.addComponent(cmpMaterial);
  }
}