export class SimidProtocol {
    listeners_: {};
    sessionId_: string;
    /**
     * The next message ID to use when sending a message.
     * @private {number}
     */
    private nextMessageId_;
    /**
     * The window where the message should be posted to.
     * @private {!Element}
     */
    private target_;
    resolutionListeners_: {};
    reset(): void;
    /**
     * Sends a message using post message.  Returns a promise
     * that will resolve or reject after the message receives a response.
     * @param {string} messageType The name of the message
     * @param {?Object} messageArgs The arguments for the message, may be null.
     * @return {!Promise} Promise that will be fulfilled when client resolves or rejects.
     */
    sendMessage(messageType: string, messageArgs: any | null): Promise<any>;
    /**
     * Adds a listener for a given message.
     */
    addListener(messageType: any, callback: any): void;
    /**
     * Sets up a listener for resolve/reject messages.
     * @private
     */
    private addResolveRejectListener_;
    /**
     * Recieves messages from either the player or creative.
     */
    receiveMessage(event: any): void;
    /**
     * Handles incoming messages specifically for the protocol
     * @param {!Object} data Data passed back from the message
     * @private
     */
    private handleProtocolMessage_;
    /**
     * Resolves an incoming message.
     * @param {!Object} incomingMessage the message that is being resolved.
     * @param {!Object} outgoingArgs Any arguments that are part of the resolution.
     */
    resolve(incomingMessage: any, outgoingArgs: any): void;
    /**
     * Rejects an incoming message.
     * @param {!Object} incomingMessage the message that is being resolved.
     * @param {!Object} outgoingArgs Any arguments that are part of the resolution.
     */
    reject(incomingMessage: any, outgoingArgs: any): void;
    /**
     * Creates a new session.
     * @param {String} sessionId
     * @return {!Promise} The promise from the create session message.
     */
    createSession(): Promise<any>;
    /**
     * Sets the session ID, this should only be used on session creation.
     * @private
     */
    private generateSessionId_;
    setMessageTarget(target: any): void;
}
export namespace ProtocolMessage {
    let CREATE_SESSION: string;
    let RESOLVE: string;
    let REJECT: string;
}
export namespace MediaMessage {
    let DURATION_CHANGE: string;
    let ENDED: string;
    let ERROR: string;
    let PAUSE: string;
    let PLAY: string;
    let PLAYING: string;
    let SEEKED: string;
    let SEEKING: string;
    let TIME_UPDATE: string;
    let VOLUME_CHANGE: string;
}
export namespace PlayerMessage {
    let RESIZE: string;
    let INIT: string;
    let LOG: string;
    let START_CREATIVE: string;
    let AD_SKIPPED: string;
    let AD_STOPPED: string;
    let FATAL_ERROR: string;
}
export namespace CreativeMessage {
    export let CLICK_THRU: string;
    export let EXPAND_NONLINEAR: string;
    export let COLLAPSE_NONLINEAR: string;
    let FATAL_ERROR_1: string;
    export { FATAL_ERROR_1 as FATAL_ERROR };
    export let GET_MEDIA_STATE: string;
    let LOG_1: string;
    export { LOG_1 as LOG };
    export let REQUEST_FULL_SCREEN: string;
    export let REQUEST_SKIP: string;
    export let REQUEST_STOP: string;
    export let REQUEST_PAUSE: string;
    export let REQUEST_PLAY: string;
    export let REQUEST_RESIZE: string;
    export let REQUEST_VOLUME: string;
    export let REQUEST_TRACKING: string;
    export let REQUEST_CHANGE_AD_DURATION: string;
}
export namespace CreativeErrorCode {
    let UNSPECIFIED: number;
    let CANNOT_LOAD_RESOURCE: number;
    let PLAYBACK_AREA_UNUSABLE: number;
    let INCORRECT_VERSION: number;
    let TECHNICAL_ERROR: number;
    let EXPAND_NOT_POSSIBLE: number;
    let PAUSE_NOT_HONORED: number;
    let PLAYMODE_NOT_ADEQUATE: number;
    let CREATIVE_INTERNAL_ERROR: number;
    let DEVICE_NOT_SUPPORTED: number;
    let MESSAGES_NOT_FOLLOWING_SPEC: number;
    let PLAYER_RESPONSE_TIMEOUT: number;
}
export namespace PlayerErrorCode {
    let UNSPECIFIED_1: number;
    export { UNSPECIFIED_1 as UNSPECIFIED };
    export let WRONG_VERSION: number;
    export let UNSUPPORTED_TIME: number;
    export let UNSUPPORTED_FUNCTIONALITY_REQUEST: number;
    export let UNSUPPORTED_ACTIONS: number;
    export let POSTMESSAGE_CHANNEL_OVERLOADED: number;
    export let VIDEO_COULD_NOT_LOAD: number;
    export let VIDEO_TIME_OUT: number;
    export let RESPONSE_TIMEOUT: number;
    export let MEDIA_NOT_SUPPORTED: number;
    export let SPEC_NOT_FOLLOWED_ON_INIT: number;
    export let SPEC_NOT_FOLLOWED_ON_MESSAGES: number;
}
export namespace StopCode {
    let UNSPECIFIED_2: number;
    export { UNSPECIFIED_2 as UNSPECIFIED };
    export let USER_INITIATED: number;
    export let MEDIA_PLAYBACK_COMPLETE: number;
    export let PLAYER_INITATED: number;
    export let CREATIVE_INITIATED: number;
    export let NON_LINEAR_DURATION_COMPLETE: number;
}
//# sourceMappingURL=simid_protocol.d.ts.map