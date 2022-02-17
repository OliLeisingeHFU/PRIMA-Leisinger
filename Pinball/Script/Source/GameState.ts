namespace Pinball {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export class GameState extends ƒ.Mutable {
    private static controller: ƒui.Controller;
    private static instance: GameState;
    public name: string = "PinBall";
    public points: number;
    public lives: number;

    private constructor() {
      super();
      this.points = 0;
      this.lives = 4;
      let domHud: HTMLDivElement = document.querySelector("#Hud");
      GameState.instance = this;
      GameState.controller = new ƒui.Controller(this, domHud);
      console.log("Hud-Controller", GameState.controller);
    }

    public static get(): GameState {
      return GameState.instance || new GameState();
    }

    public static newGame(): void{
      GameState.instance = null;
    }

    protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
  }
}