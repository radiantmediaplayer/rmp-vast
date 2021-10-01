/**
 * This class provides methods to fetch and parse a VAST document.
 * @export
 * @class VASTParser
 * @extends EventEmitter
 */
export class VASTParser extends EventEmitter {
    remainingAds: any[];
    parentURLs: any[];
    errorURLTemplates: any[];
    rootErrorURLTemplates: any[];
    maxWrapperDepth: any;
    URLTemplateFilters: any[];
    fetchingOptions: {};
    parsingOptions: {};
    /**
     * Adds a filter function to the array of filters which are called before fetching a VAST document.
     * @param  {function} filter - The filter function to be added at the end of the array.
     * @return {void}
     */
    addURLTemplateFilter(filter: Function): void;
    /**
     * Removes the last element of the url templates filters array.
     * @return {void}
     */
    removeURLTemplateFilter(): void;
    /**
     * Returns the number of filters of the url templates filters array.
     * @return {Number}
     */
    countURLTemplateFilters(): number;
    /**
     * Removes all the filter functions from the url templates filters array.
     * @return {void}
     */
    clearURLTemplateFilters(): void;
    /**
     * Tracks the error provided in the errorCode parameter and emits a VAST-error event for the given error.
     * @param  {Array} urlTemplates - An Array of url templates to use to make the tracking call.
     * @param  {Object} errorCode - An Object containing the error data.
     * @param  {Object} data - One (or more) Object containing additional data.
     * @emits  VASTParser#VAST-error
     * @return {void}
     */
    trackVastError(urlTemplates: any[], errorCode: any, ...data: any): void;
    /**
     * Returns an array of errorURLTemplates for the VAST being parsed.
     * @return {Array}
     */
    getErrorURLTemplates(): any[];
    /**
     * Returns the estimated bitrate calculated from all previous requests
     * @returns The average of all estimated bitrates in kb/s.
     */
    getEstimatedBitrate(): number;
    /**
     * Fetches a VAST document for the given url.
     * Returns a Promise which resolves,rejects according to the result of the request.
     * @param  {String} url - The url to request the VAST document.
     * @param {Number} wrapperDepth - how many times the current url has been wrapped
     * @param {String} previousUrl - url of the previous VAST
     * @emits  VASTParser#VAST-resolving
     * @emits  VASTParser#VAST-resolved
     * @return {Promise}
     */
    fetchVAST(url: string, wrapperDepth?: number, previousUrl?: string): Promise<any>;
    /**
     * Inits the parsing properties of the class with the custom values provided as options.
     * @param {Object} options - The options to initialize a parsing sequence
     */
    initParsingStatus(options?: any): void;
    rootURL: string;
    urlHandler: any;
    vastVersion: any;
    /**
     * Resolves the next group of ads. If all is true resolves all the remaining ads.
     * @param  {Boolean} all - If true all the remaining ads are resolved
     * @return {Promise}
     */
    getRemainingAds(all: boolean): Promise<any>;
    /**
     * Fetches and parses a VAST for the given url.
     * Returns a Promise which resolves with a fully parsed VASTResponse or rejects with an Error.
     * @param  {String} url - The url to request the VAST document.
     * @param  {Object} options - An optional Object of parameters to be used in the parsing process.
     * @emits  VASTParser#VAST-resolving
     * @emits  VASTParser#VAST-resolved
     * @emits  VASTParser#VAST-warning
     * @return {Promise}
     */
    getAndParseVAST(url: string, options?: any): Promise<any>;
    /**
     * Parses the given xml Object into a VASTResponse.
     * Returns a Promise which resolves with a fully parsed VASTResponse or rejects with an Error.
     * @param  {Object} vastXml - An object representing a vast xml document.
     * @param  {Object} options - An optional Object of parameters to be used in the parsing process.
     * @emits  VASTParser#VAST-resolving
     * @emits  VASTParser#VAST-resolved
     * @emits  VASTParser#VAST-warning
     * @return {Promise}
     */
    parseVAST(vastXml: any, options?: any): Promise<any>;
    /**
     * Builds a VASTResponse which can be returned.
     * @param  {Array} ads - An Array of unwrapped ads
     * @return {Object}
     */
    buildVASTResponse(ads: any[]): any;
    /**
     * Parses the given xml Object into an array of ads
     * Returns the array or throws an `Error` if an invalid VAST XML is provided
     * @param  {Object} vastXml - An object representing an xml document.
     * @param  {Object} options - An optional Object of parameters to be used in the parsing process.
     * @emits  VASTParser#VAST-warning
     * @emits VASTParser#VAST-ad-parsed
     * @return {Array}
     * @throws {Error} `vastXml` must be a valid VAST XMLDocument
     */
    parseVastXml(vastXml: any, { isRootVAST, url, wrapperDepth, allowMultipleAds, followAdditionalWrappers, }: any): any[];
    /**
     * Parses the given xml Object into an array of unwrapped ads.
     * Returns a Promise which resolves with the array or rejects with an error according to the result of the parsing.
     * @param {Object} vastXml - An object representing an xml document.
     * @param {Object} options - An optional Object of parameters to be used in the parsing process.
     * @emits VASTParser#VAST-resolving
     * @emits VASTParser#VAST-resolved
     * @emits VASTParser#VAST-warning
     * @return {Promise}
     */
    parse(vastXml: any, { url, resolveAll, wrapperSequence, previousUrl, wrapperDepth, isRootVAST, followAdditionalWrappers, allowMultipleAds, }?: any): Promise<any>;
    /**
     * Resolves an Array of ads, recursively calling itself with the remaining ads if a no ad
     * response is returned for the given array.
     * @param {Array} ads - An array of ads to resolve
     * @param {Object} options - An options Object containing resolving parameters
     * @return {Promise}
     */
    resolveAds(ads: any[], { wrapperDepth, previousUrl, url }: any): Promise<any>;
    /**
     * Resolves the wrappers for the given ad in a recursive way.
     * Returns a Promise which resolves with the unwrapped ad or rejects with an error.
     * @param {Object} ad - An ad object to be unwrapped.
     * @param {Number} wrapperDepth - The reached depth in the wrapper resolving chain.
     * @param {String} previousUrl - The previous vast url.
     * @return {Promise}
     */
    resolveWrappers(ad: any, wrapperDepth: number, previousUrl: string): Promise<any>;
    /**
     * Takes care of handling errors when the wrappers are resolved.
     * @param {Object} vastResponse - A resolved VASTResponse.
     */
    completeWrapperResolving(vastResponse: any): void;
}
import { EventEmitter } from "../util/event_emitter";
