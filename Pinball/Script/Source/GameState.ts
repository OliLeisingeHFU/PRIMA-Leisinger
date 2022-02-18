namespace Pinball {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export class GameState extends ƒ.Mutable {
    private static controller: ƒui.Controller;
    private static instance: GameState;
    public name: string = "PinBall";
    public points: number;
    public lives: number;
    public force: number;
    public baseForce: number = 1;
    public notification: string = "-";

    private constructor() {
      super();
      this.points = 0;
      this.lives = 4;
      this.force = 15;
      let domHud: HTMLDivElement = document.querySelector("#Hud");
      GameState.instance = this;
      GameState.controller = new ƒui.Controller(this, domHud);
      console.log("Hud-Controller", GameState.controller);
    }

    public static get(): GameState {
      return GameState.instance || new GameState();
    }

    public notificator(_notification: string): void{
      GameState.get().notification = _notification;
      setTimeout(function(){
        GameState.get().notification = "-";
      }, 5000);
    }

    public pointAdder(_amount: number, _multihit: number):void{
      GameState.get().points += _amount * (1 + (_multihit / 10)) + 1;
    }

    protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
  }
}