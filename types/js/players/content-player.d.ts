export default class ContentPlayer {
    constructor(rmpVast: any);
    _rmpVast: any;
    _contentPlayer: any;
    _customPlaybackCurrentTime: number;
    _antiSeekLogicInterval: NodeJS.Timeout;
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
}
//# sourceMappingURL=content-player.d.ts.map