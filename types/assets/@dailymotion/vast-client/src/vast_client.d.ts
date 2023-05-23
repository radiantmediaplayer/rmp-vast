/**
 * This class provides methods to fetch and parse a VAST document using VASTParser.
 * In addition it provides options to skip consecutive calls based on constraints.
 * @export
 * @class VASTClient
 */
export class VASTClient {
    /**
     * Creates an instance of VASTClient.
     * @param  {Number} cappingFreeLunch - The number of first calls to skip.
     * @param  {Number} cappingMinimumTimeInterval - The minimum time interval between two consecutive calls.
     * @param  {Storage} customStorage - A custom storage to use instead of the default one.
     * @constructor
     */
    constructor(cappingFreeLunch: number, cappingMinimumTimeInterval: number, customStorage: Storage);
    cappingFreeLunch: number;
    cappingMinimumTimeInterval: number;
    defaultOptions: {
        withCredentials: boolean;
        timeout: number;
    };
    vastParser: VASTParser;
    storage: Storage;
    set lastSuccessfulAd(arg: any);
    get lastSuccessfulAd(): any;
    set totalCalls(arg: any);
    get totalCalls(): any;
    set totalCallsTimeout(arg: any);
    get totalCallsTimeout(): any;
    getParser(): VASTParser;
    /**
     * Returns a boolean indicating if there are more ads to resolve for the current parsing.
     * @return {Boolean}
     */
    hasRemainingAds(): boolean;
    /**
     * Resolves the next group of ads. If all is true resolves all the remaining ads.
     * @param  {Boolean} all - If true all the remaining ads are resolved
     * @return {Promise}
     */
    getNextAds(all: boolean): Promise<any>;
    /**
     * Gets a parsed VAST document for the given url, applying the skipping rules defined.
     * Returns a Promise which resolves with a fully parsed VASTResponse or rejects with an Error.
     * @param  {String} url - The url to use to fecth the VAST document.
     * @param  {Object} options - An optional Object of parameters to be applied in the process.
     * @return {Promise}
     */
    get(url: string, options?: any): Promise<any>;
}
import { VASTParser } from './parser/vast_parser';
import { Storage } from './util/storage';
//# sourceMappingURL=vast_client.d.ts.map