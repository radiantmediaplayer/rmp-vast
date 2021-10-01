export default VAST_PLAYER;
declare namespace VAST_PLAYER {
    function destroy(): void;
    function init(): void;
    function append(url: any, type: any): void;
    function setVolume(level: any): void;
    function getVolume(): any;
    function setMute(muted: any): void;
    function getMute(): any;
    function play(firstVastPlayerPlayRequest: any): void;
    function pause(): void;
    function getDuration(): number;
    function getCurrentTime(): number;
    function resumeContent(): void;
}
