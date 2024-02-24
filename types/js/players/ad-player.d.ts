export default class AdPlayer {
    constructor(rmpVast: any);
    _rmpVast: any;
    _params: any;
    _contentPlayer: any;
    _adContainer: any;
    _contentWrapper: any;
    _adPlayer: any;
    destroy(): void;
    init(): void;
    append(url: any, type: any): void;
    set volume(level: any);
    get volume(): any;
    set muted(muted: any);
    get muted(): any;
    get duration(): number;
    get currentTime(): number;
    play(firstAdPlayerPlayRequest: any): void;
    pause(): void;
    resumeContent(): void;
}
//# sourceMappingURL=ad-player.d.ts.map