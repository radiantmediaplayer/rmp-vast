export default class ContentPlayer {
    constructor(rmpVast: any);
    set volume(level: any);
    get volume(): any;
    set muted(muted: any);
    get muted(): any;
    get currentTime(): number;
    destroy(): void;
    play(firstContentPlayerPlayRequest: any): void;
    pause(): void;
    seekTo(msSeek: any): void;
    preventSeekingForCustomPlayback(): void;
    #private;
}
//# sourceMappingURL=content-player.d.ts.map