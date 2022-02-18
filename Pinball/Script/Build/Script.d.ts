declare namespace Pinball {
    import ƒ = FudgeCore;
    interface Values {
        weight: number;
    }
    export class Ball extends ƒ.Node {
        multihit: number;
        static val: Values;
        constructor(_pos?: ƒ.Vector3);
        static loadValues(): Promise<void>;
    }
    export {};
}
declare namespace Script {
    import ƒ = FudgeCore;
    interface Values {
        bumperValue: number;
        coinValue: number;
        coinTime: number;
    }
    export class CollisionHandler extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        objectType: String;
        static val: Values;
        constructor(_type?: String);
        hndEvent: (_event: Event) => void;
        private HndAdder;
        static loadValues(): Promise<void>;
        private colHndEvent;
    }
    export {};
}
declare namespace Pinball {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        private static controller;
        private static instance;
        name: string;
        points: number;
        lives: number;
        private constructor();
        static get(): GameState;
        static newGame(): void;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Pinball {
    import ƒ = FudgeCore;
    function addColliders(_nodes: ƒ.Node[], _mass?: number, _type?: ƒ.BODY_TYPE, _colliderType?: ƒ.COLLIDER_TYPE, _trigger?: boolean): void;
    function timesWeight(_val: number): number;
    function inSeconds(_val: number): number;
}
