declare namespace Pinball {
    import ƒ = FudgeCore;
    interface Values {
        weight: number;
        restitution: number;
        effectGravity: number;
    }
    export class Ball extends ƒ.Node {
        multihit: number;
        static val: Values;
        private mesh;
        private mat;
        constructor(_pos?: ƒ.Vector3);
        static loadValues(): Promise<void>;
    }
    export {};
}
declare namespace Pinball {
    import ƒ = FudgeCore;
    class Coin extends ƒ.Node {
        private mesh;
        private mat;
        constructor(_name: string);
    }
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
        private HndRemover;
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
        force: number;
        baseForce: number;
        notification: string;
        private constructor();
        static get(): GameState;
        notificator(_notification: string): void;
        pointAdder(_amount: number, _multihit: number): void;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Pinball {
    import ƒ = FudgeCore;
    function addColliders(_nodes: ƒ.Node[], _mass?: number, _type?: ƒ.BODY_TYPE, _colliderType?: ƒ.COLLIDER_TYPE, _trigger?: boolean): void;
    function timesWeight(_val: number): number;
    function inSeconds(_val: number): number;
    function deactivator(_node: ƒ.Node, time: number): void;
}
declare namespace Pinball {
    import ƒ = FudgeCore;
    class Power extends ƒ.Node {
        private mesh;
        private matMult;
        private matForce;
        constructor(_name: string);
    }
}
