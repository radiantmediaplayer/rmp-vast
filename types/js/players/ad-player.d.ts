export default class AdPlayer {
    constructor(rmpVast: any);
    set volume(level: any);
    get volume(): any;
    set muted(muted: any);
    get muted(): any;
    get duration(): number;
    get currentTime(): number;
    destroy(): void;
    init(): void;
    append(url: any, type: any): void;
    play(firstAdPlayerPlayRequest: any): void;
    pause(): void;
    resumeContent(): void;
    #private;
}
//# sourceMappingURL=ad-player.d.ts.map