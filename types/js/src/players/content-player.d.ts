export default CONTENT_PLAYER;
declare namespace CONTENT_PLAYER {
    function play(firstContentPlayerPlayRequest: any): void;
    function pause(): void;
    function setVolume(level: any): void;
    function getVolume(): any;
    function getMute(): any;
    function setMute(muted: any): void;
    function getDuration(): number;
    function getCurrentTime(): number;
    function seekTo(msSeek: any): void;
    function preventSeekingForCustomPlayback(): void;
}
