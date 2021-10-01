export namespace util {
    export { track };
    export { resolveURLTemplates };
    export { extractURLsFromTemplates };
    export { containsTemplateObject };
    export { isTemplateObjectEqual };
    export { encodeURIComponentRFC3986 };
    export { replaceUrlMacros };
    export { leftpad };
    export { range };
    export { isNumeric };
    export { flatten };
    export { joinArrayOfUniqueTemplateObjs };
}
declare function track(URLTemplates: any, macros: any, options: any): void;
/**
 * Replace the provided URLTemplates with the given values
 *
 * @param {Array} URLTemplates - An array of tracking url templates.
 * @param {Object} [macros={}] - An optional Object of parameters to be used in the tracking calls.
 * @param {Object} [options={}] - An optional Object of options to be used in the tracking calls.
 */
declare function resolveURLTemplates(URLTemplates: any[], macros?: any, options?: any): string[];
/**
 * Extract the url/s from the URLTemplates.
 *   If the URLTemplates is an array of urls
 *   If the URLTemplates object has a url property
 *   If the URLTemplates is a single string
 *
 * @param {Array|String} URLTemplates - An array|string of url templates.
 */
declare function extractURLsFromTemplates(URLTemplates: any[] | string): string | any[];
/**
 * Returns a boolean after checking if the object exists in the array.
 *   true - if the object exists, false otherwise
 *
 * @param {Object} obj - The object who existence is to be checked.
 * @param {Array} list - List of objects.
 */
declare function containsTemplateObject(obj: any, list: any[]): boolean;
/**
 * Returns a boolean after comparing two Template objects.
 *   true - if the objects are equivalent, false otherwise
 *
 * @param {Object} obj1
 * @param {Object} obj2
 */
declare function isTemplateObjectEqual(obj1: any, obj2: any): boolean;
declare function encodeURIComponentRFC3986(str: any): string;
/**
 * Replace the macros tracking url with their value.
 * If no value is provided for a supported macro and it exists in the url,
 * it will be replaced by -1 as described by the VAST 4.1 iab specifications
 *
 * @param {String} url - Tracking url.
 * @param {Object} macros - Object of macros to be replaced in the tracking calls
 */
declare function replaceUrlMacros(url: string, macros: any): string;
declare function leftpad(input: any, len?: number): string;
declare function range(left: any, right: any, inclusive: any): any[];
declare function isNumeric(n: any): boolean;
declare function flatten(arr: any): any;
/**
 * Joins two arrays of objects without duplicates
 *
 * @param {Array} arr1
 * @param {Array} arr2
 *
 * @return {Array}
 */
declare function joinArrayOfUniqueTemplateObjs(arr1?: any[], arr2?: any[]): any[];
export {};
