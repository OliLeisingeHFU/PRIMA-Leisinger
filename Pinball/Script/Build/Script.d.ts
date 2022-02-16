declare namespace Pinball {
    import ƒ = FudgeCore;
    class Ball extends ƒ.Node {
        multihit: number;
        constructor(_pos?: ƒ.Vector3);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CollisionHandler extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        objectType: String;
        constructor(_type?: String);
        hndEvent: (_event: Event) => void;
        private HndAdder;
        private colHndEvent;
    }
}
declare namespace Pinball {
    import ƒ = FudgeCore;
    function addColliders(_nodes: ƒ.Node[], _mass?: number, _type?: ƒ.BODY_TYPE, _colliderType?: ƒ.COLLIDER_TYPE, _trigger?: boolean): void;
}